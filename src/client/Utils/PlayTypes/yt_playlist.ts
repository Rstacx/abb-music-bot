import { ChatInputCommandInteraction, ChannelType } from "discord.js";
import { bot } from "../../main";
import { VoiceSession } from "../../Services/Audio/VoiceSession";
import { playlist_info } from "play-dl";
import { addedPlaylistToQueueEmbed } from "../VoiceSessionEmbeds";

export default async (client:bot, ctx:ChatInputCommandInteraction, connection:VoiceSession, query:string) => {
    if (!ctx.inCachedGuild() || ctx.member.voice.channel.type !== ChannelType.GuildVoice) return;
    try {
        const playlist = await playlist_info(query, {incomplete:true});
        if (playlist.videoCount >= 1) {
            await connection.batchAddToQueue(playlist, ctx.user);
            await ctx.followUp({embeds:[addedPlaylistToQueueEmbed(playlist, ctx.user, ctx.member.voice.channel)]});
        } else {
            return client.errors.post(ctx, "Something went wrong while adding this playlist to the queue");
        };
    } catch (err) {
        return client.errors.post(ctx, err);
    }
};