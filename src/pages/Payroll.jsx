import { useState } from 'react';
import { Calculator, FileText, CheckCircle2, Users, Mail, Loader2 } from 'lucide-react';

const mockEmployees = [
  { id: 'e1', name: 'John Doe', role: 'Driver', baseRate: 100, nightRate: 150 },
  { id: 'e2', name: 'Jane Smith', role: 'Driver', baseRate: 110, nightRate: 160 },
  { id: 'e3', name: 'Mike Ross', role: 'Helper', baseRate: 80, nightRate: 120 },
];

// Mocking weekly logged hours for the batch
const mockWeeklyLogs = {
  'e1': { hoursWorked: 48, nightHours: 20, deMinimis: 1000 },
  'e2': { hoursWorked: 45, nightHours: 15, deMinimis: 1000 },
  'e3': { hoursWorked: 40, nightHours: 0, deMinimis: 500 },
};

export default function Payroll() {
  const [mode, setMode] = useState('single'); // 'single' | 'batch'
  const [selectedEmployee, setSelectedEmployee] = useState(mockEmployees[0]);
  const [hoursWorked, setHoursWorked] = useState(10); 
  const [nightHours, setNightHours] = useState(8); 
  const [deMinimis, setDeMinimis] = useState(500);

  const [isProcessingBatch, setIsProcessingBatch] = useState(false);
  const [batchResults, setBatchResults] = useState(null);

  // Single Calculation Logic (Daily)
  const effectiveStandardHours = Math.min(hoursWorked, 8);
  const standardPay = effectiveStandardHours * selectedEmployee.baseRate;
  const overtimeHours = Math.max(0, hoursWorked - 8);
  const overtimePay = overtimeHours * (selectedEmployee.baseRate * 1.25);
  const effectiveNightHours = Math.min(nightHours, 6);
  const nightPay = effectiveNightHours * selectedEmployee.nightRate;
  const taxableIncome = standardPay + overtimePay + nightPay;
  const taxDeduction = taxableIncome * 0.10; 
  const netPay = (taxableIncome - taxDeduction) + Number(deMinimis);

  // Batch Calculation Logic (Weekly)
  const handleRunBatch = () => {
    setIsProcessingBatch(true);
    
    setTimeout(() => {
      const results = mockEmployees.map(emp => {
        const log = mockWeeklyLogs[emp.id];
        // For a week, let's say max standard is 40 (8x5)
        const stdHrs = Math.min(log.hoursWorked, 40);
        const otHrs = Math.max(0, log.hoursWorked - 40);
        const nHrs = Math.min(log.nightHours, 30); // max 6x5
        
        const stdPay = stdHrs * emp.baseRate;
        const otPay = otHrs * (emp.baseRate * 1.25);
        const nPay = nHrs * emp.nightRate;
        const taxable = stdPay + otPay + nPay;
        const tax = taxable * 0.10;
        const net = (taxable - tax) + log.deMinimis;

        return {
          ...emp,
          stdHrs, otHrs, nHrs, stdPay, otPay, nPay, tax, deMinimis: log.deMinimis, net
        };
      });
      
      setBatchResults(results);
      setIsProcessingBatch(false);
    }, 1500);
  };

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-6 h-full pb-10">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Payroll Engine</h1>
          <p className="text-slate-500">Calculate employee shifts and generate payslips with strict compliance.</p>
        </div>
        
        <div className="bg-slate-200 p-1 rounded-lg flex gap-1">
          <button 
            onClick={() => setMode('single')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${mode === 'single' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-600 hover:bg-slate-300'}`}
          >
            Single Calculator
          </button>
          <button 
            onClick={() => setMode('batch')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${mode === 'batch' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-600 hover:bg-slate-300'}`}
          >
            Batch Automation
          </button>
        </div>
      </div>

      {mode === 'single' ? (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* Single Input Form */}
          <div className="md:col-span-5 bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2 mb-6">
              <Calculator className="w-5 h-5 text-blue-500" />
              Daily Shift Details
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Employee</label>
                <select 
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-blue-500 transition-colors"
                  value={selectedEmployee.id}
                  onChange={(e) => setSelectedEmployee(mockEmployees.find(emp => emp.id === e.target.value))}
                >
                  {mockEmployees.map(emp => (
                    <option key={emp.id} value={emp.id}>{emp.name} ({emp.role})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Base Rate / Hr</label>
                  <div className="bg-slate-100 border border-slate-200 rounded-lg px-3 py-2 text-slate-600 font-mono">
                    ₱{selectedEmployee.baseRate}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Night Rate / Hr</label>
                  <div className="bg-slate-100 border border-slate-200 rounded-lg px-3 py-2 text-slate-600 font-mono">
                    ₱{selectedEmployee.nightRate}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <label className="block text-sm font-medium text-slate-700 mb-1">Total Hours Worked</label>
                <input 
                  type="number" 
                  min="0"
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500 transition-colors"
                  value={hoursWorked}
                  onChange={(e) => setHoursWorked(Number(e.target.value))}
                />
                <p className="text-xs text-slate-500 mt-1">* Max 8 hours for standard rate.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Night Shift Hours</label>
                <input 
                  type="number" 
                  min="0"
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500 transition-colors"
                  value={nightHours}
                  onChange={(e) => setNightHours(Number(e.target.value))}
                />
                <p className="text-xs text-slate-500 mt-1">* Max 6 hours eligible for night diff.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">De Minimis Benefits (Non-taxable)</label>
                <input 
                  type="number" 
                  min="0"
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500 transition-colors"
                  value={deMinimis}
                  onChange={(e) => setDeMinimis(Number(e.target.value))}
                />
              </div>
            </div>
          </div>

          {/* Payslip View */}
          <div className="md:col-span-7 bg-slate-900 rounded-2xl shadow-xl border border-slate-800 p-8 text-white relative overflow-hidden">
            {/* Decorative glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full blur-[100px] opacity-20 pointer-events-none transform translate-x-1/2 -translate-y-1/2"></div>
            
            <div className="flex justify-between items-start mb-8 relative z-10">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <FileText className="w-6 h-6 text-blue-400" />
                  Payslip Preview
                </h2>
                <p className="text-slate-400 mt-1">Generated dynamically</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-lg">{selectedEmployee.name}</p>
                <p className="text-slate-400 text-sm">{selectedEmployee.role}</p>
              </div>
            </div>

            <div className="space-y-6 relative z-10">
              {/* Standard Pay */}
              <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 flex justify-between items-center">
                <div>
                  <p className="text-sm text-slate-400">Standard Pay (Max 8 hrs)</p>
                  <p className="font-medium">{effectiveStandardHours} hrs @ ₱{selectedEmployee.baseRate}</p>
                </div>
                <p className="text-lg font-mono font-semibold">₱{standardPay.toLocaleString()}</p>
              </div>

              <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 flex justify-between items-center">
                <div>
                  <p className="text-sm text-slate-400">Overtime Pay</p>
                  <p className="font-medium">{overtimeHours} hrs @ ₱{(selectedEmployee.baseRate * 1.25).toFixed(2)}</p>
                </div>
                <p className="text-lg font-mono font-semibold">₱{overtimePay.toLocaleString()}</p>
              </div>

              {/* Night Diff */}
              <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 flex justify-between items-center relative">
                {nightHours > 6 && (
                  <div className="absolute -top-3 right-4 bg-yellow-500/20 text-yellow-400 text-xs px-2 py-1 rounded-md border border-yellow-500/30 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Capped at 6 hrs
                  </div>
                )}
                <div>
                  <p className="text-sm text-slate-400">Night Differential (Max 6 hrs)</p>
                  <p className="font-medium">{effectiveNightHours} hrs @ ₱{selectedEmployee.nightRate}</p>
                </div>
                <p className="text-lg font-mono font-semibold">₱{nightPay.toLocaleString()}</p>
              </div>

              {/* Tax */}
              <div className="flex justify-between items-center px-4 py-2 text-red-400 border-b border-slate-700">
                <p className="text-sm">Income Tax (10% of Taxable Income)</p>
                <p className="font-mono">- ₱{taxDeduction.toLocaleString()}</p>
              </div>

              {/* De Minimis */}
              <div className="flex justify-between items-center px-4 py-2 text-green-400">
                <p className="text-sm">De Minimis Benefits (Non-taxable)</p>
                <p className="font-mono">+ ₱{Number(deMinimis).toLocaleString()}</p>
              </div>

              {/* Total */}
              <div className="mt-8 bg-blue-600 rounded-xl p-5 flex justify-between items-center shadow-lg shadow-blue-900/50">
                <p className="text-blue-100 font-medium">Net Take-Home Pay</p>
                <p className="text-3xl font-bold font-mono">₱{netPay.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <div className="text-center max-w-xl mx-auto mb-10">
            <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Weekly Batch Automation</h2>
            <p className="text-slate-500">Automatically calculate the weekly pay for all {mockEmployees.length} active employees based on their logged timesheets, enforcing all labor caps instantly.</p>
            
            {!batchResults && (
              <button 
                onClick={handleRunBatch}
                disabled={isProcessingBatch}
                className="mt-6 bg-slate-900 hover:bg-slate-800 text-white font-medium px-8 py-3 rounded-lg transition-all flex items-center justify-center gap-2 mx-auto w-64"
              >
                {isProcessingBatch ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
                ) : (
                  <><Calculator className="w-5 h-5" /> Run Weekly Batch</>
                )}
              </button>
            )}
          </div>

          {batchResults && (
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-green-50 border border-green-200 p-4 rounded-xl text-green-800">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                  <div>
                    <p className="font-semibold">Batch Processed Successfully</p>
                    <p className="text-sm text-green-700">All strict rules applied to 3 employees.</p>
                  </div>
                </div>
                <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4" />
                  Auto-Email Payslips
                </button>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Employee</th>
                      <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Total Hrs</th>
                      <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Night Hrs</th>
                      <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Gross Taxable</th>
                      <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase text-red-500">Tax (-10%)</th>
                      <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase text-green-600">De Minimis</th>
                      <th className="px-4 py-3 text-xs font-semibold text-slate-800 uppercase text-right">Net Pay</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {batchResults.map(emp => (
                      <tr key={emp.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3 whitespace-nowrap font-medium text-slate-800">
                          {emp.name} <span className="text-xs text-slate-400 font-normal ml-1">({emp.role})</span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-600">
                          {emp.stdHrs + emp.otHrs}h <span className="text-xs text-slate-400">({emp.otHrs} OT)</span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-600">
                          {emp.nHrs}h
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-600 font-mono">
                          ₱{(emp.stdPay + emp.otPay + emp.nPay).toLocaleString()}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-red-500 font-mono">
                          - ₱{emp.tax.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-green-600 font-mono">
                          + ₱{emp.deMinimis.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-right font-mono font-bold text-slate-800">
                          ₱{emp.net.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-slate-50 font-bold border-t-2 border-slate-200">
                      <td colSpan={6} className="px-4 py-4 text-right text-slate-600">Total Payroll Disbursement:</td>
                      <td className="px-4 py-4 text-right text-xl font-mono text-blue-600">
                        ₱{batchResults.reduce((acc, curr) => acc + curr.net, 0).toLocaleString()}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
