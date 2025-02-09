"use client";
import { useState, useRef, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

type props = {
  setObject: React.Dispatch<React.SetStateAction<string>>;
}


export default function FailSafeCamera({setObject}: props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [apikey, setApikey] = useState('')
  const genAI = new GoogleGenerativeAI(apikey);

  useEffect(() => {
    startCamera();
    const key = process.env.NEXT_PUBLIC_gemini
    setApikey(String(key))
  }, []);

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

  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const context = canvasRef.current.getContext("2d");
    if (context) {
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0);
      const imageData = canvasRef.current.toDataURL("image/png");
      setCapturedImage(imageData);
    }

    // Stop the camera feed after capturing
    if (videoRef.current?.srcObject) {
      (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
    }
  };

  const retryCapture = () => {
    setCapturedImage(null);
    setResult(null);
    startCamera(); // Restart camera
  };

  const identifyImage = async () => {
    if (!capturedImage) return;

    setLoading(true);
    setResult(null);

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      // Convert base64 image (excluding metadata)
      const base64Image = capturedImage.split(",")[1];

      const imagePart = {
        inlineData: {
          data: base64Image,
          mimeType: "image/png",
        },
      };

      const prompt = "What is this image? Identify the object in a single word.";

      const generatedContent = await model.generateContent([prompt, imagePart]);
      const text = generatedContent.response.text()
      setResult(text);
      setObject(text)
    } catch (error) {
      console.error("Error identifying image:", error);
      setResult("Error processing the image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4 bg-gray-100 p-4">
      <div className="relative w-full max-w-md">
        {/* Show Captured Image OR Video Feed */}
        {capturedImage ? (
          <img src={capturedImage} alt="Captured" className="w-full rounded-lg shadow-md object-cover" />
        ) : (
          <video ref={videoRef} autoPlay playsInline className="w-full rounded-lg shadow-md" />
        )}

        {/* Capture or Retry Button */}
        <button
          onClick={capturedImage ? retryCapture : captureImage}
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition"
        >
          {capturedImage ? "Retry" : "Capture"}
        </button>
      </div>

      <canvas ref={canvasRef} className="hidden" />

      {/* Identify Button (Only if image is captured) */}
      {capturedImage && (
        <button
          onClick={identifyImage}
          className="px-4 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition"
        >
          Identify Image
        </button>
      )}

      {loading && <p className="text-gray-500">Processing...</p>}
      {result && <p className="text-lg font-semibold text-gray-800">{result}</p>}
    </div>
  );
}
