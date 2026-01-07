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
  
  // Return customer status with progress and next steps
  const statusData = {
    success: true,
    data: {
      customer: customer,
      status: customer.status.toLowerCase(),
      progress: customer.status === 'ACTIVE' ? 100 : customer.status === 'PENDING' ? 60 : 30,
      nextSteps: customer.status === 'ACTIVE' ? [] : 
               customer.status === 'PENDING' ? ['Complete identity verification', 'Select service plan'] :
               ['Submit identity documents', 'Wait for verification']
    }
  };
  
  res.json(statusData);
});

// Mock phone numbers endpoint
app.get('/api/registration/phone-numbers', (req, res) => {
  const phoneNumbers = [
    {
      id: 'PN001',
      number: '55501113',
      fullNumber: '+155501113',
      category: 'STANDARD',
      status: 'ASSIGNED',
      customerId: 'CUST004',
      assignedAt: new Date('2024-01-12')
    },
    {
      id: 'PN002',
      number: '55501234',
      fullNumber: '+155501234',
      category: 'STANDARD',
      status: 'ASSIGNED',
      customerId: 'CUST001',
      assignedAt: new Date('2024-01-10')
    },
    {
      id: 'PN003',
      number: '55504567',
      fullNumber: '+155504567',
      category: 'STANDARD',
      status: 'ASSIGNED',
      customerId: 'CUST002',
      assignedAt: new Date('2024-01-11')
    },
    {
      id: 'PN004',
      number: '55507890',
      fullNumber: '+155507890',
      category: 'PREMIUM',
      status: 'AVAILABLE',
      customerId: null,
      assignedAt: null
    },
    {
      id: 'PN005',
      number: '55509876',
      fullNumber: '+155509876',
      category: 'STANDARD',
      status: 'AVAILABLE',
      customerId: null,
      assignedAt: null
    }
  ];
  
  res.json({
    success: true,
    data: phoneNumbers
  });
});

// Mock plans endpoint
app.get('/api/registration/plans', (req, res) => {
  console.log('📋 Serving plans request');
  
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
        'Voicemail'
      ]
    },
    {
      id: 'ENTERPRISE',
      name: 'Enterprise',
      type: 'POSTPAID',
      price: 79.99,
      monthlyFee: 79.99,
      monthlyRate: 79.99,
      description: 'Ultimate business solution',
      data: {
        allowance: 100,
        unit: 'GB',
        validity: '30 days'
      },
      dataAllowance: {
        amount: 100,
        unit: 'GB'
      },
      voiceAllowance: {
        minutes: 5000,
        unit: 'minutes'
      },
      smsAllowance: {
        count: 2000,
        unit: 'SMS'
      },
      features: [
        'Unlimited calls',
        '100GB data',
        '24/7 dedicated support',
        'International roaming',
        'Priority service'
      ],
      isPopular: false,
      isEnterprise: true
    }
  ];
  
  res.json({
    success: true,
    data: mockPlans
  });
});

// Frontend routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/plans', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
const PORT = 3300;
app.listen(PORT, () => {
  console.log(`Test server with API and frontend running on port ${PORT}`);
  console.log('\nAvailable phone numbers for testing:');
  customers.forEach(customer => {
    console.log(`- ${customer.phoneNumber} (${customer.firstName} ${customer.lastName})`);
  });
});