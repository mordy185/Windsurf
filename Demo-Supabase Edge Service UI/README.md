# Customer Registration System

A modern, CSP-compliant telecom customer registration system built with React, TypeScript, and Supabase. This system allows telecom service providers to efficiently register new customers, manage service plans, and track phone number assignments.

## Features

### Customer Registration
- Complete customer profile management with personal and contact information
- Auto-generated customer IDs in format `C0000001`, `C0000002`, etc.
- Service and contact phone number management
- Address information collection
- Date of birth validation
- Email management (supports multiple customers with same email)

### Phone Number Management
- Browse available phone numbers
- Search and filter phone numbers
- Premium number identification
- Phone number type classification (local, toll-free)
- Unique service phone number assignment per customer

### Service Plans
- View available service plans with pricing
- Plan details including data, minutes, and features
- Select plans during customer registration
- Direct plan selection from plans view

### Status Tracking
- Look up customer information by phone number or customer ID
- View registration status and details
- Quick verification of customer data

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Backend**: Supabase (PostgreSQL database + Edge Functions)
- **Deployment**: Serverless Edge Functions

## Architecture

### Database Schema
- **customers**: Customer information with auto-generated IDs
- **phone_numbers**: Available phone numbers inventory
- **plans**: Service plan definitions
- Row Level Security (RLS) enabled for data protection

### Edge Functions
- `register-customer`: Handles new customer registration
- `get-plans`: Retrieves available service plans
- `get-phone-numbers`: Fetches available phone numbers
- `check-status`: Looks up customer registration status

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Supabase account and project
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/Windsurf-Repo.git
cd Windsurf-Repo
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Run database migrations:

The migrations are located in `supabase/migrations/`. Apply them in your Supabase project:
- `20260112150624_clean_duplicates_and_update_constraints.sql`
- `20260112153833_make_optional_fields_nullable.sql`

5. Deploy Edge Functions:

The Edge Functions in `supabase/functions/` need to be deployed to your Supabase project.

6. Start the development server:
```bash
npm run dev
```

7. Build for production:
```bash
npm run build
```

## Project Structure

```
├── src/
│   ├── components/
│   │   ├── RegisterTab.tsx    # Customer registration form
│   │   ├── PlansTab.tsx        # Service plans display
│   │   └── StatusTab.tsx       # Customer status lookup
│   ├── lib/
│   │   └── supabase.ts         # Supabase client configuration
│   ├── App.tsx                 # Main application component
│   └── main.tsx               # Application entry point
├── supabase/
│   ├── functions/              # Supabase Edge Functions
│   │   ├── register-customer/
│   │   ├── get-plans/
│   │   ├── get-phone-numbers/
│   │   └── check-status/
│   └── migrations/            # Database migrations
├── public/                    # Static assets
└── package.json              # Project dependencies
```

## Database Features

### Auto-Generated Customer IDs
- Sequential format: `C0000001`, `C0000002`, etc.
- Automatically assigned on customer creation
- Unique constraint enforced

### Data Validation
- Unique service phone numbers per customer
- Required fields: first name, last name, email, phone numbers, city, state, country
- Optional fields: street address, postal code
- Date of birth validation

### Security
- Row Level Security (RLS) enabled on all tables
- Secure API endpoints through Supabase Edge Functions
- Environment-based configuration

## API Endpoints

All Edge Functions are accessible at:
```
https://[your-project-ref].supabase.co/functions/v1/[function-name]
```

### Register Customer
**POST** `/register-customer`
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "servicePhone": "+1234567890",
  "contactPhone": "+1234567890",
  "planId": "uuid",
  "dateOfBirth": "1990-01-01",
  "streetAddress": "123 Main St",
  "city": "New York",
  "state": "NY",
  "postalCode": "10001",
  "country": "US"
}
```

### Get Plans
**GET** `/get-plans`

### Get Phone Numbers
**GET** `/get-phone-numbers`

### Check Status
**POST** `/check-status`
```json
{
  "phoneNumber": "+1234567890"
}
```
or
```json
{
  "customerId": "C0000001"
}
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking

### Code Quality

- ESLint configured for React and TypeScript
- TypeScript strict mode enabled
- Tailwind CSS for consistent styling

## Design Features

- Modern gradient-based UI with professional color scheme
- Fully responsive design for mobile and desktop
- Clean typography with proper visual hierarchy
- Loading states and error handling
- Success feedback and validation messages
- Accessible form controls

## Compliance

This system is designed to meet CSP (Communications Service Provider) compliance requirements for customer registration and data management.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is private and proprietary.

## Support

For support, please open an issue in the GitHub repository.

## Acknowledgments

- Built with [React](https://react.dev/)
- Powered by [Supabase](https://supabase.com/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons by [Lucide](https://lucide.dev/)
