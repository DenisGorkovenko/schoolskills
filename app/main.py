import uvicorn
from fastapi import FastAPI
from app import users


API = FastAPI(title="Schoolskills API")

API.include_router(users.router, prefix="/api/users")


if __name__ == "__main__":
    uvicorn.run(API, host="127.0.0.1", port=8000)