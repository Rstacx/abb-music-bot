import { SlashCommandBuilder, SlashCommandSubcommandsOnlyBuilder, ChatInputCommandInteraction, AutocompleteInteraction } from "discord.js";
import { Tapedeck } from "../../Tapedeck";

export interface SlashInteraction {
    data:
        | Omit<SlashCommandBuilder, "addSubcommandGroup" | "addSubcommand">
        | SlashCommandSubcommandsOnlyBuilder
    run:(ctx:ChatInputCommandInteraction, client:Tapedeck) => Promise<any>
    autocomplete?:(ctx:AutocompleteInteraction, client:Tapedeck) => Promise<any>,
    requireVc:boolean
}