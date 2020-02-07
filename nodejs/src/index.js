/**
 * Simple Node JS App. 
 */
import express from "express";
import storage from "node-persist";
import cors from "cors";
import cron from "./modules/weather-cron";
import * as mCache from "./core/memory-cache";

const app = express();
const serverPort = process.env.PORT ? parseInt(process.env.PORT, 10) : 4100;

app.use(cors({
    allowedHeaders: ["X-Requested-With", "Content-Type"],
    origin: "*"
  }));

// Default Route.
app.get('/', (req, res) => res.send('Hello World!!!!'));

// Catch unmatched routes
app.all('*', (req, res) => {
  res.json({ status: 404, message: 'Page not found.' });
});

let storageInit = async () => {
  await storage.init({
    dir: 'public/db',
    stringify: JSON.stringify,
    parse: JSON.parse,
    encoding: 'utf8',
    logging: false,  // can also be custom logging function
    ttl: false, // ttl* [NEW], can be true for 24h default or a number in MILLISECONDS or a valid Javascript Date object
    expiredInterval: 60 * 60 * 1000, // every 60 minutes the process will clean-up the expired cache
    // in some cases, you (or some other service) might add non-valid storage files to your
    // storage dir, i.e. Google Drive, make this true if you'd like to ignore these files and not throw an error
    forgiveParseErrors: false
  });
  await storage.setItem("didarul", 'There is no cache found !!', { ttl: 1000 * 60 /* 1 min */ });
};
storageInit();

//Start the cron
cron();


// Start the server.
app.listen(serverPort, () => {
  console.log(`server started on: ${serverPort}`);
});
