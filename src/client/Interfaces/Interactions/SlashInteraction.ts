import { SlashCommandBuilder, SlashCommandSubcommandsOnlyBuilder, ChatInputCommandInteraction, AutocompleteInteraction } from "discord.js";
import { bot } from "../../main";

export interface SlashInteraction {
    data:
    | Omit<SlashCommandBuilder, "addSubcommandGroup" | "addSubcommand">
    | SlashCommandSubcommandsOnlyBuilder
    run: (ctx: ChatInputCommandInteraction, client: bot) => Promise<any>
    autocomplete?: (ctx: AutocompleteInteraction, client: bot) => Promise<any>,
    requireVc: boolean,
    ownerOnly: boolean
}