const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DB_FILE = path.join(__dirname, 'database.json');

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Inicializar base de datos JSON en el servidor si no existe
function getDB() {
    if (!fs.existsSync(DB_FILE)) {
        const initialData = {
            users: {
                "soporteinverbot@gmail.com": { email: "soporteinverbot@gmail.com", pass: "lester2010jj", balance: 1000.0, code: "CEO-MASTER", refBy: null, refCount: 0, validRefCount: 0, teamDepositTotal: 0, commissionTotal: 0, vipActive: null, vipExpiry: 0, lastClaim: 0, isAdmin: true },
                "ajc229op@gmail.com": { email: "ajc229op@gmail.com", pass: "jan123", balance: 1000.0, code: "AJC-MASTER", refBy: null, refCount: 0, validRefCount: 0, teamDepositTotal: 0, commissionTotal: 0, vipActive: null, vipExpiry: 0, lastClaim: 0, isAdmin: true }
            },
            deposits: [],
            withdrawals: []
        };
        fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2));
    }
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
}

function saveDB(data) {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// Ruta API para obtener toda la base de datos
app.get('/api/data', (req, res) => {
    res.json(getDB());
});

// Ruta API para actualizar la base de datos completa (Sincronización total)
app.post('/api/data', (req, res) => {
    const newData = req.body;
    if (newData && newData.users) {
        saveDB(newData);
        return res.json({ success: true, message: "Base de datos actualizada correctamente" });
    }
    res.status(400).json({ success: false, message: "Datos inválidos" });
});

app.listen(PORT, () => {
    console.log(`Servidor Inverbot ejecutándose en http://localhost:${PORT}`);
});
