import {useState, useEffect} from "react";
import "../App.css"
import {GOOGLE_SCRIPT_URL} from "./urls"


function WaiverInput() {
    const [formData, setFormData] = useState({name: '', email: ''});
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
            setFormData({name: '', email: ''})
        }
        catch (err) {
            alert("Submission failed.")
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" name="name" placeholder="Your Name" value={formData.name} onChange={handleChange} required />
            <input name="email" type="email" placeholder="Your Email" value={formData.email} onChange={handleChange} required />
            <label>
                <input type="checkbox" name="agree" checked={isChecked} onChange={handleCheck} />
                I agree to the terms and conditions.
            </label>
            <p>Checkbox status: {isChecked ? 'Checked' : 'Unchecked'}</p>
            <button type="submit" disabled={!isChecked}>Submit</button>
        </form>
    );
}
export default WaiverInput;