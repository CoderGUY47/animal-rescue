/**
 * AI-Automation Module - Integration Example
 * 
 * This file demonstrates how to import, wire up, and host the AI Chatbot
 * and Workflow Automation module in an Express server with Socket.io.
 * 
 * Follow the steps below to integrate into your new project.
 */

const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

// 1. Import Configs & Logs
const db = require('./config/db');
const logger = require('./config/logger');

// 2. Import Module Routes
const aiRoutes = require('./routes/ai');
const metaWebhookRoutes = require('./routes/metaWebhook');

const app = express();
const httpServer = createServer(app);

// 3. Configure Socket.io (Crucial for real-time dashboard message updates)
const io = new Server(httpServer, {
  cors: {
    origin: [
      process.env.FRONTEND_URL || 'http://localhost:3000',
      'http://localhost:5173'
    ],
    methods: ['GET', 'POST']
  }
});

// Set io globally on the app so it is accessible in messaging services and webhook routers
app.set('io', io);

// 4. Bind Security & Parsing Middlewares
app.use(helmet());
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    'http://localhost:5173'
  ],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// 5. Mount AI and Webhook Router Endpoints
app.use('/api/ai', aiRoutes);
app.use('/webhook/meta', metaWebhookRoutes);

// 6. Basic Health Endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'online',
    module: 'AI-Automation Module',
    time: new Date().toISOString()
  });
});

// 7. Socket.io Real-Time Room Binding logic
io.on('connection', (socket) => {
  logger.info(`Socket connected: ${socket.id}`);

  // When a dashboard operator opens a conversation view, they join the client room
  socket.on('join_client', (clientId) => {
    socket.join(`client_${clientId}`);
    logger.info(`Socket room join: client_${clientId}`);
  });

  socket.on('disconnect', () => {
    logger.info(`Socket disconnected: ${socket.id}`);
  });
});

// 8. Error Handling Middlewares
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint route not found' });
});

app.use((err, req, res, next) => {
  logger.error(err.stack || err.message);
  res.status(500).json({ error: 'Internal system error' });
});

// 9. Start the integration server
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  logger.info(`🚀 AI Automation Server active on port ${PORT}`);
  logger.info(`👉 Meta Webhook URL: http://localhost:${PORT}/webhook/meta`);
  logger.info(`👉 AI API Base URL: http://localhost:${PORT}/api/ai`);
});

module.exports = { app, httpServer };
