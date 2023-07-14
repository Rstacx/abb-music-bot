import { ChatInputCommandInteraction, SlashCommandBuilder, ChannelType } from "discord.js";
import { SlashInteraction } from "../../client/Interfaces/Interactions/SlashInteraction";
import { bot } from "../../client/main";

const SkipCommand:SlashInteraction = {
    data:new SlashCommandBuilder()
        .setName("skip")
        .setDescription("Skip the currently playing song"),

    requireVc:true,

    run:async(ctx:ChatInputCommandInteraction, client:bot) => {
        if (!ctx.inCachedGuild() || ctx.member.voice.channel.type !== ChannelType.GuildVoice || ctx.channel.type !== ChannelType.GuildText) return;
        
        const connection = client.services.audioSession.fetch(ctx.member.voice.channel, ctx.channel);
        if (!connection) {
            return ctx.reply({content:`🎵 • **There is nothing playing in #${ctx.member.voice.channel.name}**`, ephemeral:true});
        };

        connection.skip();
        await ctx.reply({content:`⏭️ • **Skipped to the next song in the queue**`});
    }
};

module.exports = SkipCommand;