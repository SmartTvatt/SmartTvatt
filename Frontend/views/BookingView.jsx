// Importerar UI‑komponenter från Material‑UI.
import { Box, Typography } from "@mui/material";

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

      {/* Placeholder för komponenten som ska visa användarens bokning.
          Vi lägger bara en text här tills vi implementerar komponenten i nästa issue. */}
      <div>BookingInfoCard kommer här</div>

      {/* Placeholder för tabellen med tider.
          Den kommer från TimeSlotTable.jsx i nästa issue. */}
      <div>TimeSlotTable kommer här</div>

      {/* Placeholder för knapparna (boka/avboka).
          Den kommer från BookingActionButtons.jsx. */}
      <div>BookingActionButtons kommer här</div>
    </Box>
  );
}
