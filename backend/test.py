import cv2
from ultralytics import YOLO
import mediapipe as mp

model = YOLO("../runs/detect/train/weights/last.pt")
mp_hands = mp.solutions.hands
mp_drawing = mp.solutions.drawing_utils
mp_drawing_styles = mp.solutions.drawing_styles
hands = mp_hands.Hands(static_image_mode=True, min_detection_confidence=0.4, min_tracking_confidence=0.4)
labels = {0: 'bell_pepper', 1: 'cabbage', 2: 'carrot', 3: 'cucumber', 4: 'egg', 5: 'garlic', 6: 'potato', 7: 'tomato'}

cap = cv2.VideoCapture(0)

while True:
    ret, frame = cap.read()
    if not ret:
        break
    frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = hands.process(frame_rgb)
    predictions = model.predict(frame, conf=0.6)
    boxes = predictions[0].boxes
    for box in boxes:
        x1, y1, x2, y2 = map(int, box.xyxy[0])
        cls = int(box.cls[0])
        conf = box.conf[0]
        label = labels.get(cls, f"Class {cls}")

        if results.multi_hand_landmarks:
            hand_landmarks = results.multi_hand_landmarks[0]

            x_vals = [landmark.x * frame.shape[1] for landmark in hand_landmarks.landmark]
            y_vals = [landmark.y * frame.shape[0] for landmark in hand_landmarks.landmark]
            x_min, x_max = int(min(x_vals)), int(max(x_vals))
            y_min, y_max = int(min(y_vals)), int(max(y_vals))
            pad = 40
            x1, y1, x2, y2 = x_min - pad, y_min - pad, x_max + pad, y_max + pad
            if x1 > x_max or x2 < x_min or y1 > y_max or y2 < y_min:
                continue

        if results.multi_hand_landmarks:
            for hand_landmarks in results.multi_hand_landmarks:
                mp_drawing.draw_landmarks(
                    frame, hand_landmarks, mp_hands.HAND_CONNECTIONS,
                    mp_drawing_styles.get_default_hand_landmarks_style(),
                    mp_drawing_styles.get_default_hand_connections_style()
                )
        cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
        cv2.putText(frame, f"{label} ({conf:.2f})", (x1, y1 - 10),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)

    cv2.imshow('Mmm.. Food', frame)
    if cv2.waitKey(25) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()