import { Box, Typography } from "@mui/material";
import { useState } from "react";

// Importera komponenterna
import BookingInfoCard from "../components/BookingInfoCard";
import TimeSlotTable from "../components/TimeSlotTable";
import BookingDialog from "../components/BookingDialog";

export default function BookingView() {

  // State som styr om dialogen är öppen eller stängd.
  const [dialogOpen, setDialogOpen] = useState(false);

  // State som håller den tid/dag användaren klickade på.
  const [selectedSlot, setSelectedSlot] = useState(null);

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

  return (
    <Box sx={{ padding: "2rem" }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Boka tid
      </Typography>

      {/* Visar användarens bokning */}
      <BookingInfoCard />

      {/* Kalendern får en callback som triggas vid klick */}
      <TimeSlotTable onSlotClick={handleSlotClick} />

      {/* Dialogen öppnas när dialogOpen = true */}
      <BookingDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        selectedSlot={selectedSlot}
      />
    </Box>
  );
}
