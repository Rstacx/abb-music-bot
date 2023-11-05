import { ChatInputCommandInteraction, SlashCommandBuilder, ChannelType } from "discord.js";
import { SlashInteraction } from "../../client/Interfaces/Interactions/SlashInteraction";
import { bot } from "../../client/main";

const PauseCommand: SlashInteraction = {
    data: new SlashCommandBuilder()
        .setName("pause")
        .setDescription("Pause/unpause playback of current song"),

    requireVc: true,
    ownerOnly: false,

    run: async (ctx: ChatInputCommandInteraction, client: bot) => {
        if (!ctx.inCachedGuild() || ctx.member.voice.channel.type !== ChannelType.GuildVoice || ctx.channel.type !== ChannelType.GuildText) return;

        const connection = client.services.audioSession.fetch(ctx.member.voice.channel, ctx.channel);
        if (!connection) {
            return ctx.reply({ content: `🎵 • **There is nothing playing in #${ctx.member.voice.channel.name}**`, ephemeral: true });
        };

        const pauseRequest = connection.pause();
        if (pauseRequest === "ERROR") {
            return client.errors.post(ctx, "Something failed trying to pause playback");
        };

        await ctx.reply({ content: `${(pauseRequest === "PAUSE") ? '⏸️ • **Playback has been paused**' : '▶️ • **Playback has been resumed**'}` });
    }
};

module.exports = PauseCommand;