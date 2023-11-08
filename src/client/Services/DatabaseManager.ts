import { Service } from "../Structures/Service";
import { bot } from '../main';
import dotenv from "dotenv";
dotenv.config();
import mdb from 'mongoose';

export class DatabaseManager extends Service {
  constructor(client: bot) {
    super("Database Manager");
    const uri = process.env.mdburi;
    mdb.connect(uri)
      .then(() => {
        console.log('⚙️ • Service Active: "Mongodb"');
        const cname = 'main';

        /*    const filter = { name: cname };
            try {
              
              const col = mdb.connection.db.listCollections();
              (async () => {
                const collectionExists = await col.hasNext();
                if (collectionExists) {
                  console.log(`Collection: ${cname} is currently running`);
                } else {
                  mdb.connection.db.renameCollection("test",cname)
                  console.log(`Collection: ${cname} does not exist. Creating one...`);
                }
              })
              console.log('test')
            } catch (err) {
              console.error('An error occurred while checking collections:', err);
            }
    
    */
      })
      .catch(err => {
        console.error('An error occurred connecting to MongoDB: ', err);
      });


  };
};
