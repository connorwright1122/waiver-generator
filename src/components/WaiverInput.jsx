import {useState, useEffect} from "react";
import "../App.css"
import {GOOGLE_SCRIPT_URL} from "./urls"
import { Document, Page } from 'react-pdf'

import { pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

import workerSrc from 'pdfjs-dist/build/pdf.worker.min?url';

pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';





function WaiverInput() {
    const [formData, setFormData] = useState({
        name: '', 
        gtid: ''
    });
    const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});
    const [isChecked, setIsChecked] = useState(false);

    const handleCheck = (e) => {
        setIsChecked(e.target.checked)
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            fetch("http://localhost:8000/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            alert("Waiver submitted!")
            setFormData({name: '', gtid: ''})
        }
        catch (err) {
            alert("Submission failed.")
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="max-w-sm mx-auto">
                <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} className="input" required />
                <input name="gtid" type="text" placeholder="GTID (Optional)" value={formData.gtid} onChange={handleChange} className="input" />
                <label>
                    <input type="checkbox" name="agree" checked={isChecked} onChange={handleCheck} />
                    I agree to the terms and conditions.
                </label>
                <button type="submit" disabled={!isChecked || formData.name == ""}>Submit</button>
            </form>
            <Document file="/GTLiabilityWaiverRelease_FYXX_FILMNAME.pdf">
                <Page pageNumber={1} />
                <Page pageNumber={2} />
                <Page pageNumber={3} />
            </Document>
        </>
    );
}
export default WaiverInput;