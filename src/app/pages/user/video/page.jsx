


import fs from "fs";
import path from "path";
import VideoCenterPage from "../../../../components/video/video";

export default async function Video() {
    const videoDir = path.join(process.cwd(), "public", "video");
    const files = fs.readdirSync(videoDir).filter((file) => file.endsWith(".mp4"));

    const randomFile = files[Math.floor(Math.random() * files.length)];
    const videoSrc = `/video/${randomFile}`;

    return <VideoCenterPage videoSrc={videoSrc} />;
}
