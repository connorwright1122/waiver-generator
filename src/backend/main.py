# main.py
from fastapi import FastAPI, Request, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime
import os
import requests
import json
from pypdf import PdfReader, PdfWriter 
from pathlib import Path



GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxUdKcBYjtd7hEx2_WwRPEdov-eBn5T0Un5Bk04wXbcRtC-RvR30DalrEBlO01WQqmZ/exec"

base_dir = os.path.dirname(os.path.abspath(__file__))
#public_dir = "../../public/"
#pdf_path = os.path.join(public_dir, "GTLiabilityWaiverRelease_FYXX FILMNAME.pdf")
pdf_path = os.path.join(base_dir, "GTLiabilityWaiverRelease_FYXX_FILMNAME.pdf")
downloads_path = str(Path.home() / "Downloads")


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

def fill_form(name: str, activity: str, gtid: str):
    reader = PdfReader(pdf_path)
    writer = PdfWriter()

    page = reader.pages[0]
    fields = reader.get_fields()

    writer.append(reader)

    writer.update_page_form_field_values(
        writer.pages[0],
        {"text_name": name,
         "text_signature": name,
         "text_activity": activity,
         "text_gtid": gtid,
         "text_date1": datetime.now().strftime("%Y-%m-%d"),
         "text_date2": datetime.now().strftime("%Y-%m-%d"),
         "checkbox_inperson": "/Yes_esqr",},
        auto_regenerate=False,
    )

    

    year_suffix = datetime.now().strftime("%y")  
    filename = f"GTLiabilityWaiverRelease_FY{year_suffix}_{activity.replace(" ", "")}_{name.replace(" ", "")}.pdf"
    filepath = os.path.join(downloads_path, filename)

    with open(filepath, "wb") as output_stream:
        writer.write(output_stream)

def read_pdf():
    reader = PdfReader(pdf_path)
    fields = reader.get_fields()

    print(fields)

read_pdf()
fill_form(name="Connor", activity="Test 2", gtid="100")