import { useState } from 'react';
import { FileText, Send, Building2, Calendar, FileSpreadsheet, Download } from 'lucide-react';
import { format } from 'date-fns';

const mockClients = [
  { id: 'c1', name: 'Acme Logistics Corp', email: 'billing@acmelogistics.com' },
  { id: 'c2', name: 'Global Supply Inc.', email: 'accounts@globalsupply.com' },
];

const mockUnbilledTrips = {
  'c1': [
    { id: 't1', date: new Date(Date.now() - 86400000 * 5).toISOString(), origin: 'Manila Port', dest: 'Quezon City', amount: 15000 },
    { id: 't2', date: new Date(Date.now() - 86400000 * 2).toISOString(), origin: 'Manila Port', dest: 'Makati', amount: 12000 },
    { id: 't3', date: new Date().toISOString(), origin: 'Navotas', dest: 'Pasig', amount: 9500 },
  ],
  'c2': [
    { id: 't4', date: new Date(Date.now() - 86400000 * 10).toISOString(), origin: 'Batangas Port', dest: 'Alabang', amount: 25000 },
  ]
};

export default function Billing() {
  const [selectedClient, setSelectedClient] = useState(mockClients[0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSOA, setShowSOA] = useState(false);

  const trips = mockUnbilledTrips[selectedClient.id] || [];
  const totalAmount = trips.reduce((acc, curr) => acc + curr.amount, 0);

  const handleGenerateSOA = () => {
    setIsGenerating(true);
    setShowSOA(false);
    setTimeout(() => {
      setIsGenerating(false);
      setShowSOA(true);
    }, 1500);
  };

  const handleClientChange = (c) => {
    setSelectedClient(c);
    setShowSOA(false);
  };

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-6 h-full pb-10">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Client Billing & SOA</h1>
        <p className="text-slate-500">Automate your invoicing by consolidating unpaid trips into Statements of Account.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-full">
        {/* Client Selection Sidebar */}
        <div className="md:col-span-4 bg-white rounded-2xl shadow-sm border border-slate-200 p-6 h-fit">
          <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-500" />
            Active Clients
          </h2>
          <div className="space-y-2">
            {mockClients.map(client => {
              const clientTrips = mockUnbilledTrips[client.id] || [];
              const pendingAmount = clientTrips.reduce((acc, curr) => acc + curr.amount, 0);
              
              return (
                <button
                  key={client.id}
                  onClick={() => handleClientChange(client)}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    selectedClient.id === client.id 
                      ? 'bg-blue-50 border-blue-200' 
                      : 'bg-slate-50 border-slate-100 hover:border-slate-200'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <p className={`font-medium ${selectedClient.id === client.id ? 'text-blue-800' : 'text-slate-800'}`}>
                      {client.name}
                    </p>
                  </div>
                  <p className="text-sm text-slate-500">{clientTrips.length} unpaid trips</p>
                  <p className="text-sm font-semibold text-slate-700 mt-2 font-mono">
                    ₱{pendingAmount.toLocaleString()} pending
                  </p>
                </button>
              )
            })}
          </div>
        </div>

        {/* SOA Generation Area */}
        <div className="md:col-span-8 bg-white rounded-2xl shadow-sm border border-slate-200 p-8 flex flex-col">
          {!showSOA ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                <FileSpreadsheet className="w-10 h-10 text-blue-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Consolidate Trips for {selectedClient.name}</h3>
              <p className="text-slate-500 max-w-md mb-8">
                There are {trips.length} unbilled trips pending for this client. Generate a formal Statement of Account to send for collection.
              </p>
              
              <button 
                onClick={handleGenerateSOA}
                disabled={isGenerating || trips.length === 0}
                className="bg-slate-900 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium px-8 py-3 rounded-lg transition-all flex items-center gap-2"
              >
                {isGenerating ? (
                  <span className="animate-pulse">Generating PDF...</span>
                ) : (
                  <>Generate Statement of Account</>
                )}
              </button>
            </div>
          ) : (
            <div className="flex flex-col h-full animate-in fade-in zoom-in-95 duration-300">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-slate-800">SOA Preview</h3>
                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                    <Download className="w-4 h-4" /> Download PDF
                  </button>
                  <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                    <Send className="w-4 h-4" /> Send via Email
                  </button>
                </div>
              </div>
              
              {/* Mock PDF Document */}
              <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-8 shadow-inner overflow-y-auto">
                <div className="bg-white p-10 shadow-sm border border-slate-200 min-h-[500px]">
                  <div className="flex justify-between items-start border-b pb-6 mb-6">
                    <div>
                      <h1 className="text-3xl font-bold text-slate-800 uppercase tracking-tight">Statement of Account</h1>
                      <p className="text-slate-500 mt-1">FleetPro Logistics Inc.</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-slate-600 uppercase">SOA No. #1042-A</p>
                      <p className="text-sm text-slate-500">Date: {format(new Date(), 'MMMM dd, yyyy')}</p>
                    </div>
                  </div>
                  
                  <div className="mb-8">
                    <p className="text-sm text-slate-500 uppercase font-semibold mb-1">Bill To:</p>
                    <p className="font-bold text-lg text-slate-800">{selectedClient.name}</p>
                    <p className="text-slate-600">{selectedClient.email}</p>
                  </div>
                  
                  <table className="w-full text-left mb-8">
                    <thead>
                      <tr className="border-b-2 border-slate-800">
                        <th className="py-3 text-sm font-semibold text-slate-800">Date</th>
                        <th className="py-3 text-sm font-semibold text-slate-800">Route / Description</th>
                        <th className="py-3 text-sm font-semibold text-slate-800 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {trips.map(trip => (
                        <tr key={trip.id}>
                          <td className="py-3 text-sm text-slate-600">{format(new Date(trip.date), 'MMM dd, yyyy')}</td>
                          <td className="py-3 text-sm text-slate-800 font-medium">Trip: {trip.origin} to {trip.dest}</td>
                          <td className="py-3 text-sm font-mono text-slate-800 text-right">₱{trip.amount.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  <div className="flex justify-end">
                    <div className="w-64">
                      <div className="flex justify-between py-2 text-sm border-b border-slate-200">
                        <span className="text-slate-600">Subtotal</span>
                        <span className="font-mono text-slate-800">₱{totalAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between py-2 text-sm border-b border-slate-200">
                        <span className="text-slate-600">Tax (12% VAT)</span>
                        <span className="font-mono text-slate-800">₱{(totalAmount * 0.12).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between py-3 font-bold text-lg mt-2">
                        <span className="text-slate-800">Total Due</span>
                        <span className="font-mono text-blue-600">₱{(totalAmount * 1.12).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-16 text-center text-sm text-slate-500">
                    <p>Please make payment within 15 days of receiving this invoice.</p>
                    <p>Thank you for your business!</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
