const express = require("express");
const app = express();
const users = require("./users");
const cards = require("./cards");

// Middleware nécessaire pour traiter les données JSON dans les requêtes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Lis les utilisateurs
app.post("/register", users.RegisterUser);
//Permet de connecter un utilisateur gener un tolen
app.post("/login", users.LoginUser);

app.get("/user", users.GetUser);
//Permet de ce deco et supprimer le token
app.post("/disconnect", users.DisconnectUser);
//Permet d'avoir les cartes 
app.post("/booster", cards.GetBooster);
   
app.listen(3000, () => {
    console.log("Serveur démarré sur http://localhost:3000");
   });
   