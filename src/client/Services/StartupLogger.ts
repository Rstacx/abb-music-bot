import { Service } from "../Structures/Service";
import { bot } from "../main";

import simpleGit from "simple-git";
import { join } from "path";
import { EmbedBuilder } from "discord.js";
import { existsSync } from "fs";

export class StartupLogger extends Service {
    constructor(client: bot) {
        super("Startup Logger");
        this.postLog(client);
    }

    async postLog(client: bot) {
        if (!existsSync(join(__dirname, "..", "..", "..", ".git"))) return;

        const packageFile = require(join(__dirname, "..", "..", "..", "package.json"));
        const repo = simpleGit();
        const log = await repo.log();
        const bootTime = `<t:${Math.floor(new Date().getTime() / 1000)}:R>`;
        const lastUpdated = `<t:${Math.floor(new Date(log.all[0].date).getTime() / 1000)}:R>`;

        const embed = new EmbedBuilder()
            .setColor("Blurple")
            .setAuthor({ name: `${client.bot.user.username} is now online!`, iconURL: client.bot.user.displayAvatarURL() })
            .addFields([
                { name: "Started", value: bootTime },
                { name: "Currently running", value: `\`${packageFile.name} v${packageFile.version}-${log.all[0].hash.substring(0, 6)}\`` },
                { name: "Last updated", value: lastUpdated }
            ]);

        if (process.env.LOG_CHANNEL_ID) {
            const channel: any = await client.bot.channels.fetch(process.env.LOG_CHANNEL_ID);
            await channel.send({ embeds: [embed] });
        }else{
            return
        }
    }
}