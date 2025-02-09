'use client'
import {useState, useRef, useEffect } from 'react'

export default function FailSafeCamera () {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [result, setResult] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
  
    useEffect(() => {
      async function startCamera() {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (error) {
          console.error("Error accessing camera:", error);
        }
      }
      startCamera();
    }, []);
  
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
    };
  
    const identifyImage = async () => {
      if (!capturedImage) return;
      
      setLoading(true);
      setResult(null);
  
      try {
        const base64Image = capturedImage.split(",")[1]; // Remove metadata
        const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-pro-vision:generateContent?key=AIzaSyBnBdUR-lSxDGQVyYRl6LyXdTaGp19LmjM`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    inlineData: {
                      mimeType: "image/png",
                      data: base64Image,
                    },
                  },
                ],
              },
            ],
          }),
        });
  
        const data = await response.json();
        setResult(data?.candidates?.[0]?.content ?? "No result found");
      } catch (error) {
        console.error("Error identifying image:", error);
        setResult("Error processing the image.");
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <div className="flex flex-col items-center justify-center p-4 space-y-4 bg-gray-100 min-h-screen">
        <h1 className="text-xl font-bold">Camera & Image Recognition</h1>
  
        <video ref={videoRef} autoPlay playsInline className="w-full max-w-md rounded-lg shadow-md" />
        <canvas ref={canvasRef} className="hidden" />
  
        <button onClick={captureImage} className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600">
          Capture Image
        </button>
  
        {capturedImage && (
          <>
            <img src={capturedImage} alt="Captured" className="w-64 h-64 object-cover rounded-lg shadow-md" />
            <button onClick={identifyImage} className="px-4 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600">
              Identify Image
            </button>
          </>
        )}
  
        {loading && <p className="text-gray-500">Processing...</p>}
        {result && <p className="text-lg font-semibold text-gray-800">{result}</p>}
      </div>
    );
}