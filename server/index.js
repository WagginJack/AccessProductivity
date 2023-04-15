const { Configuration, OpenAIApi } = require("openai");
const express = require('express');
const app = express();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function makeAsyncGPT(){
  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{role: "user", content: "Hello world"}],
  });
  console.log(completion.data.choices[0].message);
}

app.get('/', (req, res) => {
    res.render('client.ejs');
  });
makeAsyncGPT();
app.listen(3920);
console.log('Server Listening');