const fs = require("fs");
const path = require("path");
const TokenGenerator = require('token-generator');

const usersFilePath = path.join(__dirname, 'data', "users.json");
// Configurer le générateur de tokens (options par défaut)
const tokenGenerator = new TokenGenerator({
    salt: 'tcg-app-salt',
    timestampMap: 'abcdefghij', // 10 caractères par défaut
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
    
    // Vérifier si les données sont présentes
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

    res.json({ message: "Utilisateurs lus", users});
};

const LoginUser = (req, res) => {
    // Vérifier si le body existe
    if(!req.body) {
        res.status(400).json({"message": "Erreur : Aucune données"});
        return;
    }
    
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
    
    if(!user) {
        return res.status(401).json({"message": "Identifiants incorrects"});
    }
    
    // Génére un token pour l'utilisateur authentifié
    const token = tokenGenerator.generate();
    
    // mis a jour de l'utilisateur avec le token
    user.token = token;
    
    // Enregistre la mise à jour dans le fichier
    try {
        fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 4));
    } catch(error) {
        console.error("Erreur lors de l'enregistrement du token:", error);
        return res.status(500).json({"message": "Erreur lors de l'authentification"});
    }
    
    res.json({
        message: "Authentification réussie",
        data: {
            token: token
        }
    });
};

/**
 * Convertit l'ancienne structure de collection (tableau d'IDs) vers la nouvelle (objets avec id et nb)
 * @param {Array} oldCollection - Ancienne collection (tableau d'IDs)
 * @returns {Array} Nouvelle collection (objets avec id et nb)
 */
function convertOldCollectionFormat(oldCollection) {
    if (!oldCollection || oldCollection.length === 0) {
        return [];
    }
    
    // Vérifier si c'est déjà le nouveau format
    if (oldCollection[0] && typeof oldCollection[0] === 'object' && oldCollection[0].hasOwnProperty('id') && oldCollection[0].hasOwnProperty('nb')) {
        return oldCollection; // Déjà au bon format
    }
    
    // Convertir l'ancien format vers le nouveau
    const cardCounts = {};
    oldCollection.forEach(cardId => {
        cardCounts[cardId] = (cardCounts[cardId] || 0) + 1;
    });
    
    return Object.keys(cardCounts).map(cardId => ({
        id: parseInt(cardId),
        nb: cardCounts[cardId]
    }));
}

const GetUser = (req, res) => {
    // Récupération du token depuis l'URL
    const token = req.query.token;
    
    // verification du token 
    if (!token) {
        return res.status(401).json({ message: "Vous devez fournir un token" });
    }
    
    try {
        const data = fs.readFileSync(usersFilePath, "utf-8");
        const users = JSON.parse(data);
        
        //Chercher l'utilisateur qui a ce token
        const user = users.find(u => u.token === token);
        
     
        if (!user) {
            return res.status(401).json({ message: "Token invalide" });
        }
        
        // Convertir l'ancienne structure de collection vers la nouvelle si nécessaire
        if (user.collection) {
            user.collection = convertOldCollectionFormat(user.collection);
            
            // Sauvegarder la conversion dans le fichier
            fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 4));
        }
        
        // Initialiser currency si elle n'existe pas
        if (user.currency === undefined) {
            user.currency = 0;
            fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 4));
        }
        
        res.json({
            message: "Utilisateur trouvé",
            data: {
                id: user.id,
                username: user.username,
                collection: user.collection || [],
                lastBooster: user.lastBooster,
                currency: user.currency
            }
        });
        
    } catch (error) {
        // En cas d'erreur
        res.status(500).json({ message: "Erreur lors de la lecture des utilisateurs" });
    }
};

const DisconnectUser = (req, res) => {
    // 1. Récupérer le token depuis le body de la requête
    const { token } = req.body;
    
    // 2. Vérifier que le token existe
    if (!token) {
        return res.status(401).json({ message: "Vous devez fournir un token" });
    }
    
    try {
        const data = fs.readFileSync(usersFilePath, "utf-8");
        const users = JSON.parse(data);

        const user = users.find(u => u.token === token);

        if (!user) {
            return res.status(401).json({ message: "Token invalide" });
        }

        delete user.token;
        
        fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 4));

        res.json({ message: "Déconnexion réussie" });
        
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la déconnexion" });
    }
};

module.exports = {
    RegisterUser,
    LoginUser,
    GetUser,
    DisconnectUser
};