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

export async function POST(request: Request) {
  try {
    const connectedClient = await connect();
    
    if (!connectedClient) {
      return NextResponse.json({ error: "Failed to connect to the database" }, { status: 500 });
    }

    const body: Omit<DBEntry, 'occurrence'> = await request.json();

    // Validate the incoming data
    if (!body.product_name || !body.city || !body.state) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const db = connectedClient.db("spoilerDB");
    const collection = db.collection("recalls");

    // Check if the document already exists
    const existingEntry = await collection.findOne({
      product_name: body.product_name,
      city: body.city,
      state: body.state
    });

    let result;
    
    if (existingEntry) {
      // If the entry exists, increment the occurrence count
      result = await collection.updateOne(
        { _id: existingEntry._id }, 
        { $inc: { occurrence: 1 } }
      );
    } else {
      // If no entry exists, insert a new document with occurrence = 1
      result = await collection.insertOne({ ...body, occurrence: 1 });
    }

    return NextResponse.json({
      message: existingEntry ? "Existing document updated" : "New document inserted",
      document: result,
    });

  } catch (error) {
    console.error("Error inserting/updating document:", error);
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
