import React, { useEffect, useRef, useState } from "react";
interface CameraProps {
  setObject: (object: string) => void;
}
        
const CAMERA_WIDTH = 640;
const CAMERA_HEIGHT = 480;
const Camera: React.FC<CameraProps> = ({ setObject }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isStreaming, setIsStreaming] = useState(false);
 
    const mediaRecorderRef = useRef(null);
    const [recordedChunks, setRecordedChunks] = useState([]);

    const videoStreamBackend = "http://127.0.0.1:5000/video_feed"

    const startCamera = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: { width: CAMERA_WIDTH, height: CAMERA_HEIGHT } });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;

                    const mediaRecorder = new MediaRecorder(stream, {
                        mimeType: "video/webm",
                    });

                    mediaRecorder.ondataavailable = (event) => {
                        if (event.data.size > 0) {
                            setRecordedChunks((prev) => [...prev, event.data]);
                        }
                    };

                    mediaRecorder.onstop = () => {
                        if (recordedChunks.length) {
                            const blob = new Blob(recordedChunks, {
                                type: "video/webm",
                            });
                            const url = URL.createObjectURL(blob);
                            console.log("Recorded video blob:", blob);
                            setRecordedChunks([]);
                        }
                    };

                    mediaRecorderRef.current = mediaRecorder;
                }
                setIsStreaming(true);
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
      
    };

    useEffect(() => {
        startCamera()
            .then(() => {
                console.log("Camera started");
            })
            .catch((error) => {
                console.error("Error with camera:", error);
            });
    }, []);

    return (
    <div className="relative w-[640px] h-[480px] bg-black rounded-lg overflow-hidden">
      <video 
        ref={videoRef} 
        autoPlay 
        playsInline 
        muted 
        className="w-full h-full object-cover" />
      <img src={videoStreamBackend} alt="Mmm Fruits"/>
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

        {/* Side bar for showing the information regarding recalls for a certain prodcut */}
      <div className="absolute top-2 right-2 bg-white p-2 rounded-md text-gray-800 text-sm font-semibold">
        {/* ping the api */}
        
      </div>
    </div>
  );
};

export default Camera;