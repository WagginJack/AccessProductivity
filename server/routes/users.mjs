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
  let isDuplicate = await collection.findOne({email: newDocument.email})
  let result = {}
  let userInfo = {}
  
  if(isDuplicate) {
    console.log('Duplicate spotted')
    collection.updateOne({email: newDocument.email}, {$inc: {count: 1}})
  } else {
    userInfo.email = newDocument.email
    userInfo.hasAccess = true
    userInfo.count = 0;
    userInfo.isAdmin = false;
    userInfo.wantsHeaders = true
    userInfo.wantsCaptions = true
    userInfo.wantsEmailGen = true
    result = await collection.insertOne(userInfo);
  }
  const response = await makeAsyncGPT(newDocument.gptQuestion);
  return res.json(response.replaceAll('\n','')).status(204);
});

router.post("/profile", async (req, res) => {
  let collection = await db.collection("users");
  let newDocument = req.body;
  let doesExist = await collection.findOne({email: newDocument.email})
  let result = {}
  
  if(doesExist) {
    collection.updateOne({email: newDocument.email},
      { $set: {wantsHeaders: newDocument.wantsHeaders,
        wantsCaptions: newDocument.wantsCaptions,
        wantsEmailGen: newDocument.wantsEmailGen}
      })
  } else {
    console.log('Not logged in')
  }
  return res.send(result).status(204);
})
export default router;