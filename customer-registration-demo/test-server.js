const express = require('express');
const path = require('path');
const app = express();

// Mock customer data
const customers = [
  {
    id: 'CUST004',
    customerId: 'CUST004',
    firstName: 'David',
    lastName: 'Wilson',
    email: 'david.wilson@email.com',
    phoneNumber: '55501113',
    status: 'ACTIVE',
    identityVerificationStatus: 'VERIFIED'
  },
  {
    id: 'CUST001',
    customerId: 'CUST001',
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@email.com',
    phoneNumber: '55501234',
    status: 'ACTIVE',
    identityVerificationStatus: 'VERIFIED'
  },
  {
    id: 'CUST002',
    customerId: 'CUST002',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@email.com',
    phoneNumber: '55504567',
    status: 'PENDING',
    identityVerificationStatus: 'IN_PROGRESS'
  }
];

// Serve static files
app.use(express.static('public'));

// API endpoint
app.get('/api/registration/status/:customerId', (req, res) => {
  const { customerId } = req.params;
  
  // Find customer by ID or phone number
  let customer = customers.find(c => c.customerId === customerId || c.phoneNumber === customerId);
  
  if (!customer) {
    return res.status(404).json({
      success: false,
      errors: ['Customer not found']
    });
  }
  
  // Calculate registration progress
  let progress = 0;
  let status = 'pending';
  let nextSteps = [];
  
  if (customer.identityVerificationStatus === 'VERIFIED') {
    progress += 40;
  } else if (customer.identityVerificationStatus === 'IN_PROGRESS') {
    progress += 20;
    nextSteps.push('Identity verification in progress');
  }
  
  if (customer.status === 'ACTIVE') {
    progress += 60;
    status = 'active';
  }
  
  res.json({
    success: true,
    data: {
      status,
      progress,
      nextSteps,
      customer: {
        id: customer.id,
        customerId: customer.customerId,
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        phoneNumber: customer.phoneNumber,
        status: customer.status,
        identityVerificationStatus: customer.identityVerificationStatus
      }
    }
  });
});

// Mock phone numbers endpoint
app.get('/api/registration/phone-numbers', (req, res) => {
  console.log('📱 Serving phone numbers request');
  
  const mockPhoneNumbers = [
    {
      id: 'PN001',
      phoneId: 'N0000001',
      number: '55501113',
      fullNumber: '+1-555-01113',
      countryCode: '1',
      areaCode: '555',
      numberType: 'MOBILE',
      category: 'STANDARD',
      status: 'AVAILABLE',
      price: 0,
      isPortable: true
    },
    {
      id: 'PN002',
      phoneId: 'N0000002',
      number: '55501234',
      fullNumber: '+1-555-01234',
      countryCode: '1',
      areaCode: '555',
      numberType: 'MOBILE',
      category: 'STANDARD',
      status: 'AVAILABLE',
      price: 0,
      isPortable: true
    },
    {
      id: 'PN003',
      phoneId: 'N0000003',
      number: '55504567',
      fullNumber: '+1-555-04567',
      countryCode: '1',
      areaCode: '555',
      numberType: 'MOBILE',
      category: 'STANDARD',
      status: 'AVAILABLE',
      price: 0,
      isPortable: true
    },
    {
      id: 'PN004',
      phoneId: 'N0000004',
      number: '55507890',
      fullNumber: '+1-555-07890',
      countryCode: '1',
      areaCode: '555',
      numberType: 'MOBILE',
      category: 'PREMIUM',
      status: 'AVAILABLE',
      price: 10,
      isPortable: true
    },
    {
      id: 'PN005',
      phoneId: 'N0000005',
      number: '55509876',
      fullNumber: '+1-555-09876',
      countryCode: '1',
      areaCode: '555',
      numberType: 'MOBILE',
      category: 'GOLD',
      status: 'AVAILABLE',
      price: 25,
      isPortable: true
    }
  ];
  
  res.json({
    success: true,
    data: mockPhoneNumbers
  });
});

// Plans endpoint - Now fetching from actual database
app.get('/api/registration/plans', async (req, res) => {
  console.log('📋 Serving plans request from database...');
  
  try {
    // Import Supabase client
    const { createClient } = require('@supabase/supabase-js');
    const supabaseUrl = 'https://ixmxwljqoepepncsburd.supabase.co';
    const supabaseKey = 'sb_publishable_XDD6AHINaBJLbEYaImo0Ag_R48kXmPV';
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Fetch plans from database
    const { data, error } = await supabase
      .from('service_plans')
      .select('*')
      .eq('status', 'ACTIVE');
    
    if (error) {
      console.error('❌ Database error:', error);
      // Fallback to mock data if database fails
      const mockPlans = [
        {
          id: 'BASIC',
          name: 'Basic',
          type: 'POSTPAID',
          price: 29.99,
          monthlyFee: 29.99,
          monthlyRate: 29.99,
          description: 'Perfect for light users',
          data: {
            allowance: 10,
            unit: 'GB',
            validity: '30 days'
          },
          dataAllowance: {
            amount: 10,
            unit: 'GB'
          },
          voiceAllowance: {
            minutes: 1000,
            unit: 'minutes'
          },
          smsAllowance: {
            count: 500,
            unit: 'SMS'
          },
          features: [
            'Unlimited calls',
            '10GB data',
            'Standard support'
          ]
        },
        {
          id: 'STANDARD',
          name: 'Standard',
          type: 'POSTPAID',
          price: 49.99,
          monthlyFee: 49.99,
          monthlyRate: 49.99,
          description: 'Most popular choice',
          data: {
            allowance: 25,
            unit: 'GB',
            validity: '30 days'
          },
          dataAllowance: {
            amount: 25,
            unit: 'GB'
          },
          voiceAllowance: {
            minutes: 2000,
            unit: 'minutes'
          },
          smsAllowance: {
            count: 1000,
            unit: 'SMS'
          },
          features: [
            'Unlimited calls',
            '25GB data',
            'Priority support',
            'Voicemail',
            'Free international calls'
          ]
        }
      ];
      
      return res.json({
        success: true,
        data: mockPlans
      });
    }
    
    // Transform database data to match UI expected format
    const transformedPlans = data.map(plan => ({
      id: plan.plan_id,
      name: plan.name,
      type: plan.type,
      price: plan.monthly_rate,
      monthlyFee: plan.monthly_rate,
      monthlyRate: plan.monthly_rate,
      description: plan.description,
      data: {
        allowance: plan.data_allowance,
        unit: plan.data_unit,
        validity: '30 days'
      },
      dataAllowance: {
        amount: plan.data_allowance,
        unit: plan.data_unit
      },
      voiceAllowance: {
        minutes: plan.voice_minutes,
        unit: 'minutes'
      },
      smsAllowance: {
        count: plan.sms_allowance,
        unit: 'SMS'
      },
      features: plan.features,
      isPopular: plan.name === 'Standard Plus',
      isEnterprise: plan.name === 'Enterprise'
    }));
    
    console.log(`✅ Loaded ${transformedPlans.length} plans from database`);
    res.json({
      success: true,
      data: transformedPlans
    });
    
  } catch (error) {
    console.error('❌ Error fetching plans:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to load plans'
    });
  }
});

// Serve main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Serve plans page
app.get('/plans', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const port = 3300;
const server = app.listen(port, () => {
  console.log(`Test server with API and frontend running on port ${port}`);
  console.log('Available phone numbers for testing:');
  console.log('- 55501113 (David Wilson)');
  console.log('- 55501234 (John Smith)');
  console.log('- 55504567 (Sarah Johnson)');
});

server.on('error', (error) => {
  console.error('Server error:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});