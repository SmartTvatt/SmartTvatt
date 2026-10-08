const Booking = require('../models/Booking');                                                                        // hämtar mooking modelen från booking.js

exports.getMyBooking = async (req, res) =>                                                                               //getmybooking: våran funktion, oc med async betyder att ffunktionen är asyncrron o väntar på nåt ska hända innnan forstättter ,req och res.
{
    try
    {
        const booking = await Booking.findOne                                                                        //await: vänta,databasen ska hitta en bokning.
        ({                                                                                                              //booking.finon : själva sökningen. hitta en bookning där användrae är inlogad o aktiv.
            user: req.user.id, //<-- jag kan ändra namnet på det baserat på andra kommer o skrivaa , ?????
            status:'aktiv',
        });
        
        res.json(booking); //skicka bookingen tillbaka till frontend
    }

    catch (error)
    {
        res.status(500).json({message: error.message}); // om kraschar sysyetmet skickar error 
    }   

};