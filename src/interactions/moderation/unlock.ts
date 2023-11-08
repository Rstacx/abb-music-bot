import { ChatInputCommandInteraction, SlashCommandBuilder, ChannelType, PermissionFlagsBits, GuildChannel, Role, RoleResolvable } from "discord.js";
import { SlashInteraction } from "../../client/Interfaces/Interactions/SlashInteraction";
import { bot } from "../../client/main";

const Unlockcmd: SlashInteraction = {
    data: new SlashCommandBuilder()
        .setName("unlock")
        .setDescription("Unlock a specific channel")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
        .addChannelOption(option => option
            .setName("channel")
            .setDescription("The channel you want to unlock.")
            .setRequired(false)),

    requireVc: false,
    ownerOnly: false,

    run: async (ctx: ChatInputCommandInteraction, client: bot) => {
        const chan = ctx.options.getChannel("channel") || ctx.channel
        const everyone: Role | undefined = ctx.guild?.roles.cache.find(
            (r) => r.name === "@everyone",
        );
        let channel: GuildChannel = ctx.options.getChannel("channel") as GuildChannel;
        if (!channel) (channel as typeof ctx.channel) = ctx.channel;
        await channel.permissionOverwrites.edit(everyone as RoleResolvable, {
            SendMessages: true,
        });
        await ctx.reply({ content: `Successfully unlocked <#${channel.id}>`, ephemeral: true });

    }
}

module.exports = Unlockcmd;