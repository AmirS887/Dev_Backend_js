

// Fonction pour gérer l'inscription d'un utilisateur
const RegisterUser = (req, res) => {
    if(!req.body)
    {
        res.status(400).json({"message": "Erreur : Aucune données"});
        return;
    }
       
    let username = req.body.username;
          
    res.json({"message": "OK"});
};

module.exports = {
    RegisterUser
};