'use client'
import { useState, useEffect } from "react";

export default function getLocationData() {
    const [latitude, setLatitude] = useState(0);
    const [longitude, setLongitude] = useState(0);
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const ACCESS_TOKEN = process.env.NEXT_PUBLIC_access_token;
    if (!ACCESS_TOKEN) {
        console.error("API key is missing. Make sure it's prefixed with NEXT_PUBLIC_");
        return { data: null, loading: false, error: "API key is missing" };
    }

    useEffect(() => {
        if (!navigator.geolocation) {
            setError("Geolocation is not supported by your browser.");
            setLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const long = position.coords.longitude;
                setLatitude(lat);
                setLongitude(long);
            },
            () => {
                setError("Unable to retrieve your location.");
                setLoading(false);
            }
        );
    }, []);

    useEffect(() => {
        async function getUserLocationData() {
            if (latitude && longitude) {
                try {
                    setLoading(true);
                    const api = `https://us1.locationiq.com/v1/reverse?format=json&key=${ACCESS_TOKEN}&lat=${latitude}&lon=${longitude}`;
                    const response = await fetch(api);
                    const result = await response.json();
                    setData(result);
                    console.log("Location data:", result);
                } catch (err) {
                    setError("Failed to fetch location data.");
                    console.error(err);
                } finally {
                    setLoading(false);
                }
            }
        }
        getUserLocationData();
    }, [latitude, longitude]);

    return { data, loading, error };
}
