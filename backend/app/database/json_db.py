# Keeps fast access to variables and saves to db.json
import json

filepath="backend/app/database/db.json"

def read_db():
    with open(filepath, "r") as f:
        return json.load(f)

def save_to_db(data):
    with open(filepath, "w") as f:
        json.dump(data, f, indent=4)
