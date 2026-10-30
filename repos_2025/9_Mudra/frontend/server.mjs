import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 });

let state = {
    type: null,
    size: 150,
    position: { x: 0, y: 0 },
    isDragging: false,
    webcamEnabled: false,
};

wss.on('connection', (ws) => {
    console.log('Client connected');

    // Send current state to new client
    ws.send(JSON.stringify({ type: 'sync', state }));

    ws.on('message', (data) => {
        try {
            const message = JSON.parse(data);
            console.log('Received:', message);

            switch (message.type) {
                case 'sync':
                    if (message.state) {
                        state = { ...state, ...message.state };
                    }
                    break;
                case 'setShape':
                    state.type = message.value;
                    break;
                case 'setSize':
                    state.size = message.value;
                    break;
                case 'setPosition':
                    state.position = message.value;
                    break;
                case 'setDragging':
                    state.isDragging = message.value;
                    break;
                case 'setWebcam':
                    state.webcamEnabled = message.value;
                    break;
            }

            // Broadcast update to all clients
            const update = JSON.stringify({ type: 'update', state });
            wss.clients.forEach((client) => {
                if (client.readyState === 1) {
                    client.send(update);
                }
            });
        } catch (e) {
            console.error('Failed to parse message:', e);
        }
    });

    ws.on('close', () => console.log('Client disconnected'));
});

console.log('WebSocket server running on ws://localhost:8080');
