from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np
from ultralytics import YOLO
import base64

app = Flask(__name__)
CORS(app)

model = YOLO("runs/detect/train2/weights/last.pt")

labels_dict = {0: 'apple', 1: 'banana', 2: 'broccoli', 3: 'carrot', 4: 'cucumber', 5: 'kiwi', 6: 'lemon', 7: 'onion', 8: 'orange', 9: 'tomato'}
@app.route('/')
def home():
    return "Welcome to the Object Detection API!"
@app.route('/detect', methods=['POST'])
@app.route('/detect', methods=['POST'])
def detect():
    data = request.json
    frame_data = data.get("frame")

    if not frame_data:
        return jsonify({"error": "No frame provided"}), 400

    try:
        # Extract the base64 data (remove the "data:image/jpeg;base64," prefix)
        if "," in frame_data:
            frame_data = frame_data.split(",")[1]

        # Add padding if necessary
        padding = len(frame_data) % 4
        if padding:
            frame_data += "=" * (4 - padding)

        # Decode the base64 image data
        frame_bytes = base64.b64decode(frame_data)
        np_arr = np.frombuffer(frame_bytes, np.uint8)
        frame = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

        if frame is None:
            print("Failed to decode image. Invalid or corrupted image data.")  # Debug statement
            return jsonify({"error": "Failed to decode image"}), 400

        # Perform object detection
        predictions = model.predict(frame, conf=0.4)
        yolo_boxes = predictions[0].boxes

        detected_objects = []

        for box in yolo_boxes:
            x1, y1, x2, y2 = map(int, box.xyxy[0])
            cls = int(box.cls[0])
            conf = float(box.conf[0])
            label = labels_dict.get(cls, f"Class {cls}")

            detected_objects.append({
                "label": label,
                "confidence": conf,
                "bbox": [x1, y1, x2, y2]  # Return bounding box coordinates
            })

        return jsonify({"objects": detected_objects})

    except Exception as e:
        print("Error:", e)  # Debug statement
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)