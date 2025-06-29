import {useState, useEffect} from "react";
import "../App.css"
import {GOOGLE_SCRIPT_URL} from "./urls"

function AdminPage() {

    const [data, setData] = useState([]);
    const [filmTitle, setFilmTitle] = useState('');
    const [prodDate, setProdDate] = useState('');
    const [selected, setSelected] = useState([]);
    const password = "PASSWORD";
    const [currentPassword, setCurrentPassword] = useState("");
    const [currentPasswordCheck, setCurrentPasswordCheck] = useState("");
    const [error, setError] = useState('');


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
                participants: selected.map(entry => ({
                  name: entry.name,
                  gtid: String(entry.gtid),
                })),
            };
          
            fetch("http://localhost:8000/admin/export", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            }).then(res => res.json()).then(console.log) ;

            alert(`Generated ${selected.length} waivers!`);
            //setFormData({name: '', gtid: ''});
        }
        catch (err) {
            alert("Submission failed.");
        }
    };

    const handleCheckPassword = () => {
        try {
            setCurrentPasswordCheck(currentPassword);
            setError('');
        } catch {
            setError('Incorrect Password');
        }
    }

    return (
        <div className="m-5">
            
            <h2>Admin Panel</h2>
            {currentPasswordCheck != password ? (
                <>
                    <input
                        placeholder="Enter password..."
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="input"
                    />

                    <button onClick={handleCheckPassword}>Submit</button>

                    {error !== '' && (<p className="error">{error}</p>)}
                </>
            ) : (
            <>
                <input
                    placeholder="Film Title"
                    value={filmTitle}
                    onChange={(e) => setFilmTitle(e.target.value)}
                    className="input"
                />

                <input
                    placeholder="Production Date"
                    value={prodDate}
                    onChange={(e) => setProdDate(e.target.value)}
                    className="input"
                />

                <button onClick={handleGenerateWaivers}>Generate Waivers</button>

                <h2>Responses from the Last Week</h2>

                <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>
                                    <input
                                        type="checkbox"
                                        checked={selected.length === data.length && data.length > 0}
                                        onChange={(e) => {
                                        if (e.target.checked) {
                                            setSelected(data);
                                        } else {
                                            setSelected([]);
                                        }
                                        }}
                                        className="checkbox"
                                    />
                                </th>
                                <th>Name</th>
                                <th>GTID</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.isArray(data) ? (
                                data.map((entry, i) => {
                                    const isSelected = selected.some(sel => sel.name === entry.name);

                                    const toggleCheckbox = () => {
                                        if (isSelected) {
                                            setSelected(prev => prev.filter(p => p.name !== entry.name));
                                        } else {
                                            setSelected(prev => [...prev, entry]);
                                        }
                                    };

                                    return(
                                    <tr key={i}>
                                        <td>
                                            <p>{i}</p>
                                            <input
                                            type="checkbox"
                                            checked={isSelected}
                                            onChange={toggleCheckbox}
                                            className="checkbox"
                                            />
                                        </td>
                                        <td>{entry.name}</td>
                                        <td>{entry.gtid}</td>
                                    </tr>);
                                })
                            ) : (
                                <tr>
                                    <td colSpan={3}>No data found or unauthorized access</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </>
            )}

        </div>
      );
}
export default AdminPage;