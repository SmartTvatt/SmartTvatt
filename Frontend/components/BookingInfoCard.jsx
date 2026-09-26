// Importerar Material-UI komponenter.
import { Card, CardContent, Typography } from "@mui/material";

// Dummy-data för användarens bokning.
// Detta kommer senare från backend via controller → model → API.
// Just nu är det bara en placeholder.
const dummyBooking = {
  day: "Onsdag",
  time: "14:00"
};

// Själva komponenten som visar bokningsinformationen.
// Den exporteras så BookingView kan importera den.
export default function BookingInfoCard() {
  return (
    // Card ger en snygg vit ruta med skugga.
    <Card sx={{ mb: 3, padding: "0.5rem" }}>
      {/* CardContent håller texten och ger spacing. */}
      <CardContent>

        {/* Titel för sektionen. */}
        <Typography variant="h6" sx={{ mb: 1 }}>
          Din bokning
        </Typography>

        {/* Visar själva bokningsinformationen. */}
        <Typography variant="body1">
          Du har bokat: {dummyBooking.day} kl {dummyBooking.time}
        </Typography>

      </CardContent>
    </Card>
  );
}
