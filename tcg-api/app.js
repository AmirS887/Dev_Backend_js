const express = require("express");
const app = express();

app.listen(3008, () => {
 console.log("Serveur démarré sur http://localhost:3008");
});


app.get("/", (req, res) => {
    res.json(
    {
    message : "Bienvenue sur l'API TCG",
    data : {}
    }
    );
   });

   app.use(express.urlencoded({ extended: true }));
   