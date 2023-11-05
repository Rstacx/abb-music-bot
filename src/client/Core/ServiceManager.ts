import { bot } from "../main";
import { DatabaseManager } from "../Services/DatabaseManager";
import { InteractionListener } from "../Services/InteractionListener";
import { StartupLogger } from "../Services/StartupLogger";
import { SessionManager } from "../Services/Audio/SessionManager";

export class ServiceManager {
    private client: bot
    constructor(client: bot) {
        this.client = client;
    };

    public db: DatabaseManager;
    public audioSession: SessionManager;

    init() {
        // -- Public Services
        // this.db = new DatabaseManager();
        this.audioSession = new SessionManager(this.client);

        // -- Private services
        new StartupLogger(this.client);
        // Discord interactions event manager -- start last!!
        new InteractionListener(this.client);
    }
};