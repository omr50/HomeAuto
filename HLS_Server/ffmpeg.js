const ffmpeg = require('fluent-ffmpeg');
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

const rtspUrl = 'rtsp://user:password@192.168.0.13:554/live/ch1'; // Replace with your IP camera's RTSP stream URL
const hlsOutputPath = 'videos/ipcam/index.m3u8';

ffmpeg(rtspUrl, { timeout: 432000 })
  .inputOptions([
    '-rtsp_transport tcp', // Use TCP for RTSP transport
  ])
  .outputOptions([
    '-profile:v baseline',
    '-level 3.0',
    '-start_number 0',
    '-hls_time 1', // Reduced segment time
    '-hls_list_size 2',
    '-g 15', // Adjust this based on your video's frame rate
    '-f hls',
    '-hls_flags append_list+omit_endlist',
    '-preset ultrafast', // Fastest encoding
    '-tune zerolatency' // Optimize for low latency
  ])
  .output(hlsOutputPath)
  .on('end', () => {
    console.log('end');
  })
  .run();
