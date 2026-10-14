import Message from '../models/Message.js';

// Returnera bara den inloggades meddelanden och visa de nyaste först.
export const getMyMessages = async (req, res) => {
  try {
    const messages = await Message.find({ recipient: req.user._id })
      .sort({ createdAt: -1 })
      .populate('sender', 'name');

    res.status(200).json(messages);
  } catch (error) {
    console.error('Fel vid hämtning av meddelanden:', error.message);
    res.status(500).json({ message: 'Ett fel uppstod när meddelanden skulle hämtas.' });
  }
};