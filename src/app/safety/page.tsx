// pages/safety.tsx
'use client'
import { useState, useEffect } from "react";
import Test from "./_components/test";

export default function Safety() {
    const [detectedObject, setDetectedObject] = useState<string>("");
    const [latitude, setLatitude] = useState("")
    const [longitude, setLongitude] = useState("")
    const [data, setData] = useState({})
    const ACCESS_TOKEN = "pk.38580c3f69a72023f4dd81db9cc4cb9a"

    function success(position:any) {
        const lat = position.coords.latitude;
        const long = position.coords.longitude;
        setLatitude(lat)
        setLongitude(long)

    }

    function error() {
        console.log("Unable to retrieve your location");
    }


    useEffect(() => {
        navigator.geolocation.getCurrentPosition(success, error);
        async function getUserLocationData() {
            if (latitude && longitude) {
                const api = `https://us1.locationiq.com/v1/reverse?format=json&key=${ACCESS_TOKEN}&lat=${latitude}&lon=${longitude}`
                const options = {method: 'GET', headers: {accept: 'application/json'}};
                const response = await fetch(api, options)
                const result = await response.json();
                setData(result);
                console.log(result)
            }
        }

        async function getRecallStats() {
            const options = {method: 'POST', headers: {accept: 'application/json'}, body: JSON.stringify({ username: "example" }),
        };
        }

        getUserLocationData()
    }, [latitude, longitude]);

    return (
        <>
            <Test/>
            
        </>
    );
}
