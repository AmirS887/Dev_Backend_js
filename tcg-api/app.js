const express = require("express");
const app = express();
const users = require("./users");
const cards = require("./cards");
const path = require("path");
const { connectDB } = require("./config/database");

// Middleware nécessaire pour traiter les données JSON dans les requêtes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ajouter CORS pour permettre les requêtes depuis le frontend
app.use((req, res, next) => {   
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    next();
});

// Servir les fichiers statiques du frontend
app.use(express.static(path.join(__dirname, 'front')));

// Routes API
app.post("/register", users.RegisterUser);
app.post("/login", users.LoginUser);
app.get("/user", users.GetUser);
app.post("/disconnect", users.DisconnectUser);
app.post("/booster", cards.GetBooster);
app.get("/cards", cards.GetAllCards);
app.post("/convert", cards.ConvertCard);

// Fonction de démarrage du serveur
async function startServer() {
    try {
        // Connexion à MongoDB
        await connectDB();
        
        // Démarrage du serveur Express
        app.listen(3000, () => {
            console.log("🚀 Serveur démarré sur http://localhost:3000");
            console.log("📊 Base de données MongoDB connectée");
        });
    } catch (error) {
        console.error("❌ Erreur au démarrage:", error);
        process.exit(1);
    }
}

// Gestion propre de l'arrêt du serveur
process.on('SIGINT', async () => {
    console.log('\n🔄 Arrêt du serveur en cours...');
    const { closeDB } = require("./config/database");
    await closeDB();
    process.exit(0);
});

// Démarrage de l'application
startServer();
   