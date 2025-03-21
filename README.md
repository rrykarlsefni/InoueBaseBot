![Logo](https://cdn.xtermai.xyz/AXfiR.jpg)

 [**InoueBaseBot**](https://files.catbox.moe/6spj9t.mp4)

----------
## 📦 Package Information  

![Name](https://img.shields.io/badge/Name-InoueBaseBot-purple)  
![Version](https://img.shields.io/badge/Version-1.0.3-brightgreen)  
![Main File](https://img.shields.io/badge/Main-rrykarl.js-blue)  
![Module type](https://img.shields.io/badge/ModuleType-CommonJS-green)  
![License](https://img.shields.io/badge/License-MIT-orange)  
![Baileys](https://img.shields.io/badge/Baileys-@FizzxyDev/BaileysPro-blue)  

## 🔗 **GitHub Repository:**  
[![GitHub](https://img.shields.io/badge/GitHub-rrykarlsefni-blue?logo=github)](https://github.com/rrykarlsefni)  

## 💙 **Support & Donation:**  
[![Donate](https://img.shields.io/badge/Support-Saweria-blue)](https://saweria.co/rrykarlsefni)  

----------
## 📁 Struktur Direktori  
```javascript
│── database/        # Untuk menyimpan database  
│── helpers/         # Fungsi tambahan  
│── rrykarlcfg/      # Konfigurasi bot  
│── case.js          # Handler utama command  
│── rrykarl.js       # File utama bot  
│── index.js         # Entry point alternatif  
│── package.json     # Dependensi proyek  
│── readme.md        # Dokumentasi proyek  
│── LICENSE          # Lisensi proyek
```
----------

## ⚙️ configuratoon
```javascript
const fs = require("fs");

module.exports = {
    owner: "6288802752781",
    prefix: [".", ",", "!", "?"],
    botName: "Inoue",
    ownerName: "RRYKARL",
    consoleLog: "rrykarlsefni",
    footer: "ʳʳʸᵏᵃʳˡˢᵉᶠⁿⁱ",
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
        image: "https://cdn.xtermai.xyz/EmM57.jpg",
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
```
----------

##  Instalasi   
### **Clone Repository & Install Dependencies**  
```bash
git clone https://github.com/rrykarlsefni/InoueBase.git
cd InoueBase
npm install
```

## startup
### produksi
```bash
npm start
```
### manual
```bash
node rrykarl.js
```
### development
```bash
npm run rrykarl
```
### produksi alternatif 
```bash
npm run rrykarl-prod
```

## WITH TERMUX
```bash
$ pkg update && pkg upgrade
$ pkg install git -y
$ pkg install nodejs -y
$ pkg install ffmpeg -y
$ git clone https://github.com/rrykarlsefni/InoueBaseBot
$ cd InoueBaseBot
$ npm install
$ npm start
```
----------
## FOR WINDOWS/VPS/RDP USER

* Download And Install Git [`Click Here`](https://git-scm.com/downloads)
* Download And Install NodeJS [`Click Here`](https://nodejs.org/en/download)
* Download And Install FFmpeg [`Click Here`](https://ffmpeg.org/download.html) (**Don't Forget Add FFmpeg to PATH enviroment variables**)
* Download And Install ImageMagick [`Click Here`](https://imagemagick.org/script/download.php)

```bash
git clone https://github.com/rrykarlsefni/InoueBaseBot
cd InoueBaseBot
npm install
npm update
```
-----------

## 🔧 How to build
### react random emoji
```javascript
if (m.key && m.key.id) {
await rrykarl.sendMessage(InoueSend, { react: { text: getRandomEmoji(), key: m.key } });
}
```
### Explanation:  
- **`m.key && m.key.id`** → Mengecek apakah pesan memiliki ID yang valid sebelum memberikan reaksi.  
- **`getRandomEmoji()`** → Fungsi yang mengembalikan emoji acak untuk reaksi.  
- **`await rrykarl.sendMessage(InoueSend, { react: { text: getRandomEmoji(), key: m.key } });`** → Mengirim reaksi emoji ke pesan pengguna.  
- **`react: { text: getRandomEmoji(), key: m.key }`** →  
- **`text`** → Emoji yang akan dikirim sebagai reaksi.  
- **`key`** → ID pesan yang akan menerima reaksi.
 
  -----------
## Case example
```javascript
case "anton": { 
    await rrykarl.sendMessage(InoueSend, { text: "cape" }); 
    break; 
}
```
### explanation: 
- `rrykarl` → Objek utama bot yang menangani koneksi WhatsApp (menggunakan Baileys). rename aja tapi harus rename semua untuk menghindari error!
- `InoueSend` → adalah seperti chatId/m.reply, kalian bisa rename tapi pastikan di ganti semua, jika tidak, maka akan error!
- `await rrykarl.sendMessage(InoueSend, { text: "cape" });` → Mengirim pesan teks "cape".  
- `break;` → Menghentikan eksekusi dalam switch.

----------
## send message
```javascript
await rrykarl.sendMessage(InoueSend, 
```
### Explanation
- sama seperti di atas

----------
## owner only
```javascript
if (!isOwner(senderJid, rrykarl)) {
            return await rrykarl.sendMessage(InoueSend, { text: config.messages.ownerOnly }, { quoted: m });
        } 
```
### Explanation  
- **`isOwner(senderJid, rrykarl)`** → Mengecek apakah **pengirim pesan (`senderJid`) adalah owner bot, senderJid bukan untuk mengirim, tapi untuk cek Jid pengirim, untuk mengirim gunakan InoueSend**.  
- **`if (!isOwner(senderJid, rrykarl))`** → Jika **pengirim bukan owner**, bot akan mengirim peringatan & menghentikan eksekusi.  
- **`return`** → Menghentikan eksekusi perintah jika pengguna bukan owner.  
- **`rrykarl.sendMessage(...)`** → Mengirim pesan kepada pengguna.  
- **`text: config.messages.ownerOnly`** → Mengambil teks peringatan dari `config.js`.  
- **`{ quoted: m }`** → Pesan dikirim sebagai **balasan** (`reply`) ke pesan pengguna.

------------
## runtime
```javascript
const { getInoueStats, time } = require("./helpers/InoueStats");
case: {
const stats = getInoueStats();
${stats.runtimeBot}
```

## runtime in database
```javascript
${InoueRuntime()}
```
### Explanation
- runtime keseluruhan dari awal menggunakan bot sampe saat ini, walau update dan restart, runtime tidak tereset
----------

## message from function (button+fkreply+forwarded)
```javascript
await replymesej(InoueSend, menuText, config.rrykarls.image, rrykarl, m);
break;
}
```
### Explanation  
- **`replymesej(InoueSend, menuText, config.rrykarls.image, rrykarl, m);`** →  
- Memanggil fungsi `replymesej` untuk mengirim pesan yang sudah diformat.  
- **`InoueSend`** → ID chat atau grup tempat pesan dikirim.  
- **`menuText`** → Isi pesan yang akan dikirim. (contoh | let menuText = `ini menu text`, pastikan ini ada
- **`config.rrykarls.image`** → URL gambar yang digunakan dalam pesan.  
- **`rrykarl`** → Objek utama bot untuk menangani koneksi WhatsApp.  
- **`m`** → Objek pesan yang sedang diproses.  
  
-----------
## Fakereply
```javascript
}, { quoted: ftroli });
```
### Explanation  
- **`{ quoted: ftroli }`** → Menggunakan pesan **fake reply** (pesan yang terlihat seolah membalas pesan lain).  
- **Fake Reply Order Catalog** → Pesan ini sering digunakan untuk meniru **balasan dari katalog WhatsApp**, biasanya digunakan dalam bot untuk memberikan efek lebih realistis.  
- **Contoh Penggunaan:**  
```javascript
  await rrykarl.sendMessage(InoueSend, { 
      text: "amboi amboi", 
  }, { quoted: ftroli });
```

------------
## audioMessage
```javascript
await sendAwdyo(rrykarl, InoueSend, config.rrykarls.audio,
```
## audioMessage with contexinfo & externalAdReply
```javascript
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
```
### Explanation
- mengirim pesan audio denganmenggunakan url

----------
## Dokumentasi Interactive Message, Button, dan Lainnya di Baileys
- **Baileys yang digunakan:** [`@FizzxyDev/BaileysPro`](https://www.npmjs.com/package/@fizzxydev/baileys-pro)  
  (tidak di endorse)


## join channel for info and updates

[![WhatsApp channel](https://img.shields.io/badge/WhatsApp%20Channel-25D366?style=for-the-badge&logo=whatsapp&logoColor=white)](https://whatsapp.com/channel/0029Vb42ECFB4hdJNqSg9t3z)

## Info
- script ini masih beta
- beberapa deklarasi belom ada
- jika kamu ingin menambahkan fitur mungkin masih perlu import/const/require/dependecies tambahan
- silahkan rakit rakit se kreatif mungkin🔥
- jika sudah banyak perubahan, bebas mau menjualnya atau tidak karna ini sc mu sendiri🔥, tapi jan hapus credit ya
- semangat semua

## 🔥 **Butuh Panel Private Anti Delay & Anti Rusuh?**  
📌 **Cek link di bawah ini untuk informasi lebih lanjut:**  
📢 **Testimoni & Menu:**  
[🔗 WhatsApp Channel](https://whatsapp.com/channel/0029Vb42ECFB4hdJNqSg9t3z/1979)  
 **Diskon Spesial Ramadhan! Dijamin Amanah & Terpercaya!** 


## THANKS TO
- **Allah SWT**
- **Para Pengguna & Tester**  
- **Chat GPT**
- **[@FizzxyDev](https://www.npmjs.com/package/@fizzxydev/baileys-pro)**
- **Seluruh Developer & Community**

---

###### end

