const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const DATA_DIR = path.join(__dirname, 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);
if (!fs.existsSync(USERS_FILE)) fs.writeFileSync(USERS_FILE, JSON.stringify([
  { id: 'u_admin', fullName: 'Administrator', email: 'admin@gmail.com', phone: '', password: '123456', role: 'admin' }
], null, 2));

function readUsers() {
  try {
    return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
  } catch (e) {
    return [];
  }
}

function writeUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

app.post('/api/auth/register', (req, res) => {
  const { fullName, email, phone, password } = req.body;
  if (!email || !password || !fullName) return res.status(400).json({ message: 'Missing fields' });

  const users = readUsers();
  if (users.find(u => u.email === email)) return res.status(409).json({ message: 'Email already exists' });

  const user = { id: `u_${Date.now()}`, fullName, email, phone: phone || '', password, role: 'user' };
  users.push(user);
  writeUsers(users);

  // In production, never return password. This is a mock.
  const { password: _p, ...userSafe } = user;
  return res.json({ user: userSafe });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Missing fields' });

  const users = readUsers();
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const { password: _p, ...userSafe } = user;
  // Return a fake token for demo purposes
  return res.json({ user: userSafe, token: 'fake-jwt-token' });
});

app.get('/api/users', (req, res) => {
  const users = readUsers();
  const safe = users.map(({ password, ...rest }) => rest);
  res.json(safe);
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Auth mock server running on http://localhost:${port}`));
