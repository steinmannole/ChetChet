const express = require('express');
const cors = require('cors');

const authRoutes = require("./routes/auth.js"); // Importieren der Authentifizierungsrouten

const app = express();
const PORT = process.env.PORT || 5000;

require('dotenv').config(); // Laden der Umgebungsvariablen aus der .env-Datei

app.use(cors()); // Verwendung des CORS-Middleware für Cross-Origin-Anfragen
app.use(express.json()); // Middleware zum Verarbeiten von JSON-Anfragen aus dem Frontend zum Backend
app.use(express.urlencoded()); // Middleware zum Verarbeiten von URL-codierten Anfragen

app.get('/', (req, res) => {
    res.send('Hello, World!'); // Eine einfache Route, die "Hello, World!" als Antwort sendet
});

app.use('/auth', authRoutes); // Verwendung der Authentifizierungsrouten unter dem Pfad "/auth"

app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); // Starten des Servers und Zuhören auf dem angegebenen Port
