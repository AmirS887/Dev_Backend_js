const express = require("express");
const app = express();
const users = require("./users");

// Middleware nécessaire pour traiter les données JSON dans les requêtes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.json(
    {
    message : "Bienvenue sur l'API TCG",
    data : {}
    }
    );
   });

app.post("/register", users.RegisterUser);
   
app.listen(3000, () => {
    console.log("Serveur démarré sur http://localhost:3000");
   });
   