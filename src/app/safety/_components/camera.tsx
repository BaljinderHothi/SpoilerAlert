import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

const CAMERA_WIDTH = 640;
const CAMERA_HEIGHT = 480;
const DETECTION_URL = "http://127.0.0.1:5000/detect";

const CameraStream: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [detectedObjects, setDetectedObjects] = useState<{ class: string; confidence: number }[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Error accessing camera:", error);
      }
    };

    startCamera();
  }, []);

  const startStreaming = () => {
    setIsStreaming(true);
    captureAndSendFrames();
  };

  const stopStreaming = () => {
    setIsStreaming(false);
  };

  const captureAndSendFrames = async () => {
    if (!isStreaming || !videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (context) {
      canvas.width = CAMERA_WIDTH;
      canvas.height = CAMERA_HEIGHT;
      context.drawImage(videoRef.current, 0, 0, CAMERA_WIDTH, CAMERA_HEIGHT);

      const frameData = canvas.toDataURL("image/jpeg"); // Convert frame to Base64

      try {
        const response = await axios.post(DETECTION_URL, { frame: frameData });
        setDetectedObjects(response.data.objects);
      } catch (error) {
        console.error("Error sending frame:", error);
      }
    }

    setTimeout(captureAndSendFrames, 500); // Send a frame every 500ms
  };

  return (
    <div>
      <h2>Live Camera Stream</h2>
      <video ref={videoRef} autoPlay playsInline muted style={{ width: "100%", maxWidth: "640px" }} />
      <canvas ref={canvasRef} style={{ display: "none" }} />

      <div style={{ marginTop: "10px" }}>
        <button onClick={startStreaming} disabled={isStreaming}>
          {isStreaming ? "Streaming..." : "Start Streaming"}
        </button>
        <button onClick={stopStreaming} disabled={!isStreaming}>
          Stop Streaming
        </button>
      </div>

      {/* Display detected objects */}
      <div>
        <h3>Detected Objects:</h3>
        {detectedObjects.length > 0 ? (
          <ul>
            {detectedObjects.map((obj, index) => (
              <li key={index}>
                {obj.class} ({(obj.confidence * 100).toFixed(2)}%)
              </li>
            ))}
          </ul>
        ) : (
          <p>No objects detected</p>
        )}
      </div>
    </div>
  );
};

export default CameraStream;
