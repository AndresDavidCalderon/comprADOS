# Keeps fast access to variables and saves to db.json
import json
from sqlalchemy import create_engine,engine
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.pool import NullPool
import os

filepath="backend/app/database/db.json"

if not os.getenv("DATABASE_PASSWORD"):
    raise ValueError("DATABASE_PASSWORD environment variable is not set.")

if not os.getenv("DATABASE_HOST"):
    raise ValueError("DATABASE_HOST environment variable is not set.")

if not os.getenv("DATABASE_PORT"):
    raise ValueError("DATABASE_PORT environment variable is not set.")

if not os.getenv("DATABASE_NAME"):
    raise ValueError("DATABASE_NAME environment variable is not set.")

if not os.getenv("DATABASE_USER"):
    raise ValueError("DATABASE_USER environment variable is not set.")

engine = create_engine(engine.url.URL.create(
    drivername="postgresql",
    username=os.getenv("DATABASE_USER", "postgres"),
    password=os.getenv("DATABASE_PASSWORD"),
    host=os.getenv("DATABASE_HOST", "localhost"),
    port=int(os.getenv("DATABASE_PORT", "54668")),
    database=os.getenv("DATABASE_NAME", "postgres")
), poolclass=NullPool)

class Base(DeclarativeBase):
    pass


def read_db():
    with open(filepath, "r") as f:
        return json.load(f)

def save_to_db(data):
    with open(filepath, "w") as f:
        json.dump(data, f, indent=4)
