const fs = require("fs");
const os = require("os");
const util = require("util");
const { performance } = require("perf_hooks");   
const axios = require("axios");
const fetch = require('node-fetch');
const jimp = require("jimp");
const path = require('path');
const ytdl = require("ytdl-core");
const config = require("./rrykarlcfg/config");
const { ffmpegConvertToWebp } = require("./helpers/func/ffmpeg");
const { getInoueStats, time } = require("./helpers/statsSs");
const { getRandomEmoji, getGreeting } = require("./helpers/utilities");
const { requestPairingCode } = require("./helpers/func/rry-pairspam");
const more = String.fromCharCode(8206);
const readmore = more.repeat(4001);
const processedMessages = new Set();

const { 
proto,
generateWAMessageFromContent,
generateWAMessage,
generateWAMessageContent,
getContentType,
prepareWAMessageMedia,
downloadContentFromMessage
} = require("@whiskeysockets/baileys");

const {  
rrykarlsLCMD,  
logUnknownCommand  
} = require("./helpers/logger");

const { 
exec, 
execSync 
} = require("child_process");

const { 
loadBotStats, 
updateRuntime, 
getLastOnline 
} = require("./database/botStats");


///-----///
const isOwner = (senderJid, rrykarl) => {
  if (!senderJid || typeof senderJid !== "string") return false;
  if (!rrykarl?.user?.id) return false;

  const botNumber = rrykarl.user.id.replace(/[^0-9]/g, "").trim();
  const ownerNumbers = [].concat(config.owner || [])
    .map(num => num.toString().replace(/[^0-9]/g, "").trim())
    .filter(num => num.length > 0);
  const senderNumber = senderJid.replace(/[^0-9]/g, "").trim();
  return ownerNumbers.includes(senderNumber) || senderNumber === botNumber;
};

///-----///
const settingPath = "./rrykarlcfg/settings.json";
const getSettings = () => JSON.parse(fs.readFileSync(settingPath));
const saveSettings = (data) => fs.writeFileSync(settingPath, JSON.stringify(data, null, 2));

///-----///
module.exports = async (rrykarl, m) => {
try {
if (!m.message) return;

const settings = getSettings();
const senderJid = m.key?.participant ?? m.key?.remoteJid ?? "";
const InoueSend = m.key?.remoteJid ?? "";
const isGroup = InoueSend.endsWith("@g.us");
    
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
 return JSON.parse(m.message.interactiveResponseMessage.nativeFlowResponseMessage.paramsJson)?.id;
} catch (e) {
return null;
}
})()
: null
) ??
m.message?.extendedTextMessage?.contextInfo?.quotedMessage?.conversation ??
  ""
)?.trim() || "";

if (!textMessage) return;

const evalPrefix = ["=>", ">", "$"];
const usedEvalPrefix = evalPrefix.find(p => textMessage.startsWith(p));

const prefix = Array.isArray(config?.prefix)
  ? config.prefix.find(p => textMessage.startsWith(p))
  : null;

if (!prefix && !usedEvalPrefix) return;

const usedPrefix = prefix ?? usedEvalPrefix;
const commandWithArgs = textMessage.slice(usedPrefix.length).trim();
if (!commandWithArgs) return;

const [commandRaw, ...argsArray] = commandWithArgs.split(/\s+/).filter(Boolean);
const command = commandRaw?.toLowerCase().trim();
const args = argsArray.join(" ");
const text = args;

if (processedMessages.has(m.key.id)) return;
processedMessages.add(m.key.id);

const groupMetadata = isGroup ? await rrykarl.groupMetadata(InoueSend).catch(() => ({})) : {};
const groupOwner = groupMetadata.owner ?? "";
const groupName = groupMetadata.subject ?? "";
const participants = groupMetadata.participants ?? [];
const groupAdmins = participants.filter(v => v.admin !== null).map(v => v.id);
const groupMembers = participants.map(v => v.id);
const isBotGroupAdmins = isGroup ? groupAdmins.includes(rrykarl.user.id) : false;
const isBotAdmins = isBotGroupAdmins;
const isAdmins = isGroup ? groupAdmins.includes(senderJid) : false;
    
const senderJidName = m.pushName ?? "Unknown";
const messLocation = isGroup ? "Group Chat" : "Private Chat";
const whoOwner = isOwner(senderJid, rrykarl) ? "true" : "false";

const mode = settings.mode || "public";
if (mode === "self" && !isOwner(senderJid, rrykarl)) return;

///-----///
async function getBuffer(url) {
try {
const response = await axios.get(url, { responseType: "arraybuffer" });
return Buffer.from(response.data, "binary");
} catch {
return null;
}
}
let ppuser;
try {
puser = await rrykarl.profilePictureUrl(senderJid, "image");
} catch {
ppuser = config.rrykarls.fkreply;
}
const profileuser = await getBuffer(ppuser);
const resizeImage = async (buffer, width, height) => {
try {
const image = await jimp.read(buffer);
image.cover(width, height, jimp.HORIZONTAL_ALIGN_CENTER | jimp.VERTICAL_ALIGN_MIDDLE);
return await image.quality(50).getBufferAsync(jimp.MIME_JPEG);
} catch {
return null;
}
};
const fakethumb = await resizeImage(profileuser, 300, 300);
///-----///
const ftroli = { 
key: { 
remoteJid: "6288802752781-120363402095323524@g.us", 
mentionedJid: [senderJid],
participant: "6288802752781@s.whatsapp.net" 
}, 
message: {
orderMessage: { 
itemCount: 505, 
status: 1, 
thumbnail: fakethumb,
surface: 1, 
message: "<\> rrykarlsefni", 
orderTitle: "rrykarl", 
sellerJid: "0@s.whatsapp.net"
} 
} 
};
///---///
async function sendAwdyo(rrykarl, InoueSend, url, options = {}) {
try {
const response = await axios({
method: "GET",
url: url,
responseType: "arraybuffer",
});

await rrykarl.sendMessage(InoueSend, { 
audio: Buffer.from(response.data, "binary"), 
mimetype: "audio/mp4", 
ptt: false, 
...options
});
} catch (error) {}
}
///----///
async function sendMenuMessage(to, captionText, videoUrl = config.rrykarls.thumbvid) {
    const footer = config.footer;
    const buttonId = `.menu`;
    const buttonText = 'kembali ke menu';
    const menuText = captionText;
    await rrykarl.sendMessage(to, {
        video: { url: videoUrl },
        gifPlayback: true,
        caption: menuText,
        footer: footer,
        contextInfo: {
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterName: config.rrykarls.nameCh,
                newsletterJid: config.rrykarls.idCh
            },
            externalAdReply: {
                showAdAttribution: true,
                title: config.title,
                body: config.body,
                thumbnailUrl: config.rrykarls.image,
                sourceUrl: config.rrykarls.idCh,
                mediaType: 1,
                renderLargerThumbnail: false
            }
        },
        buttons: [
            {
                buttonId: buttonId,
                buttonText: { displayText: buttonText },
                type: 1
            }
        ],
        headerType: 1,
        viewOnce: true
    });
}

///----///
async function sendAwdyoMessage(to, audioUrl) {
    await sendAwdyo(rrykarl, to, audioUrl, {
        contextInfo: {
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterName: config.rrykarls.nameCh,
                newsletterJid: config.rrykarls.idCh
            },
            externalAdReply: {
                showAdAttribution: true,
                title: config.title,
                body: config.body,
                thumbnailUrl: config.rrykarls.image,
                sourceUrl: config.rrykarls.idCh,
                mediaType: 1,
                renderLargerThumbnail: false
            }
        }
    });
}
///----///
function InoueRuntime() {
    const botStats = loadBotStats();
    let totalSeconds = botStats.runtime || 0;
    let days = Math.floor(totalSeconds / (3600 * 24));
    let hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    let minutes = Math.floor((totalSeconds % 3600) / 60);
    return `${days}d ${hours}h ${minutes}m`;
}
///---////
        rrykarlsLCMD(command, senderJidName, senderJid, messLocation, whoOwner);

        switch (command) {
///|================( MENU UTAMA )================|
case "rrykarl":
case "help":
case "menu": {
const stats = getInoueStats();
const greeting = getGreeting();
let menuText = `
${greeting}
Hi ${m.pushName},  
I am a ${config.botName} Bot.
WhatsApp bot that will help you

> \`Waktu\`   : *${stats.time} WIB*
> \`Runtime\` : *${InoueRuntime()}*
> \`Status\`  : *${settings.mode || "public"} Mode*
> \`Bot Ver\` : *${stats.botVersion}*
> \`NodeJS\`  : *${stats.nodeVersion}*
> \`Baileys\` : *${stats.baileysVersion}*
${readmore} 
[ DASHBOARD ]
> ALLMENU
> OWNERMENU
> TOOLSMENU
> MAINMENU
`;

if (m.key && m.key.id) {
rrykarl.sendMessage(InoueSend, { react: { text: getRandomEmoji(), key: m.key } });
}

await rrykarl.sendMessage(InoueSend, {
    video: { url: config.rrykarls.thumbvid },
    gifPlayback: true,
    caption: menuText,
    footer: config.footer,
    contextInfo: {
        mentionedJid: [senderJid],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterName: config.rrykarls.nameCh,
            newsletterJid: config.rrykarls.idCh 
        },
        externalAdReply: {  
            showAdAttribution: true,
            title: config.title,
            body: config.body,
            thumbnailUrl: config.rrykarls.image,
            sourceUrl: config.rrykarls.idCh,
            mediaType: 1,
            renderLargerThumbnail: true
        }
    },
    buttons: [
        { 
            buttonId: `.owner`,
            buttonText: { displayText: 'owner' },
            type: 1 
        },
        { 
            buttonId: `.sc`,
            buttonText: { displayText: 'script' },
            type: 1 
        },
        { 
            buttonId: `action`,
            buttonText: { displayText: 'More Options' },
            type: 4,
            nativeFlowInfo: {
                name: 'single_select',
                paramsJson: JSON.stringify({
                    title: '-List Menu',
                    sections: [
                        {
                            title: 'rrykarlsefni',
                            highlight_label: '🫩',
                            rows: [
                                {
                                    header: 'menu all',
                                    title: 'allmenu',
                                    description: 'Klik untuk melihat allmenu',
                                    id: '.allmenu'
                                },
                                {
                                    header: 'menu owner',
                                    title: 'ownermenu',
                                    description: 'menu untik owner',
                                    id: '.ownermenu'
                                },
                                {
                                    header: 'menu tools',
                                    title: 'toolsmenu',
                                    description: 'klik untik melihat menu tools',
                                    id: '.toolsmenu'
                                },
                                {
                                    header: 'menu main',
                                    title: 'mainmenu',
                                    description: 'klik untik melihat menu main',
                                    id: '.mainmenu'
                                },
                            ]
                        }
                    ]
                })
            }
        }
    ],
    headerType: 1,
    viewOnce: true
}, { quoted: ftroli });

try {
        await sendAwdyoMessage(InoueSend, config.rrykarls.audio);
    } catch (error) {
        console.log("Error sending audio:", error);
    }

    break;
}

///|================( LIST MENU)================|
case "rrykarlsefni": 
case "allmenu": {
    const captionText = `
\`ALLMENU\`
*[ OWNER MENU ]*
> public
> self
> joingc
> followch
> pairspam
> $
> >
> =>

*[ TOOLS MENU ]*
> brat
> bratvid

*[ MAIN MENU ]*
> menu
> help
> owner
> ping
> speed
> stats
> infobot
`;

if (m.key && m.key.id) {
        rrykarl.sendMessage(InoueSend, { 
            react: { text: getRandomEmoji(), key: m.key } 
        });
    }
 
      await sendMenuMessage(InoueSend, captionText);

try {
        await sendAwdyoMessage(InoueSend, config.rrykarls.audio);
    } catch (error) {
        console.log("Error sending audio:", error);
    }

    break;
}
///---///
case "ownermenu": {
    const captionText = `
*[ OWNER MENU ]*
> public
> self
> joingc
> followch
> pairspam
> $
> >
> =>
`;

if (m.key && m.key.id) {
        rrykarl.sendMessage(InoueSend, { 
            react: { text: getRandomEmoji(), key: m.key } 
        });
    }
 
    await sendMenuMessage(InoueSend, captionText);

break;
}
///---///
case "toolsmenu": {
    const captionText = `
*[ TOOLS MENU ]*
> brat
> bratvid
`;

if (m.key && m.key.id) {
        rrykarl.sendMessage(InoueSend, { 
            react: { text: getRandomEmoji(), key: m.key } 
        });
    }
 
    await sendMenuMessage(InoueSend, captionText);
    break;
}
///---///
case "mainmenu": {
    const captionText = `
*[ MAIN MENU ]*
> menu
> help
> owner
> ping
> speed
> stats
> infobot
`;

if (m.key && m.key.id) {
        rrykarl.sendMessage(InoueSend, { 
            react: { text: getRandomEmoji(), key: m.key } 
        });
    }
 
    await sendMenuMessage(InoueSend, captionText);
    break;
}
///|================( FITURNYA)================|

     case "owner": {
    let ownerNumber = config.owner + "@s.whatsapp.net";

    if (m.key && m.key.id) {
        await rrykarl.sendMessage(InoueSend, { 
            react: { text: getRandomEmoji(), key: m.key } 
        });
    }

    const vcard = `BEGIN:VCARD\nVERSION:3.0\nFN:${config.ownerName}\nTEL;type=CELL;type=VOICE;waid=${config.owner}:${config.owner}\nEND:VCARD`;

    const contactMessage = {
        contacts: {
            displayName: config.ownerName,
            contacts: [
                { vcard }
            ]
        }
    };

    await rrykarl.sendMessage(InoueSend, { contacts: { displayName: config.ownerName, contacts: [{ vcard }] } }, { quoted: m });

    try {
        await sendAwdyoMessage(InoueSend, config.rrykarls.audio);
    } catch (error) {
        console.log("Error sending audio:", error);
    }

    break;
}

      case "self":
      case "public": {
        if (!isOwner(senderJid, rrykarl)) {
          return await rrykarl.sendMessage(InoueSend, { text: config.ownerOnly }, { quoted: ftroli });
        }

        settings.mode = command;
        saveSettings(settings);

        await rrykarl.sendMessage(InoueSend, {
          text: `Mode bot diubah ke: *${command.toUpperCase()}*`
        }, { quoted: ftroli });
        break;
      }
      
      case "autotyping": {
        if (!isOwner(senderJid, rrykarl)) {
          return await rrykarl.sendMessage(InoueSend, { text: config.ownerOnly }, { quoted: ftroli });
        }

        if (args === "on") {
          settings.autotyping = true;
        } else if (args === "off") {
          settings.autotyping = false;
        } else {
          return await rrykarl.sendMessage(InoueSend, {
            text: `Penggunaan:\n.autotyping on\n.autotyping off`
          }, { quoted: ftroli });
        }

        saveSettings(settings);
        await rrykarl.sendMessage(InoueSend, {
          text: `Fitur *autotyping* diubah ke: *${settings.autotyping ? "ON" : "OFF"}*`
        }, { quoted: ftroli });
        break;
      }

      case "autoreadchat": {
        if (!isOwner(senderJid, rrykarl)) {
          return await rrykarl.sendMessage(InoueSend, { text: config.ownerOnly }, { quoted: ftroli });
        }

        if (args === "on") {
          settings.autoreadchat = true;
        } else if (args === "off") {
          settings.autoreadchat = false;
        } else {
          return await rrykarl.sendMessage(InoueSend, {
            text: `Penggunaan:\n.autoreadchat on\n.autoreadchat off`
          }, { quoted: ftroli });
        }

        saveSettings(settings);
        await rrykarl.sendMessage(InoueSend, {
          text: `Fitur *autoreadchat* diubah ke: *${settings.autoreadchat ? "ON" : "OFF"}*`
        }, { quoted: ftroli });
        break;
      }

      case "readsw": {
        if (!isOwner(senderJid, rrykarl)) {
          return await rrykarl.sendMessage(InoueSend, { text: config.ownerOnly }, { quoted: ftroli });
        }

        if (args === "on") {
          settings.autoreadsw = true;
        } else if (args === "off") {
          settings.autoreadsw = false;
        } else {
          return await rrykarl.sendMessage(InoueSend, {
            text: `Penggunaan:\n.readsw on\n.readsw off`
          }, { quoted: ftroli });
        }

        saveSettings(settings);
        await rrykarl.sendMessage(InoueSend, {
          text: `Fitur *autoreadsw* diubah ke: *${settings.autoreadsw ? "ON" : "OFF"}*`
        }, { quoted: ftroli });
        break;
      }

      case "reactsw": {
        if (!isOwner(senderJid, rrykarl)) {
          return await rrykarl.sendMessage(InoueSend, { text: config.ownerOnly }, { quoted: ftroli });
        }

        if (args === "on") {
          settings.autoreactsw = true;
        } else if (args === "off") {
          settings.autoreactsw = false;
        } else {
          return await rrykarl.sendMessage(InoueSend, {
            text: `Penggunaan:\n.reactsw on\n.reactsw off`
          }, { quoted: ftroli });
        }

        saveSettings(settings);
        await rrykarl.sendMessage(InoueSend, {
          text: `Fitur *autoreactsw* diubah ke: *${settings.autoreactsw ? "ON" : "OFF"}*`
        }, { quoted: ftroli });
        break;
      }

      case "setreactsw": {
        if (!isOwner(senderJid, rrykarl)) {
          return await rrykarl.sendMessage(InoueSend, { text: config.ownerOnly }, { quoted: ftroli });
        }

        const emojis = args.split(",").map(e => e.trim()).filter(e => e);
        if (emojis.length === 0) {
          return await rrykarl.sendMessage(InoueSend, {
            text: "Masukkan emoji valid. Contoh:\n.setreactsw 😎,🔥,👀"
          }, { quoted: ftroli });
        }

        settings.emojiList = emojis;
        saveSettings(settings);

        await rrykarl.sendMessage(InoueSend, {
          text: `Daftar emoji autoreact diperbarui:\n${emojis.join(" ")}`
        }, { quoted: ftroli });
        break;
      }
      
case "ping":
case "speed":
case "stats":
case "infobot": { 
	const stats = getInoueStats();
    const botStats = loadBotStats();
    const platform = os.platform();
    const totalRam = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2) + " GB"; 
    const freeRam = (os.freemem() / 1024 / 1024 / 1024).toFixed(2) + " GB"; 
    const usedRam = ((os.totalmem() - os.freemem()) / 1024 / 1024 / 1024).toFixed(2) + " GB"; 
    const totalCpu = os.cpus().length + " Core"; 
    const uptimeVps = os.uptime();
    const days = Math.floor(uptimeVps / 86400);
    const hours = Math.floor((uptimeVps % 86400) / 3600);
    const minutes = Math.floor((uptimeVps % 3600) / 60);
    const seconds = Math.floor(uptimeVps % 60);
    const runtimeVps = `${days}d ${hours}h ${minutes}m ${seconds}s`;
    let totalDisk = "Unknown", usedDisk = "Unknown";
    try {
        const diskData = require("child_process").execSync("df -h --total | grep 'total'").toString();
        const diskInfo = diskData.split(/\s+/);
        totalDisk = diskInfo[1];
        usedDisk = diskInfo[2];
    } catch (error) {}
    const startTime = performance.now();
    const responseTime = (performance.now() - startTime).toFixed(4) + " detik";
    const captionText = `
[ INFO SERVER ]
> \`Waktu\` : *${stats.time} WIB*
> \`Platform\` : *${platform}*
> \`Total Ram\` : *${totalRam}*
> \`Free Ram\` : *${freeRam}*
> \`Used Ram\` : *${usedRam}*
> \`Total Disk\` : *${totalDisk}*
> \`Used Disk\` : *${usedDisk}*
> \`Total Cpu\` : *${totalCpu}*
> \`Runtime Vps\` : *${runtimeVps}*
[ INFO BOT ]
> \`Respon Speed\` : *${responseTime}*
> \`Runtime Bot\` : *${InoueRuntime()}*
> \`Terakhir Online\` : *${botStats.lastOnline}*
> \`Total Pesan Masuk\` : *${botStats.totalReceived}*
> \`Total Pesan Keluar\` : *${botStats.totalSent}*
> \`Total Perintah\` : *${botStats.totalCommand}*
`;

    if (m.key && m.key.id) {
         rrykarl.sendMessage(InoueSend, { 
            react: { text: "⏱️", key: m.key } 
        });
    }

    await sendMenuMessage(InoueSend, captionText);
    break;
}
///|================( WARNING )================|
default:
  if (usedEvalPrefix && isOwner(senderJid, rrykarl)) {
    try {
      let evaled;
      const code = textMessage.slice(usedEvalPrefix.length).trim();

      if (usedEvalPrefix === "=>") {
        evaled = await eval(`(async () => { ${code} })()`);
      } else if (usedEvalPrefix === ">") {
        evaled = await eval(code);
      } else if (usedEvalPrefix === "$") {
        exec(code, (err, stdout, stderr) => {
          if (err) return rrykarl.sendMessage(InoueSend, { text: `Error:\n${err.message}` }, { quoted: ftroli });
          if (stderr) return rrykarl.sendMessage(InoueSend, { text: `Stderr:\n${stderr}` }, { quoted: m });
          return rrykarl.sendMessage(InoueSend, { text: stdout }, { quoted: m });
        });
        return;
      }

      if (typeof evaled !== "string") {
        evaled = util.inspect(evaled, { depth: 2, compact: false });
      }

      rrykarl.sendMessage(InoueSend, { text: evaled }, { quoted: m });
    } catch (e) {
      rrykarl.sendMessage(InoueSend, { text: `error:\n${e.message}` }, { quoted: ftroli });
    }
    return;
  }

  logUnknownCommand(command, senderJid);
  break;
  }
    } catch (err) {
        console.error("\x1b[31m❌ Error dalam penanganan pesan:\x1b[0m", err);
    }
};

///|================( FILE WATCHER )================|
let file = require.resolve(__filename);
fs.watchFile(file, () => {
    fs.unwatchFile(file);
    console.log(`\x1b[32m[UPDATE] ${__filename} telah diperbarui!\x1b[0m`);
    delete require.cache[file];
    require(file);
});