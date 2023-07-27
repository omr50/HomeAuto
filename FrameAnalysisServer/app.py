# url = "rtsp://user:password@192.168.0.13:554/live/ch1"
from flask import Flask, jsonify
from threading import Thread
from flask_cors import CORS
import cv2
import numpy as np
import threading
import queue
import os


app = Flask(__name__, static_folder='pictures', static_url_path='/pictures')
cors = CORS(app, resources={r"/*": {"origins": "*"}})

# Create a queue to hold frames
frame_queue = queue.Queue(maxsize=10)

@app.route('/get-images/<int:start>/<int:amount>')
def get_images(start, amount):
    images = os.listdir('pictures/')
    images.sort(key=lambda img: os.path.getmtime(f'pictures/{img}'))
    # Consider the images are sorted in the order you want them to be sent
    images = images[start:start+amount]
    image_urls = [{'url': f'/pictures/{image}'} for image in images]
    return jsonify(image_urls)


def worker():
    # Worker function to process frames
    net = cv2.dnn.readNet("yolov4.weights", "yolov4.cfg")
    classes = []
    with open("coco.names", "r") as f:
        classes = [line.strip() for line in f.readlines()]
    layer_names = net.getLayerNames()
    output_layers = [layer_names[i - 1] for i in net.getUnconnectedOutLayers().flatten()]
    
    frame_counter = 0
    while True:
        # Take a frame from the queue and process it
        frame = frame_queue.get()
        frame_counter += 1
        if frame_counter % 15 == 0:  # Only process every 15th frame
            height, width, channels = frame.shape
            blob = cv2.dnn.blobFromImage(frame, 0.00392, (416, 416), (0, 0, 0), True, crop=False)
            net.setInput(blob)
            outs = net.forward(output_layers)

            # Draw bounding boxes for each object detected
            class_ids = []
            confidences = []
            boxes = []
            for out in outs:
                for detection in out:
                    scores = detection[5:]
                    class_id = np.argmax(scores)
                    confidence = scores[class_id]
                    if confidence > 0.5:
                        # Object detected
                        center_x = int(detection[0] * width)
                        center_y = int(detection[1] * height)
                        w = int(detection[2] * width)
                        h = int(detection[3] * height)
                        x = int(center_x - w / 2)
                        y = int(center_y - h / 2)
                        boxes.append([x, y, w, h])
                        confidences.append(float(confidence))
                        class_ids.append(class_id)

            indexes = cv2.dnn.NMSBoxes(boxes, confidences, 0.5, 0.4)

            # if person is detected change this to true and then capture the picture
            person_detected = False
            # Draw bounding boxes for each object detected
            for i in range(len(boxes)):
                if i in indexes:
                    x, y, w, h = boxes[i]
                    label = str(classes[class_ids[i]])
                    if label == 'person':  # Only detect persons
                        person_detected = True
                        cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)
                        cv2.putText(frame, label, (x, y + 30), cv2.FONT_HERSHEY_PLAIN, 3, (0, 255, 0), 2)

            # Save the processed frame to a directory
            if person_detected:
                image_name = f"frame_{frame_counter}.jpg"
                image_path = os.path.join('pictures', image_name)
                cv2.imwrite(image_path, frame)


# Start the worker thread
threading.Thread(target=worker, daemon=True).start()

# Replace with your IP camera's address
url = "rtsp://user:password@192.168.0.13:554/live/ch1"
cap = cv2.VideoCapture(url)

def start_flask_app():
    app.run(host='0.0.0.0')

def start_camera():
    while True:
        ret, frame = cap.read()
        if frame is not None:
            # Put the frame on the queue for the worker to process
            if not frame_queue.full():
               frame_queue.put(frame)
            cv2.imshow('cam', frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

if __name__ == '__main__':
    # Starting the Flask server in a new thread
    Thread(target=start_flask_app).start()
    
    # Starting the camera feed processing in the main thread
    start_camera()


# from flask import Flask, Response, render_template
# import subprocess

# app = Flask(__name__)

# @app.route('/')
# def stream():
#     return render_template('stream.html')

# @app.route('/stream')
# def stream():
#     camera_url = 'rtsp://user:password@192.168.0.13:554/live/ch0'
#     ffmpeg_cmd = f'ffmpeg -i {camera_url} -c:v libx264 -preset ultrafast -tune zerolatency -c:a aac -f hls -hls_time 2 -hls_list_size 5 -hls_flags delete_segments+discont_start+append_list -start_number 1 static/stream.m3u8'
#     subprocess.call(ffmpeg_cmd, shell=True)
#     return Response(gen(), mimetype='application/vnd.apple.mpegurl')

# def gen():
#     stream_url = 'static/stream.m3u8'
#     with open(stream_url, 'rb') as f:
#         while True:
#             data = f.read(1024)
#             if not data:
#                 break
#             yield data

# if __name__ == '__main__':
#     app.run(host='0.0.0.0', port=5000)


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
