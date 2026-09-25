
import './Dashboard.css'


export default function Dashboard() {
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
                                <span className="booking-day">FREDAG</span>
                                <strong>18</strong>
                                <span>SEP</span>
                            </div>
                            <div className="booking-details">
                                <h3>16:00 <span>–</span> 20:00</h3>
                                <p>Tvättstuga 1 <span className="detail-divider">·</span> Gjutargatan 26</p>
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
                            <button className="action-button action-primary">
                                <span className="action-icon">＋</span>
                                <span><strong>Boka tid</strong><small>Hitta en ledig tid</small></span>
                                <span className="action-chevron">›</span>
                            </button>
                            <button className="action-button action-danger">
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
        </div>
    )
}