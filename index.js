const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());

let servidores = {};
let logs = []; 

setInterval(() => {
    const ahora = Date.now();
    logs = logs.filter(log => log.expira > ahora);
}, 1000);

app.get('/', (req, res) => {
    res.status(200).send('API Online');
});

app.post('/update', (req, res) => {
    const { Brainrot, Dinero, JobId, Players } = req.body;
    if (!JobId) return res.status(400).json({ error: "No JobId" });

    servidores[JobId] = {
        JobId: JobId,
        Brainrot: Brainrot || 0,
        Dinero: Dinero || 0,
        Players: Players || 0
    };
    res.json({ status: "success" });
});

app.post('/send_log', (req, res) => {
    const { JobId, Evento, Usuario } = req.body;
    
    logs = logs.filter(log => log.jobId !== JobId);

    logs.push({
        jobId: JobId || "Global",
        evento: Evento || "N/A",
        usuario: Usuario || "System",
        expira: Date.now() + 10000 
    });

    res.json({ status: "ok" });
});

app.get('/get_logs', (req, res) => {
    const logsLimpios = logs.map(l => ({
        JobId: l.jobId,
        Evento: l.evento,
        Usuario: l.usuario
    }));
    res.json(logsLimpios);
});

// NUEVA RUTA: Para ver todos los servidores sin saber el JobId
app.get('/todos', (req, res) => {
    res.json(servidores);
});

app.get('/get_server/:jobid', (req, res) => {
    const data = servidores[req.params.jobid];
    if (data) return res.json(data);
    res.status(404).json({ error: "Not found" });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor activo en puerto: ${PORT}`);
});
