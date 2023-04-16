import express from "express";
//import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";
import { makeAsyncGPT } from "../index.mjs";
const router = express.Router();

// get all users
router.get("/", async (req, res) => {
    //let collection = await db.collection("users");
    /*let results = await collection.find({})
      .limit(50)
      .toArray();
  
    res.send(results).status(200);*/
  });

// post new user, TODO(): get gpt input and call gpt api, get response
router.post("/", async (req, res) => {
  //let collection = await db.collection("users");
  let newDocument = req.body;
  let q = await collection.findOne({email: newDocument.email})
  let result = {}
  console.log("email:", newDocument.email)
  console.log(q)
  if(q) {
    console.log('Duplicate spotted')
  } else {
    newDocument.hasAccess = true
    newDocument.count = 0;
    newDocument.isAdmin = false;
    result = await collection.insertOne(newDocument);
  }
  //let result = await collection.insertOne(newDocument);
  const response = await makeAsyncGPT(newDocument.gptQuestion);
  return res.json(response.replaceAll('\n','')).status(204);
});
  
export default router;