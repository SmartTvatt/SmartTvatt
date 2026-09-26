// Importerar Material-UI komponenter för dialogen.
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from "@mui/material";

export default function BookingDialog({ open, onClose, selectedSlot }) {
  return (
    // Dialog visas endast när "open" är true.
    <Dialog open={open} onClose={onClose}>
      
      {/* Titel för popupen. */}
      <DialogTitle>
        Bekräfta bokning
      </DialogTitle>

      {/* Innehåll i popupen. */}
      <DialogContent>
        {/* Visar vilken tid användaren håller på att boka. */}
        <Typography variant="body1">
          Vill du boka tiden: {selectedSlot ? `${selectedSlot.day} kl ${selectedSlot.time}` : "Ingen tid vald"}
        </Typography>
      </DialogContent>

      {/* Knappar längst ner i popupen. */}
      <DialogActions>
        {/* Avbryt-knappen stänger dialogen. */}
        <Button onClick={onClose}>
          Avbryt
        </Button>

        {/* Boka-knappen kommer senare kopplas till backend. */}
        <Button variant="contained" color="primary">
          Boka
        </Button>
      </DialogActions>
    </Dialog>
  );
}
