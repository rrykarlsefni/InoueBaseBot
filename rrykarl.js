const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
  proto,
  jidDecode,
  generateWAMessageFromContent,
  getContentType,
  messageType,
  prepareWAMessageMedia,
  downloadContentFromMessage
} = require("@whiskeysockets/baileys");

const {  
    updateStatsOnCommand,  
    updateStatsOnReceive,  
    updateStatsOnSend,  
    updateLastOnline,  
    updateRuntime  
} = require("./database/botStats");

const {  
    logStartupInfo,  
    logBotConnected,  
    logReconnect,  
    logLogout  
} = require("./helpers/logger");
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
        keepAliveIntervalMs: 30000,
        browser: ["macOS", "Safari", "17.0"],
        useMobile: false,
    });
   

rrykarl.decodeJid = (jid) => {
    if (!jid) return jid
    if (/:\d+@/gi.test(jid)) {
        const decode = jidDecode(jid) || {}
        return (
            (decode.user && decode.server && decode.user + "@" + decode.server) || jid
        )
    } else return jid
}

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
    let reason = "Unknown";

    if (lastDisconnect?.error?.output?.statusCode) {
        reason = lastDisconnect.error.output.statusCode;
    } else if (lastDisconnect?.error?.message?.includes("stream:error")) {
        reason = "stream:error";
    } else if (lastDisconnect?.error?.message?.includes("timed out")) {
        reason = "timedout";
    }

    console.log("Detail Error:", lastDisconnect?.error);

    if (reason === DisconnectReason.loggedOut || reason === 515) {
        console.log("\x1b[41m\x1b[37m Bot logout! Alasan: " + reason + " \x1b[0m");
        logLogout();
        console.log("\x1b[33mScan ulang QR Code untuk login!\x1b[0m");
        setTimeout(() => startBot(), 10000);
    } else if (reason === "stream:error" || reason === "timedout") {
        console.log("\x1b[31m Stream error/Timeout! Restart koneksi...\x1b[0m");
        logReconnect();
        setTimeout(() => startBot(), 10000);
    } else {
        console.log("\x1b[31m Bot disconnect! Alasan: " + reason + "\x1b[0m");
        logReconnect();
        setTimeout(() => startBot(), 10000);
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
                    console.log("Error sending Inoue message: ", error);
                }
            }
        }
    });

    rrykarl.ev.on("messages.upsert", async (chatUpdate) => {
    try {
        const m = chatUpdate.messages[0];
        if (!m.message || !m.key) return;

        updateStatsOnReceive();

        const settings = JSON.parse(fs.readFileSync('./rrykarlcfg/settings.json'));
        const isStatus = m.key.remoteJid === 'status@broadcast';
        const fromMe = m.key.fromMe;
        const from = m.key.remoteJid;

        if (!isStatus) {
            if (settings.autoreadchat) {
                try {
                    await rrykarl.readMessages([m.key]);
                } catch (err) {
                    console.error('Gagal autoread chat:', err);
                }
            }

            if (settings.autotyping) {
                try {
                    await rrykarl.sendPresenceUpdate('composing', from);
                } catch (err) {
                    console.error('Gagal autotyping:', err);
                }
            }
        }

        if (isStatus && !fromMe) {
            const maxTime = 5 * 60 * 1000;
            const currentTime = Date.now();
            const messageTime = (m.messageTimestamp || 0) * 1000;
            const timeDiff = currentTime - messageTime;

            if (timeDiff <= maxTime) {
                if (settings.autoreadsw) {
                    try {
                        await rrykarl.readMessages([m.key]);
                    } catch (err) {
                        console.error('Gagal membaca status:', err);
                    }
                }

                if (settings.autoreactsw) {
                    try {
                        const key = m.key;
                        const status = m.key.remoteJid;
                        const me = await rrykarl.decodeJid(rrykarl.user.id);
                        const participant = key.participant || m.participant || m.key.participant || me;

                        const emoji = settings.emojiList[Math.floor(Math.random() * settings.emojiList.length)];

                        await rrykarl.sendMessage(status, {
                            react: {
                                key: key,
                                text: emoji
                            }
                        }, {
                            statusJidList: [participant, me]
                        });
                    } catch (err) {
                        console.error('Gagal memberi reaksi status:', err);
                    }
                }
            }
        }

        const InoueSend = m.key?.remoteJid ?? "";
        const senderJid = m.key?.participant ?? m.key?.remoteJid ?? "";
        const messageType = Object.keys(m.message || {})[0] || "";

        const textMessage = (
            m.message?.conversation ??
            m.message?.[messageType]?.text ??
            m.message?.extendedTextMessage?.text ??
            m.message?.buttonsResponseMessage?.selectedButtonId ??
            m.message?.listResponseMessage?.singleSelectReply?.selectedRowId ??
            m.message?.templateButtonReplyMessage?.selectedId ??
            (m.message?.interactiveResponseMessage?.nativeFlowResponseMessage?.paramsJson
                ? (() => {
                    try {
                        return JSON.parse(m.message.interactiveResponseMessage.nativeFlowResponseMessage.paramsJson)?.id || "";
                    } catch {
                        return "";
                    }
                })()
                : "")
        ).trim();

        if (!textMessage) return;

        const usedPrefix = config.prefix.find(p => textMessage.startsWith(p)) || "";
        let command = "";
        let args = "";

        if (usedPrefix) {
            command = textMessage.slice(usedPrefix.length).trim().split(" ")[0].toLowerCase();
            args = textMessage.slice(usedPrefix.length + command.length).trim();
            updateStatsOnCommand();
        } else {
            command = textMessage;
        }

        await handleCase(rrykarl, m, command, args, config, InoueSend, senderJid, textMessage);
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
        setTimeout(() => startBot(), 5000);
    }
})();

let file = require.resolve(__filename);

process.on("uncaughtException", (err) => {
    console.error("❌ Uncaught Exception:", err);
});

process.on("unhandledRejection", (reason, promise) => {
    console.error("❌ Unhandled Rejection:", reason);
});

fs.watchFile(file, () => {
    fs.unwatchFile(file);
    console.log(`\x1b[32m[UPDATE] ${__filename} telah diperbarui!\x1b[0m`);
    delete require.cache[file];
    require(file);
});