import { ChatInputCommandInteraction, SlashCommandBuilder, ChannelType } from "discord.js";
import { SlashInteraction } from "../../client/Interfaces/Interactions/SlashInteraction";
import { bot } from "../../client/main";

const ConnectCommand:SlashInteraction = {
    data:new SlashCommandBuilder()
        .setName("connect")
        .setDescription("Connect to the voice channel without playing anything"),

    requireVc:true,
    ownerOnly:false,

    run:async(ctx:ChatInputCommandInteraction, client:bot) => {
        if (!ctx.inCachedGuild() || ctx.member.voice.channel.type !== ChannelType.GuildVoice || ctx.channel.type !== ChannelType.GuildText) return;
        const connection = client.services.audioSession.fetch(ctx.member.voice.channel, ctx.channel);
        if (!connection) {
            return ctx.reply({content:`❌ • **Another channel in this server is already using ${client.bot.user.username}**`, ephemeral:true});
        };

        return ctx.reply({content:`🎵 • **${client.bot.user.username} connected to <#${ctx.member.voice.channel.id}>**`});
    }
};

module.exports = ConnectCommand;