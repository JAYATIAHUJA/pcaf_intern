import * as dashboardService from '../services/dashboardService.js';

export async function getDashboardStats(req, res) {
  try {
    const stats = await dashboardService.fetchDashboardStats();
    return res.json(stats);
  } catch (err) {
    console.error('Error fetching dashboard stats:', err);
    return res.status(err.statusCode || 500).json({ error: err.message || 'Internal Server Error' });
  }
}
