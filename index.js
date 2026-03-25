const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

let servidores = {};
let logs = [];

setInterval(() => {
    logs = [];
}, 3000);

app.get('/', (req, res) => {
    res.send('API Online');
});

app.post('/update', (req, res) => {
    const { Brainrot, Dinero, JobId, Players } = req.body;
    if (!JobId) return res.status(400).json({ error: "No JobId" });

    servidores[JobId] = {
        Brainrot: Brainrot || 0,
        Dinero: Dinero || 0,
        Players: Players || [],
        timestamp: new Date().toLocaleString()
    };
    res.json({ status: "success" });
});

app.post('/send_log', (req, res) => {
    const { JobId, Evento, Usuario } = req.body;
    logs.push({
        fecha: new Date().toLocaleString(),
        jobId: JobId || "Global",
        evento: Evento || "N/A",
        usuario: Usuario || "System"
    });
    res.json({ status: "ok" });
});

app.get('/get_logs', (req, res) => {
    res.json(logs);
});

app.listen(PORT, () => {
    console.log(`Port: ${PORT}`);
});
