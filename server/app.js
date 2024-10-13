const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://2usttg4:20191028eu!@cluster0.7t5yp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    console.log("Connected to MongoDB Atlas");
    // 데이터베이스 작업 수행
  } finally {
    await client.close();
  }
}

run().catch(console.dir);
