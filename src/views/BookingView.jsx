import { Alert, Box, Button, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";

import "./Booking.css";

import BookingInfoCard from "./BookingInfoCard.jsx";
import TimeSlotTable from "./TimeSlotTable.jsx";
import BookingDialog from "./BookingDialog.jsx";
import { addDays, formatDateOnly, formatLongDate, getMonday } from "./bookingDateUtils.js";

const BOOKING_LOCATION = "Gjutargatan 26";

async function readResponse(response) {
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    throw new Error(
      `Bokningsservern svarade inte med API-data (HTTP ${response.status}). Starta om backend med npm run dev:server och ladda om sidan.`
    );
  }

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Begäran kunde inte genomföras.");
  }
  return data;
}

export default function BookingView() {
  const { token } = useContext(AuthContext);
  const [booking, setBooking] = useState(null);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [weekStart, setWeekStart] = useState(() => getMonday(new Date()));
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [bookingNotice, setBookingNotice] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const weekStartDate = formatDateOnly(weekStart);

  // Laddar egen bokning och veckans upptagna tider parallellt.
  useEffect(() => {
    if (!token) return undefined;

    const controller = new AbortController();
    const loadBookings = async () => {
      setLoading(true);
      setErrorMessage("");
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const [myBookingResponse, slotsResponse] = await Promise.all([
          fetch("/api/bookings/mine", { headers, signal: controller.signal }),
          fetch(`/api/bookings?weekStart=${weekStartDate}`, { headers, signal: controller.signal }),
        ]);
        const [myBooking, slots] = await Promise.all([
          readResponse(myBookingResponse),
          readResponse(slotsResponse),
        ]);
        setBooking(myBooking);
        setBookedSlots(slots);
      } catch (error) {
        if (error.name !== "AbortError") {
          setErrorMessage(error.message || "Kunde inte hämta bokningsuppgifter.");
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    loadBookings();
    return () => controller.abort();
  }, [token, weekStartDate]);

  const handleSlotClick = (slot) => {
    setErrorMessage("");
    setSelectedSlot(slot);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedSlot(null);
  };

  const handleConfirmBooking = async (slot) => {
    if (!slot) return;

    setSubmitting(true);
    setErrorMessage("");
    try {
      // Skickar det valda datumet och intervallet till API:t för lagring.
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          date: slot.date,
          time: slot.time,
          location: BOOKING_LOCATION,
        }),
      });
      const createdBooking = await readResponse(response);
      setBooking(createdBooking);
      setBookedSlots((currentSlots) => [...currentSlots, createdBooking]);
      setBookingNotice(`Bokningen ${formatLongDate(slot.date)} kl ${slot.time} är sparad.`);
      handleCloseDialog();
    } catch (error) {
      setErrorMessage(error.message || "Kunde inte spara bokningen.");
    } finally {
      setSubmitting(false);
    }
  };

  const currentWeekStart = getMonday(new Date());
  const isCurrentWeek = weekStartDate === formatDateOnly(currentWeekStart);

  return (
    <Box component="main" className="booking-page">
      <header className="booking-page__header">
        <p className="booking-page__eyebrow">BOKNING</p>
        <Typography component="h1" variant="h4" className="booking-page__title">
          Boka tid
        </Typography>
        <Typography className="booking-page__intro">
          Välj en vecka och sedan en ledig tid för ett exakt datum.
        </Typography>
      </header>

      {errorMessage && (
        <Alert severity="error" role="alert" onClose={() => setErrorMessage("")}>
          {errorMessage}
        </Alert>
      )}
      {bookingNotice && (
        <Alert
          severity="success"
          role="status"
          onClose={() => setBookingNotice("")}
        >
          {bookingNotice}
        </Alert>
      )}

      <BookingInfoCard booking={booking} />

      <Box className="booking-week-navigation" aria-label="Välj vecka">
        <Button
          type="button"
          onClick={() => setWeekStart((current) => addDays(current, -7))}
          disabled={isCurrentWeek}
          aria-label="Visa föregående vecka"
        >
          Föregående vecka
        </Button>
        <Typography component="p" aria-live="polite">
          {formatLongDate(weekStartDate)} – {formatLongDate(formatDateOnly(addDays(weekStart, 6)))}
        </Typography>
        <Button
          type="button"
          onClick={() => setWeekStart((current) => addDays(current, 7))}
          aria-label="Visa nästa vecka"
        >
          Nästa vecka
        </Button>
      </Box>

      <TimeSlotTable
        onSlotClick={handleSlotClick}
        bookedSlots={bookedSlots}
        userBooking={booking}
        weekStart={weekStart}
        disabled={loading || Boolean(errorMessage)}
      />

      <BookingDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        onConfirm={handleConfirmBooking}
        selectedSlot={selectedSlot}
        submitting={submitting}
      />
    </Box>
  );
}
