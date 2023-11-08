import { TextChannel, VoiceChannel } from "discord.js";
import { Service } from "../../Structures/Service";
import { VoiceSession } from "./VoiceSession";
import { bot } from "../../main";

export class SessionManager extends Service {
    private client: bot;
    private sessions: Map<string, VoiceSession>; // TODO: change to voice session

    constructor(client: bot) {
        super("Audio session manager");
        this.client = client;

        this.sessions = new Map();
    };

    public fetch(voiceChannel: VoiceChannel, textChannel: TextChannel, check?: boolean) {
        if (this.sessions.has(voiceChannel.guild.id)) {
            const connection = this.sessions.get(voiceChannel.guild.id);
            if (voiceChannel.id !== connection.getVoiceChannelId()) return false;
            return connection;
        } else {
            if (check) return false;
            const connection = new VoiceSession(this.client, voiceChannel, textChannel);
            this.sessions.set(voiceChannel.guild.id, connection);
            return connection;
        };
    };

    public destroy(id: string) {
        if (this.sessions.has(id)) {
            this.sessions.delete(id);
        };
    };
}