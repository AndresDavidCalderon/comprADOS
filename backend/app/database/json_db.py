# Keeps fast access to variables and saves to db.json
import json

db = {}
filepath="backend/app/database/db.json"

def read_db():
    return db

def save_to_db(data):
    global db
    db = data
    with open(filepath, "w") as f:
        json.dump(db, f, indent=4)
