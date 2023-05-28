const { connect } = require('getstream');
const bcrypt = require('bcrypt');
const StreamChat = require('stream-chat').StreamChat;
const crypto = require('crypto');

// Laden der Umgebungsvariablen aus der .env-Datei
require('dotenv').config();

// Lesen der Umgebungsvariablen
const api_key = process.env.STREAM_API_KEY;
const api_secret = process.env.STREAM_API_SECRET;
const app_id = process.env.STREAM_APP_ID;

// Funktion zum Registrieren eines Benutzers
const signup = async (req, res) => {
    try {
        // Extrahieren der Daten aus der Anfrage
        const { fullName, username, password, phoneNumber } = req.body;

        // Generieren einer zufälligen Benutzer-ID
        const userId = crypto.randomBytes(16).toString('hex');

        // Verbindung zum Stream-Server herstellen
        const serverClient = connect(api_key, api_secret, app_id);

        // Passwort hashen
        const hashedPassword = await bcrypt.hash(password, 10);

        // Erstellen eines Tokens für den Benutzer
        const token = serverClient.createUserToken(userId);

        // Erfolgreiche Antwort mit Token und Benutzerdaten senden
        res.status(200).json({ token, fullName, username, userId, hashedPassword, phoneNumber });
    } catch (error) {
        // Fehler behandeln und eine fehlerhafte Antwort senden
        console.log(error);
        res.status(500).json({ message: error });
    }
};

// Funktion zum Einloggen eines Benutzers
const login = async (req, res) => {
    try {
        // Extrahieren der Daten aus der Anfrage
        const { username, password } = req.body;
        
        // Verbindung zum Stream-Server herstellen
        const serverClient = connect(api_key, api_secret, app_id);

        // Stream-Chat-Client-Instanz erstellen
        const client = StreamChat.getInstance(api_key, api_secret);

        // Abfrage des Benutzers mit dem angegebenen Benutzernamen
        const { users } = await client.queryUsers({ name: username });

        // Überprüfen, ob der Benutzer existiert
        if (!users.length) return res.status(400).json({ message: 'User not found' });

        // Vergleichen des eingegebenen Passworts mit dem gespeicherten gehashten Passwort
        const success = await bcrypt.compare(password, users[0].hashedPassword);

        // Erstellen eines Tokens für den Benutzer
        const token = serverClient.createUserToken(users[0].id);

        if (success) {
            // Erfolgreiche Antwort mit Token und Benutzerdaten senden
            res.status(200).json({ token, fullName: users[0].fullName, username, userId: users[0].id });
        } else {
            // Bei falschem Passwort eine fehlerhafte Antwort senden
            res.status(500).json({ message: 'Incorrect password' });
        }
    } catch (error) {
        // Fehler behandeln und eine fehlerhafte Antwort senden
        console.log(error);
        res.status(500).json({ message: error });
    }
};

// Exportieren der Funktionen signup und login
module.exports = { signup, login };
