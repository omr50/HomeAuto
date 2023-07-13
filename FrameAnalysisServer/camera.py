import time
import cv2

class Camera():
    @staticmethod
    def get_frame():
        path = "rtsp://user:password@192.168.0.22:554/live/ch0"
        video_selected = cv2.VideoCapture(path)
        currTime = time.time()
        while True:
            ret, frame = video_selected.read()
            if time.time() - currTime >= 1:
                # print("FPS:", currFrames)
                currFrames = 0
                currTime = time.time()
            if ret:
                success, encoded_frame = cv2.imencode('.jpg', frame)
                if success:
                    yield encoded_frame.tobytes()
            else:
                break
