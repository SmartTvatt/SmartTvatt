// Importerar Material-UI komponenter för dialogen.
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from "@mui/material";
import { formatLongDate } from "./bookingDateUtils.js";

export default function BookingDialog({ open, onClose, onConfirm, selectedSlot, submitting = false }) {
  // Bekräfta först när en tid är vald och inget sparanrop pågår.
  const canConfirm = selectedSlot !== null && !submitting;

  return (
    // Dialog visas endast när "open" är true.
    <Dialog
      className="booking-dialog"
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
    >
      
      {/* Titel för popupen. */}
      <DialogTitle>
        Bekräfta bokning
      </DialogTitle>

      {/* Innehåll i popupen. */}
      <DialogContent>
        {/* Visar vilken tid användaren håller på att boka. */}
        <Typography variant="body1">
          Vill du boka tiden: {selectedSlot
            ? `${formatLongDate(selectedSlot.date)} kl ${selectedSlot.time}`
            : "Ingen tid vald"}
        </Typography>
      </DialogContent>

      {/* Knappar längst ner i popupen. */}
      <DialogActions>
        {/* Avbryt-knappen stänger dialogen. */}
        <Button onClick={onClose}>
          Avbryt
        </Button>

        {/* Föräldravyn skickar valet vidare till boknings-API:t. */}
        <Button
          className="booking-dialog__confirm"
          variant="contained"
          color="primary"
          disabled={!canConfirm}
          onClick={() => onConfirm(selectedSlot)}
        >
          {submitting ? "Sparar..." : "Boka"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
