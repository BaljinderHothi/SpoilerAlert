// pages/safety.tsx
'use client'
import Camera from "./_components/camera";
import Sidebar from "./_components/sidebar";
import { useState } from "react";
import Test from "./_components/test";

export default function Safety() {
    const [detectedObject, setDetectedObject] = useState<string>("");

    return (
        <>
            {/*<Camera setObject={setDetectedObject} />

            <div className="mt-4 w-96 bg-white p-4 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold text-gray-700">Detected Object:</h2>
                <p className="text-gray-600 mt-2">{detectedObject || "No object detected"}</p>
            </div> */}
            <Test/>
        </>
        {/*
        <div className="flex space-x-4">
            <div className="flex-1">
                <Camera setObject={setDetectedObject} />
            </div>
            <div className="flex-1">
                <Sidebar />
            </div>
            <div className="mt-4 w-96 bg-white p-4 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold text-gray-700">Detected Object:</h2>
                <p className="text-gray-600 mt-2">{detectedObject || "No object detected"}</p>
            </div>
        </div> */}
    );
}
