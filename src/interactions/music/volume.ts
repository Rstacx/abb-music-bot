import { ChatInputCommandInteraction, SlashCommandBuilder, ChannelType } from "discord.js";
import { SlashInteraction } from "../../client/Interfaces/Interactions/SlashInteraction";
import { bot } from "../../client/main";

const VolumeCommand:SlashInteraction = {
    data:new SlashCommandBuilder()
        .setName("volume")
        .setDescription("Set the playback volume")
        .addNumberOption(option => option
            .setName("volume")
            .setDescription("Set the volume between 0 and 1 (example 0.5)")),

    requireVc:true,

    run:async(ctx:ChatInputCommandInteraction, client:bot) => {
        if (!ctx.inCachedGuild() || ctx.member.voice.channel.type !== ChannelType.GuildVoice || ctx.channel.type !== ChannelType.GuildText) return;
        
        const connection = client.services.audioSession.fetch(ctx.member.voice.channel, ctx.channel);
        if (!connection) {
            return ctx.reply({content:`🎵 • **There is nothing playing in #${ctx.member.voice.channel.name}**`, ephemeral:true});
        };

        const volumeRequest = connection.setVolume(ctx.options.getNumber("volume"));
        if (!volumeRequest) {
            return ctx.reply({content:`🔊 • **Invalid volume value entered**`, ephemeral:true})
        } else {
            return ctx.reply({content:`🔊 • **Set the volume to \`${volumeRequest}\`**`});
        }
    }
};

module.exports = VolumeCommand;