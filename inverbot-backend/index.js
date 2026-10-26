const admin = require("firebase-admin");
const { ethers } = require("ethers");

admin.initializeApp();
const db = admin.firestore();

const BSC_RPC_URL = "https://bsc-dataseed.binance.org/";
const USDT_BEP20_ADDRESS = "0x55d398326f99059fF775485246999027B3197955";
const ERC20_ABI = [
    "function transfer(address to, uint256 amount) public returns (bool)"
];

async function escucharRetiros() {
    console.log("Escuchando retiros pendientes automáticamente...");
    db.collection("withdrawals").where("status", "==", "Pendiente")
        .onSnapshot(async (snapshot) => {
            for (const change of snapshot.docChanges()) {
                if (change.type === "added") {
                    const docData = change.doc.data();
                    const docId = change.doc.id;
                    await procesarRetiro(docId, docData);
                }
            }
        });
}

async function procesarRetiro(id, data) {
    try {
        const provider = new ethers.providers.JsonRpcProvider(BSC_RPC_URL);
        const privateKey = process.env.PRIVATE_KEY;
        if (!privateKey) throw new Error("Falta la clave privada");

        const wallet = new ethers.Wallet(privateKey, provider);
        const usdtContract = new ethers.Contract(USDT_BEP20_ADDRESS, ERC20_ABI, wallet);

        const montoWei = ethers.utils.parseUnits(data.monto.toString(), 18);
        
        console.log(`Enviando ${data.monto} USDT a ${data.wallet}...`);
        const tx = await usdtContract.transfer(data.wallet, montoWei);
        await tx.wait();

        await db.collection("withdrawals").doc(id).update({
            status: "Aprobado",
            txHash: tx.hash
        });
        console.log("Retiro enviado con éxito:", tx.hash);
    } catch (error) {
        console.error("Error procesando retiro:", error);
        await db.collection("withdrawals").doc(id).update({
            status: "Error",
            errorLog: error.message
        });
    }
}

escucharRetiros();
