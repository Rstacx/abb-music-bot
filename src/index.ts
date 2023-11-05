// -- Init environment variables
import dotenv from "dotenv";
import { join } from "path";
dotenv.config({ path: join(__dirname, "..", ".env") });

// -- Init console log
console.log(`${require("../package.json").name} [v${require("../package.json").version}] -- Starting up -- `);

// -- Import client
import { bot } from "./client/main";
new bot();