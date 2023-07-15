import { ChatInputCommandInteraction, SlashCommandBuilder, ChannelType } from "discord.js";
import { SlashInteraction } from "../../client/Interfaces/Interactions/SlashInteraction";
import { bot } from "../../client/main";

const ShuffleCommand:SlashInteraction = {
    data:new SlashCommandBuilder()
        .setName("shuffle")
        .setDescription("Shuffle the queue"),

    requireVc:true,
    ownerOnly:false,

    run:async(ctx:ChatInputCommandInteraction, client:bot) => {
        if (!ctx.inCachedGuild() || ctx.member.voice.channel.type !== ChannelType.GuildVoice || ctx.channel.type !== ChannelType.GuildText) return;
        
        const connection = client.services.audioSession.fetch(ctx.member.voice.channel, ctx.channel);
        if (!connection) {
            return ctx.reply({content:`🎵 • **There is nothing playing in #${ctx.member.voice.channel.name}**`, ephemeral:true});
        };

        connection.shuffle();
        await ctx.reply({content:`🔀 • **The queue has been shuffled**`});
    }
}

module.exports = ShuffleCommand;