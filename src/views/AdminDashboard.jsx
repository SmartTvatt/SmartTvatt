import { useContext, useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import "./AdminDashboard.css";
import { AuthContext } from "../context/AuthContext";
import { bookingWeekdays } from "../../controllers/timeslotController.js";
import { fetchTimeSlots } from "../api/timeSlots.js";
import { useTimeSlotAutosave } from "../api/useTimeSlotAutosave.js";
import TimeInput from "./TimeInput.jsx";

export default function AdminDashboard() {
    const { token, user } = useContext(AuthContext);
    const [intervals, setIntervals] = useState([]);
    const [scheduleLoading, setScheduleLoading] = useState(true);
    const [scheduleLoaded, setScheduleLoaded] = useState(false);
    const {
        save: autosave,
        saving: scheduleSaving,
        error: scheduleError,
        notice: scheduleNotice,
        reportError: setScheduleError,
    } =
        useTimeSlotAutosave(token);
    const [newInterval, setNewInterval] = useState({
        start: "08:00",
        end: "12:00",
    });
    const [formError, setFormError] = useState("");
    const [residents, setResidents] = useState([]);
    const [messageDraft, setMessageDraft] = useState({ recipientId: "all", subject: "", body: "" });
    const [messageFeedback, setMessageFeedback] = useState(null);
    const [isSending, setIsSending] = useState(false);

    // Load the shared weekly schedule saved by the server.
    useEffect(() => {
        if (!token) return undefined;

        const controller = new AbortController();
        fetchTimeSlots(token, controller.signal)
            .then((schedule) => {
                setIntervals(schedule.intervals);
                setScheduleLoaded(true);
            })
            .catch((error) => {
                if (error.name !== "AbortError") setScheduleError(error.message);
            })
            .finally(() => {
                if (!controller.signal.aborted) setScheduleLoading(false);
            });

        return () => controller.abort();
    }, [setScheduleError, token]);

    // Admin-API:t kräver token; listan filtreras till boende innan den visas som mottagare.
    useEffect(() => {
        if (!token) return;

        fetch("/api/admin/users", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(async (response) => {
                const data = await response.json();
                if (!response.ok) throw new Error(data.message || "Kunde inte hämta boende.");
                setResidents(data.filter((resident) => resident.role === "boende"));
            })
            .catch((error) => setMessageFeedback({ type: "error", text: error.message }));
    }, [token]);

    function updateInterval(id, field, value) {
        const updatedIntervals = intervals.map((interval) =>
            interval.id === id ? { ...interval, [field]: value } : interval
        );
        setIntervals(updatedIntervals);
        autosave(updatedIntervals);
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

        const updatedIntervals = [
            ...intervals,
            { id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`, ...newInterval },
        ];
        setIntervals(updatedIntervals);
        autosave(updatedIntervals);
        setFormError("");
    }

    function removeInterval(id) {
        const updatedIntervals = intervals.filter((interval) => interval.id !== id);
        setIntervals(updatedIntervals);
        autosave(updatedIntervals);
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
                            {scheduleLoading ? (
                                <tr><td colSpan="4">Hämtar schemat...</td></tr>
                            ) : intervals.map((interval, index) => (
                                <tr key={interval.id}>
                                    <th scope="row">Slot {index + 1}</th>
                                    <td>
                                        <label className="visually-hidden" htmlFor={`start-${interval.id}`}>
                                            Starttid för slot {index + 1}
                                        </label>
                                        <TimeInput
                                            id={`start-${interval.id}`}
                                            label={`Starttid för slot ${index + 1}`}
                                            value={interval.start}
                                            disabled={!scheduleLoaded}
                                            onChange={(value) => updateInterval(interval.id, "start", value)}
                                        />
                                    </td>
                                    <td>
                                        <label className="visually-hidden" htmlFor={`end-${interval.id}`}>
                                            Sluttid för slot {index + 1}
                                        </label>
                                        <TimeInput
                                            id={`end-${interval.id}`}
                                            label={`Sluttid för slot ${index + 1}`}
                                            value={interval.end}
                                            disabled={!scheduleLoaded}
                                            allowMidnight
                                            onChange={(value) => updateInterval(interval.id, "end", value)}
                                        />
                                    </td>
                                    <td className="interval-action-cell">
                                        <button
                                            className="remove-interval-button"
                                            type="button"
                                            aria-label={`Ta bort slot ${index + 1} för alla dagar`}
                                            disabled={!scheduleLoaded}
                                            onClick={() => removeInterval(interval.id)}
                                        >
                                            Ta bort
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {!scheduleLoading && scheduleLoaded && intervals.length === 0 && (
                                <tr><td colSpan="4">Inga bokningsbara tider i veckoschemat.</td></tr>
                            )}
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
                        <TimeInput
                            label="Starttid för nytt intervall"
                            value={newInterval.start}
                            disabled={!scheduleLoaded}
                            onChange={(value) => setNewInterval((current) => ({ ...current, start: value }))}
                        />
                    </label>
                    <label>
                        Sluttid
                        <TimeInput
                            label="Sluttid för nytt intervall"
                            value={newInterval.end}
                            disabled={!scheduleLoaded}
                            allowMidnight
                            onChange={(value) => setNewInterval((current) => ({ ...current, end: value }))}
                        />
                    </label>
                    <button className="add-interval-button" type="submit" disabled={!scheduleLoaded}>Lägg till</button>
                </form>
                {formError && <p className="form-error" role="alert">{formError}</p>}
                {scheduleError && <p className="form-error" role="alert">{scheduleError}</p>}
                {scheduleNotice && <p className="message-feedback success" role="status">{scheduleNotice}</p>}
                {scheduleSaving && <p role="status">Sparar ändring...</p>}
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
        </main>
    );
}
