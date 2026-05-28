const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;
const DATA_DIR = path.join(__dirname, 'data');

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

const reportsFile = path.join(DATA_DIR, 'reports.json');
const chatFile = path.join(DATA_DIR, 'chat.json');

function readJson(file, fallback) {
  try {
    if (fs.existsSync(file)) return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (_) {}
  return fallback;
}

function writeJson(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
}

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/reports', (_req, res) => {
  res.json(readJson(reportsFile, []));
});

app.post('/api/reports', (req, res) => {
  const { adminName, reason, reporter } = req.body;
  if (!adminName?.trim() || !reason?.trim()) {
    return res.status(400).json({ error: 'Укажите админа и причину жалобы' });
  }
  const reports = readJson(reportsFile, []);
  const report = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
    adminName: adminName.trim(),
    reason: reason.trim(),
    reporter: (reporter || 'Аноним').trim(),
    createdAt: new Date().toISOString(),
  };
  reports.unshift(report);
  writeJson(reportsFile, reports);
  res.status(201).json(report);
});

app.delete('/api/reports/:id', (req, res) => {
  const reports = readJson(reportsFile, []);
  const next = reports.filter((r) => r.id !== req.params.id);
  if (next.length === reports.length) {
    return res.status(404).json({ error: 'Жалоба не найдена' });
  }
  writeJson(reportsFile, next);
  res.json({ ok: true });
});

app.get('/api/chat', (_req, res) => {
  res.json(readJson(chatFile, []));
});

app.post('/api/chat', (req, res) => {
  const { message, author } = req.body;
  if (!message?.trim()) {
    return res.status(400).json({ error: 'Пустое сообщение' });
  }
  const messages = readJson(chatFile, []);
  const entry = {
    id: Date.now().toString(36),
    author: (author || 'Гость').trim(),
    message: message.trim(),
    createdAt: new Date().toISOString(),
    fromSupport: false,
  };
  messages.push(entry);
  writeJson(chatFile, messages);
  res.status(201).json(entry);
});

app.listen(PORT, () => {
  console.log(`HomiLAB → http://localhost:${PORT}`);
});
