import { ChatInputCommandInteraction, SlashCommandBuilder, ChannelType, PermissionFlagsBits } from "discord.js";
import { SlashInteraction } from "../../client/Interfaces/Interactions/SlashInteraction";
import { bot } from "../../client/main";
import schema from '../../client/Utils/models/test'

const TestCommand: SlashInteraction = {
    data: new SlashCommandBuilder()
        .setName("test")
        .setDescription("Testing")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    requireVc: false,
    ownerOnly: true,

    run: async (ctx: ChatInputCommandInteraction, client: bot) => {

        ctx.reply({ content: "Test?" });
        let sh = schema.findOne({ UserID: "982902" })
        if (!sh) {
            schema.create({
                UserID: "982902",
                Status: "test"
            }).then(() => { console.log('done') })
        } else {
            return
        }
    }
}

module.exports = TestCommand;