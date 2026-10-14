import User from '../models/User.js';

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

  const allowedRoles = ['user', 'admin'];
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