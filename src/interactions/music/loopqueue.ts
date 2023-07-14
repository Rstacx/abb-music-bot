import { ChatInputCommandInteraction, SlashCommandBuilder, ChannelType } from "discord.js";
import { SlashInteraction } from "../../client/Interfaces/Interactions/SlashInteraction";
import { bot } from "../../client/main";

const LoopQueueCommand:SlashInteraction = {
    data:new SlashCommandBuilder()
        .setName("loopqueue")
        .setDescription("Loop the current queue"),

    requireVc:true,

    run:async(ctx:ChatInputCommandInteraction, client:bot) => {
        if (!ctx.inCachedGuild() || ctx.member.voice.channel.type !== ChannelType.GuildVoice || ctx.channel.type !== ChannelType.GuildText) return;
        
        const connection = client.services.audioSession.fetch(ctx.member.voice.channel, ctx.channel);
        if (!connection) {
            return ctx.reply({content:`🎵 • **There is nothing playing in #${ctx.member.voice.channel.name}**`, ephemeral:true});
        };

        const loopRequest = connection.toggleLoopQueue();
        await ctx.reply({content:`${(loopRequest === "LOOPING") ? '🔂 • **Now looping the queue**' : '🔂 • **The queue is no longer looping**'}`});
    }
}

module.exports = LoopQueueCommand;