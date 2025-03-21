const os = require("os");
const packageJson = require("../package.json");
const config = require("../rrykarlcfg/config");
const moment = require("moment-timezone");
const time = moment().tz("Asia/Jakarta").format("HH:mm:ss");
function dateTime() {
    return moment().tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss");
}

async function logStartupInfo(question, rrykarl) {
    console.log("\x1b[34m====================================\x1b[0m");
    console.log(`\x1b[32m            ${config.consoleLog}      \x1b[0m`);
    console.log("\x1b[34m====================================\x1b[0m\n");

    console.log("\n\x1b[34m VPS INFORMATION\x1b[0m");
    console.log(` Platform: ${os.platform()}`);
    console.log(` Total RAM: ${(os.totalmem() / 1024 / 1024 / 1024).toFixed(1)} GB`);
    console.log(` Total CPU: ${os.cpus().length} Cores`);
    console.log("\x1b[35m────────────────────────────────────\x1b[0m");

    console.log("\x1b[32m BOT START TIME\x1b[0m");
    console.log(` Waktu Mulai: ${dateTime()}`);
    console.log("\x1b[35m────────────────────────────────────\x1b[0m");

    console.log("\x1b[36m PACKAGE INFORMATION\x1b[0m");
    console.log(` Bot Name: ${packageJson.name || "Unknown"}`);
    console.log(` Node.js Version: ${process.version}`);
    console.log(` Installed Packages: ${Object.keys(packageJson.dependencies || {}).length}`);
    console.log("\x1b[35m────────────────────────────────────\x1b[0m\n");

    const phoneNumber = await question("\x1b[33m Masukkan nomor WhatsApp berawal 62 untuk menghubungkan ke bot:\x1b[0m\n");

    const pairingCode = config?.rrykarls?.pairing || "UNKNOWN";
    const code = await rrykarl.requestPairingCode(phoneNumber, pairingCode);

    console.log(`\x1b[36m Kode Pairing Anda: \x1b[1m${code}\x1b[0m`);
    console.log("\x1b[34m Gunakan kode ini untuk menghubungkan bot ke WhatsApp!\n\x1b[0m");
}

function logBotConnected(rrykarl) {
    console.log(`\x1b[32m✅ [${dateTime()}] Bot sukses terhubung!\x1b[0m`);

    const ownerJid = config.owner + "@s.whatsapp.net";
    const pesan = `*BOT CONNECTED SUCCESS*\n*Tanggal:* ${dateTime()}\n*Status:* Online`;

    console.log(pesan);

    if (!global.notifiedOwner) {
        rrykarl.sendMessage(ownerJid, { text: pesan })
            .then(() => {
                console.log(`\x1b[34m📩 [${dateTime()}] Notifikasi terkirim ke owner!\x1b[0m`);
                global.notifiedOwner = true;
            })
            .catch((err) => console.error("\x1b[31m❌ Gagal mengirim notifikasi ke owner:\x1b[0m", err));
    }
}

function logReconnect() {
    console.log(`\x1b[33m🔄 [${dateTime()}] Bot mencoba reconnect...\x1b[0m`);
}

function logLogout() {
    console.log(`\x1b[31m❌ [${dateTime()}] Bot telah logout, harap scan ulang.\x1b[0m`);
}

function logConnect() {
    console.log(`\x1b[32m✅ [${dateTime()}] Bot berhasil terhubung!\x1b[0m`);
}

function rrykarlsLCMD(command, senderName, senderJid, messLocation, whoOwner) {
    console.log('\x1b[44m\x1b[97m%s\x1b[0m', ' [.ᐟ]NEW MESSAGE ');
    console.log(`\x1b[42m\x1b[97m ${command} \x1b[0m─────────────────
│ \x1b[38;5;32mDateTime    : ${dateTime()}
│ \x1b[38;5;178mSendername  : ${senderName}
│ \x1b[38;5;97mSenderJid   : ${senderJid}
│ \x1b[38;5;73mMLocation   : ${messLocation}
│ \x1b[38;5;160mOwnerCheck  : ${whoOwner}
└────────────────────────[${config.consoleLog}]\x1b[0m`);
}

function logUnknownCommand(command) {
    console.log(`|\x1b[41m\x1b[37m%s\x1b[0m`, `UnknownCMD : ${command}`);
    console.log(`└────────────────────[rrykarl]`);
}

module.exports = { 
    logStartupInfo, 
    logBotConnected, 
    logReconnect, 
    logLogout, 
    logConnect,
    rrykarlsLCMD, 
    logUnknownCommand 
};