import { ChatInputCommandInteraction, SlashCommandBuilder, ChannelType, PermissionFlagsBits } from "discord.js";
import { SlashInteraction } from "../../client/Interfaces/Interactions/SlashInteraction";
import { bot } from "../../client/main";

const TestCommand: SlashInteraction = {
    data: new SlashCommandBuilder()
        .setName("test")
        .setDescription("Testing")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    requireVc: false,
    ownerOnly: true,

    run: async (ctx: ChatInputCommandInteraction, client: bot) => {

        ctx.reply({ content: "Test?" });
    }
}

module.exports = TestCommand;