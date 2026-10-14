import User from '../models/User.js';
import Message from '../models/Message.js';
import mongoose from 'mongoose';

// GET /api/admin/users – Hämta lista på alla registrerade användare
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (error) {
    console.error('Fel vid hämtning av användare:', error.message);
    res.status(500).json({ message: 'Ett fel uppstod när användare skulle hämtas.' });
  }
};

// PATCH /api/admin/users/:id/role – Ändra en användares roll
export const updateUserRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  const allowedRoles = ['boende', 'admin'];
  if (!role || !allowedRoles.includes(role)) {
    return res.status(400).json({
      message: `Ogiltig roll. Tillåtna roller är: ${allowedRoles.join(', ')}`,
    });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'Användaren hittades inte.' });
    }

    res.status(200).json({
      message: 'Användarroll uppdaterades framgångsrikt.',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Fel vid uppdatering av användarroll:', error.message);
    res.status(500).json({ message: 'Ett fel uppstod när användarrollen skulle uppdateras.' });
  }
};

// POST /api/admin/messages – Skicka ett meddelande till en eller alla boende
export const sendMessage = async (req, res) => {
  // Normalisera texten innan längdkrav och lagring kontrolleras.
  const subject = typeof req.body.subject === 'string' ? req.body.subject.trim() : '';
  const body = typeof req.body.body === 'string' ? req.body.body.trim() : '';
  const { recipientId } = req.body;

  if (!subject || subject.length > 120 || !body || body.length > 2000) {
    return res.status(400).json({
      message: 'Ange en rubrik (max 120 tecken) och ett meddelande (max 2000 tecken).',
    });
  }

  try {
    let recipients;
    if (recipientId === 'all') {
      // Massutskick omfattar boende, aldrig andra administratörer.
      recipients = await User.find({ role: 'boende' }).select('_id');
    } else {
      // Avvisa felaktiga id:n innan de används i en databasfråga.
      if (!mongoose.Types.ObjectId.isValid(recipientId)) {
        return res.status(400).json({ message: 'Välj en giltig mottagare.' });
      }

      const recipient = await User.findOne({ _id: recipientId, role: 'boende' }).select('_id');
      if (!recipient) {
        return res.status(404).json({ message: 'Boenden hittades inte.' });
      }
      recipients = [recipient];
    }

    if (recipients.length === 0) {
      return res.status(400).json({ message: 'Det finns inga boende att skicka meddelandet till.' });
    }

    // Skapa ett separat inkorgsmeddelande för varje vald mottagare.
    await Message.insertMany(recipients.map((recipient) => ({
      recipient: recipient._id,
      sender: req.user._id,
      subject,
      body,
    })));

    res.status(201).json({
      message: `Meddelandet skickades till ${recipients.length} boende.`,
      recipientCount: recipients.length,
    });
  } catch (error) {
    console.error('Fel vid utskick av meddelande:', error.message);
    res.status(500).json({ message: 'Ett fel uppstod när meddelandet skulle skickas.' });
  }
};