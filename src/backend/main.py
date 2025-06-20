# main.py
from fastapi import FastAPI, Request, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime
import os
import requests
import json

GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxUdKcBYjtd7hEx2_WwRPEdov-eBn5T0Un5Bk04wXbcRtC-RvR30DalrEBlO01WQqmZ/exec"

app = FastAPI()

# Allow your React dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"]
)

# Example model
class Waiver(BaseModel):
    name: str
    email: str

@app.post("/submit")
async def submit_waiver(waiver: Waiver):
    try:
        response = requests.post(
            GOOGLE_SCRIPT_URL,
            json=waiver.model_dump(),
            headers={"Content-Type": "application/json"},
            timeout=5
        )
        return {"status": "ok", "google_script_response": response.text}
    except Exception as e:
        return {"status": "error", "error": str(e)}


@app.get("/admin/waivers")
async def get_waivers():
    try:
        response = requests.get(
            f"{GOOGLE_SCRIPT_URL}?view=admin",
            timeout=5
        )
        return response.json() 
    except Exception as e:
        return {"status": "error", "error": str(e)}

@app.post("/admin/export")
async def export_pdfs(password: str, film: str = Form(...)):
    if password != os.getenv("ADMIN_PASSWORD", "supersecret"):
        return {"error": "Unauthorized"}
    # TODO: generate PDFs and save or return paths
    return {"message": "PDFs generated for film: " + film}
