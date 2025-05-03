// Pour manipuler les fichiers notamment la partie lecture de users.json
const fs = require("fs");
//Pour gerer les chemins de fichiers
const path = require("path");

const usersFilePath = path.join(__dirname, 'data', "users.json");

// Fonction pour gérer l'inscription d'un utilisateur
const RegisterUser = (req, res) => {
    // Vérifier si le body existe
    if(!req.body) {
        res.status(400).json({"message": "Erreur : Aucune données"});
        return;
    }
    
    // Récupérer les données envoyées
    const { username, password } = req.body;
    
    // Vérifier que les champs obligatoires sont présents
    if(!username || !password) {
        res.status(400).json({"message": "Erreur : Données manquantes"});
        return;
    }

    // Lire le fichier users.json
    let users = [];
    try {
        const data = fs.readFileSync(usersFilePath, "utf-8");
        users = JSON.parse(data);
    } catch(error) {
        // Si le fichier n'existe pas ou est vide, on continue avec un tableau vide
        users = [];
    }

    // Envoyer la réponse avec les utilisateurs lus
    res.json({ message: "Utilisateurs lus", users});
};

module.exports = {
    RegisterUser
};