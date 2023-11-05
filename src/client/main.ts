// Import client modules
// -- Discord Client
import { DiscordClient } from "./Core/DiscordClient";
import { ErrorHandler } from "./Core/ErrorHandler";
import { ServiceManager } from "./Core/ServiceManager";

export class bot {
    public bot: DiscordClient;
    public services: ServiceManager;
    public errors: ErrorHandler;

    constructor() {
        this.bot = new DiscordClient();
        this.services = new ServiceManager(this);
        this.errors = new ErrorHandler();

        this.start();
    }

    private async start() {
        // -- start discord connection
        await this.bot.start();
        // -- init services
        this.services.init();
    };
};