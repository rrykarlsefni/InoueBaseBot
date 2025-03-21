const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

async function ffmpegConvertToWebp(videoBuffer) {
    return new Promise((resolve, reject) => {
        const inputPath = path.join(__dirname, "input.mp4");
        const outputPath = path.join(__dirname, "output.webp");

        fs.writeFileSync(inputPath, videoBuffer);

        exec(`ffmpeg -i ${inputPath} -vf "scale=512:512:force_original_aspect_ratio=decrease" -loop 0 ${outputPath}`, (err) => {
            if (err) return reject(err);

            const webpBuffer = fs.readFileSync(outputPath);
            fs.unlinkSync(inputPath);
            fs.unlinkSync(outputPath);

            resolve(webpBuffer);
        });
    });
}

module.exports = { ffmpegConvertToWebp };