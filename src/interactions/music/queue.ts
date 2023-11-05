import { ChatInputCommandInteraction, SlashCommandBuilder, ChannelType, EmbedBuilder } from "discord.js";
import { SlashInteraction } from "../../client/Interfaces/Interactions/SlashInteraction";
import { bot } from "../../client/main";

const QueueCommand: SlashInteraction = {
    data: new SlashCommandBuilder()
        .setName("queue")
        .setDescription("View the current queue"),

    requireVc: true,
    ownerOnly: false,

    run: async (ctx: ChatInputCommandInteraction, client: bot) => {
        if (!ctx.inCachedGuild() || ctx.member.voice.channel.type !== ChannelType.GuildVoice || ctx.channel.type !== ChannelType.GuildText) return;

        const connection = client.services.audioSession.fetch(ctx.member.voice.channel, ctx.channel);
        if (!connection) {
            return ctx.reply({ content: `🎵 • **There is nothing playing in #${ctx.member.voice.channel.name}**`, ephemeral: true });
        };

        const nowPlaying = connection.getNowPlaying();
        const queue = connection.getQueue();

        if (!nowPlaying) {
            return ctx.reply({ content: `🎵 • **There is nothing playing in #${ctx.member.voice.channel.name}**`, ephemeral: true });
        };

        const embed = new EmbedBuilder()
            .setColor("Blurple")
            .setAuthor({ name: `🎵 • #${ctx.member.voice.channel.name} queue` })
            .setDescription(`__Now Playing__\n**[${nowPlaying.video.title}](${nowPlaying.video.url})**\n**Requested by:** ${nowPlaying.user}\n**Duration:** \`${nowPlaying.video.durationRaw}\`${queue.length >= 1 ? '\n\n__Coming Up__' : ''}`)
            .setThumbnail(nowPlaying.video.thumbnails[0].url || null);

        if (connection.getLoopQueue()) embed.setFooter({ text: `🔁 • Loop queue enabled` })

        if (queue && queue.length >= 1) {
            let pos = 0;
            const shortQueue = queue.slice(0, 10);
            shortQueue.map(song => {
                embed.addFields({
                    name: `#${pos += 1}. ${song.video.title} | \`${song.video.durationRaw}\``,
                    value: `**Requested by:** ${song.user}`
                })
            });
            if (queue.length > 10) embed.setFooter({ text: `and ${queue.length - 10} more... ${(connection.getLoopQueue() ? '• 🔁 • Loop queue enabled' : '')}` })
        };

        await ctx.reply({ embeds: [embed] });
    }
}

module.exports = QueueCommand;