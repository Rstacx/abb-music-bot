import { ChatInputCommandInteraction, SlashCommandBuilder, ChannelType, EmbedBuilder } from "discord.js";
import { SlashInteraction } from "../../client/Interfaces/Interactions/SlashInteraction";
import { bot } from "../../client/main";
import dotenv from "dotenv";
import {join} from "path";
dotenv.config({path:join(__dirname, "..","..", ".env")});
import axios from 'axios';

const Askchatgpt: SlashInteraction = {
    data: new SlashCommandBuilder()
        .setName("gpt")
        .setDescription("Ask chat gpt")
        .addStringOption(option => option
            .setName("prompt")
            .setDescription("Enter a prompt")
            .setRequired(true)),

    requireVc: false,
    ownerOnly: false,

    run: async (ctx: ChatInputCommandInteraction, client: bot) => {
      
    await ctx.reply({ content: `Sending the request to the api...`, ephemeral: false });
    
    const question = ctx.options.getString("prompt");

    try {
    
    const username = process.env.user;  
    const password = process.env.password;  
    const postData = {
        prompt: `${question}`,
        model: 1,
    };
    
    const res = await axios.post(process.env.api, postData, {
      auth: {
        username: username,
        password: password
      }
    }).then(response => {
       ctx.editReply({ embeds: [
        new EmbedBuilder()
        .setTitle(`Response`)
        .setDescription(response.data.gpt)
        .setColor(0x0099FF)
        .setFooter({text: `Credit to @Rstacx`})
       ]});
    })
    } catch (error) {
      console.error("An error occurred:", error);
      await ctx.followUp("An error occurred while using the command.");
    }
    }
}

module.exports = Askchatgpt;