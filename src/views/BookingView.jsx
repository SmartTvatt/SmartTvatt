import { Alert, Box, Typography } from "@mui/material";
import { useState } from "react";

import "./Booking.css";

// Importera komponenterna
import BookingInfoCard from "./BookingInfoCard.jsx";
import TimeSlotTable from "./TimeSlotTable.jsx";
import BookingDialog from "./BookingDialog.jsx";

// Själva vyn för bokningssidan.
// Bokningsdata tas emot utifrån så att vyn kan visa både aktiv bokning och tomt läge.
export default function BookingView({ booking = null, bookedSlots = [] }) {

  // State som styr om dialogen är öppen eller stängd.
  const [dialogOpen, setDialogOpen] = useState(false);

  // State som håller den tid/dag användaren klickade på.
  const [selectedSlot, setSelectedSlot] = useState(null);

  // API:t är inte inkopplat ännu, så sidan får inte påstå att tiden har sparats.
  const [bookingNotice, setBookingNotice] = useState("");

  // Funktion som körs när man klickar på en cell i tabellen.
  // Den tar emot ett objekt med { day, time }.
  const handleSlotClick = (slot) => {
    setSelectedSlot(slot);   // Spara vald tid
    setDialogOpen(true);     // Öppna dialogen
  };

  // Funktion som stänger dialogen.
  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedSlot(null);   // Rensa vald tid
  };

  // Tar emot den valda tiden från dialogen utan att felaktigt skapa en bokning.
  const handleConfirmBooking = (slot) => {
    if (!slot) return;

    setBookingNotice(
      `Tiden ${slot.day} kl ${slot.time} är inte sparad än. Bokningsfunktionen kopplas till API:t senare.`
    );
    handleCloseDialog();
  };

  return (
    <Box component="main" className="booking-page">
      <header className="booking-page__header">
        <p className="booking-page__eyebrow">BOKNING</p>
        <Typography component="h1" variant="h4" className="booking-page__title">
          Boka tid
        </Typography>
        <Typography className="booking-page__intro">
          Välj en ledig tid i schemat för att komma igång.
        </Typography>
      </header>

      {/* Berättar tydligt att bekräftelsen ännu inte sparar en bokning. */}
      {bookingNotice && (
        <Alert
          severity="info"
          role="status"
          onClose={() => setBookingNotice("")}
          sx={{ mb: 3 }}
        >
          {bookingNotice}
        </Alert>
      )}

      {/* Kortet visar bokningsuppgifter eller tomt läge utifrån samma bokningsdata. */}
      <BookingInfoCard booking={booking} />

      {/* Kalendern får en callback som triggas vid klick */}
      <TimeSlotTable
        onSlotClick={handleSlotClick}
        bookedSlots={bookedSlots}
        userBooking={booking}
      />

      {/* Dialogen öppnas när dialogOpen = true */}
      <BookingDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        onConfirm={handleConfirmBooking}
        selectedSlot={selectedSlot}
      />
    </Box>
  );
}
