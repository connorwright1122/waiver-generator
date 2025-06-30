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
from typing import List


## Deployment Link 
### when making changes to the google app script, create a new deployment and put it here
GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycby90kHGpE0ERfdkNtWXppKwslpEmrDysrjRGjOrxfyVbMIJioCFQKv_2L_NqDt5z8P9/exec"
## Page Link
### Link to the actual google app script edit page
GOOGLE_SCRIPT_URL_EDIT = "https://script.google.com/u/0/home/projects/1JTK3c75WNw3HxIO6dl4rt6KzuHqIRGgg3W9YCcHn61FPcqEMdCXn8MUj"

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
    gtid: str

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


@app.get("/admin/links")
async def get_links():
    try:
        response = requests.get(
            f"{GOOGLE_SCRIPT_URL}?view=sheet_url",
            timeout=5
        )
        return {
            "sheet_url": response.json()['url'],
            "script_url": GOOGLE_SCRIPT_URL_EDIT
        }
        #return response.json() 
    except Exception as e:
        return {"status": "error", "error": str(e)}

# @app.post("/admin/export")
# async def export_pdfs(password: str, film: str = Form(...)):
#     if password != os.getenv("ADMIN_PASSWORD", "supersecret"):
#         return {"error": "Unauthorized"}
#     # TODO: generate PDFs and save or return paths
#     return {"message": "PDFs generated for film: " + film}


class Participant(BaseModel):
    name: str
    gtid: str

class WaiverExportRequest(BaseModel):
    film_title: str
    production_date: str
    participants: List[Participant]

@app.post("/admin/export")
async def export_pdfs(request: WaiverExportRequest):
    for person in request.participants:
        fill_form(name=person.name, activity=request.film_title, activity_date=request.production_date, gtid=person.gtid)
    return {"message": f"Generated {len(request.participants)} waivers"}



def fill_form(name: str, activity: str, activity_date: str, gtid: str):
    reader = PdfReader(pdf_path)
    writer = PdfWriter()

    page = reader.pages[0]
    fields = reader.get_fields()

    writer.append(reader)

    field_updates = {
        "text_name": name,
        "text_signature": name,
        "text_activity": activity,
        "text_gtid": gtid,
        "text_date1": activity_date,
        "text_date2": datetime.now().strftime("%Y-%m-%d"),
        "text_checkbox": "x"
    }

    for page_num in range(len(reader.pages)):
        page = reader.pages[page_num]
        #writer.add_page(page)  # Add the original page first
        writer.update_page_form_field_values(writer.pages[page_num], field_updates)


    year_suffix = datetime.now().strftime("%y")  
    filename = f"GTLiabilityWaiverRelease_FY{year_suffix}_{activity.replace(" ", "")}_{name.replace(" ", "")}.pdf"
    filepath = os.path.join(downloads_path, filename)

    with open(filepath, "wb") as output_stream:
        writer.write(output_stream)

def read_pdf():
    reader = PdfReader(pdf_path)
    fields = reader.get_fields()

    print(fields)

#read_pdf()
#fill_form(name="Connor W", activity="Test 2", activity_date=datetime.now().strftime("%Y-%m-%d"), gtid="100") 