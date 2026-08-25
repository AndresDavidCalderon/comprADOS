# Keeps fast access to variables and saves to db.json
import json
from sqlalchemy import create_engine,engine
from sqlalchemy.orm import DeclarativeBase

filepath="backend/app/database/db.json"

engine = create_engine(engine.url.URL.create(
    'postgresql',
    username='postgres',
    password='6920',
    host='localhost',
    port=54668,
    database='ados'
)
)

class Base(DeclarativeBase):
    pass


def read_db():
    with open(filepath, "r") as f:
        return json.load(f)

def save_to_db(data):
    with open(filepath, "w") as f:
        json.dump(data, f, indent=4)
