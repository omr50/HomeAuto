const app = require('express')();
const fs = require('fs');
const hls = require('hls-server');
const cors = require('cors');
const path = require('path')
const mqtt = require('mqtt')

const options = {
    username: "ynfhrqut:ynfhrqut",
    password: "CTO86ortUE2z3_5G7HXdbh0YQ-sdHGVH",
    port: 1883
  };

const client  = mqtt.connect("mqtt://toad.rmq.cloudamqp.com", options)
// clear all old .ts files
// and re-create .m3u8 file.
require('./startup')

// startup ffmpeg
// and convert the
// rtsp ip cam stream
// to hls .ts video.
require('./ffmpeg')

app.use(cors());

app.get('/', (req, res) => {
    return res.status(200).sendFile(`${__dirname}/client.html`);
});


app.get('/light-on', (req, res) => {
    // Publish 'ON' message to the MQTT broker when '/light-on' is accessed
    client.publish('/home/light', 'ON');
    res.send('Light is turned on!');
  });

app.get('/light-off', (req, res) => {
    // Publish 'OFF' message to the MQTT broker when '/light-off' is accessed
    client.publish('/home/light', 'OFF');
    res.send('Light is turned off!');
});

const server = app.listen(3000);

const findRemoveSync = require('find-remove')

const VideoFilePath = './videos/ipcam';
const m3u8FilePath = './videos/ipcam/index.m3u8';

setInterval(()=> {
    var result = findRemoveSync('./videos/ipcam', { age: { seconds: 15 }, extensions: '.ts' });
}, 15000)




new hls(server, {
    provider: {
        exists: (req, cb) => {
            const ext = req.url.split('.').pop();

            if (ext !== 'm3u8' && ext !== 'ts') {
                return cb(null, true);
            }

            fs.access(__dirname + req.url, fs.constants.F_OK, function (err) {
                if (err) {
                    console.log('File not exist');
                    return cb(null, false);
                }
                cb(null, true);
            });
        },
        getManifestStream: (req, cb) => {
            const stream = fs.createReadStream(__dirname + req.url);
            cb(null, stream);
        },
        getSegmentStream: (req, cb) => {
            const stream = fs.createReadStream(__dirname + req.url);
            cb(null, stream);
        }
    }
});