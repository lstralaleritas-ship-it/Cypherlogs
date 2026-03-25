const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());

let servidores = {};
let logs = [];

setInterval(() => {
    logs = [];
}, 3000);

app.get('/', (req, res) => {
    res.status(200).send('API Online');
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

app.get('/get_server/:jobid', (req, res) => {
    const data = servidores[req.params.jobid];
    if (data) return res.json(data);
    res.status(404).json({ error: "Not found" });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor activo en puerto: ${PORT}`);
});
