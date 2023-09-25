import { ChannelType, Events } from "discord.js";
import { bot } from "../main";
import { Service } from "../Structures/Service";
import { SlashInteraction } from "../Interfaces/Interactions/SlashInteraction";

export class InteractionListener extends Service {
    constructor(client:bot) {
        super("Discord Interaction Listener");

        client.bot.on(Events.InteractionCreate, async ctx => {
            if (!ctx.isChatInputCommand()
            && !ctx.isAutocomplete()) return;

            let interaction:SlashInteraction = client.bot.interactions.get(ctx.commandName);

            try {
                if (!ctx.inCachedGuild() && !ctx.isAutocomplete()) {
                    await ctx.reply({content:`❌ • **${client.bot.user.username} can only be used in servers**`});
                }

                else if (!interaction && !ctx.isAutocomplete()) {
                    await ctx.reply({content:`❌ • **Unable to run command**`, ephemeral:true});
                }

                else if (ctx.isAutocomplete()) {
                    await interaction.autocomplete(ctx, client);
                    console.log(`💬 • Autocomplete being handled for: "${ctx.commandName}" by ${ctx.user.username} (${ctx.user.id})`)
                }
                 
                else {
                    if (interaction.requireVc) {
                        if (!ctx.member.voice.channel) {
                            await ctx.reply({content:`❌ • **You need to join a voice channel to use ${client.bot.user.username}**`, ephemeral:true})
                        } else if (ctx.member.voice.channel.type === ChannelType.GuildVoice && !ctx.member.voice.channel.joinable || ctx.member.voice.channel.type === ChannelType.GuildVoice && !ctx.member.voice.channel.speakable) {
                            await ctx.reply({content:`❌ • **${client.bot.user.username} cannot join the voice channel you're in**`, ephemeral:true});
                        } else {
                            await interaction.run(ctx, client);
                            console.log(`💬 • Interaction used: "${ctx.commandName}" by ${ctx.user.username} (${ctx.user.id})`)
                        };
                      /*  if(ctx.member.permissions.has(interaction.userPerms)){
                            ctx.reply({ content: `You need the \`${interaction.userPerms}\` to run that command`})
                        }
                        */
                    } else if(interaction.ownerOnly && ctx.user.id !== "737880313493061712"){
                        ctx.reply({ content: `You are not allowed to run that command!`, ephemeral: true})
                    } else {
                        await interaction.run(ctx, client);
                        console.log(`💬 • Interaction used: "${ctx.commandName}" by ${ctx.user.username} (${ctx.user.id})`)
                    };
                }
            } catch (err) {
                console.error(err);
                if (ctx.isAutocomplete()) return;
                if (ctx.deferred || ctx.replied) {
                    await ctx.followUp({content:`❌ • \`${err}\``, ephemeral:true});
                } else {
                    await ctx.reply({content:`❌ • \`${err}\``, ephemeral:true});
                }
            }
        });
    }
}