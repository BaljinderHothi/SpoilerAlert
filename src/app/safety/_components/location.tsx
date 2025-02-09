import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import getLocationData from '../actions'

type Props = {
    product: string;
};

const url = 'http://spoileralert.nyc'

export default function LocationInfo({ product }: Props) {
    const [data, setData] = useState<{ occurrence: number | null }>({ occurrence: null });
    const { data: locationData, loading, error } = getLocationData();
    const city = locationData?.address?.suburb;
    const state = locationData?.address?.state;
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        if (city && state) {
            setIsReady(true);
        }
    }, [city, state]);

    useEffect(() => {
        async function postCrowdData() {
            if (product && city && state) {
                const api = `/api/postLocation`;
                const options = {
                    method: "POST",
                    headers: { accept: "application/json" },
                    body: JSON.stringify({ product_name: product, city, state }),
                };
                await fetch(api, options);
            }
        }

        async function getCrowdData() {
            if (product && city && state) {
                const api = `/api/getLocation?product_name=${product}&city=${city}&state=${state}`;
                const options = { method: "GET", headers: { accept: "application/json" } };
                const response = await fetch(api, options);
                const result = await response.json();
                setData(result);
                console.log(result);
            }
        }

        if (isReady) {
            postCrowdData();
            getCrowdData();
        }
    }, [product, city, state, isReady]);

    return (
        <div className="bg-white p-6 rounded-2xl shadow-lg max-w-md w-full pt-10 border-2">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
                Check Product Availability
            </h2>

            {loading && <p className="text-center text-gray-500">Fetching location...</p>}
            {error && <p className="text-center text-red-500">{error}</p>}

            {isReady && data?.occurrence !== null && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <Card className="mt-4 text-center">
                        <CardContent className="p-4">
                            <p className="text-lg font-medium">
                                {data?.occurrence > 0
                                    ? `Found ${data?.occurrence} occurrences of "${product}" in ${city}, ${state}.`
                                    : `No occurrences of "${product}" found in ${city}, ${state}.`}
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>
            )}
        </div>
    );
}
