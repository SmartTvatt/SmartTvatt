// Importerar Material-UI komponenter för tabellen.
import { Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";

// Dummy-data för dagar och tider.
// Detta är bara temporärt tills backend kopplas in.
// Vi använder dessa för att rendera en enkel kalender.
const days = ["Mån", "Tis", "Ons", "Tors", "Fre"];
const times = ["08:00", "10:00", "12:00", "14:00", "16:00"];

// Själva komponenten som visar tabellen.
// Den exporteras så BookingView kan importera den.
// onSlotClick är en callback som triggas när användaren klickar på en cell.
export default function TimeSlotTable({ onSlotClick }) {
  return (
    // Table är huvudkomponenten som håller hela kalendern.
    <Table>

      {/* TableHead innehåller kolumnrubrikerna (dagarna). */}
      <TableHead>
        <TableRow>
          {/* Första cellen är tom eftersom tiderna står i vänster kolumn. */}
          <TableCell></TableCell>

          {/* Renderar varje dag som en kolumnrubrik. */}
          {days.map((day) => (
            <TableCell key={day} align="center">
              {day}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>

      {/* TableBody innehåller själva kalendern med tider och celler. */}
      <TableBody>
        {times.map((time) => (
          // Varje tid är en rad i tabellen.
          <TableRow key={time}>
            {/* Första cellen i raden visar tiden. */}
            <TableCell>{time}</TableCell>

            {/* För varje dag skapar vi en cell. */}
            {days.map((day) => (
              <TableCell
                key={day + time}

                // Tillfällig styling: alla celler är "lediga" (grön).
                sx={{
                  backgroundColor: "lightgreen",
                  cursor: "pointer",
                  "&:hover": { backgroundColor: "#9fdf9f" }
                }}

                // Klick-event som skickar tillbaka dag + tid till BookingView.
                // BookingView öppnar sedan dialogen med rätt information.
                onClick={() => onSlotClick({ day, time })}
              >
                Ledig
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
