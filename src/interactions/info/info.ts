import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder, ChannelType, PermissionFlagsBits, Embed } from "discord.js";
import { SlashInteraction } from "../../client/Interfaces/Interactions/SlashInteraction";
import { bot } from "../../client/main";
const version = require("discord.js").version
import os from 'os';
const cpustat = require('cpu-stat');
import * as moment from 'moment';
const { mem, cpu } = require('node-os-utils');
import simpleGit from "simple-git";
import { join } from "path";
import { existsSync } from "fs";

const info: SlashInteraction = {
    data: new SlashCommandBuilder()
        .setName("info")
        .setDescription("Get the bot info"),

    requireVc: false,
    ownerOnly: false,

    run: async (ctx: ChatInputCommandInteraction, client: bot) => {
        if (!existsSync(join(__dirname, "..", "..", "..", ".git"))) return ctx.reply({ content: `❌ • **This command is currently unavailable**`, ephemeral: true });

        cpustat.usagePercent(async function (error: any, percent: any, seconds: any) {
            if (error) {
                return console.error(error)
            }
            const cores = os.cpus().length
            const cpuModel = os.cpus()[0].model
            const guilds = client.bot.guilds.cache.size.toLocaleString()
            const users = client.bot.users.cache.size.toLocaleString()
            const channels = client.bot.channels.cache.size.toLocaleString()
            const node = process.version
            const latency = (Date.now() - ctx.createdTimestamp) / 60;
            let lat = Math.round(latency)
            const uptimeDuration = moment.duration(client.bot.uptime);
            const packageFile = require(join(__dirname, "..", "..", "..", "package.json"));
            const repo = simpleGit();
            const log = await repo.log();
            const lastUpdated = `<t:${Math.floor(new Date(log.all[0].date).getTime() / 1000)}:R>`;

            ctx.reply({
                embeds: [new EmbedBuilder()
                    .setTitle(`My Stats!`)
                    .setColor(0x0099FF)
                    .setDescription(`Credits to [**@Rstacx**](https://github.com/Rstacx) and [**@Siprizer**](https://github.com/Siprizer) for developing me!`)
                    .addFields(
                        { name: `Message Latency`, value: `${lat}ms`, inline: true },
                        { name: `Websocket Latency`, value: `${client.bot.ws.ping}ms`, inline: true },
                        { name: `Repository Info`, value: `> Name: \`${packageFile.name}\` \n> Version: \`v${packageFile.version}-${log.all[0].hash.substring(0, 6)}\`` },
                        { name: `Last Update`, value: lastUpdated, inline: true },
                        { name: "Created on", value: `\`${client.bot.user.createdAt}\``, inline: false },
                        { name: "Guilds", value: `\`${guilds} guilds\``, inline: false },
                        { name: "Users", value: `\`${users} users\``, inline: false },

                        { name: "Channels", value: `\`${channels} channels\``, inline: false },
                        { name: "Discord.js Version", value: `\`v${version}\``, inline: false },
                        { name: "Node.js Version", value: `\`${node}\``, inline: false },
                        { name: "CPU", value: `\`\`\`${os.cpus()[0].model}\`\`\``, inline: false },
                        { name: "Cores", value: `\`\`\`${cores}\`\`\``, inline: false },
                        { name: `Memory Used`, value: `\`${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} / ${(os.totalmem() / 1024 / 1024).toFixed(2)} MB\``, inline: false },
                        { name: "Platform", value: `\`\`\`${os.platform()}\`\`\``, inline: false }
                    )
                    .setThumbnail(client.bot.user.displayAvatarURL({ extension: 'jpg' }))
                ]
            })






        }
        )


    }
}

module.exports = info;