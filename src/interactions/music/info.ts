import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { SlashInteraction } from "../../client/Interfaces/Interactions/SlashInteraction";
import { bot } from "../../client/main";

import simpleGit from "simple-git";
import { join } from "path";
import { existsSync } from "fs";

const InfoCommand:SlashInteraction = {
    data:new SlashCommandBuilder()
        .setName("info")
        .setDescription("View bot information"),
    requireVc:false,
    ownerOnly:false,

    run:async (ctx:ChatInputCommandInteraction, client:bot) => {
        if (!existsSync(join(__dirname, "..", "..", "..", ".git"))) return ctx.reply({content:`❌ • **This command is currently unavailable**`, ephemeral:true});
        
        await ctx.deferReply();

        const packageFile = require(join(__dirname, "..", "..", "..", "package.json"));
        const repo = simpleGit();
        const log = await repo.log();
        const lastUpdated = `<t:${Math.floor(new Date(log.all[0].date).getTime()/1000)}:F>`;

        const embed = new EmbedBuilder()
            .setColor("Blurple")
            .setAuthor({name:`${client.bot.user.username} bot information`, iconURL:client.bot.user.displayAvatarURL()})
            .addFields([
                {name:"Currently running", value:`\`${packageFile.name} v${packageFile.version}-${log.all[0].hash.substring(0,6)}\``},
                {name:"Last updated", value:lastUpdated},
                {name:"Developed by", value:`[@Rstacx](https://github.com/Rstacx) \n [@Siprizer](https://github.com/Siprizer)`}
            ]);
        
        await ctx.followUp({embeds:[embed]});
    }
};

module.exports = InfoCommand;