import "./loadEnvironment.mjs"
import { Configuration, OpenAIApi } from "openai";
import cors from "cors";
import express from 'express';
import users from "./routes/users.mjs";
import Replicate from "replicate";


const app = express();
const PORT = process.env.PORT || 5050;
app.use(cors());
app.use(express.json());
app.use("/users", users);


const configuration = new Configuration({
  apiKey: process.env.OPEN_API_KEY,
});

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_KEY,
});

const openai = new OpenAIApi(configuration);

export async function makeAsyncGPT(data){
  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{role: "user", content: data}],
    max_tokens: 4097 - parseInt(data.length/4) -100,
  });
  console.log(completion.data.choices[0].message);
  return completion.data.choices[0].message.content
}

export async function makeAsyncReplicate(data){

  const output = await replicate.run(
    "salesforce/blip:2e1dddc8621f72155f24cf2e0adbde548458d3cab9f00c0139eea840d0ac4746",
    {
      input: {
        image: data.img
      }
    }
  );
  return output

}

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
console.log('Server Listening');