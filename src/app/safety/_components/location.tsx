import { useEffect, useState } from 'react'
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

type props = {
    product: string,
    city: string, 
    state: string
}


export default function LocationInfo({product, city, state}: props) {
    const [data, setData] = useState({occurrence: 0});
    product = 'carrot'

    useEffect(() => {
        async function postCrowdData() {
            if (product && city && state) {
                const api = 'http://localhost:3000/api/postLocation'
                const options = {method: 'POST', headers: {accept: 'application/json'}, body: JSON.stringify({product_name: product, city: city, state:state})};
                const response = await fetch(api, options)
                const data = await response.json()
            }
        }
        async function getCrowdData() {
            if (product && city && state) {
                const api = `http://localhost:3000/api/getLocation?product_name=${product}&city=${city}&state=${state}`
                const options = {method: 'GET', headers: {accept: 'application/json'}};
                const response = await fetch(api, options)
                const data = await response.json()
                setData(data)
                console.log(data)
            }
        }
        postCrowdData()
        getCrowdData()
     }, [product, city, state]);
    
    return (
        <div className="bg-white p-6 rounded-2xl shadow-lg max-w-md w-full pt-10 border-2">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
                Check Product Availability
            </h2>
    
            {data?.occurrence !== null && (
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
    )
}