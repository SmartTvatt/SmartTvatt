import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
    bookingWeekdays,
    getBookingIntervals,
    saveBookingIntervals,
} from "../controllers/timeslotController";
import "./AdminDashboard.css";
import "./AdminDaySchedule.css";

export default function AdminDaySchedule() {
    const { day: dayKey } = useParams();
    const day = bookingWeekdays.find((weekday) => weekday.key === dayKey);

    if (!day) {
        return (
            <main className="admin-page">
                <h1>Veckodagen hittades inte</h1>
                <Link className="back-to-week-link" to="/admin">Till veckoschemat</Link>
            </main>
        );
    }

    return <DaySchedule key={day.key} day={day} />;
}

function DaySchedule({ day }) {
    const [intervals, setIntervals] = useState(() => getBookingIntervals(day.key));
    const [newInterval, setNewInterval] = useState({ start: "08:00", end: "12:00" });
    const [formError, setFormError] = useState("");

    function updateInterval(id, field, value) {
        const updatedIntervals = intervals.map((interval) =>
            interval.id === id ? { ...interval, [field]: value } : interval
        );
        setIntervals(updatedIntervals);
        saveBookingIntervals(updatedIntervals, day.key);
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

        const updatedIntervals = [...intervals, { id: Date.now(), ...newInterval }];
        setIntervals(updatedIntervals);
        saveBookingIntervals(updatedIntervals, day.key);
        setFormError("");
    }

    function removeInterval(id) {
        const updatedIntervals = intervals.filter((interval) => interval.id !== id);
        setIntervals(updatedIntervals);
        saveBookingIntervals(updatedIntervals, day.key);
    }

    const sortedIntervals = [...intervals].sort((left, right) => left.start.localeCompare(right.start));

    return (
        <main className="admin-page">
            <header className="admin-header">
                <div>
                    <Link className="back-to-week-link" to="/admin">← Veckoschema</Link>
                    <p className="admin-eyebrow admin-day-eyebrow">DAGENS SCHEMA</p>
                    <h1>{day.label}</h1>
                    <p className="admin-intro">Ändringar här gäller bara {day.label.toLowerCase()}.</p>
                </div>
                <span className="admin-role">Admin</span>
            </header>

            <section className="interval-panel" aria-labelledby="day-interval-heading">
                <div className="interval-panel-heading">
                    <div>
                        <h2 id="day-interval-heading">Bokningsbara tider</h2>
                        <p>Justera, lägg till eller ta bort en slot för {day.label.toLowerCase()}.</p>
                    </div>
                    <span className="interval-count">{intervals.length} slots</span>
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
                            {sortedIntervals.map((interval, index) => (
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
                                            aria-label={`Ta bort slot ${index + 1} ${day.label.toLowerCase()}`}
                                            onClick={() => removeInterval(interval.id)}
                                        >
                                            Ta bort
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {sortedIntervals.length === 0 && (
                                <tr>
                                    <td colSpan="4">Inga bokningsbara tider den här dagen.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>

            <section className="add-interval-panel" aria-labelledby="add-day-interval-heading">
                <div>
                    <h2 id="add-day-interval-heading">Lägg till tidsintervall</h2>
                    <p>Den nya sloten läggs bara till på {day.label.toLowerCase()}.</p>
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