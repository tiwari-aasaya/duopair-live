"""
MongoDB Database Connection using Motor (Async Python Driver).
"""
import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
DB_NAME = os.getenv("DB_NAME", "duopair_db")

client: AsyncIOMotorClient = None
db = None

async def init_db():
    global client, db
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    
    # Create indexes for high-speed matchmaking queries by time & study field
    await db.match_queue.create_index([("commitment_time", 1), ("study_field", 1), ("timestamp", 1)])
    await db.match_queue.create_index("user_id", unique=True)
    await db.users.create_index("email", unique=True)
    await db.sessions.create_index("id", unique=True)
    print(f"Connected to MongoDB: {DB_NAME}")

async def close_db():
    global client
    if client:
        client.close()
        print("Closed MongoDB connection.")

def get_db():
    return db
