import dotenv from "dotenv";
dotenv.config();

import { REST, Routes } from "discord.js";
import { readdirSync } from "fs";
import { join } from "path";

const rest = new REST().setToken(process.env.DISCORD_TOKEN || "");

if (process.argv[2] === "register") {
    const interactions:Array<Object> = [];

    readdirSync(join(__dirname, "interactions")).forEach(folder => {
        if (folder === "shared" || folder === "temp" || folder === "slash-sub") return;
        
        readdirSync(join(__dirname, "interactions", folder)).forEach(interaction => {
            const file = require(join(__dirname, "interactions", folder, interaction));
            console.log(`💬 • Interaction loaded: "${file.data.name}"`);
            interactions.push(file.data.toJSON());
        });
    });

    (async () => {
        try {
            console.log(`Deploying ${interactions.length} interactions...`);

            await rest.put((process.env.DEBUG_GUILD) ? 
                Routes.applicationGuildCommands(process.env.DISCORD_APPID || "", process.env.DEBUG_GUILD || "")
                :
                Routes.applicationCommands(process.env.DISCORD_APPID || ""),
                {body:interactions}
            )

            console.log(`Deployed ${interactions.length} interactions ${(process.env.DEBUG_GUILD) ? 'in guild:' + process.env.DEBUG_GUILD : "globally"} successfully!`);
        } catch (err) {
            console.error(err);
        };
    })();
}
else if (process.argv[2] === "deregister") 
{
    (async () => {
        try {
            console.log(`Deregistering all interactions...`);

            await rest.put((process.env.DEBUG_GUILD) ? 
                Routes.applicationGuildCommands(process.env.DISCORD_APPID || "", process.env.DEBUG_GUILD || "")
                :
                Routes.applicationCommands(process.env.DISCORD_APPID || ""),
                {body:[]}
            );

            console.log(`Deregisted all interactions ${(process.env.DEBUG_GUILD) ? 'in guild' + process.env.DEBUG_GUILD : "globally"} successfully!`);
        } catch (err) {
            return console.error(err);
        }
    })();
}