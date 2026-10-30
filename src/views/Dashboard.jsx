//sidan användaren ser efter inloggning

import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";  //hämtar token och användaren från inloggningen

import { formatLongDate } from "./bookingDateUtils.js"; // formatLongDate , funktion som gör "2026-10-16" till “fredag 16 oktober”.
import './Dashboard.css'
import logo from '../assets/logo.svg'; // samma logga som på login-sidan
import { Link, useNavigate } from "react-router-dom";

export default function Dashboard() {
    const navigate = useNavigate();
    const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
    const [faultDialogOpen, setFaultDialogOpen] = useState(false);
    const [showNextStep, setShowNextStep] = useState(false);

    const { token, user, logout } = useContext(AuthContext);
    const [booking, setBooking] = useState(null);

    const [bookingError, setBookingError] = useState("");
    const [bookingLoading, setBookingLoading] = useState(true);
    const [cancelling, setCancelling] = useState(false);
    const [messages, setMessages] = useState([]);
    const [messagesLoading, setMessagesLoading] = useState(Boolean(token));
    const [messagesError, setMessagesError] = useState("");
    const [faultDraft, setFaultDraft] = useState({ equipment: "", description: "" });
    const [faultSubmitting, setFaultSubmitting] = useState(false);
    const [faultError, setFaultError] = useState("");
    const [faultNotice, setFaultNotice] = useState("");

    // minns vilka meddelanden användaren redan sett (sparat i webbläsaren).
    // nya meddelanden får en "NY"-stämpel tills sidan laddas om.
    const [settaMeddelanden] = useState(() => {
        try {
            return new Set(JSON.parse(localStorage.getItem("smarttvatt.settaMeddelanden") || "[]"));
        } catch {
            return new Set();
        }
    });

    // Hämtar den inloggades aktiva bokning för dashboarden.
    useEffect(() => {
        fetch("/api/bookings/mine", { //frågar backend efter min bokning.
            headers: { Authorization: `Bearer ${token}` }, // visa token till vakten
        })
            .then(async (res) => {
                const data = await res.json();       
                if (!res.ok) throw new Error(data.message || "Kunde inte hämta din bokning."); // gick det dåligt “kastas” ett fel. Det hoppar direkt ner till .catch.
                return data;
            }) //Kedjan: then = lyckades, catch = misslyckades, finally = oavsett.
            .then((data) => setBooking(data)) //lägger bokningen i lådan
            .catch((error) => setBookingError(error.message || "Kunde inte hämta din bokning.")) //sparar felmeddelandet så det kan visas.
            .finally(() => setBookingLoading(false));
        }, [token]);//kör om koden om token ändras.

    // Inkorgen hämtas med JWT så backend kan begränsa svaret till den inloggade boende.
    useEffect(() => {
        if (!token) return;

        fetch("/api/messages/mine", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(async (response) => {
                const data = await response.json();
                if (!response.ok) throw new Error(data.message || "Inkorgen kunde inte hämtas.");
                setMessages(data);
            })
            .catch((error) => setMessagesError(error.message))
            .finally(() => setMessagesLoading(false));
    }, [token]);

    // när inkorgen har laddats: spara meddelande-id:na så de räknas som sedda nästa gång.
    useEffect(() => {
        if (!messages.length) return;
        try {
            localStorage.setItem(
                "smarttvatt.settaMeddelanden",
                JSON.stringify(messages.map((m) => m._id))
            );
        } catch {
            // struntar i om webbläsaren inte vill spara
        }
    }, [messages]);
    
    // dagens datum till rubriken. sv-SE ger t.ex. "torsdag 30 oktober 2026",
    // raden under gör bara första bokstaven stor.
    const todayRaw = new Intl.DateTimeFormat("sv-SE", {
        weekday: "long", day: "numeric", month: "long", year: "numeric",
    }).format(new Date());
    const todayLabel = todayRaw.charAt(0).toUpperCase() + todayRaw.slice(1);

    // Gör om bokningen från databasen till det kortet visar
const activeBooking = booking
  ? {
      weekday: new Intl.DateTimeFormat("sv-SE", { weekday: "long", timeZone: "UTC" })
          .format(new Date(booking.date)).toUpperCase(),
      dayOfMonth: new Date(booking.date).getUTCDate(),
      month: new Intl.DateTimeFormat("sv-SE", { month: "short", timeZone: "UTC" })
          .format(new Date(booking.date)).toUpperCase(),
      dateLabel: formatLongDate(booking.date.slice(0, 10)),
      time: booking.time,
      location: booking.location,
    }
  : null;

    const handleCancelConfirmation = async () => {
        if (!booking || !token) return;
        setCancelling(true);
        setBookingError("");
        try {
            // Avbokningen sparas på servern innan dashboarden uppdateras.
            const response = await fetch(`/api/bookings/${booking._id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Kunde inte avboka tiden.");
            setBooking(null);
            setShowNextStep(true);
        } catch (error) {
            setBookingError(error.message || "Kunde inte avboka tiden.");
        } finally {
            setCancelling(false);
        }
    };

    const handleCloseCancelDialog = () => {
        setCancelDialogOpen(false);
        setShowNextStep(false);
        setBookingError("");
    };

    const handleGoToBooking = () => {
        handleCloseCancelDialog();
        navigate("/boka");
    };

    // loggar ut: tömmer token och användaren, sen tillbaka till login.
    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const handleFaultReport = async (event) => {
        event.preventDefault();
        if (!token) return;

        setFaultSubmitting(true);
        setFaultError("");
        setFaultNotice("");

        try {
            const response = await fetch("/api/fault-reports", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                },
                body: JSON.stringify(faultDraft),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Felanmälan kunde inte skickas.");

            setFaultDraft({ equipment: "", description: "" });
            setFaultDialogOpen(false);
            setFaultNotice("Din felanmälan har skickats till administratören.");
        } catch (error) {
            setFaultError(error.message || "Felanmälan kunde inte skickas.");
        } finally {
            setFaultSubmitting(false);
        }
    };

    return (
        <div className="dashboard-shell">

            <header className="dashboard-header">
                <div className="brand-lockup">
                    <img className="brand-mark" src={logo} alt="SmartTvätt" />
                    <div>
                        <p className="brand-name">SmartTvätt</p>
                        <p className="brand-caption">Din tvättstuga, enklare</p>
                    </div>
                </div>


                <div className="header-actions">
                    <div className="location-chip">
                        <span className="chip-icon">⌖</span>
                        <span>Gjutargatan 26</span>
                    </div>

                    <div className="profile-chip">
                        <span className="avatar">{user?.name?.[0] || "B"}</span>
                        <span>{user?.name || "Boende"}</span>
                    </div>

                    <button type="button" className="logout-button" onClick={handleLogout}>Logga ut</button>
                </div>
            </header>


            <main className="dashboard-main">
                {faultNotice && (
                    <Alert severity="success" role="status" onClose={() => setFaultNotice("")} sx={{ mb: 2 }}>
                        {faultNotice}
                    </Alert>
                )}
                {bookingError && (
                    <Alert severity="error" role="alert" onClose={() => setBookingError("")} sx={{ mb: 2 }}>
                        {bookingError}
                    </Alert>
                )}
                <section className="welcome-section">
                    <div>
                        <p className="eyebrow">ÖVERSIKT</p>
                        <h1>Hej, {user?.name || "boende"}</h1>
                        <p className="welcome-copy">Här är det senaste från din tvättstuga.</p>
                    </div>
                    <span className="date-label">{todayLabel}</span>
                </section>

                <section className="dashboard-grid">
                    <article className="booking-card">
                        <div className="card-heading">
                            <div>
                                <p className="eyebrow">NÄSTA BOKNING</p>
                                <h2>Din tvättid</h2>
                            </div>
                            {activeBooking && <span className="booking-badge"><span className="status-dot" />Aktiv</span>}
                        </div>

                            {bookingLoading ? 
                            (
                                <p className="welcome-copy">Hämtar bokning...</p>
                            ) : activeBooking ? (
                            <div className="booking-display">
                                <div className="booking-date-box">
                                    <span className="booking-day">{activeBooking.weekday}</span>
                                    <strong>{activeBooking.dayOfMonth}</strong>
                                    <span>{activeBooking.month}</span>
                                </div>
                                <div className="booking-details">
                                    <h3>{activeBooking.time}</h3>
                                    <p>{activeBooking.location}</p>
                                </div>
                            </div>
                        ) : (
                            <p className="welcome-copy">Du har ingen aktiv bokning just nu.</p>
                        )}
                    </article>

                    <aside className="quick-actions" aria-label="Snabblänkar">
                        <div className="section-heading">
                            <div>
                                <p className="eyebrow">SNABBT</p>
                                <h2>Vad vill du göra?</h2>
                            </div>
                        </div>
                        <div className="action-list">
                            <Link to="/boka" className="action-button action-primary">
                                <span className="action-icon">＋</span>
                                <span><strong>Boka tid</strong><small>Hitta en ledig tid</small></span>
                                <span className="action-chevron">›</span>
                            </Link>
                            <button
                                type="button"
                                className="action-button action-danger"
                                disabled={!activeBooking}
                                onClick={() => setCancelDialogOpen(true)}
                            >
                                <span className="action-icon">×</span>
                                <span><strong>Avboka tid</strong><small>Ändra din bokning</small></span>
                                <span className="action-chevron">›</span>
                            </button>
                            <button
                                type="button"
                                className="action-button action-neutral"
                                onClick={() => {
                                    setFaultError("");
                                    setFaultDialogOpen(true);
                                }}
                            >
                                <span className="action-icon">!</span>
                                <span><strong>Anmäl skada</strong><small>Rapportera ett problem</small></span>
                                <span className="action-chevron">›</span>
                            </button>
                        </div>
                    </aside>
                </section>

                <section className="inbox-card">
                    <div className="inbox-header">
                        <div>
                            <p className="eyebrow">UPPDATERINGAR</p>
                            <h2>Inkorg</h2>
                        </div>
                        <span className="message-count">{messages.length} meddelanden</span>
                    </div>
                    <div className="message-list">
                        {messagesLoading ? (
                            <p className="inbox-empty">Hämtar meddelanden...</p>
                        ) : messagesError ? (
                            <p className="inbox-empty" role="alert">{messagesError}</p>
                        ) : messages.length ? (
                            messages.map((message) => {
                                const arNy = !settaMeddelanden.has(message._id); // har man inte sett det förut?
                                return (
                                <article className={arNy ? "message-item unread" : "message-item"} key={message._id}>
                                    <span className="message-icon">⌁</span>
                                    <div className="message-content">
                                        <div className="message-meta">
                                            <p className="message-from">{message.sender?.name || "Admin"}: {message.subject}</p>
                                            <p className="message-time">
                                                {new Date(message.createdAt).toLocaleString("sv-SE", { dateStyle: "medium", timeStyle: "short" })}
                                            </p>
                                        </div>
                                        <p className="message-preview">{message.body}</p>
                                    </div>
                                    {arNy && <span className="unread-label">NY</span>}
                                </article>
                                );
                            })
                        ) : (
                            <p className="inbox-empty">Du har inga meddelanden ännu.</p>
                        )}
                    </div>
                </section>
            </main>

            {/* Dialogen håller hela avbokningsflödet kvar ovanpå dashboarden. */}
            <Dialog
                className="cancel-dialog"
                open={cancelDialogOpen}
                onClose={handleCloseCancelDialog}
                aria-labelledby="cancel-booking-title"
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle id="cancel-booking-title">
                    {showNextStep ? "Vad vill du göra härnäst?" : "Avboka din tvättid?"}
                </DialogTitle>

                <DialogContent>
                    {bookingError && (
                        <Alert severity="error" role="alert" sx={{ mb: 2 }}>
                            {bookingError}
                        </Alert>
                    )}
                    {showNextStep ? (
                        <>
                            <Alert severity="success" role="status" sx={{ mb: 2 }}>
                                Din bokning är avbokad och ändringen är sparad.
                            </Alert>
                            <Typography>
                                Du kan gå vidare till bokningssidan eller stanna på dashboarden.
                            </Typography>
                        </>
                    ) : (
                        <>
                            <Typography sx={{ mb: 2 }}>
                                Det här är din nuvarande bokning:
                            </Typography>
                            <Typography component="p" variant="body1">
                                {activeBooking?.dateLabel}, {activeBooking?.time}
                            </Typography>
                            <Typography component="p" variant="body2" sx={{ mt: 0.5 }}>
                                {activeBooking?.location}
                            </Typography>
                            <Typography sx={{ mt: 2 }}>
                                Vill du fortsätta med avbokningen?
                            </Typography>
                        </>
                    )}
                </DialogContent>

                <DialogActions sx={{ p: 2, flexWrap: "wrap" }}>
                    {showNextStep ? (
                        <>
                            <Button className="cancel-dialog__secondary" onClick={handleCloseCancelDialog}>
                                Till dashboarden
                            </Button>
                            <Button className="cancel-dialog__primary" variant="contained" onClick={handleGoToBooking}>
                                Till bokningssidan
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button className="cancel-dialog__secondary" onClick={handleCloseCancelDialog}>
                                Behåll bokningen
                            </Button>
                            <Button
                                className="cancel-dialog__danger"
                                color="error"
                                variant="contained"
                                onClick={handleCancelConfirmation}
                                disabled={cancelling}
                            >
                                {cancelling ? "Avbokar..." : "Ja, avboka"}
                            </Button>
                        </>
                    )}
                </DialogActions>
            </Dialog>

            <Dialog
                open={faultDialogOpen}
                onClose={() => !faultSubmitting && setFaultDialogOpen(false)}
                aria-labelledby="fault-report-title"
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle id="fault-report-title">Anmäl ett fel</DialogTitle>
                <form onSubmit={handleFaultReport}>
                    <DialogContent>
                        <Typography sx={{ mb: 2 }}>
                            Beskriv vilken utrustning det gäller och vad som inte fungerar.
                        </Typography>
                        {faultError && (
                            <Alert severity="error" role="alert" sx={{ mb: 2 }}>
                                {faultError}
                            </Alert>
                        )}
                        <label className="fault-report-field">
                            Utrustning
                            <input
                                type="text"
                                value={faultDraft.equipment}
                                onChange={(event) => setFaultDraft({ ...faultDraft, equipment: event.target.value })}
                                maxLength={100}
                                required
                            />
                        </label>
                        <label className="fault-report-field">
                            Beskrivning
                            <textarea
                                value={faultDraft.description}
                                onChange={(event) => setFaultDraft({ ...faultDraft, description: event.target.value })}
                                maxLength={1000}
                                rows={4}
                                required
                            />
                        </label>
                    </DialogContent>
                    <DialogActions sx={{ p: 2 }}>
                        <Button onClick={() => setFaultDialogOpen(false)} disabled={faultSubmitting}>
                            Avbryt
                        </Button>
                        <Button type="submit" variant="contained" disabled={faultSubmitting}>
                            {faultSubmitting ? "Skickar..." : "Skicka felanmälan"}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </div>
    )
}