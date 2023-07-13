from flask import Flask, Response, render_template
import subprocess

app = Flask(__name__)

@app.route('/')
def stream():
    return render_template('stream.html')

@app.route('/stream')
def stream():
    camera_url = 'rtsp://user:password@192.168.0.13:554/live/ch0'
    ffmpeg_cmd = f'ffmpeg -i {camera_url} -c:v libx264 -preset ultrafast -tune zerolatency -c:a aac -f hls -hls_time 2 -hls_list_size 5 -hls_flags delete_segments+discont_start+append_list -start_number 1 static/stream.m3u8'
    subprocess.call(ffmpeg_cmd, shell=True)
    return Response(gen(), mimetype='application/vnd.apple.mpegurl')

def gen():
    stream_url = 'static/stream.m3u8'
    with open(stream_url, 'rb') as f:
        while True:
            data = f.read(1024)
            if not data:
                break
            yield data

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)


# from flask import Flask, Response
# import cv2
# import numpy as np

# app = Flask(__name__)


# @app.route("/video")
# def video():
#     return Response(generate_video(), mimetype='multipart/x-mixed-replace; boundary=frame')


# def generate_video():
#     path = "rtsp://user:password@192.168.0.13:554/live/ch0"
#     video_selected = cv2.VideoCapture(path)

#     while True:
#         ret, frame = video_selected.read()
#         if ret:
#             # Encode frame as JPEG
#             _, encoded_frame = cv2.imencode('.jpg', frame)
#             frame_bytes = encoded_frame.tobytes()

#             # Yield frame as multipart HTTP response
#             yield (b'--frame\r\n'
#                    b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')

#         else:
#             break

#     # Release the VideoCapture object
#     video_selected.release()


# if __name__ == '__main__':
#     app.run()






# import cv2
# import time
# from flask import Flask
# from flask_socketio import SocketIO
# from flask_socketio import SocketIO, emit
# from flask_cors import CORS

# app = Flask(__name__)
# socketio = SocketIO(app, cors_allowed_origins="*")
# cors = CORS(app, resources={r"/*": {"origins": "*"}})

# @socketio.on('request_video_stream')
# def handle_video_stream():
#     path = "rtsp://user:password@192.168.0.22:554/live/ch0"
#     video_selected = cv2.VideoCapture(path)
#     chunk_size = 8192  # Adjust the chunk size as per your requirements
#     while True:
#         ret, frame = video_selected.read()
#         if ret:
#             success, encoded_frame = cv2.imencode('.jpg', frame)
#             if success:
#                 frame_bytes = encoded_frame.tobytes()
#                 socketio.emit('video_stream', frame_bytes)

#         else:
#             break

#     socketio.emit('video_end')

# if __name__ == '__main__':
#     socketio.run(app, host='0.0.0.0')


# import cv2
# import time
# import threading
# from flask import Flask, Response, render_template
# from flask_socketio import SocketIO, emit
# from flask_cors import CORS
# import logging

# # logging.getLogger('werkzeug').setLevel(logging.ERROR)

# app = Flask(__name__)
# cors = CORS(app)

# @app.route("/")
# def index():
#     print('accessed')
#     return render_template('index.html')

# @app.route("/video")
# def video():
#     print('accessed')
#     return Response(generate_video(), mimetype='multipart/x-mixed-replace; boundary=frame')

# def generate_video():
#     path = "rtsp://user:password@192.168.0.22:554/live/ch0"
#     video_selected = cv2.VideoCapture(path)
#     while True:
#         ret, frame = video_selected.read()
#         if ret:
#             success, buffer = cv2.imencode('.jpg', frame, [cv2.IMWRITE_JPEG_QUALITY, 20])
#             if success:
#                 frame_bytes = buffer.tobytes()
#                 # cannot just return the frame
#                 # because it will just return
#                 # one. We need to return a multi
#                 # part response. So we have to use
#                 # yield frame.
#                 yield(b'--frame\r\n' b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')
#         else:
#             break

# app.run()
