const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DB_PATH = path.join(__dirname, '../../db/bluetell.db');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('../../'));

const db = new sqlite3.Database(DB_PATH);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../index.html'));
});

app.get('/api/health', (req, res) => {
    res.json({ status: 'healthy', service: 'BlueTell API', timestamp: new Date().toISOString() });
});

app.post('/api/contact', (req, res) => {
    const { name, email, phone, subject, message } = req.body;
    
    if (!name || !email || !subject || !message) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    
    db.run(
        'INSERT INTO contacts (name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?)',
        [name, email, phone || '', subject, message],
        function(err) {
            if (err) {
                return res.status(500).json({ error: 'Failed to submit contact' });
            }
            res.status(201).json({ success: true, message: 'Message sent successfully', id: this.lastID });
        }
    );
});

app.get('/api/services', (req, res) => {
    db.all('SELECT * FROM services WHERE active = 1', [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to fetch services' });
        }
        res.json(rows);
    });
});

app.post('/api/subscribe', (req, res) => {
    const { email } = req.body;
    
    if (!email) {
        return res.status(400).json({ error: 'Email required' });
    }
    
    db.run('INSERT INTO newsletter_subscribers (email) VALUES (?)', [email], function(err) {
        if (err) {
            return res.status(400).json({ error: 'Email already subscribed' });
        }
        res.status(201).json({ success: true, message: 'Subscribed successfully' });
    });
});

app.listen(PORT, () => {
    console.log(`BlueTell API running on http://localhost:${PORT}`);
});
