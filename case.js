const { generateWAMessageFromContent } = require("@whiskeysockets/baileys");
const { rrykarlsLCMD, logUnknownCommand } = require("./helpers/InoueLogger");
const { exec, execSync } = require("child_process");
const fs = require("fs");
const os = require("os");
const util = require("util");
const { performance } = require("perf_hooks");   
const axios = require("axios");
const jimp = require("jimp");
const { loadBotStats, updateRuntime, getLastOnline } = require("./database/botStats");
const config = require("./rrykarlcfg/config");
const { ffmpegConvertToWebp } = require("./helpers/func/ffmpeg");
const { getInoueStats, time } = require("./helpers/InoueStats");
const { getRandomEmoji, getGreeting } = require("./helpers/Inoueutilities");
const { requestPairingCode } = require("./helpers/func/rry-pairspam");
const more = String.fromCharCode(8206);
const readmore = more.repeat(4001);
const processedMessages = new Set();
const isOwner = (senderJid, rrykarl) => {
    if (!senderJid || typeof senderJid !== "string") return false;
    if (!rrykarl?.user?.id) return false;
    const ownerNumbers = [].concat(config.owner || [])
        .map(num => num.toString().replace(/@s\.whatsapp\.net/, "").trim())
        .filter(num => num.length > 0);
    const botNumber = rrykarl.user.id.replace(/@s\.whatsapp\.net/, "").trim();
    return ownerNumbers.includes(senderJid.replace(/@s\.whatsapp\.net/, "").trim()) 
        || senderJid.replace(/@s\.whatsapp\.net/, "").trim() === botNumber;
};

module.exports = async (rrykarl, m) => {
    try {
        if (!m.message) return;
        ///x/x/x/x///
const messageType = Object.keys(m.message || {})[0] || "";
const textMessage = (
  m.message?.conversation ??
  m.message?.[messageType]?.text ??
  m.message?.extendedTextMessage?.text ?? 
  ""
).trim();
if (!textMessage) return; 
const senderJid = m.key?.participant || m.key?.remoteJid || "";
const InoueSend = m.key?.remoteJid || "";
const isGroup = InoueSend.endsWith("@g.us"); 
const prefix = Array.isArray(config?.prefix)
  ? config.prefix.find((p) => textMessage.startsWith(p))
  : null;
if (!prefix) return;
const commandWithArgs = textMessage.slice(prefix.length).trim();
if (!commandWithArgs) return;
const [commandRaw, ...argsArray] = commandWithArgs.split(/\s+/).filter(Boolean);
const command = commandRaw?.toLowerCase().trim(); 
if (!command) return; 
const args = argsArray.join(" "); 
const text = args; 
const senderJidName = m.pushName || "Unknown";
const messLocation = isGroup ? "Group Chat" : "Private Chat";
const whoOwner = isOwner(senderJid, rrykarl) ? "true" : "false";

if (config.mode === "self" && !isOwner(senderJid, rrykarl)) return;
if (processedMessages.has(m.key.id)) return;
processedMessages.add(m.key.id);

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
    ppuser = await rrykarl.profilePictureUrl(senderJid, "image");
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
///|================( sjsjnsjsjs )================|
async function replymesej(InoueSend, menuText, image, rrykarl, m) {
    await rrykarl.sendMessage(InoueSend, { 
        image: { url: image },  
        caption: menuText,  
        footer: config.footer,
        contextInfo: { 
            forwardingScore: 999, 
            isForwarded: true 
        },
        interactiveButtons: [
            {
                name: "cta_url",
                buttonParamsJson: JSON.stringify({
                    display_text: "Official Saluran",
                    url: config.rrykarls.saluran
                })
            }
        ]
    }, { quoted: ftroli }); 
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
///|================( sknsjsmsmks )================|
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
> \`Status\`  : *${stats.status} Mode*
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
    }
}, { quoted: ftroli });
                
    try {
    await sendAwdyo(rrykarl, InoueSend, config.rrykarls.audio, {
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
    }, { quoted: m });
} catch (error) {}
break;
}
///|================( ALL MENU )================|
case "rrykarlsefni": 
case "allmenu": {
let menuText = `
\`ALLMENU\`
*[ OWNER MENU ]*
> public
> self
> joingc
> followch
> pairspam
> exec
> eval
> shell
> synceval
> asynceval
> seval
> aseval

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
    }
}, { quoted: ftroli });
                
    try {
    await sendAwdyo(rrykarl, InoueSend, config.rrykarls.audio, {
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
    }, { quoted: ftroli });
} catch (error) {}
break;
}
///|================( LIST MENU )================|
///|================( OWNER MENU )================|
case "ownermenu": {
let menuText = `
*[ OWNER MENU ]*
> public
> self
> joingc
> followch
> pairspam
> exec
> eval
> shell
> synceval
> asynceval
> seval
> aseval
`;

if (m.key && m.key.id) {
 rrykarl.sendMessage(InoueSend, { 
react: { text: getRandomEmoji(), key: m.key } 
});
}
await replymesej(InoueSend, menuText, config.rrykarls.image, rrykarl, m);
break;
}
///|================( TOOLS MENU )================|
case "toolsmenu": {
let menuText = `
*[ TOOLS MENU ]*
> brat
> bratvid
`;

if (m.key && m.key.id) {
 rrykarl.sendMessage(InoueSend, { 
react: { text: getRandomEmoji(), key: m.key } 
});
}
await replymesej(InoueSend, menuText, config.rrykarls.image, rrykarl, m);
break;
}
///|================( MAIN MENU )================|
case "mainmenu": {
let menuText = `
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
await replymesej(InoueSend, menuText, config.rrykarls.image, rrykarl, m);
break;
}
//setiap list menu memiliki baris, kmu copy 1 baris lalu taruh di bawahnya, terus edit menu tambahan sesukamu//rrykarl
//untuk fitur di bawah ini, di atas adalah tampilan menu
///|================( CASE )================|
//kode masih berantakan,belom sempet rapiin, gini aja dlu, cape
///|================( OWNER )================|
           case "owner": {
    let ownerNumber = config.owner + "@s.whatsapp.net";

    if (m.key && m.key.id) {
        rrykarl.sendMessage(InoueSend, { 
            react: { text: getRandomEmoji(), key: m.key } 
        });
    }

    let contactMessage = {
        contacts: {
            displayName: config.ownerName,
            contacts: [
                {
                    vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:${config.ownerName}\nTEL;waid=${config.owner}:${config.owner}\nEND:VCARD`
                }
            ]
        },
        contextInfo: { 
            forwardingScore: 999, 
            isForwarded: true 
        }
    };

    await rrykarl.sendMessage(InoueSend, contactMessage, { quoted: m });

    try {
    await sendAwdyo(rrykarl, InoueSend, config.rrykarls.audio, {
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
    }, { quoted: m });
} catch (error) {}
break;
}
///|================( DLL )================|         
            
            case "self": {
                if (!isOwner(senderJid, rrykarl)) {
    return await rrykarl.sendMessage(InoueSend, { text: config.messages.ownerOnly }, { quoted: m });
}

                config.mode = "self";
                await rrykarl.sendMessage(InoueSend, { text: "Bot sekarang dalam *Self Mode*!\nHanya owner yang bisa menggunakannya.", footer: "rrykarlsefni" }, { quoted: m });
                break;
            }

            case "public": {
                if (!isOwner(senderJid, rrykarl)) {
    return await rrykarl.sendMessage(InoueSend, { text: config.messages.ownerOnly }, { quoted: m });
}

                config.mode = "public";
                await rrykarl.sendMessage(InoueSend, { text: "Bot sekarang dalam *Public Mode*!\nSiapa saja bisa menggunakannya.", footer: "rrykarlsefni" }, { quoted: m });
                break;
            }
            
            case "joingc":
        if (!isOwner(senderJid, rrykarl)) {
            return await rrykarl.sendMessage(InoueSend, { text: config.messages.ownerOnly }, { quoted: m });
        }

        if (!text) {
            return rrykarl.sendMessage(InoueSend, { text: " Masukkan link grup!\nContoh: .joingc https://chat.whatsapp.com/ABCDEFG12345" }, { quoted: m });
        }

        const match = text.match(/chat\.whatsapp\.com\/([a-zA-Z0-9]+)/);
        if (!match) {
            return rrykarl.sendMessage(InoueSend, { text: "Link grup tidak valid!" }, { quoted: m });
        }

        try {
            await rrykarl.groupAcceptInvite(match[1]);
            rrykarl.sendMessage(InoueSend, { text: "Berhasil masuk grup!" }, { quoted: m });
        } catch (error) {
            rrykarl.sendMessage(InoueSend, { text: ` Gagal masuk grup: ${error.message}` }, { quoted: m });
        }
        break;
             
            case "followch":
            if (!isOwner(senderJid, rrykarl)) {
        return await rrykarl.sendMessage(InoueSend, { text: config.messages.ownerOnly }, { quoted: m });
    }
    if (!text) {
        return rrykarl.sendMessage(InoueSend, { text: " Masukkan ID channel!\nContoh: .followch 120363378175074413" }, { quoted: m });
    }

    const channelId = args.trim() + "@newsletter";

    try {
        await rrykarl.newsletterFollow(channelId);
        rrykarl.sendMessage(InoueSend, { text: `✅ Berhasil mengikuti channel: ${channelId}` }, { quoted: m });
    } catch (error) {
        rrykarl.sendMessage(InoueSend, { text: `${config.messages.error} ${channelId}: ${error.message}` }, { quoted: m });
    }
    break;        
    
case "bratv":
case "bratvid":
case "bratvideo": {
        if (!text) {
            return rrykarl.sendMessage(InoueSend, { text: "Masukkan teks untuk Brat Video!" }, { quoted: m });
        }
        
        if (m.key && m.key.id) {
        rrykarl.sendMessage(InoueSend, { react: { text: "⏱️", key: m.key } });
}

        try {
            let bratUrl = `https://api.siputzx.my.id/api/m/brat?text=${encodeURIComponent(text)}&isVideo=true&delay=500`;
            let response = await axios.get(bratUrl, { responseType: "arraybuffer" });

            if (response.data) {
                let webpBuffer = await ffmpegConvertToWebp(response.data);
                await rrykarl.sendMessage(InoueSend, { sticker: webpBuffer }, { quoted: m });
            } else {
                await rrykarl.sendMessage(InoueSend, { text: `${config.messages.error}` }, { quoted: m });
            }
        } catch (error) {
            await rrykarl.sendMessage(InoueSend, { text: `${config.messages.error} ${error.message}` }, { quoted: m });
        }
    }
    break;

case "bratimg":
case "brat": {
    if (!text) {
        return rrykarl.sendMessage(InoueSend, { 
            text: " Masukkan teks untuk Brat Sticker!" 
        }, { quoted: m });
    }
     
     if (m.key && m.key.id) {
     rrykarl.sendMessage(InoueSend, { react: { text: "⏱️", key: m.key } });
}

    try {
        let bratUrl = `https://api.siputzx.my.id/api/m/brat?text=${encodeURIComponent(text)}&isVideo=false&delay=500`;

        let response = await axios.get(bratUrl, { 
            responseType: "arraybuffer",
            headers: {
                "User-Agent": "Mozilla/5.0",
                "Accept": "image/webp,image/apng,image/*,*/*;q=0.8"
            }
        });

        if (response.data) {
            await rrykarl.sendMessage(InoueSend, { 
                sticker: response.data 
            }, { quoted: m });
        } else {
            await rrykarl.sendMessage(InoueSend, { 
    text: `${config.messages.error} ${error.message}`
}, { quoted: m });
        }

    } catch {
        await rrykarl.sendMessage(InoueSend, { 
    text: `${config.messages.error} ${error.message}`
}, { quoted: m });
    }
}
break; 

case "pairspam": {
    if (!isOwner(senderJid, rrykarl)) {
    return await rrykarl.sendMessage(InoueSend, { text: config.messages.ownerOnly }, { quoted: m });
}

    if (!text) {
        return rrykarl.sendMessage(InoueSend, { text: "Masukkan nomor target dan jumlah spam!\nContoh: .spampair 628xxxxxx 5" }, { quoted: m });
    }

    const input = args.split(" ");
    const phoneNumber = input[0].replace(/[^0-9]/g, "");
    const count = parseInt(input[1]);

    if (!phoneNumber || phoneNumber.length < 10) {
        return rrykarl.sendMessage(InoueSend, { text: "Nomor tidak valid!" }, { quoted: m });
    }
    if (isNaN(count) || count <= 0) {
        return rrykarl.sendMessage(InoueSend, { text: "Jumlah spam harus angka!" }, { quoted: m });
    }

    await rrykarl.sendMessage(InoueSend, { text: `Memulai spam pairing ke ${phoneNumber} sebanyak ${count} kali...` }, { quoted: m });

    try {
        const response = await requestPairingCode(phoneNumber, count);
        const pairingCode = response[0];
        const totalSent = response.length;

        await rrykarl.sendMessage(InoueSend, { 
            text: `Berhasil meminta kode pairing\n\nKode Pairing: ${pairingCode}\nTelah dikirim sebanyak ${totalSent} kali.` 
        }, { quoted: m });

    } catch (error) {
        await rrykarl.sendMessage(InoueSend, { text: `Gagal meminta pairing: ${error.message}` }, { quoted: m });
    }

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
    const infoMessage = `
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

    await replymesej(InoueSend, infoMessage, config.rrykarls.image, rrykarl, m);
    break;
}
///|================( EVAL )================|
case "shell":
case "exec": {
if (!isOwner(senderJid, rrykarl)) {
return await rrykarl.sendMessage(InoueSend, { text: config.messages.ownerOnly }, { quoted: m });
}
if (!text) {
return rrykarl.sendMessage(InoueSend, { text: "Masukkan perintah shell yang ingin dijalankan!" }, { quoted: ftroli });
}
try {
exec(text, (error, stdout, stderr) => {
if (error) return rrykarl.sendMessage(InoueSend, { text: `Error: ${error.message}` }, { quoted: m });
if (stderr) return rrykarl.sendMessage(InoueSend, { text: `Stderr: ${stderr}` }, { quoted: m });
rrykarl.sendMessage(InoueSend, { text: ` Output:\n${stdout}` }, { quoted: m });
});
} catch (err) {
rrykarl.sendMessage(InoueSend, { text: ` Error: ${err.message}` }, { quoted: m });
}
break;
}
case "eval": 
case "synceval":
case "seval": {
if (!isOwner(senderJid, rrykarl)) {
return await rrykarl.sendMessage(InoueSend, { text: config.messages.ownerOnly }, { quoted: m });
}
if (!text) {
return rrykarl.sendMessage(InoueSend, { text: "Silakan masukkan kode JavaScript yang ingin dieksekusi! *Hanya mendukung eksekusi sinkron.*\n> Hati-hati, kesalahan kode dapat membuat bot crash!" }, { quoted: ftroli });
}
try {
let result = eval(text); 
if (typeof result !== "string") result = require("util").inspect(result);
rrykarl.sendMessage(InoueSend, { text: `Output:\n${result}` }, { quoted: m });
} catch (error) {
rrykarl.sendMessage(InoueSend, { text: `Error: ${error.message}` }, { quoted: m });
}
break;
}
case "asynceval":
case "aseval": {
if (!isOwner(senderJid, rrykarl)) {
return await rrykarl.sendMessage(InoueSend, { text: config.messages.ownerOnly }, { quoted: m });
}
if (!text) {
return rrykarl.sendMessage(InoueSend, { text: "Silakan masukkan kode JavaScript yang ingin dieksekusi! *Mendukung kode asinkron dengan await.*\n> Hati-hati, kesalahan kode dapat membuat bot crash!" }, { quoted: ftroli });
}
try {
let result = await eval(`(async () => { ${text} })()`); 
if (typeof result !== "string") result = require("util").inspect(result);
rrykarl.sendMessage(InoueSend, { text: `Output:\n${result}` }, { quoted: m });
} catch (error) {
rrykarl.sendMessage(InoueSend, { text: `Error: ${error.message}` }, { quoted: m });
}
break;
}
///|================( END )================|

    default:
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