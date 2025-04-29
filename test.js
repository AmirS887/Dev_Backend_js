const fs = require("fs");

function createFile() {

fs.writeFileSync("test.txt", "Ceci est un fichier créé avec Node.js");
console.log("Fichier test.txt créé avec succès");
const data = fs.readFileSync("test.txt", "utf8");
console.log("Contenu du fichier :", data)

}
module.exports = { createFile };