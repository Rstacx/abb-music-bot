import { Service } from "../Structures/Service";
import { Events, EmbedBuilder} from 'discord.js';
import { bot } from '../main';
import dotenv from "dotenv";
dotenv.config();
import mdb from 'mongoose';
export class DatabaseManager extends Service {

    constructor(client: bot) {
        super("Database Manager");
        const uri = process.env.mdburi;

        client.bot.on(Events.InteractionCreate, async ctx => {
            const channel: any = await client.bot.channels.fetch(process.env.LOG_CHANNEL_ID);
            try {
                await mdb.connect(uri);
                console.log('Connected to the mongo Database');
                channel.send({
                    embeds: [new EmbedBuilder()
                        .setTitle('Active!')
                        .setDescription(`The mongodb has been initialized!`)
                    ]
                })
            } catch (err) {
                console.error('An error occurred connecting to MongoDB: ', err);
            }
        })

    };
};