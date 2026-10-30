import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { bookingWeekdays, getBookingIntervals } from "../../controllers/timeslotController.js";
import { AuthContext } from "../context/AuthContext";
import { fetchTimeSlots, resetTimeSlotDay } from "../api/timeSlots.js";
import { useTimeSlotAutosave } from "../api/useTimeSlotAutosave.js";
import TimeInput from "./TimeInput.jsx";
import "./AdminDashboard.css";
import "./AdminDaySchedule.css";

export default function AdminDaySchedule() {
    // URL-parametern avgör vilken veckodags lokala schema som ska visas.
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
    const { token } = useContext(AuthContext);
    const [intervals, setIntervals] = useState([]);
    const [hasDayOverride, setHasDayOverride] = useState(false);
    const [scheduleLoading, setScheduleLoading] = useState(true);
    const [scheduleLoaded, setScheduleLoaded] = useState(false);
    const [resettingSchedule, setResettingSchedule] = useState(false);
    const {
        save: autosave,
        saving: scheduleSaving,
        error: scheduleError,
        notice: scheduleNotice,
        reportError: setScheduleError,
    } =
        useTimeSlotAutosave(token, day.key);
    const [newInterval, setNewInterval] = useState({ start: "08:00", end: "12:00" });
    const [formError, setFormError] = useState("");

    useEffect(() => {
        if (!token) return undefined;

        const controller = new AbortController();
        fetchTimeSlots(token, controller.signal)
            .then((schedule) => {
                setIntervals(getBookingIntervals(day.key, schedule));
                setHasDayOverride(Array.isArray(schedule.dayOverrides?.[day.key]));
                setScheduleLoaded(true);
            })
            .catch((error) => {
                if (error.name !== "AbortError") setScheduleError(error.message);
            })
            .finally(() => {
                if (!controller.signal.aborted) setScheduleLoading(false);
            });

        return () => controller.abort();
    }, [day.key, setScheduleError, token]);

    async function resetToWeeklySchedule() {
        if (!hasDayOverride || scheduleSaving || resettingSchedule) return;

        setResettingSchedule(true);
        setScheduleError("");
        try {
            const schedule = await resetTimeSlotDay(token, day.key);
            setIntervals(getBookingIntervals(day.key, schedule));
            setHasDayOverride(false);
        } catch (error) {
            setScheduleError(error.message);
        } finally {
            setResettingSchedule(false);
        }
    }

    function updateInterval(id, field, value) {
        const updatedIntervals = intervals.map((interval) =>
            interval.id === id ? { ...interval, [field]: value } : interval
        );
        setIntervals(updatedIntervals);
        autosave(updatedIntervals);
    }

    function addInterval(event) {
        event.preventDefault();

        // Hindra tomma tidsintervall och överlapp innan schemat sparas.
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

        const id = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
        const updatedIntervals = [...intervals, { id, ...newInterval }];
        setIntervals(updatedIntervals);
        autosave(updatedIntervals);
        setFormError("");
    }

    function removeInterval(id) {
        const updatedIntervals = intervals.filter((interval) => interval.id !== id);
        setIntervals(updatedIntervals);
        autosave(updatedIntervals);
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
                    <div className="day-schedule-actions">
                        <span className="interval-count">{intervals.length} slots</span>
                        <button
                            className="reset-day-schedule-button"
                            type="button"
                            disabled={!scheduleLoaded || !hasDayOverride || scheduleSaving || resettingSchedule}
                            onClick={resetToWeeklySchedule}
                        >
                            {resettingSchedule
                                ? "Synkroniserar..."
                                : hasDayOverride
                                    ? "Återställ till veckoschema"
                                    : "Följer veckoschemat"}
                        </button>
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
                            ) : sortedIntervals.map((interval, index) => (
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
                                            disabled={!scheduleLoaded || resettingSchedule}
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
                                            disabled={!scheduleLoaded || resettingSchedule}
                                            allowMidnight
                                            onChange={(value) => updateInterval(interval.id, "end", value)}
                                        />
                                    </td>
                                    <td className="interval-action-cell">
                                        <button
                                            className="remove-interval-button"
                                            type="button"
                                            disabled={!scheduleLoaded || resettingSchedule}
                                            aria-label={`Ta bort slot ${index + 1} ${day.label.toLowerCase()}`}
                                            onClick={() => removeInterval(interval.id)}
                                        >
                                            Ta bort
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {!scheduleLoading && sortedIntervals.length === 0 && (
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
                        <TimeInput
                            label={`Starttid för nytt intervall ${day.label.toLowerCase()}`}
                            value={newInterval.start}
                            disabled={!scheduleLoaded || resettingSchedule}
                            onChange={(value) => setNewInterval((current) => ({ ...current, start: value }))}
                        />
                    </label>
                    <label>
                        Sluttid
                        <TimeInput
                            label={`Sluttid för nytt intervall ${day.label.toLowerCase()}`}
                            value={newInterval.end}
                            disabled={!scheduleLoaded || resettingSchedule}
                            allowMidnight
                            onChange={(value) => setNewInterval((current) => ({ ...current, end: value }))}
                        />
                    </label>
                    <button className="add-interval-button" type="submit" disabled={!scheduleLoaded || resettingSchedule}>Lägg till</button>
                </form>
                {formError && <p className="form-error" role="alert">{formError}</p>}
                {scheduleError && <p className="form-error" role="alert">{scheduleError}</p>}
                {scheduleNotice && <p className="message-feedback success" role="status">{scheduleNotice}</p>}
                {scheduleSaving && <p role="status">Sparar ändring...</p>}
                {resettingSchedule && <p role="status">Synkroniserar med veckoschemat...</p>}
            </section>
        </main>
    );
}