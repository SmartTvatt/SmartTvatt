import FaultReport from '../models/FaultReport.js';

export const createFaultReport = async (req, res) => {
  const equipment = typeof req.body.equipment === 'string' ? req.body.equipment.trim() : '';
  const description = typeof req.body.description === 'string' ? req.body.description.trim() : '';

  if (!equipment || equipment.length > 100 || !description || description.length > 1000) {
    return res.status(400).json({
      message: 'Ange utrustning och en beskrivning (max 1000 tecken).',
    });
  }

  try {
    const report = await FaultReport.create({
      resident: req.user._id,
      equipment,
      description,
    });

    res.status(201).json(report);
  } catch (error) {
    console.error('Fel vid skapande av felanmälan:', error.message);
    res.status(500).json({ message: 'Felanmälan kunde inte skickas.' });
  }
};

export const getFaultReports = async (_req, res) => {
  try {
    const reports = await FaultReport.find()
      .sort({ createdAt: -1 })
      .populate('resident', 'name apartmentNumber');

    res.status(200).json(reports);
  } catch (error) {
    console.error('Fel vid hämtning av felanmälningar:', error.message);
    res.status(500).json({ message: 'Felanmälningar kunde inte hämtas.' });
  }
};
