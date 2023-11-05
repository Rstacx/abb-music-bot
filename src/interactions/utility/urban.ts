import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { SlashInteraction } from "../../client/Interfaces/Interactions/SlashInteraction";
import { bot } from "../../client/main";
import axios from 'axios'

const Urbancmd: SlashInteraction = {
    data: new SlashCommandBuilder()
        .setName("urban")
        .setDescription("Search up something on the urban dictionary")
        .addStringOption(option => option
            .setName("word")
            .setDescription("The word you want to search")
            .setRequired(true)),

    requireVc: false,
    ownerOnly: false,

    run: async (ctx: ChatInputCommandInteraction, client: bot) => {
        let word = ctx.options.getString('word')
        try {
            word = encodeURIComponent(word);
            const {
                data: { list },
            } = await axios.get(
                `https://api.urbandictionary.com/v0/define?term=${word.toString()}`,
            );
            const [answer] = list;


            await ctx.reply({
                embeds: [new EmbedBuilder()
                    .setColor(0x0099FF)
                    .setTitle(answer.word)
                    .setURL(answer.permalink)
                    .addFields(
                        { name: "Meaning:", value: trim(answer.definition) },
                        { name: "Usage:", value: trim(answer.example) },
                        {
                            name: "Ratings",
                            value: `${answer.thumbs_up}<:uap:1030948205522858014>  **|**  ${answer.thumbs_down}<:daw:1030948305112404040>`,
                        },
                    )
                ]
            })
        } catch (err) {
            return ctx.reply({
                embeds: [new EmbedBuilder()
                    .setColor(0x0099FF)
                    .setTitle("Error!")
                    .setDescription(`${err}`)
                ]
            })
        }
        function trim(input: string) {
            return input.length > 1024 ? `${input.slice(0, 1020)} ... ` : input;
        }

    }
}

module.exports = Urbancmd;