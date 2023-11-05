import { ChatInputCommandInteraction, SlashCommandBuilder, ChannelType, PermissionFlagsBits, TextChannel, EmbedBuilder } from "discord.js";
import { SlashInteraction } from "../../client/Interfaces/Interactions/SlashInteraction";
import { bot } from "../../client/main";

const Clearcmd: SlashInteraction = {
    data: new SlashCommandBuilder()
        .setName('clearmsgs')
        .setDescription('Clear messages in channel')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .addIntegerOption(option => option
            .setName('number')
            .setDescription('The amount of messages to clear')
            .setRequired(true)),

    requireVc: false,
    ownerOnly: false,

    run: async (ctx: ChatInputCommandInteraction, client: bot) => {
        const num = ctx.options.getInteger(`number`);
        const channel = ctx.channel;
        if (num > 1000) {
            ctx.reply({ content: `You can only clear **1000** messages at a time` })
        } else {
            await (channel as TextChannel).bulkDelete(num, true);
            await ctx.reply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription('Complete')
                ]
            });

        }


    }
}

module.exports = Clearcmd;