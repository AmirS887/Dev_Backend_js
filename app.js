const mathUtils = require("./mathUtils");
const pathUtils = require("./pathUtils");
const systemUtils = require("./systemUtils");
const test = require("./test");
const express = require("express");

const app = express();


app.get("/mathUtils", (req, res) => {
    const mathUtils1 = mathUtils.add(5, 3);
    const mathUtils2 = mathUtils.subtract(9, 4);
    res.json({mathUtils1, mathUtils2});
   });   

app.get("/systeminfo", (req, res) => {
    const systemInfo = systemUtils.getSystemInfo();
    res.json(systemInfo);
   });   
app.get("/path", (req, res) => {
    const path = pathUtils.getPathInfo();
    res.json(path);
   });   
app.get("/test", (req, res) => {
    const test1 = test.createFile();
    res.json(test1);
   });   

app.listen(3000, () => {
 console.log("Serveur démarré sur http://localhost:3000");
});



   
