import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { Truck, Users, DollarSign, LayoutDashboard, FileText } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import Payroll from './pages/Payroll';
import Ledger from './pages/Ledger';
import Billing from './pages/Billing';

function App() {
  return (
    <Router>
      <div className="flex h-screen bg-slate-50 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-slate-900 text-white flex flex-col">
          <div className="p-6 flex items-center gap-3 border-b border-slate-800">
            <Truck className="w-8 h-8 text-blue-500" />
            <h1 className="text-xl font-bold tracking-tight">FleetPro</h1>
          </div>
          
          <nav className="flex-1 p-4 space-y-2">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <LayoutDashboard className="w-5 h-5" />
              <span className="font-medium">Live GPS</span>
            </NavLink>
            
            <NavLink
              to="/payroll"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <Users className="w-5 h-5" />
              <span className="font-medium">Payroll Engine</span>
            </NavLink>

            <NavLink
              to="/ledger"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <DollarSign className="w-5 h-5" />
              <span className="font-medium">Cash Ledger</span>
            </NavLink>

            <NavLink
              to="/billing"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <FileText className="w-5 h-5" />
              <span className="font-medium">Client Billing</span>
            </NavLink>
          </nav>

          <div className="p-4 border-t border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-blue-500">
                A
              </div>
              <div>
                <p className="text-sm font-medium">Admin User</p>
                <p className="text-xs text-slate-500">System Admin</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-hidden relative">
          <header className="h-16 bg-white border-b border-slate-200 flex items-center px-8 z-10 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-800">Fleet Management System - Prototype</h2>
          </header>
          
          <div className="flex-1 overflow-auto p-8 z-0">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/payroll" element={<Payroll />} />
              <Route path="/ledger" element={<Ledger />} />
              <Route path="/billing" element={<Billing />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;
