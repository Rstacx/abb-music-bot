import { ChatInputCommandInteraction, SlashCommandBuilder, ChannelType, EmbedBuilder, ActionRowBuilder,ButtonBuilder } from "discord.js";
import { SlashInteraction } from "../../client/Interfaces/Interactions/SlashInteraction";
import { bot } from "../../client/main";

const Leaveserver: SlashInteraction = {
    data: new SlashCommandBuilder()
        .setName("leave")
        .setDescription("Make the bot leave a server it's in")
        .addIntegerOption(option => option
            .setName("id")
            .setDescription("Enter the server id")
            .setRequired(true)),

    requireVc: false,
    ownerOnly: true,

    run: async (ctx: ChatInputCommandInteraction, client: bot) => {
      /*
        const id = ctx.options.getInteger("id")
        if(isNaN(id)) {
            ctx.reply({ embeds:[
                new EmbedBuilder()
                .setTitle(`Error`)
                .setDescription(`The id has to be a number`)
                .setColor(0x0099FF)
    
            ]})
          }
          const guild = client.bot.guilds.cache.get(id);
          if(!guild) {
           ctx.reply({ embeds: [
               new EmbedBuilder()
               .setTitle(`Error`)
               .setDescription(`I am not in the server which has been mentioned`)
               .setColor(`#FF6347`)
           ]})
          }
          const ConfirmEmbed = new EmbedBuilder()
          .setDescription(`Please confirm that you me to leave the Server!`)
          .setColor("RED")
       
       
       const row = new ActionRowBuilder()
          .addComponents(
              new ButtonBuilder()
              .setLabel('Yes')
              .setStyle('SUCCESS')
              .setCustomId('template-yes-create')
          )
          .addComponents(
              new ButtonBuilder()
              .setLabel('No')
              .setStyle('DANGER')
              .setCustomId('template-no-create')
          );
       
       ctx.reply({
          embeds: [ConfirmEmbed],
          components: [row]
       })
       
       const collector = await ctx.channel.createMessageComponentCollector({
          time: 15000,
          componentType: "BUTTON",
       })
       
       collector.on("collect", async (i) => {
       
          if (i.customId === "template-yes-create") {
       
              if (i.user.id !== ctx.user.id) return i.reply({
                  content: `❌ **This button is not for You.**`,
                  ephemeral: true
              })
       
              i.deferUpdate()
              const ConfirmEmbed1 = new EmbedBuilder()
                  .setDescription(`Please confirm that you want me to leave the Server!`)
                  .setColor("BLURPLE")
       
       
              const row1 = new ActionRowBuilder()
                  .addComponents(
                      new ButtonBuilder()
                      .setLabel('Yes')
                      .setStyle('SUCCESS')
                      .setCustomId('template-yes-create')
                      .setDisabled(true)
                  )
                  .addComponents(
                      new ButtonBuilder()
                      .setLabel('No')
                      .setStyle('DANGER')
                      .setCustomId('template-no-create')
                      .setDisabled(true)
                  );
              ctx.reply({
                  embeds: [ConfirmEmbed1],
                  components: [row1]
              })
          
              ctx.user.send({embeds: [new EmbedBuilder()
           .setTitle(`Success!`)
       .setDescription(`Successfully left ${id} `)
       .setColor(`#FF6347`)]})
       await guild.leave();
       
          } else if (i.customId === "template-no-create") {
       
              if (i.user.id !== ctx.user.id) return i.reply({
                  content: `❌ This button is not for You.`,
                  ephemeral: true
              })
              i.deferUpdate()
              const ConfirmEmbed2 = new EmbedBuilder()
                  .setDescription(`Please confirm that you want me to leave the server`)
                  .setColor("BLURPLE")
       
       
              const row2 = new ActionRowBuilder()
                  .addComponents(
                      new ButtonBuilder()
                      .setLabel('Yes')
                      .setStyle('SUCCESS')
                      .setCustomId('template-yes-create')
                      .setDisabled(true)
                  )
                  .addComponents(
                      new ButtonBuilder()
                      .setLabel('No')
                      .setStyle('DANGER')
                      .setCustomId('template-no-create')
                      .setDisabled(true)
                  );
              ctx.reply({
                  embeds: [ConfirmEmbed2],
                  components: [row2]
              })
              const NoEmbed = new EmbedBuilder()
                  .setDescription(`Cancelled The Process!`)
                  .setColor("BLURPLE")
       
              ctx.channel.send({
                  embeds: [NoEmbed]
              })
              
          }
       })
       await ctx.reply({
           
        });
        */
    }
}

module.exports = Leaveserver;