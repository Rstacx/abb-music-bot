import { Service } from "../Structures/Service";
import { Sequelize } from "sequelize";
import { join } from "path";
import { existsSync, mkdirSync } from "fs";

export class DatabaseManager extends Service {
    public sequelize:Sequelize;
    
    constructor() {
        super("Database Manager");

        if (!existsSync(join(__dirname, "..", "..", "..", "db"))) {
            mkdirSync(join(__dirname, "..", "..", "..", "db"));
            console.log(`🔗 DB • Generated database storage folder`);
        }

        this.sequelize = new Sequelize({
            dialect:"sqlite",
            storage:join(__dirname, "..", "..", "..", "db", "mugi.sqlite"),
            logging:msg => console.log(`🔗 DB • ${msg}`)
        });
    };
};