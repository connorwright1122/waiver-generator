import {useState, useEffect} from "react";
import "../App.css"
import {GOOGLE_SCRIPT_URL} from "./urls"

function AdminPage() {

    const [data, setData] = useState([]);
    const [filmTitle, setFilmTitle] = useState('');
    const [prodDate, setProdDate] = useState('');

    useEffect(() => {
        fetch(`http://localhost:8000/admin/waivers`)
        .then(result => result.json())
        .then(data => {
            console.log("Received data:", data);
            setData(data);
        })
        .catch(() => alert('Failed to fetch data'));
    }, []);

    const handleGenerateWaivers = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                film_title: filmTitle,
                production_date: prodDate,
                participants: data.map(entry => ({
                  name: entry.name,
                  gtid: String(entry.gtid),
                })),
            };
          
            fetch("http://localhost:8000/admin/export", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            }).then(res => res.json()).then(console.log) ;

            alert("Waivers generated!")
            setFormData({name: '', gtid: ''})
        }
        catch (err) {
            alert("Submission failed.")
        }
    };

    return (
        <div>
            
            <h2>Admin Panel</h2>
            <input
                placeholder="Film Title"
                value={filmTitle}
                onChange={(e) => setFilmTitle(e.target.value)}
            />

            <input
                placeholder="Production Date"
                value={prodDate}
                onChange={(e) => setProdDate(e.target.value)}
            />

            <button onClick={handleGenerateWaivers}>Generate Waivers</button>

            <h2>Responses from the Last Week</h2>
            <ul>
                {Array.isArray(data) ? (
                    data.map((entry, i) => (
                    <li key={i}>{entry.name} - {entry.gtid}</li>
                    ))
                ) : (
                    <li>No data found or unauthorized access</li>
                )}
            </ul>
        </div>
      );
}
export default AdminPage;