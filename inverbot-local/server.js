const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const DB_FILE = path.join(__dirname, 'usuarios.json');

// Función para leer usuarios
function leerDb() {
    if (!fs.existsSync(DB_FILE)) {
        fs.writeFileSync(DB_FILE, JSON.stringify([]));
    }
    try {
        let data = fs.readFileSync(DB_FILE, 'utf8');
        return JSON.parse(data);
    } catch (e) {
        return [];
    }
}

// Función para escribir usuarios
function escribirDb(data) {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// Ruta de registro
app.post('/api/registro', (req, res) => {
    const { email, pass } = req.body;
    let usuarios = leerDb();
    
    let existente = usuarios.find(u => u.email === email);
    if (existente) {
        return res.json({ success: false, message: "El correo ya está registrado." });
    }
    
    const nuevoUsuario = {
        email,
        pass,
        balance: 0,
        vip_active: null,
        createdAt: new Date()
    };
    
    usuarios.push(nuevoUsuario);
    escribirDb(usuarios);
    
    res.json({ success: true, user: nuevoUsuario });
});

// Ruta de login
app.post('/api/login', (req, res) => {
    const { email, pass } = req.body;
    let usuarios = leerDb();
    
    let user = usuarios.find(u => u.email === email && u.pass === pass);
    if (!user) {
        return res.json({ success: false, message: "Correo o contraseña incorrectos." });
    }
    
    res.json({ success: true, user });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`¡Servidor de Inverbot corriendo en http://localhost:${PORT}`);
});
