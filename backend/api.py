from flask import Flask, request, jsonify, Response
from flask_cors import CORS
import cv2
from ultralytics import YOLO
from collections import deque, defaultdict
from datetime import datetime, timedelta
import threading

app = Flask(__name__)
CORS(app)

model = YOLO("runs/detect/train3/weights/last.pt")

labels_dict = {0: 'apple', 1: 'banana', 2: 'broccoli', 3: 'carrot', 4: 'cucumber',
               5: 'kiwi', 6: 'lemon', 7: 'onion', 8: 'orange', 9: 'tomato'}

cap = cv2.VideoCapture(0)

is_camera_active = False
predictions_deque = deque()
lock = threading.Lock()

def generate_frames():
    while True:
        if not is_camera_active:
            continue

        ret, frame = cap.read()
        if not ret:
            break

        predictions = model.predict(frame, conf=0.4)
        boxes = predictions[0].boxes

        current_time = datetime.now()
        with lock:
            for box in boxes:
                cls = int(box.cls[0])
                label = labels_dict.get(cls, f"Class {cls}")
                predictions_deque.append((current_time, label))

            while predictions_deque and current_time - predictions_deque[0][0] > timedelta(seconds=5):
                predictions_deque.popleft()

        for box in boxes:
            x1, y1, x2, y2 = map(int, box.xyxy[0])
            cls = int(box.cls[0])
            conf = float(box.conf[0])
            label = labels_dict.get(cls, f"Class {cls}")

            cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
            cv2.putText(frame, f"{label} ({conf:.2f})", (x1, y1 - 10),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)

        _, buffer = cv2.imencode('.jpg', frame)
        frame = buffer.tobytes()

        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

@app.route('/start_camera')
def start_camera():
    global is_camera_active
    is_camera_active = True
    return jsonify({"status": "Camera started"})

@app.route('/stop_camera')
def stop_camera():
    global is_camera_active
    is_camera_active = False
    return jsonify({"status": "Camera stopped"})

@app.route('/most_frequent_prediction')
def most_frequent_prediction():
    with lock:
        freq = defaultdict(int)
        for _, label in predictions_deque:
            freq[label] += 1

        if freq:
            most_frequent = max(freq, key=freq.get)
            return jsonify({"most_frequent_prediction": most_frequent})
        else:
            return jsonify({"most_frequent_prediction": "No predictions in the last 5 seconds"})

@app.route('/video_feed')
def video_feed():
    print("Backend video feed accessed.")
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)