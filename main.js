import { createPow } from "@textile/powergate-client";
const host = "http://0.0.0.0:6002"; // local running powergate instance
const pow = createPow({ host });

(async function () {
    const pow = createPow({ host });
    const { status, messageList } = await pow.health.check();
    const { peersList } = await pow.net.peers();
    const { token } = await pow.ffs.create();
    pow.setToken(token);
    // get wallet addresses associated with your FFS instance
    const { addrsList } = await pow.ffs.addrs();

    console.log(addrsList);
})();