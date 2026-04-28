import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "graph.db")

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    c = conn.cursor()
    # Nodes table handles both Note and Concept
    c.execute('''
        CREATE TABLE IF NOT EXISTS nodes (
            id TEXT PRIMARY KEY,
            label TEXT NOT NULL, -- 'Note' or 'Concept'
            name TEXT,           -- For concepts
            content TEXT,        -- For notes
            summary TEXT,        -- For notes
            created_at TEXT
        )
    ''')
    
    # Edges table
    c.execute('''
        CREATE TABLE IF NOT EXISTS edges (
            source_id TEXT,
            target_id TEXT,
            relationship TEXT NOT NULL, -- 'CONTAINS', 'RELATED_TO'
            PRIMARY KEY (source_id, target_id, relationship)
        )
    ''')
    
    conn.commit()
    conn.close()

# Initialize DB on startup
init_db()
