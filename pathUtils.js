const path = require("path");

function getPathInfo() {
    return {
        path: path.basename(__filename),
        path2: path.dirname(__filename),
        path3: path.extname(__filename)
    };
}
module.exports = { getPathInfo };