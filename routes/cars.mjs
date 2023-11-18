import express from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";

const router = express.Router();

// Get a list of all cars
router.get("/", async (req, res) => {
  try {
    let collection = await db.collection("cars");
    let results = await collection.find({}).toArray();

    res.send(results).status(200);
  } catch (error) {
    console.error("Error to read collection:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Get a single car
router.get("/:id", async (req, res) => {
  try {
    let collection = await db.collection("cars");
    let query = { _id: new ObjectId(req.params.id) };
    let result = await collection.findOne(query);
    if (!result) {
      res.send("Not found").status(404);
    } else {
      res.send(result).status(200);
    }
  } catch (error) {
    console.error("Error to read document:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Add a new document (car) to the collection
router.post("/", async (req, res) => {
  try {
    let collection = await db.collection("cars");
    let newDocument = req.body;
    
    newDocument.created = new Date();
    let result = await collection.insertOne(newDocument);
    res.send(result).status(204);
  } catch (error) {
    console.error("Error to write on database", error);
    res.status(500).send("Internal Server Error");
  }
});

export default router;
