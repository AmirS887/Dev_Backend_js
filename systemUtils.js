const os = require("os");


function getSystemInfo() {
 return {
 platform: os.platform(),
 architecture: os.arch(),
 freeMemory: os.freemem(),
 totalMemory: os.totalmem(),
 };
}
module.exports = { getSystemInfo };