import { ChatInputCommandInteraction, SlashCommandBuilder, ChannelType, PermissionFlagsBits, GuildChannel, Role, RoleResolvable } from "discord.js";
import { SlashInteraction } from "../../client/Interfaces/Interactions/SlashInteraction";
import { bot } from "../../client/main";

const Lockcmd: SlashInteraction = {
    data: new SlashCommandBuilder()
        .setName("lock")
        .setDescription("Lock a specific channel")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
        .addChannelOption(option => option
            .setName("channel")
            .setDescription("The channel you want to lock.")
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
            SendMessages: false,
        });
        await ctx.reply({ content: `Successfully locked <#${channel.id}>`, ephemeral: true });

    }
}

module.exports = Lockcmd;