import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import MainLayout from "./layouts/MainLayout";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Accounts from "./pages/Accounts";
import Transactions from "./pages/Transactions";
import Settings from "./pages/Settings";
import HelpCenter from "./pages/HelpCenter";
import NotFound from "./pages/NotFound";
import Categories from "./pages/Categories";
import Budgets from "./pages/Budgets";
import Bills from "./pages/Bills";
import Rewards from "./pages/Rewards";
import Insights from "./pages/Insights";
import FinAssist from "./pages/FinAssist";
import Alerts from "./pages/Alerts";

import { AuthProvider } from "./context/AuthContext";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* PUBLIC ROUTES */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* PROTECTED ROUTES */}
            <Route element={<MainLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/accounts" element={<Accounts />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/budgets" element={<Budgets />} />
              <Route path="/bills" element={<Bills />} />
              <Route path="/rewards" element={<Rewards />} />
              <Route path="/insights" element={<Insights />} />
              <Route path="/finAssist" element={<FinAssist />} />
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/help" element={<HelpCenter />} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}
