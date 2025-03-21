const fs = require("fs");
const path = "./database/botStDB.json";

function loadBotStats() {
    try {
        if (fs.existsSync(path)) {
            let data = JSON.parse(fs.readFileSync(path, "utf-8") || "{}");
            
            if (!data.lastSaved) {
                data.lastSaved = Math.floor(Date.now() / 1000);
            }

            return data;
        } else {
            return createDefaultStats();
        }
    } catch (error) {
        console.error("Gagal membaca database:", error);
        return createDefaultStats();
    }
}

function createDefaultStats() {
    const defaultStats = {
        lastOnline: "",
        messageCount: 0,
        totalReceived: 0,
        totalSent: 0,
        totalCommand: 0,
        runtime: 0,
        lastSaved: Math.floor(Date.now() / 1000) // ✅ Tambahkan lastSaved
    };
    fs.writeFileSync(path, JSON.stringify(defaultStats, null, 4));
    return defaultStats;
}

let botStats = loadBotStats();

function saveBotStats() {
    try {
        fs.writeFileSync(path, JSON.stringify(botStats, null, 4));
    } catch (error) {
        console.error("Gagal menyimpan database:", error);
    }
}

function updateRuntime() {
    const now = Math.floor(Date.now() / 1000);

    if (!botStats.lastSaved || botStats.lastSaved === 0) {
        botStats.lastSaved = now;
    }

    const tambahan = now - botStats.lastSaved;
    if (tambahan > 0) {
        botStats.runtime += tambahan;
        botStats.lastSaved = now; 
        saveBotStats();
    }
}

function updateLastOnline() {
    const now = new Date();
    botStats.lastOnline = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;
    saveBotStats();
}

function getLastOnline() {
    return botStats.lastOnline ? `Terakhir online: ${botStats.lastOnline}` : "Belum pernah online";
}

function updateStatsOnReceive() { botStats.totalReceived += 1; saveBotStats(); }
function updateStatsOnSend() { botStats.totalSent += 1; saveBotStats(); }
function updateStatsOnCommand() { botStats.totalCommand += 1; saveBotStats(); }

module.exports = { 
    updateRuntime, updateStatsOnReceive, updateStatsOnSend, 
    updateStatsOnCommand, updateLastOnline, getLastOnline, saveBotStats, loadBotStats
};