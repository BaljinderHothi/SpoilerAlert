from flask import Flask, request, jsonify, Response
from flask_cors import CORS
import cv2
import numpy as np
from ultralytics import YOLO
import base64

app = Flask(__name__)
CORS(app)

model = YOLO("runs/detect/train2/weights/last.pt")

labels_dict = {0: 'apple', 1: 'banana', 2: 'broccoli', 3: 'carrot', 4: 'cucumber',
               5: 'kiwi', 6: 'lemon', 7: 'onion', 8: 'orange', 9: 'tomato'}

cap = cv2.VideoCapture(0)

@app.route('/')
def home():
    return "Welcome to the Object Detection API!"

def generate_frames():
    while True:
        ret, frame = cap.read()
        if not ret:
            break

        predictions = model.predict(frame, conf=0.4)
        boxes = predictions[0].boxes

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

@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)