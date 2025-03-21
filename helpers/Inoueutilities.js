const reactionEmojis = ["📚", "💭", "💫", "🌌", "🌏", "✨", "🌷", "🍁", "🪻"];
const getRandomEmoji = () => reactionEmojis[Math.floor(Math.random() * reactionEmojis.length)];

function getGreeting() {
	const moment = require("moment-timezone");
    const hour = moment().tz("Asia/Jakarta").hour();

    if (hour >= 4 && hour < 11) {
        return "Selamat Pagi! 🏙️";
    } else if (hour >= 11 && hour < 15) {
        return "Selamat Siang! 🏞️";
    } else if (hour >= 15 && hour < 19) {
        return "Selamat Sore! 🌄";
    } else {
        return "Selamat Malam! 🌃";
    }
};

module.exports = { getRandomEmoji, getGreeting };