import { ChannelType, ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { SlashInteraction } from "../../client/Interfaces/Interactions/SlashInteraction";
import { bot } from "../../client/main";
import { validate } from "play-dl";
import { AddQueueOptions } from "../../client/Interfaces/VoiceSession/AddQueueOptions";

// -- play types
import yt_video from "../../client/Utils/PlayTypes/yt_video";
import yt_search from "../../client/Utils/PlayTypes/yt_search";
import yt_playlist from "../../client/Utils/PlayTypes/yt_playlist";

const PlayCommand:SlashInteraction = {
    data:new SlashCommandBuilder()
        .setName("play")
        .setDescription("Add a song to the queue")
        .addStringOption(option => option
            .setName("video")
            .setDescription("Enter a URL or search query for a song you want to queue")
            .setRequired(true))
        .addStringOption(option => option
            .setName("queue_option")
            .setDescription("How do you want to queue this song?")
            .addChoices(
                {name:"Add to the top of the queue", value:"PLAYTOP"},
                {name:"Skip current song and play now", value:"PLAYSKIP"}
            )),
    requireVc:true,
    ownerOnly:false,

    run:async (ctx:ChatInputCommandInteraction, client:bot) => {
        if (!ctx.inCachedGuild() || ctx.member.voice.channel.type !== ChannelType.GuildVoice || ctx.channel.type !== ChannelType.GuildText) return;
        
        const connection = client.services.audioSession.fetch(ctx.member.voice.channel, ctx.channel);
        if (!connection) {
            return ctx.reply({content:`❌ • **Another channel in this server is already using ${client.bot.user.username}**`, ephemeral:true});
        };

        await ctx.deferReply();

        const query = ctx.options.getString("video");
        const queueOption = ctx.options.getString("queue_option");
        
        const options:AddQueueOptions = {
            playTop:false,
            playSkip:false
        };

        if (queueOption === "PLAYTOP") options.playTop = true;
        if (queueOption === "PLAYSKIP") {
            options.playSkip = true;
            options.playTop = true;
        };

        const type = await validate(query);

        switch(type) {
            case "yt_video":
                yt_video(client, ctx, connection, query, options);
                break;
            case "yt_playlist":
                yt_playlist(client, ctx, connection, query);
                break;
            case "search":
                yt_search(client, ctx, connection, query, options);
                break;
            default:
                await ctx.followUp({content:`❌ • **This URL wasn't recognised. Only YouTube video/playlist URLs are accepted.**`});
        }
    }
};

module.exports = PlayCommand;