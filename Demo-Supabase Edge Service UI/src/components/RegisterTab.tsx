import { useState, useEffect, useRef } from 'react';
import { AlertCircle, CheckCircle, ChevronDown } from 'lucide-react';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  servicePhone: string;
  contactPhone: string;
  planId: string;
  dateOfBirth: string;
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface RegisterTabProps {
  preSelectedPlanId?: string;
}

export default function RegisterTab({ preSelectedPlanId }: RegisterTabProps) {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    servicePhone: '',
    contactPhone: '',
    planId: '',
    dateOfBirth: '',
    streetAddress: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'US',
  });

  const [plans, setPlans] = useState<any[]>([]);
  const [phoneNumbers, setPhoneNumbers] = useState<any[]>([]);
  const [filteredPhoneNumbers, setFilteredPhoneNumbers] = useState<any[]>([]);
  const [phoneSearchTerm, setPhoneSearchTerm] = useState('');
  const [isPhoneDropdownOpen, setIsPhoneDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [loadingPhoneNumbers, setLoadingPhoneNumbers] = useState(true);
  const [missingFields, setMissingFields] = useState<string[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadPlans();
    loadPhoneNumbers();
  }, []);

  useEffect(() => {
    if (preSelectedPlanId) {
      setFormData(prev => ({
        ...prev,
        planId: preSelectedPlanId,
      }));
    }
  }, [preSelectedPlanId]);

  useEffect(() => {
    const filtered = phoneNumbers.filter(phone =>
      phone.number.toLowerCase().includes(phoneSearchTerm.toLowerCase())
    );
    setFilteredPhoneNumbers(filtered);
  }, [phoneSearchTerm, phoneNumbers]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsPhoneDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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
    }
  };

  const loadPhoneNumbers = async () => {
    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/get-phone-numbers`;
      const response = await fetch(apiUrl, {
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Failed to load phone numbers');
      const data = await response.json();
      setPhoneNumbers(data || []);
      setFilteredPhoneNumbers(data || []);
    } catch (err: any) {
      setError('Failed to load phone numbers: ' + err.message);
    } finally {
      setLoadingPhoneNumbers(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePhoneSearchChange = (value: string) => {
    setPhoneSearchTerm(value);
    setFormData(prev => ({
      ...prev,
      servicePhone: value,
    }));
    setIsPhoneDropdownOpen(true);
  };

  const handlePhoneSelect = (phoneNumber: string) => {
    setFormData(prev => ({
      ...prev,
      servicePhone: phoneNumber,
    }));
    setPhoneSearchTerm(phoneNumber);
    setIsPhoneDropdownOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setMissingFields([]);

    const missing: string[] = [];
    if (!formData.firstName) missing.push('firstName');
    if (!formData.lastName) missing.push('lastName');
    if (!formData.email) missing.push('email');
    if (!formData.servicePhone) missing.push('servicePhone');
    if (!formData.contactPhone) missing.push('contactPhone');
    if (!formData.planId) missing.push('planId');
    if (!formData.dateOfBirth) missing.push('dateOfBirth');
    if (!formData.city) missing.push('city');
    if (!formData.state) missing.push('state');
    if (!formData.country) missing.push('country');

    if (missing.length > 0) {
      setMissingFields(missing);
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/register-customer`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          servicePhone: formData.servicePhone,
          contactPhone: formData.contactPhone,
          planId: formData.planId,
          dateOfBirth: formData.dateOfBirth,
          streetAddress: formData.streetAddress || null,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode || null,
          country: formData.country,
        }),
      });

      if (!response.ok) {
        try {
          const error = await response.json();
          setError(error.error || 'Failed to register customer');
        } catch {
          setError(`Registration failed with status ${response.status}`);
        }
        return;
      }

      setSuccess(true);
      setMissingFields([]);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        servicePhone: '',
        contactPhone: '',
        planId: '',
        dateOfBirth: '',
        streetAddress: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'US',
      });
      setPhoneSearchTerm('');

      setTimeout(() => setSuccess(false), 5000);
    } catch (err: any) {
      setError('Failed to register customer: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Register New Customer</h2>

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
          <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <h3 className="font-semibold text-green-900">Registration Successful</h3>
            <p className="text-green-800 text-sm">Customer has been registered and will receive confirmation at their email.</p>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <h3 className="font-semibold text-red-900">Error</h3>
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">First Name *</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                missingFields.includes('firstName') ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="John"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name *</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                missingFields.includes('lastName') ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="Doe"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              missingFields.includes('email') ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="john.doe@example.com"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative" ref={dropdownRef}>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Service Phone Number *</label>
            <div className="relative">
              <input
                type="text"
                value={phoneSearchTerm}
                onChange={(e) => handlePhoneSearchChange(e.target.value)}
                onFocus={() => setIsPhoneDropdownOpen(true)}
                className={`w-full px-4 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  missingFields.includes('servicePhone') ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                placeholder={loadingPhoneNumbers ? "Loading numbers..." : "Type or select a number"}
                disabled={loadingPhoneNumbers}
              />
              <ChevronDown
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                size={20}
              />
            </div>
            {isPhoneDropdownOpen && filteredPhoneNumbers.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {filteredPhoneNumbers.map((phone) => (
                  <button
                    key={phone.id}
                    type="button"
                    onClick={() => handlePhoneSelect(phone.number)}
                    className="w-full px-4 py-2 text-left hover:bg-blue-50 focus:bg-blue-50 focus:outline-none transition-colors"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{phone.number}</span>
                      <div className="flex gap-2 text-xs">
                        {phone.is_premium && (
                          <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded">Premium</span>
                        )}
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded">{phone.type}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
            {isPhoneDropdownOpen && phoneSearchTerm && filteredPhoneNumbers.length === 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-4 text-center text-gray-500">
                No matching phone numbers found
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Phone Number *</label>
            <input
              type="tel"
              name="contactPhone"
              value={formData.contactPhone}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                missingFields.includes('contactPhone') ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="+1234567890"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Service Plan *</label>
          <select
            name="planId"
            value={formData.planId}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              missingFields.includes('planId') ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
          >
            <option value="">Select a plan</option>
            {plans.map(plan => (
              <option key={plan.id} value={plan.id}>
                {plan.name} - ${plan.price}/month
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Date of Birth *</label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                missingFields.includes('dateOfBirth') ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Street Address</label>
          <input
            type="text"
            name="streetAddress"
            value={formData.streetAddress}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="123 Main St, Apt 4B"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">City *</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                missingFields.includes('city') ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="New York"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">State *</label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                missingFields.includes('state') ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="NY"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Postal Code</label>
            <input
              type="text"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="10001"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Country *</label>
          <select
            name="country"
            value={formData.country}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              missingFields.includes('country') ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
          >
            <option value="US">United States</option>
            <option value="CA">Canada</option>
            <option value="UK">United Kingdom</option>
            <option value="AU">Australia</option>
          </select>
        </div>

        <div className="flex justify-start pt-2">
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-lg hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Registering...' : 'Register Customer'}
          </button>
        </div>
      </form>
    </div>
  );
}
