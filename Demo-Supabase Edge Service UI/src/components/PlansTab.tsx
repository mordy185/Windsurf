import { useState, useEffect } from 'react';
import { Check, Zap } from 'lucide-react';

interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  data_gb: number;
  call_minutes: number;
  sms_count: number;
  features: string[];
  is_popular: boolean;
}

interface PlansTabProps {
  onSelectPlan: (planId: string) => void;
}

export default function PlansTab({ onSelectPlan }: PlansTabProps) {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/get-plans`;
      const response = await fetch(apiUrl, {
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Failed to load plans');
      const data = await response.json();
      setPlans(data || []);
    } catch (err: any) {
      setError('Failed to load plans: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-gray-600">Loading plans...</div>;
  }

  if (error) {
    return <div className="text-center py-12 text-red-600">{error}</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-8">Available Service Plans</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`relative rounded-xl border-2 transition-all ${
              plan.is_popular
                ? 'border-blue-500 shadow-2xl transform md:scale-105'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            {plan.is_popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-orange-400 to-red-500 text-white text-sm font-bold rounded-full">
                MOST POPULAR
              </div>
            )}

            <div className={`p-6 ${plan.is_popular ? 'bg-gradient-to-b from-blue-50 to-white' : 'bg-white'}`}>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
              <p className="text-gray-600 text-sm mb-4">{plan.description}</p>

              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">${plan.price.toFixed(2)}</span>
                <span className="text-gray-600 text-sm">/month</span>
              </div>

              <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                <div className="flex items-center gap-2 text-gray-700">
                  <span className="text-lg font-semibold">{plan.data_gb}</span>
                  <span className="text-sm text-gray-600">GB Data</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <span className="text-lg font-semibold">{plan.call_minutes.toLocaleString()}</span>
                  <span className="text-sm text-gray-600">Minutes Calls</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <span className="text-lg font-semibold">{plan.sms_count.toLocaleString()}</span>
                  <span className="text-sm text-gray-600">SMS</span>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                {(plan.features || []).map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <Check className="text-green-500 flex-shrink-0 mt-0.5" size={18} />
                    <span className="text-gray-700 text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => onSelectPlan(plan.id)}
                className={`w-full py-3 font-semibold rounded-lg transition-all ${
                  plan.is_popular
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:shadow-lg'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                Select Plan
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 p-6 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-start gap-3">
          <Zap className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <h4 className="font-semibold text-gray-900 mb-1">All Plans Include</h4>
            <p className="text-gray-700 text-sm">24/7 customer support, Free roaming within network, Automatic billing, Easy plan upgrades</p>
          </div>
        </div>
      </div>
    </div>
  );
}
