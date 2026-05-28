const progressEl = document.getElementById('load-progress');
const statusEl = document.getElementById('load-status');
const bgImg = document.querySelector('#load-bg img');

const statuses = [
  'Загрузка LUA…',
  'Инициализация homigrad…',
  'Загрузка карты…',
  'Синхронизация gamemode…',
  'Отправка информации клиенту…',
  'Загрузка Workshop…',
  'Подключение к HomiLAB…',
];

let progress = 0;
let statusIdx = 0;

bgImg?.addEventListener('error', () => {
  document.getElementById('load-bg')?.classList.add('is-empty');
});

function tick() {
  const step = progress < 85 ? 0.6 + Math.random() * 1.4 : 0.15 + Math.random() * 0.35;
  progress += step;

  if (progress >= 100) {
    progress = 0;
    statusIdx = (statusIdx + 1) % statuses.length;
  }

  progressEl.style.width = progress + '%';
  statusEl.textContent = statuses[statusIdx];
}

setInterval(tick, 90);
setInterval(() => {
  statusIdx = (statusIdx + 1) % statuses.length;
}, 3200);
