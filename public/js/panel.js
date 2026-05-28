const API = '';

async function fetchJson(url, options) {
  const res = await fetch(API + url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Ошибка запроса');
  return data;
}

const reportForm = document.getElementById('report-form');
const reportsList = document.getElementById('reports-list');

function formatDate(iso) {
  return new Date(iso).toLocaleString('ru-RU', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function escapeHtml(str) {
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}

function renderReports(reports) {
  if (!reports.length) {
    reportsList.innerHTML = '<p class="reports-empty">Жалоб пока нет</p>';
    return;
  }
  reportsList.innerHTML = reports
    .map(
      (r) => `
    <article class="report-item" data-id="${r.id}">
      <div class="report-item__head">
        <div>
          <div class="report-item__admin">Админ: ${escapeHtml(r.adminName)}</div>
          <div class="report-item__meta">от ${escapeHtml(r.reporter)} · ${formatDate(r.createdAt)}</div>
        </div>
        <button type="button" class="btn btn--ghost report-delete" data-id="${r.id}">Удалить</button>
      </div>
      <p class="report-item__reason">${escapeHtml(r.reason)}</p>
    </article>`
    )
    .join('');

  reportsList.querySelectorAll('.report-delete').forEach((btn) => {
    btn.addEventListener('click', () => deleteReport(btn.dataset.id));
  });
}

async function loadReports() {
  try {
    renderReports(await fetchJson('/api/reports'));
  } catch (e) {
    reportsList.innerHTML = `<p class="reports-empty">${escapeHtml(e.message)} — запустите npm start</p>`;
  }
}

async function deleteReport(id) {
  if (!confirm('Удалить эту жалобу?')) return;
  try {
    await fetchJson(`/api/reports/${id}`, { method: 'DELETE' });
    loadReports();
  } catch (e) {
    alert(e.message);
  }
}

reportForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const fd = new FormData(reportForm);
  try {
    await fetchJson('/api/reports', {
      method: 'POST',
      body: JSON.stringify({
        reporter: fd.get('reporter'),
        adminName: fd.get('adminName'),
        reason: fd.get('reason'),
      }),
    });
    reportForm.reset();
    loadReports();
  } catch (err) {
    alert(err.message);
  }
});

const chatToggle = document.getElementById('chat-toggle');
const chatPanel = document.getElementById('chat-panel');
const chatClose = document.getElementById('chat-close');
const chatMessages = document.getElementById('chat-messages');
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const chatAuthor = document.getElementById('chat-author');

let chatPollTimer = null;

function openChat() {
  chatPanel.classList.add('is-open');
  chatPanel.setAttribute('aria-hidden', 'false');
  loadChat();
  chatPollTimer = setInterval(loadChat, 4000);
  chatInput?.focus();
}

function closeChat() {
  chatPanel.classList.remove('is-open');
  chatPanel.setAttribute('aria-hidden', 'true');
  clearInterval(chatPollTimer);
}

chatToggle?.addEventListener('click', () => {
  if (chatPanel.classList.contains('is-open')) closeChat();
  else openChat();
});

chatClose?.addEventListener('click', closeChat);

function renderChat(messages) {
  if (!messages.length) {
    chatMessages.innerHTML = '<p class="reports-empty" style="padding:0">Напишите в чат поддержки.</p>';
    return;
  }
  chatMessages.innerHTML = messages
    .map(
      (m) => `
    <div class="chat-msg">
      <div class="chat-msg__author">${escapeHtml(m.author)}</div>
      <div>${escapeHtml(m.message)}</div>
      <div class="chat-msg__time">${formatDate(m.createdAt)}</div>
    </div>`
    )
    .join('');
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function loadChat() {
  try {
    renderChat(await fetchJson('/api/chat'));
  } catch (_) {}
}

chatForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const message = chatInput.value.trim();
  if (!message) return;
  try {
    await fetchJson('/api/chat', {
      method: 'POST',
      body: JSON.stringify({
        message,
        author: chatAuthor.value.trim() || 'Гость',
      }),
    });
    chatInput.value = '';
    loadChat();
  } catch (err) {
    alert(err.message);
  }
});

loadReports();
