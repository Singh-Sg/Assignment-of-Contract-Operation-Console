import { Routes, Route } from 'react-router-dom';
import OrganizationSelectionPage from '../pages/OrganizationSelectionPage';
import DashboardPage from '../pages/DashboardPage';
import ContractsListPage from '../pages/ContractsListPage';
import CreateContractPage from '../pages/CreateContractPage';
import ContractDetailsPage from '../pages/ContractDetailsPage';
import EditContractPage from '../pages/EditContractPage';
import NotFoundPage from '../pages/NotFoundPage';
import MainLayout from '../layouts/MainLayout';
import RequireOrganization from './RequireOrganization';
import { RealtimeProvider } from '../context/RealtimeContext';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<OrganizationSelectionPage />} />

      <Route
        element={
          <RequireOrganization />
        }
      >
        <Route
          element={
            <RealtimeProvider>
              <MainLayout />
            </RealtimeProvider>
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/contracts" element={<ContractsListPage />} />
          <Route path="/contracts/new" element={<CreateContractPage />} />
          <Route path="/contracts/:id" element={<ContractDetailsPage />} />
          <Route path="/contracts/:id/edit" element={<EditContractPage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
