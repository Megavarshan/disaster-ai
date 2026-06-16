import sqlite3
import time
import random
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import os

app = FastAPI(title="AURA - Autonomous Unified Response Agent")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DB_PATH = "dadip_aura.db"

def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Create tables
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS disaster_events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT,
        location TEXT,
        severity TEXT,
        risk_score INTEGER,
        status TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
    ''')
    
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS aura_chat_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        role TEXT,
        content TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
    ''')
    
    # Seed data if empty
    cursor.execute('SELECT COUNT(*) FROM disaster_events')
    if cursor.fetchone()[0] == 0:
        events = [
            ("flood", "Mumbai, Maharashtra", "high", 85, "active"),
            ("cyclone", "Odisha Coast", "critical", 94, "active"),
            ("earthquake", "Delhi NCR", "medium", 65, "monitoring"),
            ("tsunami", "Andaman Islands", "low", 20, "resolved"),
            ("flood", "Wayanad, Kerala", "critical", 92, "active")
        ]
        cursor.executemany('''
        INSERT INTO disaster_events (type, location, severity, risk_score, status)
        VALUES (?, ?, ?, ?, ?)
        ''', events)
        
    conn.commit()
    conn.close()

# Initialize DB on startup
@app.on_event("startup")
def startup_event():
    init_db()

class ChatRequest(BaseModel):
    message: str

def get_active_events_summary():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("SELECT type, location, severity, risk_score FROM disaster_events WHERE status='active' OR status='monitoring'")
    rows = cursor.fetchall()
    conn.close()
    return rows

@app.post("/aura/chat")
async def aura_chat(request: ChatRequest):
    user_msg = request.message.lower()
    time.sleep(1.5) # Simulate AI thinking
    
    # Simple simulated NLP
    response_text = ""
    report_data = None
    
    if "report" in user_msg or "analyze" in user_msg or "status" in user_msg:
        rows = get_active_events_summary()
        critical_count = sum(1 for r in rows if r[2] == 'critical')
        
        response_text = f"I have queried the DADIP SQLite Database. We currently have {len(rows)} active/monitoring events, with {critical_count} marked as critical. I've generated a comprehensive analysis report for you below."
        
        # Generate artifact report data
        report_data = {
            "title": "AURA Intelligence Report: National Threat Assessment",
            "date": pd.Timestamp.now().strftime("%Y-%m-%d %H:%M:%S") if 'pd' in globals() else time.strftime("%Y-%m-%d %H:%M:%S"),
            "sections": [
                {"heading": "Executive Summary", "content": f"The national disaster grid is currently tracking {len(rows)} significant events. Real-time telemetry indicates heightened risk in coastal sectors."},
                {"heading": "Critical Zones", "content": ", ".join([r[1] for r in rows if r[2] == 'critical']) or "None currently detected."},
                {"heading": "AI Recommendation", "content": "Deploy preemptive NDRF battalions to critical zones. Initiate localized SMS broadcasting via the Alerts module."}
            ],
            "data": [{"type": r[0], "location": r[1], "severity": r[2], "risk": f"{r[3]}%"} for r in rows]
        }
    elif "hello" in user_msg or "hi" in user_msg:
        response_text = "Hello. I am AURA (Autonomous Unified Response Agent). I am connected to the live NDMA disaster database. How can I assist your operations today?"
    else:
        response_text = "I have cross-referenced your query with the active SQLite database and our transformer models. Based on current telemetry, the situation requires standard monitoring. Would you like me to generate a detailed regional report?"

    # Log to DB
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("INSERT INTO aura_chat_history (role, content) VALUES (?, ?)", ("user", request.message))
    cursor.execute("INSERT INTO aura_chat_history (role, content) VALUES (?, ?)", ("aura", response_text))
    conn.commit()
    conn.close()

    return {
        "text": response_text,
        "artifact": report_data
    }

if __name__ == "__main__":
    uvicorn.run("aura_agent:app", host="0.0.0.0", port=8001, reload=True)
