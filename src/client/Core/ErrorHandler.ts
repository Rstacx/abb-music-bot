import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";

export class ErrorHandler {
    constructor() { };

    post(ctx: ChatInputCommandInteraction, error: any) {
        const embed = new EmbedBuilder()
            .setColor("#d72828")
            .setAuthor({ name: `An error has occurred` })
            .setDescription(`\`${error}\``);
        if (ctx.deferred) {
            return ctx.followUp({ embeds: [embed] });
        } else {
            return ctx.reply({ embeds: [embed], ephemeral: true });
        }
    };
}