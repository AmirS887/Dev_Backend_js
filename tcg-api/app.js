const express = require("express");
const app = express();
// const users = require("./users");


app.get("/", (req, res) => {
    res.json(
    {
    message : "Bienvenue sur l'API TCG",
    data : {}
    }
    );
   });

   app.use(express.urlencoded({ extended: true }));

//    app.post("/register", users.RegisterUser);
   

   app.listen(3000, () => {
    console.log("Serveur démarré sur http://localhost:3000");
   });
   