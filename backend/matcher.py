"""
Matching Algorithm for DuoPair Live.
Queue-based instant pairing based on Field of Study, Timezone, or Country,
with a 15-second filter relaxation fallback and 30-second duration proximity fallback.
"""
import time
import uuid
from typing import Optional, Dict, Any
from backend.database import get_db

TIME_TO_SECONDS = {
    '15m': 15 * 60,
    '30m': 30 * 60,
    '1h': 60 * 60,
    '2h': 120 * 60,
}

TIME_WEIGHT = {
    '15m': 15,
    '30m': 30,
    '1h': 60,
    '2h': 120,
}

async def add_to_queue(
    user_id: str,
    name: str,
    goal: str,
    study_field: str,
    commitment_time: str,
    timezone: str = "Worldwide",
    country: str = "Worldwide",
    primary_basis: str = "field"
) -> Dict[str, Any]:
    db = get_db()
    item = {
        "user_id": user_id,
        "name": name,
        "goal": goal,
        "study_field": study_field,
        "commitment_time": commitment_time,
        "timezone": timezone,
        "country": country,
        "primary_basis": primary_basis,
        "timestamp": time.time(),
    }
    # Upsert into match_queue
    await db.match_queue.update_one(
        {"user_id": user_id},
        {"$set": item},
        upsert=True
    )
    return item

async def remove_from_queue(user_id: str):
    db = get_db()
    await db.match_queue.delete_one({"user_id": user_id})

async def find_match_for_user(user_id: str) -> Optional[Dict[str, Any]]:
    db = get_db()
    current_entry = await db.match_queue.find_one({"user_id": user_id})
    if not current_entry:
        return None

    my_time = current_entry["commitment_time"]
    my_field = current_entry.get("study_field", "General")
    my_country = current_entry.get("country", "Worldwide")
    my_tz = current_entry.get("timezone", "Worldwide")
    basis = current_entry.get("primary_basis", "field")

    current_time = time.time()
    wait_time = current_time - current_entry["timestamp"]

    candidate = None

    # 1. Strict Match: Match by chosen primary basis
    if basis == "country" and "Worldwide" not in my_country:
        candidate = await db.match_queue.find_one({
            "user_id": {"$ne": user_id},
            "commitment_time": my_time,
            "country": my_country
        })
    elif basis == "timezone" and "Worldwide" not in my_tz:
        candidate = await db.match_queue.find_one({
            "user_id": {"$ne": user_id},
            "commitment_time": my_time,
            "timezone": my_tz
        })
    else:
        # Default / Field Basis
        query = {
            "user_id": {"$ne": user_id},
            "commitment_time": my_time
        }
        if my_field != "Any Field":
            query["study_field"] = my_field
        candidate = await db.match_queue.find_one(query)

    # 2. Fallback A (> 15 seconds): expand search to match anyone with same commitment_time
    if not candidate and wait_time >= 15:
        candidate = await db.match_queue.find_one({
            "user_id": {"$ne": user_id},
            "commitment_time": my_time
        })

    # 3. Fallback B (> 30 seconds): match with closest available time to prevent drop-off
    if not candidate and wait_time >= 30:
        other_candidates = await db.match_queue.find({
            "user_id": {"$ne": user_id}
        }).to_list(length=20)
        
        if other_candidates:
            my_weight = TIME_WEIGHT.get(my_time, 30)
            other_candidates.sort(key=lambda c: abs(TIME_WEIGHT.get(c["commitment_time"], 30) - my_weight))
            candidate = other_candidates[0]

    if candidate:
        del_a = await db.match_queue.delete_one({"user_id": user_id})
        del_b = await db.match_queue.delete_one({"user_id": candidate["user_id"]})

        if del_a.deleted_count and del_b.deleted_count:
            session_id = f"duo_{uuid.uuid4().hex[:10]}"
            session_duration = min(
                TIME_TO_SECONDS.get(my_time, 1800),
                TIME_TO_SECONDS.get(candidate["commitment_time"], 1800)
            )

            session_doc = {
                "id": session_id,
                "study_field": my_field if my_field == candidate.get("study_field") else f"{my_field} & {candidate.get('study_field', 'General')}",
                "commitment_time": my_time,
                "total_duration_seconds": session_duration,
                "remaining_seconds": session_duration,
                "started_at": current_time,
                "is_running": True,
                "user_a": {
                    "id": current_entry["user_id"],
                    "name": current_entry["name"],
                    "goal": current_entry["goal"],
                    "country": current_entry.get("country", "Worldwide"),
                    "timezone": current_entry.get("timezone", "Worldwide"),
                    "completed": False,
                    "sub_tasks": []
                },
                "user_b": {
                    "id": candidate["user_id"],
                    "name": candidate["name"],
                    "goal": candidate["goal"],
                    "country": candidate.get("country", "Worldwide"),
                    "timezone": candidate.get("timezone", "Worldwide"),
                    "completed": False,
                    "sub_tasks": []
                }
            }

            await db.sessions.insert_one(session_doc)
            return session_doc

    return None
