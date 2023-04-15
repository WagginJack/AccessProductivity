import "./loadEnvironment.mjs"
import { Configuration, OpenAIApi } from "openai";
import cors from "cors";
import express from 'express';
import users from "./routes/users.mjs";

const app = express();
const PORT = process.env.NODE_ENV.PORT || 5050;
app.use(cors());
app.use(express.json());
app.use("/users", users);


const configuration = new Configuration({
  apiKey: process.env.NODE_ENV.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function makeAsyncGPT(){
  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{role: "user", content: "Hello world"}],
  });
  console.log(completion.data.choices[0].message);
}

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
console.log('Server Listening');