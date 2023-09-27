import {
    ChatInputCommandInteraction,
    SlashCommandBuilder,
    ChannelType,
    EmbedBuilder
} from "discord.js";
import { SlashInteraction } from "../../client/Interfaces/Interactions/SlashInteraction";
import { bot } from "../../client/main";
const {
    inspect
} = require(`util`);
const RunEval: SlashInteraction = {
    data: new SlashCommandBuilder()
        .setName("eval")
        .setDescription("Run eval")
        .addStringOption(option => option
            .setName("code")
            .setDescription("Enter code to eval")
            .setRequired(true)),
    requireVc: false,
    ownerOnly: true,

    run: async (ctx: ChatInputCommandInteraction, client: bot) => {
        try {
            const { options } = ctx
            const code = ctx.options.getString(`code`)
            let output = await eval(code);
            const token = client.bot.token.split("").join("[^]{0,2}");
            const rev = client.bot.token.split("").reverse().join("[^]{0,2}");
            const filter = new RegExp(`${token}|${rev}`, "g");
            if (output instanceof Promise || (Boolean(output) && typeof output.then === "function" && typeof output.catch === "function")) output = await output;

            output = inspect(output, { depth: 0, maxArrayLength: null });

            output = output.replace(filter, "\\\\Are you that down bad to get my token?\\\\");
            let string = output;
            let evalEmbed = new EmbedBuilder()
                .setTitle(`<a:cmd:993185034473324595> Eval`)
                .setColor(0x0099FF);
            evalEmbed.setDescription(`\`\`\`` + string + `\`\`\``);
            ctx.reply({
                embeds: [evalEmbed]
            });
        } catch (err) {
            console.log(err)


            ctx.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle(`Error`)
                        .setDescription(`There was an error.`)
                        .setColor(`#FF6347`)
                ]
            })
        }
        /*
                ctx.reply({
                    content: 'Still has issues'
                })
                */
    }

}

module.exports = RunEval;