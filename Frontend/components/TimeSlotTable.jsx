// Importerar Material-UI komponenter för tabellen.
import { Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";

// Dummy-data för dagar och tider.
// Detta är bara temporärt tills backend kopplas in.
// Vi använder dessa för att rendera en enkel kalender.
const days = ["Mån", "Tis", "Ons", "Tors", "Fre"];
const times = ["08–12", "12–16", "16–20"];

// Själva komponenten som visar tabellen.
// Den exporteras så BookingView kan importera den.
export default function TimeSlotTable() {
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
                // Detta ändras i Issue 18 (färgkodning).
                sx={{
                  backgroundColor: "lightgreen",
                  cursor: "pointer",
                  "&:hover": { backgroundColor: "#9fdf9f" }
                }}
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
