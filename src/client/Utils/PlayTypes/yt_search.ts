import { ChatInputCommandInteraction, ChannelType } from "discord.js";
import { bot } from "../../main";
import { AddQueueOptions } from "../../Interfaces/VoiceSession/AddQueueOptions";
import { search } from "play-dl";
import { VoiceSession } from "../../Services/Audio/VoiceSession";
import { addedToQueueEmbed } from "../VoiceSessionEmbeds";

export default async (client:bot, ctx:ChatInputCommandInteraction, connection:VoiceSession, query:string, options:AddQueueOptions) => {
    if (!ctx.inCachedGuild() || ctx.member.voice.channel.type !== ChannelType.GuildVoice) return;

    try {
        const results = await search(query, {source:{"youtube":"video"}});
        if (results.length >= 1) {
            const song = await connection.addToQueue(results[0].url, ctx.user, options);
            await ctx.followUp({embeds:[addedToQueueEmbed(song, ctx.member.voice.channel)]});
        } else {
            await ctx.followUp({content:`❌ • **No results were found for your search**`});
        };
    } catch (err) {
        return client.errors.post(ctx, err);
    }
};