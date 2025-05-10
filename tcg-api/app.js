const express = require("express");
const app = express();
const users = require("./users");
const cards = require("./cards");

// Middleware nécessaire pour traiter les données JSON dans les requêtes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.get("/register.html", (req, res) => {
    res.sendFile(__dirname + "/register.html");
});

app.post("/register", users.RegisterUser);

app.post("/login", users.LoginUser);

app.get("/user", users.GetUser);

app.post("/disconnect", users.DisconnectUser);

app.post("/booster", cards.GetBooster);
   
app.listen(3000, () => {
    console.log("Serveur démarré sur http://localhost:3000");
   });
   