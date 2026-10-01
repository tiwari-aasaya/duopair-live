"""
FastAPI Application for DuoPair Live.
REST Endpoints for Auth, Profile, and Queue Matching (with study field support),
plus WebSockets for Real-time Synchronized Timer, Live Chat, and Nudges.
"""
import json
import asyncio
from contextlib import asynccontextmanager
from typing import Dict, List
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from backend.database import init_db, close_db, get_db
from backend.models import UserAuth, MatchQueueItem, CommitmentTime, UserProfile
from backend.matcher import add_to_queue, remove_from_queue, find_match_for_user

@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield
    await close_db()

app = FastAPI(title="DuoPair Live API", version="2.0.0", lifespan=lifespan)

# Allow CORS for development and frontend clients
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------- WebSocket Connection Manager -----------------
class ConnectionManager:
    def __init__(self):
        self.active_sessions: Dict[str, List[WebSocket]] = {}

    async def connect(self, session_id: str, websocket: WebSocket):
        await websocket.accept()
        if session_id not in self.active_sessions:
            self.active_sessions[session_id] = []
        self.active_sessions[session_id].append(websocket)

    def disconnect(self, session_id: str, websocket: WebSocket):
        if session_id in self.active_sessions:
            if websocket in self.active_sessions[session_id]:
                self.active_sessions[session_id].remove(websocket)
            if not self.active_sessions[session_id]:
                del self.active_sessions[session_id]

    async def broadcast_to_session(self, session_id: str, message: dict):
        if session_id in self.active_sessions:
            serialized = json.dumps(message)
            for connection in self.active_sessions[session_id]:
                try:
                    await connection.send_text(serialized)
                except Exception:
                    pass

manager = ConnectionManager()

# ----------------- REST Endpoints -----------------

@app.get("/api/health")
async def health_check():
    return {"status": "ok", "app": "DuoPair Live Backend"}

@app.post("/api/auth/signup")
async def signup(user: UserAuth):
    db = get_db()
    existing = await db.users.find_one({"email": user.email})
    if existing:
        return {
            "id": existing["id"],
            "email": existing["email"],
            "name": existing.get("name", user.name),
            "bio": existing.get("bio", ""),
            "avatar_url": existing.get("avatar_url", ""),
            "streak": existing.get("streak", 1),
            "total_pacts_completed": existing.get("total_pacts_completed", 0),
            "completed_sessions": existing.get("completed_sessions", []),
            "achievements": existing.get("achievements", [])
        }
    new_user = {
        "id": f"usr_{user.email.split('@')[0]}",
        "email": user.email,
        "password": user.password,
        "name": user.name or user.email.split('@')[0],
        "bio": user.bio or "Crushing focus blocks on DuoPair Live.",
        "avatar_url": user.avatar_url or "",
        "streak": 1,
        "total_pacts_completed": 0,
        "total_focus_minutes": 0,
        "completed_sessions": [],
        "achievements": []
    }
    await db.users.insert_one(new_user)
    return {
        "id": new_user["id"],
        "email": new_user["email"],
        "name": new_user["name"],
        "bio": new_user["bio"],
        "avatar_url": new_user["avatar_url"],
        "streak": new_user["streak"],
        "total_pacts_completed": new_user["total_pacts_completed"]
    }

@app.post("/api/auth/login")
async def login(user: UserAuth):
    db = get_db()
    found = await db.users.find_one({"email": user.email, "password": user.password})
    if not found:
        return await signup(user)
    return {
        "id": found["id"],
        "email": found["email"],
        "name": found["name"],
        "bio": found.get("bio", ""),
        "avatar_url": found.get("avatar_url", ""),
        "streak": found.get("streak", 1),
        "total_pacts_completed": found.get("total_pacts_completed", 0),
        "completed_sessions": found.get("completed_sessions", []),
        "achievements": found.get("achievements", [])
    }

@app.put("/api/user/{user_id}/profile")
async def update_profile(user_id: str, updates: dict):
    db = get_db()
    allowed = {k: v for k, v in updates.items() if k in ["name", "bio", "avatar_url"]}
    await db.users.update_one({"id": user_id}, {"$set": allowed})
    updated = await db.users.find_one({"id": user_id})
    if updated:
        updated.pop("_id", None)
        return updated
    raise HTTPException(status_code=404, detail="User not found")

@app.post("/api/match/join")
async def join_match_queue(item: MatchQueueItem):
    queued = await add_to_queue(
        item.user_id,
        item.name,
        item.goal,
        item.study_field,
        item.commitment_time,
        item.timezone,
        item.country,
        item.primary_basis
    )
    return {"status": "queued", "item": queued}

@app.delete("/api/match/leave/{user_id}")
async def leave_match_queue(user_id: str):
    await remove_from_queue(user_id)
    return {"status": "removed"}

@app.get("/api/match/poll/{user_id}")
async def poll_match_status(user_id: str):
    db = get_db()
    # Check if this user is already in an active session
    existing_session = await db.sessions.find_one({
        "$or": [{"user_a.id": user_id}, {"user_b.id": user_id}]
    })
    if existing_session:
        existing_session.pop("_id", None)
        return {"status": "matched", "session": existing_session}

    # Otherwise run matching logic with 15s study field fallback
    match_result = await find_match_for_user(user_id)
    if match_result:
        match_result.pop("_id", None)
        return {"status": "matched", "session": match_result}

    return {"status": "waiting"}

@app.get("/api/session/{session_id}")
async def get_session(session_id: str):
    db = get_db()
    session = await db.sessions.find_one({"id": session_id})
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    session.pop("_id", None)
    return session

# ----------------- WebSocket Live Endpoint -----------------

@app.websocket("/ws/{session_id}/{user_id}")
async def websocket_session_endpoint(websocket: WebSocket, session_id: str, user_id: str):
    await manager.connect(session_id, websocket)
    
    await manager.broadcast_to_session(session_id, {
        "type": "USER_CONNECTED",
        "user_id": user_id,
        "message": f"Partner connected to session"
    })

    try:
        while True:
            data_text = await websocket.receive_text()
            data = json.loads(data_text)
            event_type = data.get("type")

            # Route 1: LIVE CHAT MESSAGE
            if event_type == "CHAT_MESSAGE":
                await manager.broadcast_to_session(session_id, {
                    "type": "CHAT_MESSAGE",
                    "payload": data.get("payload")
                })

            # Route 2: MOTIVATION NUDGE (Zap, Flame, Coffee)
            elif event_type == "NUDGE":
                await manager.broadcast_to_session(session_id, {
                    "type": "NUDGE",
                    "payload": data.get("payload")
                })

            # Route 3: TASK COMPLETE ALERT & RECORDING
            elif event_type == "TASK_COMPLETED":
                db = get_db()
                await db.sessions.update_one(
                    {"id": session_id, "user_a.id": user_id},
                    {"$set": {"user_a.completed": True}}
                )
                await db.sessions.update_one(
                    {"id": session_id, "user_b.id": user_id},
                    {"$set": {"user_b.completed": True}}
                )
                await manager.broadcast_to_session(session_id, {
                    "type": "PARTNER_COMPLETED",
                    "payload": {"userId": user_id, "goal": data.get("goal")}
                })

            # Route 4: TIMER SYNC
            elif event_type == "TIMER_SYNC":
                await manager.broadcast_to_session(session_id, {
                    "type": "TIMER_SYNC",
                    "payload": data.get("payload")
                })

    except WebSocketDisconnect:
        manager.disconnect(session_id, websocket)
        await manager.broadcast_to_session(session_id, {
            "type": "USER_DISCONNECTED",
            "user_id": user_id
        })
