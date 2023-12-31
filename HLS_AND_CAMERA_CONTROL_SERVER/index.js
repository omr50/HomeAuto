const app = require('express')();
const fs = require('fs');
const hls = require('hls-server');
const cors = require('cors');
const path = require('path')
const mqtt = require('mqtt')
const onvif = require('node-onvif')

const dotenv = require('dotenv');

dotenv.config();

// REMOVED OLD HLS SERVER
// This server will have
// camera controls too.

// test zoom later.
// move to files based on category.
// camera motion in its own folder.
// hls server in its own folder.
// light controls in its own folder.

// make zoom and movements less choppy
// if there is a way to make it small 
// increments but also don't send too
// much requests to avoid socket disconnect.


let device = new onvif.OnvifDevice({
    xaddr: 'http://192.168.0.13:8899/onvif/device_service', // Replace with your camera's ONVIF address
  });
  
let moveCameraLeft = ()=>{};
let moveCameraRight = ()=>{};
let zoomIn = ()=>{};
let zoomOut = ()=>{};

  device.init().then((info) => {
    console.log(info);
    
    // these are in x direction only (LEFT AND RIGHT)
    let paramsLeft = {
      'ProfileToken': 'Profile_token1', 
      'Velocity': { // PTZ velocity. x, y, and zoom values must be between -1 and 1.
        'x': 1.0, // Pan speed
        'y': 0.0, // Tilt speed
        'z': 0.0, 
        'zoom': 0.0 // Zoom speed
      },
      'Timeout':3 // time duration the move should continue
    };

    let paramsRight = {
        'ProfileToken': 'Profile_token1', 
        'Velocity': { // PTZ velocity. x, y, and zoom values must be between -1 and 1.
          'x': -1.0, // Pan speed
          'y': 0.0, // Tilt speed
          'z': 0.0, 
          'zoom': 0.0 // Zoom speed
        },
        'Timeout':3 // time duration the move should continue
      };
  
    // these are in x direction only (LEFT AND RIGHT)
    let paramsUp = {
      'ProfileToken': 'Profile_token1', 
      'Velocity': { // PTZ velocity. x, y, and zoom values must be between -1 and 1.
        'x': 0.0, // Pan speed
        'y': 1.0, // Tilt speed
        'z': 0.0, 
        'zoom': 0.0 // Zoom speed
      },
      'Timeout':3 // time duration the move should continue
    };

    let paramsDown = {
        'ProfileToken': 'Profile_token1', 
        'Velocity': { // PTZ velocity. x, y, and zoom values must be between -1 and 1.
          'x': 0.0, // Pan speed
          'y': -1.0, // Tilt speed
          'z': 0.0, 
          'zoom': 0.0 // Zoom speed
        },
        'Timeout':3 // time duration the move should continue
      };


      let zoom_in = {
        'ProfileToken': 'Profile_token1', 
        'Velocity': { // PTZ velocity. x, y, and zoom values must be between -1 and 1.
          'x': 0.0, // Pan speed
          'y': 0.0, // Tilt speed
          'z': 0.0, 
          'zoom': -1.0 // Zoom speed
        },
        'Timeout':3 // time duration the move should continue
      };

      let zoom_out = {
        'ProfileToken': 'Profile_token1', 
        'Velocity': { // PTZ velocity. x, y, and zoom values must be between -1 and 1.
          'x': 0.0, // Pan speed
          'y': 0.0, // Tilt speed
          'z': 0.0, 
          'zoom': 1.0 // Zoom speed
        },
        'Timeout':3 // time duration the move should continue
      };
    const delay = ms => new Promise(res => setTimeout(res, ms));

    moveCameraLeft = async () => {
      for (let i = 0; i < 3; i++) {
        try {
          await device.services.ptz.continuousMove(paramsLeft);
          console.log('Continuous move successful');
          await delay(300); // 2 seconds delay
        } catch (err) {
          console.error(err);
          break;
        } 
      }
    }

    moveCameraRight = async () => {
        for (let i = 0; i < 3; i++) {
          try {
            await device.services.ptz.continuousMove(paramsRight);
            console.log('Continuous move successful');
            await delay(300); // 2 seconds delay
          } catch (err) {
            console.error(err);
            break;
          } 
        }
      }

      zoomIn = async () => {
        for (let i = 0; i < 3; i++) {
          try {
            await device.services.ptz.continuousMove(zoom_in);
            console.log('Continuous move successful');
            await delay(300); // 2 seconds delay
          } catch (err) {
            console.error(err);
            break;
          } 
        }
      }

      zoomOut = async () => {
        for (let i = 0; i < 3; i++) {
          try {
            await device.services.ptz.continuousMove(zoom_out);
            console.log('Continuous move successful');
            await delay(300); // 2 seconds delay
          } catch (err) {
            console.error(err);
            break;
          } 
        }
      }
    
  
  }).catch((error) => {
    console.error(error);
  });

const options = {
    username: process.env.MQTT_USERNAME,
    password: process.env.MQTT_PASSWORD,
    port: process.env.MQTT_PORT
  };

const client  = mqtt.connect(process.env.MQTT_URL, options)
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


app.get('/lights', (req, res) => {
    // Publish 'ON' message to the MQTT broker when '/light-on' is accessed
    client.publish('/home/light', 'LIGHTS');
    res.send('Light is switched!');
  });


app.get('/move-left', async (req, res) => {
    await moveCameraLeft();
    res.send('successfully moved camera left');
})

app.get('/move-right', async (req, res) => {
    await moveCameraRight();
    res.send('successfully moved camera right');
})

app.get('/zoom-in', async (req, res) => {
  await zoomIn();
  res.send('successfully zoomed in');
})

app.get('/zoom-out', async (req, res) => {
  await zoomOut();
  res.send('successfully zoomed out');
})

const server = app.listen(3000);

const findRemoveSync = require('find-remove')

const VideoFilePath = './videos/ipcam';
const m3u8FilePath = './videos/ipcam/index.m3u8';

setInterval(()=> {
    var result = findRemoveSync('./videos/ipcam', { age: { seconds: 10 }, extensions: '.ts' });
}, 10000)




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
