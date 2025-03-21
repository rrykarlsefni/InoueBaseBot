/**
 * Base By rrykarlsefni 
 * github.com/rrykarlsefni
 * saweria.co/rrykarlsefni
 * https://whatsapp.com/channel/0029Vb42ECFB4hdJNqSg9t3z
 * Supported By Gpt Assistant 
*/

const fs = require("fs");

module.exports = {
    owner: "6288802752781",
    prefix: [".", ",", "!", "?"],
    botName: "Inoue",
    ownerName: "RRYKARL",
    consoleLog: "rrykarlsefni",
    footer: "ʳʳʸᵏᵃʳˡˢᵉᶠⁿⁱ",  ///footer hanya mendukung pesan interactive/button dll, tidak mendukung ImageMesej, pastikan melihat infi di gitub
    title: "InoueBaseBot",
    body: "ᴅᴇᴜɴᴀᴍɪꜱᴛ | rrykarl",
    status: true,
    mode: "public",
    
    rrykarls: {
    	nameCh: "ᴅᴇᴜɴᴀᴍɪꜱᴛ | rrykarl ",
    	idCh: "120363378175074413@newsletter",
        linkCh: "https://whatsapp.com/channel/0029Vb42ECFB4hdJNqSg9t3z",
        linkGc: "https://chat.whatsapp.com/H1KkQQUVppmD4VUs8Aqri1",
        fkreply: "https://cdn.xtermai.xyz/2uVUO.jpg",
        thumbvid : "https://files.catbox.moe/4y6uuu.mp4",
        image: "https://cdn.xtermai.xyz/AXfiR.jpg",
        audio: "https://cdn.xtermai.xyz/dhf2U.mp3",
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