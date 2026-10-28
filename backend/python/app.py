from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import sqlite3
import os
from datetime import datetime

app = Flask(__name__, static_folder='../../', template_folder='../../')
CORS(app)

DATABASE = '../../db/bluetell.db'

def init_db():
    conn = sqlite3.connect(DATABASE)
    with open('../../db/schema.sql') as f:
        conn.executescript(f.read())
    conn.commit()
    conn.close()

def get_db_connection():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({'status': 'healthy', 'service': 'BlueTell API', 'timestamp': datetime.now().isoformat()})

@app.route('/api/contact', methods=['POST'])
def contact():
    data = request.get_json()
    
    name = data.get('name')
    email = data.get('email')
    phone = data.get('phone', '')
    subject = data.get('subject')
    message = data.get('message')
    
    if not all([name, email, subject, message]):
        return jsonify({'error': 'Missing required fields'}), 400
    
    conn = get_db_connection()
    conn.execute(
        'INSERT INTO contacts (name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?)',
        (name, email, phone, subject, message)
    )
    conn.commit()
    conn.close()
    
    return jsonify({'success': True, 'message': 'Message sent successfully'}), 201

@app.route('/api/services', methods=['GET'])
def services():
    conn = get_db_connection()
    services = conn.execute('SELECT * FROM services WHERE active = 1').fetchall()
    conn.close()
    
    return jsonify([dict(row) for row in services])

@app.route('/api/subscribe', methods=['POST'])
def subscribe():
    data = request.get_json()
    email = data.get('email')
    
    if not email:
        return jsonify({'error': 'Email required'}), 400
    
    conn = get_db_connection()
    try:
        conn.execute('INSERT INTO newsletter_subscribers (email) VALUES (?)', (email,))
        conn.commit()
        conn.close()
        return jsonify({'success': True, 'message': 'Subscribed successfully'}), 201
    except sqlite3.IntegrityError:
        conn.close()
        return jsonify({'error': 'Email already subscribed'}), 400

if __name__ == '__main__':
    if not os.path.exists(DATABASE):
        init_db()
    app.run(debug=True, host='0.0.0.0', port=5000)
