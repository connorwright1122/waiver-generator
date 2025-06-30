import {useState, useEffect} from "react";
import "../App.css"
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
        gtid: '',
        activity: ''
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
            setFormData({name: '', gtid: '', activity: ''})
        }
        catch (err) {
            alert("Submission failed.")
        }
    };

    return (
        <div className="flex flex-col space-y-4 items-center">
            <form onSubmit={handleSubmit} className="max-w-sm mx-auto flex flex-col">
                <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} className="input m-2" required />
                <input name="activity" type="text" placeholder="Activity / Film Name" value={formData.activity} onChange={handleChange} className="input m-2" required />
                <input name="gtid" type="text" placeholder="GTID (Optional)" value={formData.gtid} onChange={handleChange} className="input m-2" />
                <label>
                    <input type="checkbox" name="agree" checked={isChecked} onChange={handleCheck} className="m-2"/>
                    &nbsp;I agree to the terms and conditions.
                </label>
                <button type="submit" disabled={!isChecked || formData.name == "" || formData.activity == ""} className="btn m-2">Submit</button>
            </form>
            <Document file="/GTLiabilityWaiverRelease_FYXX_FILMNAME.pdf">
                <Page pageNumber={1} />
                <Page pageNumber={2} />
                <Page pageNumber={3} />
            </Document>
        </div>
    );
}
export default WaiverInput;