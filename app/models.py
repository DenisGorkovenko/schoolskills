from sqlalchemy import Column, Integer, String, LargeBinary
from sqlalchemy.orm import declarative_base
from database import engine

Base = declarative_base()


class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    age = Column(String, nullable=False)
    grade = Column(String, nullable=True)
    school = Column(String, nullable=True)
    avatar = Column(LargeBinary, nullable=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    right_answer = Column(Integer, default=0)
    wrong_answer = Column(Integer, default=0)
    rating = Column(Integer, default=0)


class Task(Base):
    __tablename__ = 'tasks'

    id = Column(Integer, primary_key=True, index=True)
    question = Column(String, nullable=False)
    answer = Column(String, nullable=False)


Base.metadata.create_all(bind=engine)