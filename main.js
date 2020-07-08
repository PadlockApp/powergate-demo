import fs from "fs"
import { createPow, ffsTypes } from "@textile/powergate-client";
const host = "http://0.0.0.0:6002"; // local running powergate instance
const pow = createPow({ host });

(async function () {
    const { status, messageList } = await pow.health.check();
    const { peersList } = await pow.net.peers();
    const { token } = await pow.ffs.create();
    pow.setToken(token);
    // get wallet addresses associated with your FFS instance
    const { addrsList } = await pow.ffs.addrs();

    const filename = 'rick.jpg';

    const buffer = fs.readFileSync(`input/${filename}`);
    const { cid } = await pow.ffs.addToHot(buffer);


    // store the data in FFS using the default storage configuration
    const { jobId } = await pow.ffs.pushConfig(cid);

    // watch all FFS events for a cid
    pow.ffs.watchLogs((logEvent) => {
        console.log(`received event for cid ${logEvent.cid}`);
        console.log(logEvent);
    }, cid);

    // get the current actual storage configuration for a cid
    const arrayBuffer = await pow.ffs.get(cid);
    fs.mkdirSync('output');
    fs.writeFileSync(`output/${filename}`, new Buffer(arrayBuffer));
})();

