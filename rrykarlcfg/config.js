/**
 * Base By rrykarlsefni 
 * github.com/rrykarlsefni
 * saweria.co/rrykarlsefni
 * https://whatsapp.com/channel/0029Vb42ECFB4hdJNqSg9t3z
 * Supported By Gpt Assistant 
*/

const fs = require("fs");

module.exports = {
	botName: "Inoue",
    ownerName: "RRYKARL",
    owner: "6288802752781",
    prefix: [".", ",", "!", "?"],
    consoleLog: "rrykarlsefni",
    footer: "ʳʳʸᵏᵃʳˡˢᵉᶠⁿⁱ",  ///footer hanya mendukung pesan interactive/button dll, pastikan melihat info di gitub
    title: "InoueBaseBot",
    body: "ᴅᴇᴜɴᴀᴍɪꜱᴛ | rrykarl",
    
    rrykarls: {
    	nameCh: "ᴅᴇᴜɴᴀᴍɪꜱᴛ | rrykarl ",
    	idCh: "120363378175074413@newsletter",
        linkCh: "https://whatsapp.com/channel/0029Vb42ECFB4hdJNqSg9t3z",
        linkGc: "https://chat.whatsapp.com/H1KkQQUVppmD4VUs8Aqri1",
        fkreply: "https://raw.githubusercontent.com/rrykarlsefni/DBStorage/master/rrykarlcdn/fkreply.jpg",
        thumbvid : "https://raw.githubusercontent.com/rrykarlsefni/DBStorage/master/rrykarlcdn/vid.mp4",
        image: "https://raw.githubusercontent.com/rrykarlsefni/DBStorage/master/rrykarlcdn/InoueBaseBotThumb.png",
        audio: "https://raw.githubusercontent.com/rrykarlsefni/DBStorage/master/rrykarlcdn/No.%201%20Party%20Anthem%20(128kbps).mp3",
        pairing: "RRYKARLS", 
    },
    
    messages: {
        ownerOnly: "Perintah ini hanya untuk owner!",
        groupOnly: "Perintah ini hanya bisa digunakan di grup!",
        privateOnly: "Perintah ini hanya bisa digunakan di chat pribadi!",
        wait: "Loading...",
        error: "Error, terjadi kesalahan",
        done: "Done",
        unknownCommand: "Perintah tidak dikenali!",
        modeUpdated: "Mode berhasil diubah menjadi ",
    },
};

let file = require.resolve(__filename);
fs.watchFile(file, () => {
    fs.unwatchFile(file);
    console.log(`\x1b[32m[UPDATE] ${__filename} telah diperbarui!\x1b[0m`);
    delete require.cache[file];
    require(file);
});