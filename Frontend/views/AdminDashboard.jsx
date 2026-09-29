import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./AdminDashboard.css";
import {
    bookingWeekdays,
    getBookingIntervals,
    saveBookingIntervals,
} from "../controllers/timeslotController";

export default function AdminDashboard() {
    const [intervals, setIntervals] = useState(getBookingIntervals);
    const [newInterval, setNewInterval] = useState({
        start: "08:00",
        end: "12:00",
    });
    const [formError, setFormError] = useState("");

    useEffect(() => {
        saveBookingIntervals(intervals);
    }, [intervals]);

    function updateInterval(id, field, value) {
        setIntervals((currentIntervals) =>
            currentIntervals.map((interval) =>
                interval.id === id ? { ...interval, [field]: value } : interval
            )
        );
    }

    function addInterval(event) {
        event.preventDefault();

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
        </main>
    );
}

