import fs from "fs"
import { createPow, ffsTypes } from "@textile/powergate-client";
import { config } from 'dotenv';
config();
const { POW_HOST, POW_TOKEN } = process.env;

const host = POW_HOST; // local running powergate instance
const pow = createPow({ host });

(async function () {
    // const { token } = await pow.ffs.create();
    pow.setToken(POW_TOKEN);
    // get wallet addresses associated with your FFS instance
    const { addrsList } = await pow.ffs.addrs();

    const filename = 'morty.jpeg';

    // const buffer = fs.readFileSync(`input/${filename}`);
    // const { cid } = await pow.ffs.addToHot(buffer);
    const cid = 'QmcgAXy4Z9Uq3DR7jjf1K5fS8ZquwP8ZXm8xhoT85xNoEV';
    const jobId = '19997b6a-a5f5-4305-87fa-4d455c8ade8c';

    const { defaultConfig } = await pow.ffs.defaultConfig(cid);

    await pow.ffs.setDefaultConfig(
        {
            "hot": {
                "enabled": true,
                "allowUnfreeze": false,
                "ipfs": {
                    "addTimeout": 30
                }
            },
            "cold": {
                "enabled": true,
                "filecoin": {
                    "repFactor": 1,
                    "dealMinDuration": 1000,
                    "excludedMinersList": defaultConfig.cold.filecoin.excludedMinersList,
                    "trustedMinersList": defaultConfig.cold.filecoin.trustedMinersList,
                    "countryCodesList": defaultConfig.cold.filecoin.countryCodesList,
                    "renew": {
                        "enabled": false,
                        "threshold": 1
                    },
                    "addr": defaultConfig.cold.filecoin.addr,
                    "maxPrice": 0
                }
            },
            "repairable": false
        }
    );

    

    // store the data in FFS using the default storage configuration
    // const { jobId } = await pow.ffs.pushConfig(cid);

    // watch all FFS events for a cid
    pow.ffs.watchLogs((logEvent) => {
        console.log(`received event for cid ${logEvent.cid}`);
        console.log(logEvent);
        if (logEvent.msg === 'Cold-Storage execution ran successfully.') {
            pow.ffs.defaultConfig(cid).then(({ config }) => console.log(config))
        }
    }, cid);

    // get the current actual storage configuration for a cid
    const arrayBuffer = await pow.ffs.get(cid);
    fs.mkdirSync('output');
    fs.writeFileSync(`output/${filename}`, new Buffer.from(arrayBuffer));
})();

