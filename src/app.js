const express = require('express');

const authRoutes = require('./routes/auth');
const homeRoutes = require('./routes/home');
const { requireAuth } = require('./middleware/auth');

const app = express();

app.use(express.json());
app.use('/api', authRoutes);
app.use('/api/home', requireAuth, homeRoutes);

// Every error path must stay application/json, as the contract declares.
// Without these, Express's defaults return HTML for unmatched routes and for
// a malformed JSON body, which breaks clients decoding `{ error: string }`.
app.use((req, res) => {
  res.status(404).json({ error: 'Not found.' });
});

// eslint-disable-next-line no-unused-vars -- Express identifies error handlers by arity (4 args).
app.use((err, req, res, next) => {
  if (err && err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Malformed JSON request body.' });
  }

  return res.status(500).json({ error: 'Internal server error.' });
});

module.exports = app;
