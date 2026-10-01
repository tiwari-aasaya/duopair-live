# DuoPair Live Backend (Python FastAPI + MongoDB + WebSockets)

High-performance, async backend for **DuoPair Live**, the gamified instant accountability matchmaker.

## Architecture

- **Framework**: FastAPI (Python 3.10+)
- **Database**: MongoDB with Motor (async I/O driver)
- **Real-time Protocol**: WebSockets for sub-millisecond timer synchronization, live chat, and instant motivation nudges.
- **Matching Engine**: In-database atomic queue with strict matching on **BOTH commitment time AND study field**.
  - **15-Second Fallback**: If waiting > 15s without an exact study field peer, search expands to any partner with the same commitment time.
  - **30-Second Fallback**: If waiting > 30s, matches with the closest available duration.

## Matching Endpoint Models

`MatchQueueItem`:
```json
{
  "user_id": "usr_12345",
  "name": "Jordan",
  "goal": "Write compiler parser test suite",
  "study_field": "Computer Science",
  "commitment_time": "30m"
}
```

## Running the Backend

1. **Install dependencies**:
   ```bash
   pip install -r backend/requirements.txt
   ```

2. **Start MongoDB**:
   ```bash
   docker run -d -p 27017:27017 --name duopair-mongo mongo:latest
   ```

3. **Start FastAPI with Uvicorn**:
   ```bash
   uvicorn backend.main:app --reload --port 8000
   ```

4. **Verify Health**:
   Visit `http://localhost:8000/docs` to test Swagger UI or `http://localhost:8000/api/health`.
