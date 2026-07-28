import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import {
  authRoutes,
  roleRoutes,
  userRoutes,
  settingRoutes,
  loanConfigRoutes,
  dataCaptureRoutes,
  auditRoutes,
  dashboardRoutes,
  masterDataRoutes
} from './src/v1/routes/index.js';
import { initializeDatabase } from './src/db/schemaManager.js';
import { API_ROUTES } from './src/v1/constants.js';

const app = express();

app.set('etag', false);

app.use(cors());
app.use(express.json());

// Request logger middleware
app.use((req, res, next) => {
  res.on('finish', () => {
    console.log(`[API] ${req.method} ${req.originalUrl} - status: ${res.statusCode}`);
  });
  next();
});

// Register API routes
app.use(API_ROUTES.AUTH.BASE, authRoutes);
app.use(API_ROUTES.ROLES.BASE, roleRoutes);
app.use(API_ROUTES.USERS.BASE, userRoutes);
app.use(API_ROUTES.SETTINGS.BASE, settingRoutes);
app.use(API_ROUTES.LOAN_CONFIG.BASE, loanConfigRoutes);
app.use(API_ROUTES.DATA_CAPTURE.BASE, dataCaptureRoutes);
app.use(API_ROUTES.AUDIT.BASE, auditRoutes);
app.use(API_ROUTES.DASHBOARD.BASE, dashboardRoutes);
app.use(API_ROUTES.MASTER_DATA.BASE, masterDataRoutes);

const PORT = process.env.PORT || 5000;

initializeDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`API server running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('Failed to initialize database. Server shutdown.', err);
    process.exit(1);
  });


