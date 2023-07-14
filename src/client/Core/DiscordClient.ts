import { Client, GatewayIntentBits, Events, Collection } from "discord.js";
import { readdirSync } from "fs";
import { join } from "path";
import { SlashInteraction } from "../Interfaces/Interactions/SlashInteraction";

export class DiscordClient extends Client {
    interactions:Collection<string, SlashInteraction>;

    constructor() {
        super({
            intents:[GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates]
        });
        
        this.interactions = new Collection();
    }

    async start() {
        return new Promise(async (resolve, reject) => {
            this.initInteractions();
            await this.connect();
            return resolve(true);
        });
    };

    private initInteractions() {
        readdirSync(join(__dirname, "..", "..", "interactions")).forEach(folder => {
            if (folder === "shared" || folder === "temp" || folder === "slash-sub") return;
            
            readdirSync(join(__dirname, "..", "..", "interactions", folder)).forEach(interaction => {
                const file = require(join(__dirname, "..", "..", "interactions", folder, interaction));
                console.log(`⌨️ • Interaction loaded: "${file.data.name}"`);
                this.interactions.set(file.data.name, file);
            });
        });
    };

    private connect() {
        return new Promise((resolve, reject) => {
            this.login(process.env.DISCORD_TOKEN);
            this.once(Events.ClientReady, e => {
                console.log(`Connected to Discord! Signed in as ${e.user.username} (${e.user.id})`);
                return resolve(true);
            });

            this.on(Events.Debug, e => {
                if (process.env.SHOW_DEBUG) console.log(e);
            });
        });
    };
}