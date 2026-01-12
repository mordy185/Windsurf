import { useState } from 'react';
import { Search, AlertCircle, CheckCircle } from 'lucide-react';

interface CustomerStatus {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  status: string;
  created_at: string;
}

export default function StatusTab() {
  const [searchPhone, setSearchPhone] = useState('');
  const [customer, setCustomer] = useState<CustomerStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setCustomer(null);
    setSearched(true);

    if (!searchPhone.trim()) {
      setError('Please enter a service phone number');
      return;
    }

    setLoading(true);

    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/check-status?servicePhone=${encodeURIComponent(searchPhone)}`;
      const response = await fetch(apiUrl, {
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 404) {
        setError('No customer found with this service phone number');
        return;
      }

      if (!response.ok) {
        const error = await response.json();
        setError(error.error || 'Failed to search');
        return;
      }

      const data = await response.json();
      setCustomer(data);
    } catch (err: any) {
      setError('Failed to search: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Check Registration Status</h2>

      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="tel"
              value={searchPhone}
              onChange={(e) => setSearchPhone(e.target.value)}
              placeholder="Enter service phone number"
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-lg hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <h3 className="font-semibold text-red-900">Search Result</h3>
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        </div>
      )}

      {customer && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border-2 border-blue-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{customer.first_name} {customer.last_name}</h3>
                <p className="text-gray-600">{customer.email}</p>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full font-semibold bg-green-100 text-green-800">
                <CheckCircle size={20} />
                <span>Registered</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600 text-sm">Phone Number</p>
                <p className="text-gray-900 font-semibold">{customer.phone_number}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Registration Date</p>
                <p className="text-gray-900 font-semibold">{formatDate(customer.created_at)}</p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
            <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <h4 className="font-semibold text-green-900">Registration Found</h4>
              <p className="text-green-800 text-sm">Your registration has been successfully processed and recorded in our system.</p>
            </div>
          </div>
        </div>
      )}

      {searched && !customer && !error && (
        <div className="text-center py-12">
          <AlertCircle className="mx-auto text-gray-400 mb-4" size={48} />
          <p className="text-gray-600">Enter a service phone number and click search to check the registration status</p>
        </div>
      )}

      {!searched && (
        <div className="text-center py-12">
          <Search className="mx-auto text-gray-400 mb-4" size={48} />
          <p className="text-gray-600">Enter a service phone number to check registration status</p>
        </div>
      )}
    </div>
  );
}
