import { useState } from 'react';
import { FileText, Phone, CheckCircle } from 'lucide-react';
import RegisterTab from './components/RegisterTab';
import PlansTab from './components/PlansTab';
import StatusTab from './components/StatusTab';

function App() {
  const [activeTab, setActiveTab] = useState('register');
  const [selectedPlanId, setSelectedPlanId] = useState<string>('');

  const handlePlanSelect = (planId: string) => {
    setSelectedPlanId(planId);
    setActiveTab('register');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-cyan-500 px-8 py-12 text-center">
            <h1 className="text-4xl font-bold text-white mb-2">Customer Registration System</h1>
            <p className="text-blue-100">Telecom Customer Registration - CSP Compliant</p>
          </div>

          <div className="border-b border-gray-200">
            <div className="flex overflow-x-auto">
              <button
                onClick={() => setActiveTab('register')}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                  activeTab === 'register'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <FileText size={20} />
                Register Customer
              </button>
              <button
                onClick={() => setActiveTab('plans')}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                  activeTab === 'plans'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Phone size={20} />
                View Plans
              </button>
              <button
                onClick={() => setActiveTab('status')}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                  activeTab === 'status'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <CheckCircle size={20} />
                Check Status
              </button>
            </div>
          </div>

          <div className="p-8">
            {activeTab === 'register' && <RegisterTab preSelectedPlanId={selectedPlanId} />}
            {activeTab === 'plans' && <PlansTab onSelectPlan={handlePlanSelect} />}
            {activeTab === 'status' && <StatusTab />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
