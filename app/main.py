import uvicorn
from fastapi import FastAPI
from app import users, tasks


API = FastAPI(title="Schoolskills API")

API.include_router(users.router, prefix="/api/users")
API.include_router(tasks.router, prefix="/api/tasks")


if __name__ == "__main__":
    uvicorn.run(API, host="127.0.0.1", port=8000)