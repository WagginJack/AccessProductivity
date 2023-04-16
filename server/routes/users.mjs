import express from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";
import { makeAsyncGPT } from "../index.mjs";
const router = express.Router();

// get all users
router.get("/", async (req, res) => {
    let collection = await db.collection("users");
    let results = await collection.find({})
      .limit(50)
      .toArray();
  
    res.send(results).status(200);
  });

// post new user, TODO(): get gpt input and call gpt api, get response
router.post("/", async (req, res) => {
  let collection = await db.collection("users");
  let newDocument = req.body;
  let result = await collection.insertOne(newDocument);
  const response = await makeAsyncGPT(newDocument.gptQuestion);
  return res.send(response).status(204);
  // if(collection.find({email: newDocument.email})) {

  // } else {
  //   newDocument.hasAccess = true
  //   newDocument.count = 0;
  //   newDocument.isAdmin = false;
  //   result = await collection.insertOne(newDocument);
  // }
  res.send(result).status(204);
});
  
export default router;