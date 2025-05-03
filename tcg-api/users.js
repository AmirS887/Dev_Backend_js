// Pour manipuler les fichiers notamment la partie lecture de users.json
const fs = require("fs");
//Pour gerer les chemins de fichiers
const path = require("path");
// Pour générer des tokens d'authentification
const TokenGenerator = require('token-generator');

const usersFilePath = path.join(__dirname, 'data', "users.json");
// Configure le générateur de tokens (options par défaut)
const tokenGenerator = new TokenGenerator({
    salt: 'tcg-app-salt',
    timestampMap: 'abcdefghij', // 10 caractères
});

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

    // Lecture du fichier users.json
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

const LoginUser = (req, res) => {
    // Vérifier si le body existe
    if(!req.body) {
        res.status(400).json({"message": "Erreur : Aucune données"});
        return;
    }
    
    // Récupérer les identifiants
    const { username, password } = req.body;
    
    // Vérifier que les identifiants sont fournis
    if(!username || !password) {
        res.status(400).json({"message": "Erreur : Username et password requis"});
        return;
    }
    
    // Lire le fichier users.json
    let users = [];
    try {
        const data = fs.readFileSync(usersFilePath, "utf-8");
        users = JSON.parse(data);
    } catch(error) {
        // Si le fichier n'existe pas ou est vide, erreur d'authentification
        return res.status(401).json({"message": "Identifiants incorrects"});
    }
    
    // Rechercher l'utilisateur par son username et password
    const user = users.find(u => u.username === username && u.password === password);
    
    // Si l'utilisateur n'est pas trouvé
    if(!user) {
        return res.status(401).json({"message": "Identifiants incorrects"});
    }
    
    // Générer un token pour l'utilisateur authentifié
    const token = tokenGenerator.generate();
    
    // Mettre à jour l'utilisateur avec le token
    user.token = token;
    
    // Enregistrer la mise à jour dans le fichier
    try {
        fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 4));
    } catch(error) {
        console.error("Erreur lors de l'enregistrement du token:", error);
        return res.status(500).json({"message": "Erreur lors de l'authentification"});
    }
    
    // Répondre avec le token
    res.json({
        message: "Authentification réussie",
        data: {
            token: token
        }
    });
};

// Fonction pour récupérer les infos d'un utilisateur avec son token
const GetUser = (req, res) => {
    // 1. Récupérer le token depuis l'URL
    const token = req.query.token;
    
    // 2. Vérifier que le token existe
    if (!token) {
        return res.status(401).json({ message: "Vous devez fournir un token" });
    }
    
    // 3. Lire le fichier des utilisateurs
    try {
        const data = fs.readFileSync(usersFilePath, "utf-8");
        const users = JSON.parse(data);
        
        // 4. Chercher l'utilisateur qui a ce token
        const user = users.find(u => u.token === token);
        
        // 5. Si aucun utilisateur n'a ce token
        if (!user) {
            return res.status(401).json({ message: "Token invalide" });
        }
        
        // 6. Renvoyer les informations de l'utilisateur (sans le mot de passe)
        res.json({
            message: "Utilisateur trouvé",
            data: {
                id: user.id,
                username: user.username,
                collection: user.collection
            }
        });
        
    } catch (error) {
        // En cas d'erreur
        res.status(500).json({ message: "Erreur lors de la lecture des utilisateurs" });
    }
};

module.exports = {
    RegisterUser,
    LoginUser,
    GetUser
};