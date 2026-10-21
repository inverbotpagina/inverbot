const https = require('https');

const miDireccionSafePal = "0x8B9a2f78D2bc67Bc6172386Ef9cd30e3F7829069".toLowerCase();
const RPC_URL = "https://bsc-dataseed.binance.org/";

console.log("=========================================");
console.log("  INVERBOT: VIGILANTE SAFEPAL (LIGERO)   ");
console.log("=========================================");
console.log("Monitoreando red BSC sin instalaciones pesadas...\n");

function consultarUltimoBloque() {
    const data = JSON.stringify({
        jsonrpc: "2.0",
        method: "eth_getBlockByNumber",
        params: ["latest", true],
        id: 1
    });

    const url = new URL(RPC_URL);
    const options = {
        hostname: url.hostname,
        path: url.pathname,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length
        }
    };

    const req = https.request(options, (res) => {
        let cuerpo = '';
        res.on('data', (chunk) => { cuerpo += chunk; });
        res.on('end', () => {
            try {
                const respuesta = JSON.parse(cuerpo);
                if (respuesta.result && respuesta.result.transactions) {
                    const bloqueNum = parseInt(respuesta.result.number, 16);
                    for (const tx of respuesta.result.transactions) {
                        if (tx.to && tx.to.toLowerCase() === miDireccionSafePal) {
                            console.log(`\n[¡DEPÓSITO DETECTADO!]`);
                            console.log(`Bloque: ${bloqueNum}`);
                            console.log(`Remitente: ${tx.from}`);
                            console.log(`Hash: ${tx.hash}`);
                            console.log(`-----------------------------------------`);
                        }
                    }
                }
            } catch (e) {}
        });
    });

    req.on('error', (e) => {});
    req.write(data);
    req.end();
}

setInterval(consultarUltimoBloque, 12000);


