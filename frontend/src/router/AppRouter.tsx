import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';

import AuthLayout from '../layouts/AuthLayout';
import MainLayout from '../layouts/MainLayout';

import Login from '../pages/auth/Login';
import Dashboard from '../pages/dashboard/Dashboard';

import BusinessLoanCapturePage from '../pages/data-capture/business-loans/BusinessLoanCapture';
import MotorVehicleCapturePage from '../pages/data-capture/motor-vehicle/MotorVehicleCapture';
import CommercialRECapturePage from '../pages/data-capture/commercial-real-estate/CommercialRECapture';
import MortgageCapturePage from '../pages/data-capture/mortgage/MortgageCapture';

import LoanConfiguration from '../pages/loan-configuration/LoanConfiguration';

import Settings from '../pages/settings/Settings';
import RoleManagement from '../pages/role-management/RoleManagement';
import UserManagement from '../pages/user-management/UserManagement';
import AuditTrail from '../pages/audit-trail/AuditTrail';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path={ROUTES.LOGIN} element={<Login />} />
        </Route>

        <Route element={<MainLayout />}>
          <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />

          <Route path={ROUTES.DATA_CAPTURE_BUSINESS_LOANS} element={<BusinessLoanCapturePage />} />
          <Route path={ROUTES.DATA_CAPTURE_MOTOR_VEHICLE} element={<MotorVehicleCapturePage />} />
          <Route path={ROUTES.DATA_CAPTURE_COMMERCIAL_RE} element={<CommercialRECapturePage />} />
          <Route path={ROUTES.DATA_CAPTURE_MORTGAGE} element={<MortgageCapturePage />} />

          <Route path={ROUTES.LOAN_CONFIGURATION} element={<LoanConfiguration />} />

          <Route path={ROUTES.SETTINGS} element={<Settings />} />
          <Route path={ROUTES.ROLE_MANAGEMENT} element={<RoleManagement />} />
          <Route path={ROUTES.USER_MANAGEMENT} element={<UserManagement />} />
          <Route path={ROUTES.AUDIT_TRAIL} element={<AuditTrail />} />
        </Route>

        <Route path="/" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
        <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
      </Routes>
    </BrowserRouter>
  );
}
