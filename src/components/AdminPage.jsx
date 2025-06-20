import {useState, useEffect} from "react";
import "../App.css"
import {GOOGLE_SCRIPT_URL} from "./urls"

function AdminPage() {

    const [data, setData] = useState([]);
    const [filmTitle, setFilmTitle] = useState('');

    useEffect(() => {
        fetch(`http://localhost:8000/admin/waivers`)
        .then(result => result.json())
        .then(data => {
            console.log("Received data:", data);
            setData(data);
        })
        .catch(() => alert('Failed to fetch data'));
    }, []);

    return (
        <div>
            
            <h2>Admin Panel</h2>
            <input
                placeholder="Film Title"
                value={filmTitle}
                onChange={(e) => setFilmTitle(e.target.value)}
            />
            
            <ul>
                {Array.isArray(data) ? (
                    data.map((entry, i) => (
                    <li key={i}>{entry.name} - {entry.email}</li>
                    ))
                ) : (
                    <li>No data found or unauthorized access</li>
                )}
            </ul>
        </div>
      );
}
export default AdminPage;