import { useContext, useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import "./AdminDashboard.css";
import { AuthContext } from "../context/AuthContext";
import {
    bookingWeekdays,
    getBookingIntervals,
    saveBookingIntervals,
} from "../../controllers/timeslotController";

export default function AdminDashboard() {
    const { token, user } = useContext(AuthContext);
    const [intervals, setIntervals] = useState(getBookingIntervals);
    const [newInterval, setNewInterval] = useState({
        start: "08:00",
        end: "12:00",
    });
    const [formError, setFormError] = useState("");
    const [residents, setResidents] = useState([]);
    const [messageDraft, setMessageDraft] = useState({ recipientId: "all", subject: "", body: "" });
    const [messageFeedback, setMessageFeedback] = useState(null);
    const [isSending, setIsSending] = useState(false);
    const [faultReports, setFaultReports] = useState([]);
    const [faultReportsLoading, setFaultReportsLoading] = useState(true);
    const [faultReportsError, setFaultReportsError] = useState("");

    // Spara grundschemat när en ändring görs så det finns kvar efter omladdning.
    useEffect(() => {
        saveBookingIntervals(intervals);
    }, [intervals]);

    // Admin-API:t kräver token; listan filtreras till boende innan den visas som mottagare.
    useEffect(() => {
        if (!token) return;

        fetch("/api/admin/users", {
            headers: { Authorization: "Bearer " + token },
        })
            .then(async (response) => {
                const data = await response.json();
                if (!response.ok) throw new Error(data.message || "Kunde inte hämta boende.");
                setResidents(data.filter((resident) => resident.role === "boende"));
            })
            .catch((error) => setMessageFeedback({ type: "error", text: error.message }));
    }, [token]);

    useEffect(() => {
        if (!token) return;

        fetch("/api/admin/fault-reports", {
            headers: { Authorization: "Bearer " + token },
        })
            .then(async (response) => {
                const data = await response.json();
                if (!response.ok) throw new Error(data.message || "Felanmälningar kunde inte hämtas.");
                setFaultReports(data);
            })
            .catch((error) => setFaultReportsError(error.message || "Felanmälningar kunde inte hämtas."))
            .finally(() => setFaultReportsLoading(false));
    }, [token]);

    function updateInterval(id, field, value) {
        setIntervals((currentIntervals) =>
            currentIntervals.map((interval) =>
                interval.id === id ? { ...interval, [field]: value } : interval
            )
        );
    }

    function addInterval(event) {
        event.preventDefault();

        // Tidsfältens HH:MM-format kan jämföras direkt för ordning och överlapp.
        if (newInterval.start >= newInterval.end) {
            setFormError("Sluttiden måste vara senare än starttiden.");
            return;
        }

        const overlaps = intervals.some(
            (interval) => newInterval.start < interval.end && newInterval.end > interval.start
        );
        if (overlaps) {
            setFormError("Tidsintervallet överlappar en befintlig slot.");
            return;
        }

        setIntervals((currentIntervals) => [
            ...currentIntervals,
            { id: Date.now(), ...newInterval },
        ]);
        setFormError("");
    }

    function removeInterval(id) {
        setIntervals((currentIntervals) =>
            currentIntervals.filter((interval) => interval.id !== id)
        );
    }

    async function sendMessage(event) {
        event.preventDefault();
        setMessageFeedback(null);
        setIsSending(true);

        try {
            // Samma token som skyddar adminvyn skickas med utskicket till API:t.
            const response = await fetch("/api/admin/messages", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(messageDraft),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Meddelandet kunde inte skickas.");

            setMessageFeedback({ type: "success", text: data.message });
            setMessageDraft((current) => ({ ...current, subject: "", body: "" }));
        } catch (error) {
            setMessageFeedback({ type: "error", text: error.message });
        } finally {
            setIsSending(false);
        }
    }

    // Frontendskyddet förbättrar navigeringen; API:et gör den egentliga behörighetskontrollen.
    if (user?.role !== "admin") return <Navigate to="/" replace />;

    return (
        <main className="admin-page">
            <header className="admin-header">
                <div>
                    <p className="admin-eyebrow">ADMINISTRATION</p>
                    <h1>Bokningsintervall</h1>
                    <p className="admin-intro">
                        Ändra en slot en gång så uppdateras veckans alla dagar.
                    </p>
                </div>
                <span className="admin-role">Admin</span>
            </header>

            <section className="interval-panel" aria-labelledby="interval-heading">
                <div className="interval-panel-heading">
                    <div>
                        <h2 id="interval-heading">Gemensamt veckoschema</h2>
                        <p>Samma slots används varje dag, måndag till söndag.</p>
                    </div>
                    <span className="interval-count">{intervals.length} slots per dag</span>
                </div>

                <div className="week-template-banner">
                    <span className="week-template-label">Gäller alla dagar</span>
                    <div className="week-days" aria-label="Måndag till söndag">
                        {bookingWeekdays.map((day) => (
                            <Link className="week-day-link" key={day.key} to={`/admin/${day.key}`}>
                                {day.short}
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="interval-table-wrap">
                    <table className="interval-table">
                        <thead>
                            <tr>
                                <th scope="col">Slot</th>
                                <th scope="col">Start</th>
                                <th scope="col">Slut</th>
                                <th scope="col"><span className="visually-hidden">Åtgärd</span></th>
                            </tr>
                        </thead>
                        <tbody>
                            {intervals.map((interval, index) => (
                                <tr key={interval.id}>
                                    <th scope="row">Slot {index + 1}</th>
                                    <td>
                                        <label className="visually-hidden" htmlFor={`start-${interval.id}`}>
                                            Starttid för slot {index + 1}
                                        </label>
                                        <input
                                            id={`start-${interval.id}`}
                                            className="time-input"
                                            type="time"
                                            value={interval.start}
                                            onChange={(event) => updateInterval(interval.id, "start", event.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <label className="visually-hidden" htmlFor={`end-${interval.id}`}>
                                            Sluttid för slot {index + 1}
                                        </label>
                                        <input
                                            id={`end-${interval.id}`}
                                            className="time-input"
                                            type="time"
                                            value={interval.end}
                                            onChange={(event) => updateInterval(interval.id, "end", event.target.value)}
                                        />
                                    </td>
                                    <td className="interval-action-cell">
                                        <button
                                            className="remove-interval-button"
                                            type="button"
                                            aria-label={`Ta bort slot ${index + 1} för alla dagar`}
                                            onClick={() => removeInterval(interval.id)}
                                        >
                                            Ta bort
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            <section className="add-interval-panel" aria-labelledby="add-interval-heading">
                <div>
                    <h2 id="add-interval-heading">Lägg till tidsintervall</h2>
                    <p>Den nya sloten läggs till för alla veckans dagar.</p>
                </div>
                <form className="add-interval-form" onSubmit={addInterval}>
                    <label>
                        Starttid
                        <input
                            type="time"
                            value={newInterval.start}
                            onChange={(event) => setNewInterval({ ...newInterval, start: event.target.value })}
                            required
                        />
                    </label>
                    <label>
                        Sluttid
                        <input
                            type="time"
                            value={newInterval.end}
                            onChange={(event) => setNewInterval({ ...newInterval, end: event.target.value })}
                            required
                        />
                    </label>
                    <button className="add-interval-button" type="submit">Lägg till</button>
                </form>
                {formError && <p className="form-error" role="alert">{formError}</p>}
            </section>

            <section className="message-panel" aria-labelledby="message-heading">
                <div className="message-panel-heading">
                    <div>
                        <h2 id="message-heading">Skicka meddelande</h2>
                        <p>Meddelandet visas i mottagarens inkorg i appen.</p>
                    </div>
                </div>
                <form className="message-form" onSubmit={sendMessage}>
                    <label>
                        Mottagare
                        <select
                            value={messageDraft.recipientId}
                            onChange={(event) => setMessageDraft({ ...messageDraft, recipientId: event.target.value })}
                        >
                            <option value="all">Alla boende</option>
                            {residents.map((resident) => (
                                <option key={resident._id} value={resident._id}>
                                    {resident.name} - lgh {resident.apartmentNumber}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label>
                        Rubrik
                        <input
                            type="text"
                            maxLength={120}
                            value={messageDraft.subject}
                            onChange={(event) => setMessageDraft({ ...messageDraft, subject: event.target.value })}
                            required
                        />
                    </label>
                    <label className="message-body-field">
                        Meddelande
                        <textarea
                            maxLength={2000}
                            rows={5}
                            value={messageDraft.body}
                            onChange={(event) => setMessageDraft({ ...messageDraft, body: event.target.value })}
                            required
                        />
                    </label>
                    <button className="add-interval-button" type="submit" disabled={isSending || residents.length === 0}>
                        {isSending ? "Skickar..." : "Skicka"}
                    </button>
                </form>
                {messageFeedback && (
                    <p className={`message-feedback ${messageFeedback.type}`} role={messageFeedback.type === "error" ? "alert" : "status"}>
                        {messageFeedback.text}
                    </p>
                )}
            </section>

            <section className="fault-reports-panel" aria-labelledby="fault-reports-heading">
                <div className="message-panel-heading">
                    <div>
                        <h2 id="fault-reports-heading">Felanmälningar</h2>
                        <p>Problem som boende har rapporterat.</p>
                    </div>
                    <span className="interval-count">{faultReports.length} rapporter</span>
                </div>
                {faultReportsLoading ? (
                    <p className="fault-reports-feedback">Hämtar felanmälningar...</p>
                ) : faultReportsError ? (
                    <p className="fault-reports-feedback error" role="alert">{faultReportsError}</p>
                ) : faultReports.length ? (
                    <ul className="fault-report-list">
                        {faultReports.map((report) => (
                            <li className="fault-report-item" key={report._id}>
                                <div className="fault-report-meta">
                                    <strong>{report.equipment}</strong>
                                    <span>
                                        {report.resident?.name || "Boende"}
                                        {report.resident?.apartmentNumber ? ` · lgh ${report.resident.apartmentNumber}` : ""}
                                    </span>
                                    <time dateTime={report.createdAt}>
                                        {new Date(report.createdAt).toLocaleString("sv-SE", {
                                            dateStyle: "medium",
                                            timeStyle: "short",
                                        })}
                                    </time>
                                </div>
                                <p>{report.description}</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="fault-reports-feedback">Inga felanmälningar ännu.</p>
                )}
            </section>
        </main>
    );
}
