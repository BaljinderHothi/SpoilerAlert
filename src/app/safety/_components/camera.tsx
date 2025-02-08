import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

const CAMERA_WIDTH = 640;
const CAMERA_HEIGHT = 480;
const DETECTION_URL = "http://127.0.0.1:5000/detect"; // Flask endpoint

interface CameraProps {
  setObject: (object: string) => void;
}

const Camera: React.FC<CameraProps> = ({ setObject }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const detectionInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => stopCamera(); // Cleanup when unmounting
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsStreaming(true);
      startDetection(); // Start detection loop
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsStreaming(false);

    // Stop detection loop
    if (detectionInterval.current) {
      clearInterval(detectionInterval.current);
      detectionInterval.current = null;
    }
  };

  const startDetection = () => {
    if (detectionInterval.current) return; // Prevent multiple intervals

    detectionInterval.current = setInterval(async () => {
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

          // Extract first detected object name
          if (response.data.objects.length > 0) {
            const detectedClass = response.data.objects[0].class;
            console.log("Flask Detected Object:", detectedClass);
            setObject(detectedClass); // Update parent state
          } else {
            setObject("Unknown");
          }
        } catch (error) {
          console.error("Error sending frame:", error);
          setObject("Error detecting");
        }
      }
    }, 1000); // Send a frame every 1 second
  };

  return (
    <div className="relative w-[640px] h-[480px] bg-black rounded-lg overflow-hidden">
      <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
      <canvas ref={canvasRef} className="hidden" />

      {/* Overlay Buttons */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4">
        {!isStreaming ? (
          <button
            onClick={startCamera}
            className="px-4 py-2 bg-green-500 text-white text-sm font-semibold rounded-md shadow hover:bg-green-600 transition"
          >
            Start
          </button>
        ) : (
          <button
            onClick={stopCamera}
            className="px-4 py-2 bg-red-500 text-white text-sm font-semibold rounded-md shadow hover:bg-red-600 transition"
          >
            Stop
          </button>
        )}
      </div>

      {/* Display Detected Object Inside Camera Box */}
      <div className="absolute top-2 left-2 bg-white p-2 rounded-md text-gray-800 text-sm font-semibold">
        {isStreaming ? "Detecting..." : "Camera Off"}
      </div>
    </div>
  );
};

export default Camera;
