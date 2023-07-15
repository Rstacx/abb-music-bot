import { ChatInputCommandInteraction, SlashCommandBuilder, ChannelType } from "discord.js";
import { SlashInteraction } from "../../client/Interfaces/Interactions/SlashInteraction";
import { bot } from "../../client/main";

const LoopTrackCommand:SlashInteraction = {
    data:new SlashCommandBuilder()
        .setName("loop")
        .setDescription("Loop the currently playing song"),

    requireVc:true,
    ownerOnly:false,

    run:async(ctx:ChatInputCommandInteraction, client:bot) => {
        if (!ctx.inCachedGuild() || ctx.member.voice.channel.type !== ChannelType.GuildVoice || ctx.channel.type !== ChannelType.GuildText) return;
        
        const connection = client.services.audioSession.fetch(ctx.member.voice.channel, ctx.channel);
        if (!connection) {
            return ctx.reply({content:`🎵 • **There is nothing playing in #${ctx.member.voice.channel.name}**`, ephemeral:true});
        };

        const loopRequest = connection.toggleLoopTrack();
        await ctx.reply({content:`${(loopRequest === "LOOPING") ? '🔂 • **Now looping the current song**' : '🔂 • **The current song is no longer looping**'}`});
    }
}

module.exports = LoopTrackCommand;