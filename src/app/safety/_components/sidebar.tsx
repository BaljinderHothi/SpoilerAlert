// components/Sidebar.tsx
import { useEffect, useState } from "react";

export default function Sidebar() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        const fetchFDAData = async () => {
            try {
                const response = await fetch(`/api/fda?product="carrot"`);
                if (!response.ok) {
                    throw new Error("Failed to fetch data");
                }
                const result = await response.json();
                setData(result);
            } catch (err) {
                setError("Error fetching data: " + err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchFDAData();
    }, []);

    return (
        <div className="w-96 bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-gray-700">FDA Data</h2>
            {loading && <p className="text-gray-600 mt-2">Loading...</p>}
            {error && <p className="text-red-500 mt-2">{error}</p>}
            {data && (
                <div className="mt-2 text-gray-600">
                    <pre>{JSON.stringify(data, null, 2)}</pre>
                </div>
            )}
        </div>
    );
}
