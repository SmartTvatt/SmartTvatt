
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { formatLongDate } from "./bookingDateUtils.js";
import './Dashboard.css'
import { Link, useNavigate } from "react-router-dom";

export default function Dashboard() {
    const navigate = useNavigate();
    const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
    const [showNextStep, setShowNextStep] = useState(false);

    const { token, user } = useContext(AuthContext);
    const [booking, setBooking] = useState(null);
    const [messages, setMessages] = useState([]);
    const [messagesLoading, setMessagesLoading] = useState(true);
    const [messagesError, setMessagesError] = useState("");

    // Hämtar den inloggades aktiva bokning när sidan öppnas
    useEffect(() => {
        fetch("/api/bookings/mine", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(async (res) => {
                const data = await res.json();
                if (!res.ok) throw new Error(data.message || "Kunde inte hämta din bokning.");
                return data;
            })
            .then((data) => setBooking(data))
            .catch((error) => setBookingError(error.message || "Kunde inte hämta din bokning."))
            .finally(() => setBookingLoading(false));
        }, [token]);

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

    return (
        <div className="dashboard-shell">
            <header className="dashboard-header">
                <div className="brand-lockup">
                    <span className="brand-mark">S</span>
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
                    <button className="logout-button">Logga ut</button>
                </div>
            </header>


            <main className="dashboard-main">
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
                    <span className="date-label">Torsdag 25 september 2026</span>
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

                                                {bookingLoading ? (
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
                                <span className="booking-arrow">→</span>
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
                            <button className="action-button action-neutral">
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
                            messages.map((message) => (
                                <article className="message-item" key={message._id}>
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
                                </article>
                            ))
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
        </div>
    )
}