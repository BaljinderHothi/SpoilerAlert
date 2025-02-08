from ultralytics import YOLO
from roboflow import Roboflow
from dotenv import load_dotenv
import os
import torch
load_dotenv()
api_key = os.getenv('ROBOFLOW_API_KEY')
rf = Roboflow(api_key)
project = rf.workspace("mldatasets-aiiqt").project("spoiler-alert-cloned-dataset-1ryna")
version = project.version(1)
dataset = version.download("yolov8")

def main():
    torch.cuda.empty_cache()
    model = YOLO("yolov8n.pt")

    train_results = model.train(
        data=f"{dataset.location}/data.yaml",
        epochs=200,
        imgsz=512,
        batch=2,
        device='cuda',
        workers=2
    )

    print("Model class names:", model.names)

if __name__ == "__main__":
    main()