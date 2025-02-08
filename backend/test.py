import cv2
from ultralytics import YOLO

model = YOLO("runs/detect/train2/weights/last.pt")

labels = {0: 'bell_pepper', 1: 'cabbage', 2: 'carrot', 3: 'cucumber', 4: 'egg', 5: 'garlic', 6: 'potato', 7: 'tomato'}

cap = cv2.VideoCapture(0)

while True:
    ret, frame = cap.read()
    if not ret:
        break

    predictions = model.predict(frame, conf=0.6)

    boxes = predictions[0].boxes
    for box in boxes:
        x1, y1, x2, y2 = map(int, box.xyxy[0])
        cls = int(box.cls[0])
        conf = float(box.conf[0])
        label = labels.get(cls, f"Class {cls}")

        cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
        cv2.putText(frame, f"{label} ({conf:.2f})", (x1, y1 - 10),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)

    cv2.imshow('Mmm.. Food', frame)

    if cv2.waitKey(25) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()