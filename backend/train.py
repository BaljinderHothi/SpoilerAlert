from ultralytics import YOLO
from roboflow import Roboflow
from dotenv import load_dotenv
import os
import torch
load_dotenv()
api_key = os.getenv('ROBOFLOW_API_KEY')
rf = Roboflow(api_key)
project = rf.workspace("mldatasets-aiiqt").project("spoiler-alert-cloned-dataset-1ryna")
version = project.version(2)
dataset = version.download("yolov8")

def main():
    torch.cuda.empty_cache()
    print(torch.version.cuda)
    print(torch.cuda.is_available())
    print(os.environ.get('CUDA_VISIBLE_DEVICES'))
    os.environ["KMP_DUPLICATE_LIB_OK"] = "TRUE"
    os.environ['CUDA_VISIBLE_DEVICES'] = '0'
    model = YOLO("yolov8n.pt")
    train_loader = DataLoader(dataset, batch_size=16, num_workers=0)

    train_results = model.train(
        data=f"{dataset.location}/data.yaml",
        epochs=40,
        imgsz=512,
        batch=2,
        device='cuda',
        workers=2
    )

    print("Model class names:", model.names)

if __name__ == "__main__":
    main()