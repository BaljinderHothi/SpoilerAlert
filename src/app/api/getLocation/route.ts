import { NextResponse } from 'next/server';
import { MongoClient, ServerApiVersion } from 'mongodb';

const uri = `mongodb+srv://${process.env.mongo_user}:${process.env.mongo_password}@spoileralertprod.d5ujk.mongodb.net/?retryWrites=true&w=majority&appName=SpoilerAlertProd`;

// Create a MongoClient instance
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

interface DBEntry {
  product_name: string;
  city: string;
  state: string;
  occurrence: number;
}

export async function GET(request: Request) {
  try {
    // Get the query parameters from the URL
    const url = new URL(request.url);
    const productName = url.searchParams.get('product_name');
    const city = url.searchParams.get('city');
    const state = url.searchParams.get('state');

    // Validate the parameters
    if (!productName || !city || !state) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }

    const connectedClient = await connect();
    if (!connectedClient) {
      return NextResponse.json({ error: "Failed to connect to the database" }, { status: 500 });
    }

    const db = connectedClient.db("spoilerDB");
    const collection = db.collection("recalls");

    // Find the document based on the query parameters
    const result = await collection.findOne({
      product_name: productName,
      city: city,
      state: state
    });

    if (!result) {
      return NextResponse.json({ error: "Entry not found" }, { status: 404 });
    }

    // Return the document if found
    return NextResponse.json(result);

  } catch (error) {
    console.error("Error fetching document:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  } finally {
    await client.close();
  }
}

async function connect() {
  try {
    await client.connect();
    console.log("Connected to the database");
    return client;
  } catch (e) {
    console.error("Database connection error:", e);
    return null;
  }
}
