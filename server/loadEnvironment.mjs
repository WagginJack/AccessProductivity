import dotenv from "dotenv";

dotenv.config({ path: `.env.${process.env.NODE_ENV}` })
console.log(`./.env.${process.env.NODE_ENV}`)