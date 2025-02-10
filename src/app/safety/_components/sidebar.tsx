import { useEffect, useState } from "react";

type Props = {
  product: string;
};

export default function Sidebar({ product }: Props) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchFDAData = async () => {
      if (product) {
        try {
          const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
          const response = await fetch(`${baseUrl}/api/fda?product=${encodeURIComponent(product)}`);
          if (!response.ok) {
            throw new Error("Failed to fetch data");
          }
          const result = await response.json();
          setData(result);
        } catch (err: any) {
          setError("Error fetching data: " + err.message);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchFDAData();
  }, [product]);

  return (
    <div className="w-96 border-2 bg-white p-4 rounded-lg shadow-md h-[570px] overflow-y-auto">
      <h2 className="text-lg font-semibold text-gray-700">FDA Data</h2>
      {loading && <p className="text-gray-600 mt-2">Loading...</p>}
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {data && data.results && (
        <div className="mt-2 space-y-4">
          {data.results.map((item: any, index: number) => (
            <div key={index} className="p-4 border rounded-lg shadow-sm bg-gray-50 hover:bg-gray-100">
              <h3 className="text-lg font-medium text-gray-800">{item.firm}</h3>
              <p className="text-sm text-gray-600">{item.date}</p>
              <div className="mt-2">
                <h4 className="font-semibold text-gray-700">Reason:</h4>
                <p className="text-gray-600">{item.reason}</p>
              </div>
              <div className="mt-2">
                <h4 className="font-semibold text-gray-700">Status:</h4>
                <p className="text-gray-600">{item.status}</p>
              </div>
              <div className="mt-2">
                <h4 className="font-semibold text-gray-700">Classification:</h4>
                <p className="text-gray-600">{item.classification}</p>
              </div>
              <div className="mt-2">
                <h4 className="font-semibold text-gray-700">Distribution:</h4>
                <p className="text-gray-600">{item.distribution}</p>
              </div>
              <div className="mt-2">
                <h4 className="font-semibold text-gray-700">Description:</h4>
                <p className="text-gray-600">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
