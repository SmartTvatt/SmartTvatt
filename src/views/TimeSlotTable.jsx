// Importerar Material-UI komponenter för tabellen.
import { Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { bookingWeekdays, getBookingIntervals } from "../../controllers/timeslotController";

// Dummy-data för dagar och tider.
// Detta är bara temporärt tills backend kopplas in.
// Vi använder dessa för att rendera en enkel kalender.
const days = bookingWeekdays;

// Dummy-data för bokade tider (av andra användare).
// I backend kommer detta från databasen.
const bookedSlots = [
  { day: "Ons", time: "12:00" },
  { day: "Fre", time: "10:00" }
];

// Dummy-data för användarens egen bokning.
// I backend kommer detta från BookingInfoCard / API.
const userBooking = { day: "Tis", time: "14:00" };

// Funktion som avgör färgen på en cell baserat på status.
function getCellColor(day, time) {
  // Om cellen är användarens bokning → gul.
  if (userBooking.day === day && userBooking.time === time) {
    return "#ffeb3b"; // gul
  }

  // Om cellen finns i listan över bokade tider → röd.
  const isBooked = bookedSlots.some(
    (slot) => slot.day === day && slot.time === time
  );
  if (isBooked) {
    return "#ff6666"; // ljusröd
  }

  // Annars är cellen ledig → grön.
  return "lightgreen";
}

// Själva komponenten som visar tabellen.
// Den exporteras så BookingView kan importera den.
// onSlotClick är en callback som triggas när användaren klickar på en cell.
export default function TimeSlotTable({ onSlotClick }) {
  const intervalsByDay = days.map((day) => ({
    ...day,
    intervals: getBookingIntervals(day.key),
  }));
  const intervals = [...new Map(
    intervalsByDay.flatMap(({ intervals: dayIntervals }) =>
      dayIntervals.map((interval) => [`${interval.start}-${interval.end}`, interval])
    )
  ).values()].sort((left, right) => left.start.localeCompare(right.start));

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
            <TableCell key={day.key} align="center">
              {day.short}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>

      {/* TableBody innehåller själva kalendern med tider och celler. */}
      <TableBody>
        {intervals.map((interval) => {
              const time = `${interval.start}–${interval.end}`;

          return (
          // Varje tid är en rad i tabellen.
          <TableRow key={time}>
            {/* Första cellen i raden visar tiden. */}
            <TableCell>{time}</TableCell>

            {/* För varje dag skapar vi en cell. */}
            {intervalsByDay.map((day) => {
              const isAvailable = day.intervals.some(
                (dayInterval) => dayInterval.start === interval.start && dayInterval.end === interval.end
              );

              return (
              <TableCell
                key={day.key + time}

                // NYTT: Färgkodning baserat på status (ledig, bokad, din bokning).
                sx={{
                  backgroundColor: isAvailable ? getCellColor(day.short, time) : "#f1f4f2",
                  cursor: isAvailable ? "pointer" : "default",
                  "&:hover": { opacity: 0.8 }
                }}

                // Klick-event som skickar tillbaka dag + tid till BookingView.
                // BookingView öppnar sedan dialogen med rätt information.
                onClick={() => isAvailable && onSlotClick({ day: day.short, time })}
              >
                {/* Texten ändras beroende på status */}
                {!isAvailable
                  ? "Ej tillgänglig"
                  : userBooking.day === day.short && userBooking.time === time
                  ? "Din bokning"
                  : bookedSlots.some(
                      (slot) => slot.day === day.short && slot.time === time
                    )
                  ? "Upptagen"
                  : "Ledig"}
              </TableCell>
              );
            })}
          </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
