// Importerar UI‑komponenter från Material‑UI.
import { Box, Typography } from "@mui/material";

import BookingInfoCard from "../components/BookingInfoCard";
import TimeSlotTable from "../components/TimeSlotTable";
import BookingActionButtons from "../components/BookingActionButtons";
import BookingDialog from "../components/BookingDialog";

// Själva vyn för bokningssidan.
export default function BookingView() {
  return (
    // Box fungerar som en wrapper runt hela sidan.
    // sx={{ padding: "2rem" }} ger luft runt innehållet.
    <Box sx={{ padding: "2rem" }}>
      
      {/* Titel för sidan. 
          variant="h4" ger stor rubrik.
          mb={3} ger margin-bottom så att det inte ligger för nära nästa element. */}
      <Typography variant="h4" sx={{ mb: 3 }}>
        Boka tid
      </Typography>

      {/* Placeholder för komponenten som ska visa användarens bokning. */}
      <BookingInfoCard />

      {/* Placeholder för tabellen med tider.
          Den kommer från TimeSlotTable.jsx. */}
      <TimeSlotTable />

      {/* Placeholder för knapparna (boka/avboka).
          Den kommer från BookingActionButtons.jsx. */}
      <BookingActionButtons />

      <BookingDialog />
    </Box>
  );
}
