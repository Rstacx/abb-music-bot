import { ChatInputCommandInteraction, SlashCommandBuilder, ChannelType } from "discord.js";
import { SlashInteraction } from "../../client/Interfaces/Interactions/SlashInteraction";
import { bot } from "../../client/main";

const StopCommand:SlashInteraction = {
    data:new SlashCommandBuilder()
        .setName("stop")
        .setDescription("Stop the currently playing song and leave voice channel"),

    requireVc:true,
    ownerOnly:false,

    run:async(ctx:ChatInputCommandInteraction, client:bot) => {
        if (!ctx.inCachedGuild() || ctx.member.voice.channel.type !== ChannelType.GuildVoice || ctx.channel.type !== ChannelType.GuildText) return;
        
        const connection = client.services.audioSession.fetch(ctx.member.voice.channel, ctx.channel);
        if (!connection) {
            return ctx.reply({content:`🎵 • **There is nothing playing in #${ctx.member.voice.channel.name}**`, ephemeral:true});
        } else {
            connection.kill();
            return ctx.reply({content:`⏹️ • **Playback has stopped**`});
        }
    }   
};

module.exports = StopCommand;