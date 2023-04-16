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
        image: "https://scontent.fmci2-1.fna.fbcdn.net/v/t39.30808-6/336443007_1266216830647431_1634483068566236489_n.jpg?stp=dst-jpg_p526x296&_nc_cat=109&ccb=1-7&_nc_sid=5cd70e&_nc_ohc=dStoDF_SImoAX_E5pHO&_nc_ht=scontent.fmci2-1.fna&oh=00_AfDE1o-2W0mjwMWGOseYZ2jG9V9X3dLS7B3-ZWnLNl3j_Q&oe=643F814C"
      }
    }
  );
  return output

}

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
console.log('Server Listening');