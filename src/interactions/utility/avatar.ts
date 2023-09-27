import { ChatInputCommandInteraction, SlashCommandBuilder, ChannelType, EmbedBuilder } from "discord.js";
import { SlashInteraction } from "../../client/Interfaces/Interactions/SlashInteraction";
import { bot } from "../../client/main";

const CheckAvatar: SlashInteraction = {
    data: new SlashCommandBuilder()
        .setName("avatar")
        .setDescription("Check a user's avatar")
        .addUserOption(option => option
            .setName("user")
            .setDescription("Enter a user to get their avatar")
            .setRequired(false)),

    requireVc: false,
    ownerOnly: false,

    run: async (ctx: ChatInputCommandInteraction, client: bot) => {
      
        const targetId = ctx.options.getUser("user") || ctx.user
        const user = await client.bot.users.fetch(targetId);
       await ctx.reply({
            embeds: [new EmbedBuilder()
                .setTitle(`${user.username}'s avatar`)
                .addFields({
                    name: `<:avatar:1007290615479930880> PNG`,
                    value: `[**\`Download\`**](${user.displayAvatarURL({ extension: "png" })})`,
                    inline: true
                }, {
                    name: `<:avatar:1007290615479930880> JPEG`,
                    value: `[**\`Download\`**](${user.displayAvatarURL({ extension: "jpg" })})`,
                    inline: true
                }, {
                    name: `<:avatar:1007290615479930880> WEBP`,
                    value: `[**\`Download\`**](${user.displayAvatarURL({ extension: "webp" })})`,
                    inline: true
                })
                .setColor(0x0099FF)
                .setImage(user.displayAvatarURL({ size: 4096 }))
                .setTimestamp()]
        });
    }
}

module.exports = CheckAvatar;