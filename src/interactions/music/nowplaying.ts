import { ChatInputCommandInteraction, SlashCommandBuilder, ChannelType, EmbedBuilder } from "discord.js";
import { SlashInteraction } from "../../client/Interfaces/Interactions/SlashInteraction";
import { bot } from "../../client/main";

const NowPlayingCommand: SlashInteraction = {
    data: new SlashCommandBuilder()
        .setName("nowplaying")
        .setDescription("View the currently playing song"),

    requireVc: true,
    ownerOnly: false,

    run: async (ctx: ChatInputCommandInteraction, client: bot) => {
        if (!ctx.inCachedGuild() || ctx.member.voice.channel.type !== ChannelType.GuildVoice || ctx.channel.type !== ChannelType.GuildText) return;

        const connection = client.services.audioSession.fetch(ctx.member.voice.channel, ctx.channel);
        if (!connection) {
            return ctx.reply({ content: `🎵 • **There is nothing playing in #${ctx.member.voice.channel.name}**`, ephemeral: true });
        };

        const song = connection.getNowPlaying();
        const queue = connection.getQueue();

        if (song) {
            const duration = connection.getDuration();
            const loopTrack = connection.getLoopTrack();
            const embed = new EmbedBuilder()
                .setColor("Blurple")
                .setAuthor({ name: `🎵 • Now Playing` })
                .setDescription(`**[${song.video.title}](${song.video.url})**\n**Requested by:** ${song.user}\n**Duration:** \`${duration.playback}\`/\`${duration.total}\``)
                .setThumbnail(song.video.thumbnails[0]?.url)
                .setFooter({ text: `#${ctx.member.voice.channel.name} ${(loopTrack) ? '• 🔂 Loop track enabled' : ''}` });

            if (queue && queue.length >= 1) {
                const nextSong = queue[0];
                embed.addFields({
                    name: `Coming up`,
                    value: `**[${nextSong.video.title}](${nextSong.video.url})**\n**Requested by:** ${nextSong.user}\n**Duration:** \`${nextSong.video.durationRaw}\``
                })
            }

            return ctx.reply({ embeds: [embed] });
        } else {
            return ctx.reply({ content: `🎵 • **There is nothing playing in #${ctx.member.voice.channel.name}**`, ephemeral: true });
        }
    }
};

module.exports = NowPlayingCommand;