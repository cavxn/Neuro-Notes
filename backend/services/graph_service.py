import uuid
from datetime import datetime
from database.sqlite_db import get_db_connection

def save_note_with_concepts(content: str, summary: str, concepts: list[str]):
    conn = get_db_connection()
    c = conn.cursor()
    
    note_id = str(uuid.uuid4())
    created_at = datetime.utcnow().isoformat()
    
    # Store Note Node
    c.execute(
        "INSERT INTO nodes (id, label, content, summary, created_at) VALUES (?, ?, ?, ?, ?)",
        (note_id, "Note", content, summary, created_at)
    )
    
    concept_objs = []
    
    for concept in concepts:
        concept_name = concept.lower().strip()
        if not concept_name:
            continue
            
        # Check if concept already exists
        c.execute("SELECT id FROM nodes WHERE label='Concept' AND name=?", (concept_name,))
        row = c.fetchone()
        
        if row:
            concept_id = row['id']
        else:
            concept_id = str(uuid.uuid4())
            c.execute(
                "INSERT INTO nodes (id, label, name, created_at) VALUES (?, ?, ?, ?)",
                (concept_id, "Concept", concept_name, created_at)
            )
            
        # Store Relationship Edge  (Note)-[:CONTAINS]->(Concept)
        c.execute(
            "INSERT OR IGNORE INTO edges (source_id, target_id, relationship) VALUES (?, ?, ?)",
            (note_id, concept_id, "CONTAINS")
        )
        
        # Only add unique concepts to the response list
        if not any(c_obj['name'] == concept_name for c_obj in concept_objs):
            concept_objs.append({"id": concept_id, "name": concept_name})
        
    conn.commit()
    conn.close()
    
    return {
        "id": note_id,
        "content": content,
        "summary": summary,
        "created_at": created_at,
        "concepts": concept_objs
    }

def get_recent_notes(limit: int = 20):
    conn = get_db_connection()
    c = conn.cursor()
    
    # Get notes
    c.execute("SELECT * FROM nodes WHERE label='Note' ORDER BY created_at DESC LIMIT ?", (limit,))
    rows = c.fetchall()
    
    notes = []
    for r in rows:
        note_id = r['id']
        # Fetch related concepts for this note
        c.execute('''
            SELECT n.id, n.name 
            FROM nodes n
            JOIN edges e ON e.target_id = n.id
            WHERE e.source_id = ? AND e.relationship = 'CONTAINS'
        ''', (note_id,))
        concepts = [{"id": cr['id'], "name": cr['name']} for cr in c.fetchall()]
        
        notes.append({
            "id": note_id,
            "content": r['content'],
            "summary": r['summary'],
            "created_at": r['created_at'],
            "concepts": concepts
        })
        
    conn.close()
    return notes

def get_revision_notes(limit: int = 3):
    conn = get_db_connection()
    c = conn.cursor()
    
    # Randomly pull oldest notes to simulate spaced reinforcement
    c.execute("SELECT * FROM nodes WHERE label='Note' ORDER BY created_at ASC LIMIT ?", (limit,))
    rows = c.fetchall()
    
    notes = []
    for r in rows:
        note_id = r['id']
        c.execute('''
            SELECT n.id, n.name 
            FROM nodes n
            JOIN edges e ON e.target_id = n.id
            WHERE e.source_id = ? AND e.relationship = 'CONTAINS'
        ''', (note_id,))
        concepts = [{"id": cr['id'], "name": cr['name']} for cr in c.fetchall()]
        
        notes.append({
            "id": note_id,
            "content": r['content'],
            "summary": r['summary'],
            "created_at": r['created_at'],
            "concepts": concepts
        })
        
    conn.close()
    return notes

def get_full_graph():
    conn = get_db_connection()
    c = conn.cursor()
    
    c.execute("SELECT id, label, name, summary FROM nodes")
    node_rows = c.fetchall()
    
    nodes = []
    for r in node_rows:
        label = r["label"]
        name = r["summary"] if label == "Note" else r["name"]
        group = "note" if label == "Note" else "concept"
        nodes.append({
            "id": r["id"],
            "label": name or "Unknown",
            "group": group
        })
        
    c.execute("SELECT source_id, target_id, relationship FROM edges")
    edge_rows = c.fetchall()
    
    edges = []
    for r in edge_rows:
        edges.append({
            "id": f"{r['source_id']}-{r['target_id']}",
            "source": r['source_id'],
            "target": r['target_id'],
            "label": r['relationship']
        })
        
    conn.close()
    return {"nodes": nodes, "edges": edges}

def delete_note_from_db(note_id: str):
    conn = get_db_connection()
    c = conn.cursor()
    c.execute("DELETE FROM nodes WHERE id=?", (note_id,))
    c.execute("DELETE FROM edges WHERE source_id=? OR target_id=?", (note_id, note_id))
    conn.commit()
    conn.close()

def search_nodes_in_db(query: str):
    conn = get_db_connection()
    c = conn.cursor()
    c.execute("SELECT * FROM nodes WHERE label='Note' AND (content LIKE ? OR summary LIKE ?) ORDER BY created_at DESC", (f'%{query}%', f'%{query}%'))
    rows = c.fetchall()
    notes = []
    for r in rows:
        note_id = r['id']
        c.execute('''
            SELECT n.id, n.name 
            FROM nodes n
            JOIN edges e ON e.target_id = n.id
            WHERE e.source_id = ? AND e.relationship = 'CONTAINS'
        ''', (note_id,))
        concepts = [{"id": cr['id'], "name": cr['name']} for cr in c.fetchall()]
        notes.append({
            "id": note_id,
            "content": r['content'],
            "summary": r['summary'],
            "created_at": r['created_at'],
            "concepts": concepts
        })
    conn.close()
    return notes
