const config = require("../rrykarlcfg/config");
const packageInfo = require("../package.json");

function getInoueStats() {
	const moment = require("moment-timezone");
	const time = moment().tz("Asia/Jakarta").format("HH:mm:ss");
    const dateTime = moment().tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss");

    let uptime = process.uptime();
    let botDays = Math.floor(uptime / (3600 * 24));
    let botHours = Math.floor((uptime % (3600 * 24)) / 3600);
    let botMinutes = Math.floor((uptime % 3600) / 60);
    let botSeconds = Math.floor(uptime % 60);

    let runtimeBot = `${botDays}d ${String(botHours).padStart(2, "0")}h ${String(botMinutes).padStart(2, "0")}m ${String(botSeconds).padStart(2, "0")}s`;

    let status = (config?.mode || "UNKNOWN").toUpperCase();
    let nodeVersion = process.version;
    let baileysVersion = packageInfo.dependencies?.["@whiskeysockets/baileys"] || "Unknown";
    let botVersion = packageInfo.version || "1.0.0";

    return {
        runtimeBot,
        time,
        dateTime, 
        status,
        nodeVersion,
        baileysVersion,
        botVersion
    };
}

module.exports = { getInoueStats };