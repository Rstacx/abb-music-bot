import { Embed, EmbedBuilder, User, VoiceChannel } from "discord.js"
import { AudioPlayerError } from "@discordjs/voice"
import { Song } from "../Interfaces/VoiceSession/Song";
import { YouTubePlayList } from "play-dl";

export function errorEmbed(err: string | AudioPlayerError) {
    const embed = new EmbedBuilder()
        .setColor("#d72828")
        .setAuthor({ name: `An error has occurred` })
        .setDescription(`\`${err}\``);
    return embed;
}

export function nowPlayingEmbed(song: Song, voice: VoiceChannel) {
    const embed = new EmbedBuilder()
        .setColor("Blurple")
        .setAuthor({ name: `🎵 • Now Playing` })
        .setDescription(`**[${song.video.title}](${song.video.url})**\n**Requested by:** ${song.user}\n**Duration:** \`${song.video.durationRaw}\``)
        .setThumbnail(song.video.thumbnails[0]?.url)
        .setFooter({ text: `#${voice.name}` });
    return embed;
}

export function addedToQueueEmbed(song: Song, voice: VoiceChannel) {
    const embed = new EmbedBuilder()
        .setColor("Blurple")
        .setAuthor({ name: `🎵 • Added song to queue` })
        .setDescription(`**[${song.video.title}](${song.video.url})**`)
        .setThumbnail(song.video.thumbnails[0].url)
        .setFooter({ text: `#${voice.name}` });
    return embed;
}

export function addedPlaylistToQueueEmbed(playlist: YouTubePlayList, user: User, voice: VoiceChannel) {
    const embed = new EmbedBuilder()
        .setColor("Blurple")
        .setAuthor({ name: `🎵 • Added playlist to queue` })
        .setDescription(`**[${playlist.title}](${playlist.url})**\n**Requested by:**${user.username}\n**Queued:** \`${playlist.videoCount}\` videos`)
        .setThumbnail(playlist.thumbnail.url || null)
        .setFooter({ text: `#${voice.name}` });
    return embed;
};