import { ChannelType, ChatInputCommandInteraction, Embed, EmbedBuilder } from "discord.js";
import { AddQueueOptions } from "../../Interfaces/VoiceSession/AddQueueOptions";
import { VoiceSession } from "../../Services/Audio/VoiceSession";
import { bot } from "../../main";
import { addedToQueueEmbed } from "../VoiceSessionEmbeds";

export default async (client:bot, ctx:ChatInputCommandInteraction, connection:VoiceSession, query:string, options:AddQueueOptions) => {
    if (!ctx.inCachedGuild() || ctx.member.voice.channel.type !== ChannelType.GuildVoice) return;
    
    try {
        const song = await connection.addToQueue(query, ctx.user, options);
        await ctx.followUp({embeds:[addedToQueueEmbed(song, ctx.member.voice.channel)]});
    } catch (err) {
        return client.errors.post(ctx, err);
    }
};