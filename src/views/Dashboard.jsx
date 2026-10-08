
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";
import { useState } from "react";
import './Dashboard.css'
import { Link, useNavigate } from "react-router-dom";

export default function Dashboard() {
    const navigate = useNavigate();
    const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
    const [showNextStep, setShowNextStep] = useState(false);

    // Tillfällig presentationsdata tills dashboarden hämtar bokningen från API:t.
    const activeBooking = {
        weekday: "FREDAG",
        dayOfMonth: "18",
        month: "SEP",
        dateLabel: "Fredag 18 sep",
        time: "16:00–20:00",
        location: "Tvättstuga 1 · Gjutargatan 26",
    };

    // Att bekräfta i dialogen är ännu inte samma sak som att spara en avbokning.
    const handleCancelConfirmation = () => {
        setShowNextStep(true);
    };

    const handleCloseCancelDialog = () => {
        setCancelDialogOpen(false);
        setShowNextStep(false);
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
                        <span className="avatar">U</span>
                        <span>Username</span>
                    </div>
                    <button className="logout-button">Logga ut</button>
                </div>
            </header>


            <main className="dashboard-main">
                <section className="welcome-section">
                    <div>
                        <p className="eyebrow">ÖVERSIKT</p>
                        <h1>Hej, Username</h1>
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
                            <span className="booking-badge"><span className="status-dot" />Aktiv</span>
                        </div>
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
                        <span className="message-count">3 meddelanden</span>
                    </div>
                    <div className="message-list">
                        <article className="message-item unread">
                            <span className="message-icon">⌁</span>
                            <div className="message-content">
                                <div className="message-meta"><p className="message-from">Admin</p><p className="message-time">Idag</p></div>
                                <p className="message-preview">Underhållsdag tisdag - tvättstugan stänger kl 12.</p>
                            </div>
                            <span className="unread-label">NY</span>
                        </article>
                        <article className="message-item">
                            <span className="message-icon system-icon">✓</span>
                            <div className="message-content">
                                <div className="message-meta"><p className="message-from">System</p><p className="message-time">18 sep</p></div>
                                <p className="message-preview">Du har bokat tid fredag 18 sep, 16:00–20:00.</p>
                            </div>
                        </article>
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
                    {showNextStep ? (
                        <>
                            {/* Förklarar att gränssnittet ännu inte kan spara avbokningen. */}
                            <Alert severity="info" role="status" sx={{ mb: 2 }}>
                                Du har valt att avboka, men ändringen är inte sparad eftersom
                                avbokningen ännu inte är kopplad till systemet.
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
                                {activeBooking.dateLabel}, {activeBooking.time}
                            </Typography>
                            <Typography component="p" variant="body2" sx={{ mt: 0.5 }}>
                                {activeBooking.location}
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
                            >
                                Ja, avboka
                            </Button>
                        </>
                    )}
                </DialogActions>
            </Dialog>
        </div>
    )
}