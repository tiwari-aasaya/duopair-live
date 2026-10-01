"""
Pydantic Schemas for DuoPair Live: Users, Matchmaking, Sessions, and Real-time Payloads.
"""
from typing import Optional, List, Literal
from pydantic import BaseModel, Field
import time

CommitmentTime = Literal['15m', '30m', '1h', '2h']

class UserAuth(BaseModel):
    email: str
    password: str
    name: Optional[str] = "DuoPair Crusher"
    bio: Optional[str] = ""
    avatar_url: Optional[str] = ""

class CompletedSessionRecord(BaseModel):
    id: str
    date: float
    goal: str
    study_field: str
    commitment_time: CommitmentTime
    duration_minutes: int
    partner_name: str
    was_perfect_focus: bool = False

class AchievementRecord(BaseModel):
    id: str
    title: str
    description: str
    badge_emoji: str
    unlocked: bool = False
    progress: int = 0
    target_label: str

class UserProfile(BaseModel):
    id: str
    email: str
    name: str
    bio: str = ""
    avatar_url: str = ""
    streak: int = 1
    total_pacts_completed: int = 0
    total_focus_minutes: int = 0
    completed_sessions: List[CompletedSessionRecord] = []
    achievements: List[AchievementRecord] = []

class StrangerFilterPreferences(BaseModel):
    primary_basis: Literal['field', 'timezone', 'country'] = 'field'
    field_of_study: str = "Computer Science"
    timezone: str = "Worldwide"
    country: str = "Worldwide"

class MatchQueueItem(BaseModel):
    user_id: str
    name: str
    goal: str
    study_field: str = "General"
    commitment_time: CommitmentTime
    timezone: str = "Worldwide"
    country: str = "Worldwide"
    primary_basis: Literal['field', 'timezone', 'country'] = 'field'
    timestamp: float = Field(default_factory=time.time)

class SubTask(BaseModel):
    id: str
    text: str
    completed: bool = False

class SessionUser(BaseModel):
    id: str
    name: str
    goal: str
    avatar_url: Optional[str] = ""
    country: Optional[str] = "Worldwide"
    timezone: Optional[str] = "Worldwide"
    completed: bool = False
    sub_tasks: List[SubTask] = []

class SessionModel(BaseModel):
    id: str
    study_field: str
    commitment_time: CommitmentTime
    total_duration_seconds: int
    remaining_seconds: int
    started_at: float
    is_running: bool = True
    user_a: SessionUser
    user_b: SessionUser

class ChatMessagePayload(BaseModel):
    id: str
    sender_id: str
    sender_name: str
    text: str
    timestamp: float

class NudgePayload(BaseModel):
    sender_id: str
    sender_name: str
    type: Literal['zap', 'flame', 'coffee']
    message: str
