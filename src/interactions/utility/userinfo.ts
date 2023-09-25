import { ChatInputCommandInteraction, SlashCommandBuilder, ChannelType, EmbedBuilder } from "discord.js";
import { SlashInteraction } from "../../client/Interfaces/Interactions/SlashInteraction";
import { bot } from "../../client/main";
import fetch from "node-fetch"


const statuses = {
    online: "<:ONLINE:1018545053959991348> Online",
    offline: "<:offline:1018545360706224148> Offline",
    dnd: "<:dnd:1018545105835151461> DND",
    idle: "<:idle:1018545252417675275> Idle",
};

const flags = {
    DISCORD_EMPLOYEE: "<:employee:1018545859115352127>",
    DISCORD_PARTNER: "<:partner:1018546031731933276>",
    BUGHUNTER_LEVEL_1: "<:bughunter:1018546200770789456>",
    BUGHUNTER_LEVEL_2: "<:bughunter2:1018546259671404557>",
    HYPESQUAD_EVENTS: "<:hypesquadevents:1018546328487346298>",
    HOUSE_BRAVERY: "<:hypebravery:1018546385638936638>",
    HOUSE_BRILLIANCE: "<:hypebrilliance:1018546435530162266>",
    HOUSE_BALANCE: "<:hypebalance:1018546471425032253>",
    EARLY_SUPPORTER: "<:earlysupporter:1018546511069577316>",
    SYSTEM: "<:developer:1018546579289948190>",
    VERIFIED_BOT:
        "<:verifiedbot2:1018546998531588157><:verifiedbot1:1018546932613914724>",
    VERIFIED_DEVELOPER: "<:developer:1018546579289948190>",
    NITRO: "<:nitroclassic:1018547094174314586>",
    BOOSTER_1: "<:serverbooster1:1018547699873755258>",
    BOOSTER_2: "<:serverbooster2:1018547738687832224>",
    BOOSTER_3: "<:serverbooster3:1018547777267040347>",
    BOOSTER_4: "<:serverbooster4:1018547906082508961>",
    BOOSTER_5: "<:serverbooster5:1018547987477168188>",
    BOOSTER_6: "<:serverbooster6:1018548078443233422>",
    BOOSTER_7: "<:serverbooster7:1018548136693743758>",
    BOOSTER_8: "<:serverbooster8:1018548176082456677>",
    BOOSTER_9: "<:serverbooster9:1018548234664296599>",
};


const Userinfo: SlashInteraction = {
    data: new SlashCommandBuilder()
        .setName("userinfo")
        .setDescription("Check a user's info")
        .addUserOption(option => option
            .setName("user")
            .setDescription("Enter a user to get their info")
            .setRequired(false)),

    requireVc: false,
    ownerOnly: false,

    run: async (ctx: ChatInputCommandInteraction, client: bot) => {

        const targetId = ctx.options.getUser("user") || ctx.user
        const user = await client.bot.users.fetch(targetId);
        await ctx.reply({
           content:"This is test"
        });
    }
}

module.exports = Userinfo;