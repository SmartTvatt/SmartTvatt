// Importerar Material-UI komponenter.
import { Card, CardContent, Typography } from "@mui/material";

// Själva komponenten som visar bokningsinformationen.
// Den exporteras så BookingView kan importera den.
// `booking` kommer från den komponent som använder kortet.
// Standardvärdet gör att kortet visar ett tydligt tomt läge innan API-kopplingen finns.
export default function BookingInfoCard({ booking = null }) {
  // Samma kort kan visa både en aktiv bokning och information om att ingen finns.
  const hasActiveBooking = booking !== null;

  return (
    // Card ger en snygg vit ruta med skugga.
    <Card>
      {/* CardContent håller texten och ger spacing. */}
      <CardContent>

        {/* Titel för sektionen. */}
        <Typography component="h2" variant="h6" sx={{ mb: 1 }}>
          Din bokning
        </Typography>

        {hasActiveBooking ? (
          <>
            {/* Uppgifterna kommer från användande komponent, inte från hårdkodad exempeldata. */}
            {/* Visar själva bokningsinformationen. */}
            <Typography variant="body1">
              Du har bokat: {booking.day} kl {booking.time}
            </Typography>
          </>
        ) : (
          <>
            {/* `role="status"` låter även hjälpmedel uppmärksamma det tomma läget. */}
            {/* Visar att användaren saknar en aktiv bokning. */}
            <Typography variant="body1" role="status">
              Du har ingen aktiv bokning just nu.
            </Typography>
          </>
        )}
      </CardContent>
    </Card>
  );
}
