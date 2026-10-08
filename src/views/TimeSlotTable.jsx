// Importerar Material-UI komponenter för tabellen.
import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { bookingWeekdays, getBookingIntervals } from "../../controllers/timeslotController";

// Dummy-data för dagar och tider.
// Detta är bara temporärt tills backend kopplas in.
// Vi använder dessa för att rendera en enkel kalender.
const days = bookingWeekdays;

// Statusen avgör både cellens färg och om användaren får välja tiden.
function getSlotStatus(day, time, isAvailable, bookedSlots, userBooking) {
  // Om cellen är användarens bokning → gul.
  // Den egna bokningen ska visas särskilt och får inte bokas en gång till.
  if (userBooking?.day === day && userBooking.time === time) {
    return "own";
  }

  // En tid som saknas bland dagens intervall är inte bokningsbar.
  if (!isAvailable) {
    return "unavailable";
  }

  // Om cellen finns i listan över bokade tider → röd.
  // Upptagna tider går inte att välja även om intervallet finns i schemat.
  const isBooked = bookedSlots.some(
    (slot) => slot.day === day && slot.time === time
  );
  if (isBooked) {
    return "booked";
  }

  // Annars är cellen ledig → grön.
  // Bara lediga tider kan väljas.
  return "available";
}

// Håller färgvalen samlade så att status och utseende inte glider isär.
function getCellColor(status) {
  const colors = {
    own: "#ffeb3b",
    booked: "#ff6666",
    unavailable: "#f1f4f2",
    available: "lightgreen",
  };

  return colors[status];
}

// Texten ger en förklaring som inte är beroende av att användaren kan se färgen.
function getStatusLabel(status) {
  const labels = {
    own: "Din bokning",
    booked: "Upptagen",
    unavailable: "Ej tillgänglig",
    available: "Ledig",
  };

  return labels[status];
}

// Själva komponenten som visar tabellen.
// Den exporteras så BookingView kan importera den.
// onSlotClick är en callback som triggas när användaren klickar på en cell.
// Bokningsstatus skickas in som props; API-kopplingen kan mata in datan senare.
export default function TimeSlotTable({
  onSlotClick,
  bookedSlots = [],
  userBooking = null,
}) {
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
    <Box>
      {/* TableContainer låter tabellen scrolla i sidled på smala skärmar. */}
      <TableContainer sx={{ overflowX: "auto" }}>
        {/* Table är huvudkomponenten som håller hela kalendern. */}
        <Table aria-label="Bokningsbara tvättider" sx={{ minWidth: 600 }}>

          {/* TableHead innehåller kolumnrubrikerna (dagarna). */}
          <TableHead>
            <TableRow>
              {/* Första cellen är tom eftersom tiderna står i vänster kolumn. */}
              <TableCell aria-label="Tid"></TableCell>

              {/* Renderar varje dag som en kolumnrubrik. */}
              {days.map((day) => (
                <TableCell key={day.key} align="center" scope="col">
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
                  <TableCell component="th" scope="row">{time}</TableCell>

                  {/* För varje dag skapar vi en cell. */}
                  {intervalsByDay.map((day) => {
                    const isAvailable = day.intervals.some(
                      (dayInterval) => dayInterval.start === interval.start && dayInterval.end === interval.end
                    );
                    const status = getSlotStatus(
                      day.short,
                      time,
                      isAvailable,
                      bookedSlots,
                      userBooking
                    );
                    const canSelect = status === "available";

                    return (
                      <TableCell
                        key={day.key + time}
                        align="center"
                        // Färgkodning baserat på status (ledig, bokad, din bokning).
                        sx={{ backgroundColor: getCellColor(status), p: 0.5 }}
                      >
                        {/* Nativa knappar går att använda med både mus och tangentbord. */}
                        {/* Texten ändras beroende på status. */}
                        {/* Klick-event skickar tillbaka dag + tid till BookingView. */}
                        {/* BookingView öppnar sedan dialogen med rätt information. */}
                        <Button
                          type="button"
                          disabled={!canSelect}
                          aria-label={`${day.label} ${time}: ${getStatusLabel(status)}`}
                          onClick={() => onSlotClick({ day: day.short, time })}
                          sx={{
                            width: "100%",
                            minWidth: 72,
                            minHeight: 44,
                            color: "text.primary",
                            "&:focus-visible": {
                              outline: "3px solid",
                              outlineColor: "primary.main",
                              outlineOffset: -3,
                            },
                            "&.Mui-disabled": {
                              color: "text.primary",
                              opacity: 0.7,
                            },
                          }}
                        >
                          {getStatusLabel(status)}
                        </Button>
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Färgförklaringen använder alltid text så att status inte bara syns genom färg. */}
      <Box
        component="ul"
        aria-label="Förklaring av tider"
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 1,
          listStyle: "none",
          p: 0,
          mt: 2,
        }}
      >
        {[
          ["available", "Ledig"],
          ["booked", "Upptagen"],
          ["own", "Din bokning"],
          ["unavailable", "Ej tillgänglig"],
        ].map(([status, label]) => (
          <Box
            component="li"
            key={status}
            sx={{ display: "flex", alignItems: "center", gap: 0.75 }}
          >
            <Box
              aria-hidden="true"
              sx={{
                width: 16,
                height: 16,
                borderRadius: "3px",
                backgroundColor: getCellColor(status),
                border: "1px solid",
                borderColor: "divider",
              }}
            />
            <Typography variant="body2">{label}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
