# upload-service/main.py

from fastapi import FastAPI, File, UploadFile, Form
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from dotenv import load_dotenv
import os
import uuid
from google.cloud import storage

# Load env vars
load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Google Cloud setup
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
bucket_name = os.getenv("BUCKET_NAME")

# MongoDB setup
client = MongoClient(os.getenv("MONGO_URI"))
db = client["uploads"]
collection = db["files"]

# Upload endpoint
@app.post("/upload")
async def upload_file(file: UploadFile = File(...), filetype: str = Form(...)):
    contents = await file.read()
    filename = f"{uuid.uuid4()}_{file.filename}"

    # Upload to GCS
    storage_client = storage.Client()
    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(filename)
    blob.upload_from_string(contents, content_type=file.content_type)

    file_url = f"https://storage.googleapis.com/{bucket_name}/{filename}"

    # Store metadata in DB
    doc = {
        "filename": file.filename,
        "stored_as": filename,
        "filetype": filetype,
        "url": file_url,
        "content_type": file.content_type,
    }
    collection.insert_one(doc)

    return JSONResponse({"url": file_url, "message": "File uploaded successfully."})
