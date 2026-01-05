# Customer Registration Demo

A comprehensive telecom customer registration system with advanced features including:

## 🚀 Features

- **📱 Searchable Phone Dropdown**: Real-time filtering of available phone numbers
- **📋 Tabbed Interface**: Organized registration, status checking, and plan viewing
- **🔢 Phone Count**: Display summary of available phone numbers by status
- **🌐 RESTful API**: Complete backend with TypeScript and Express
- **📊 Database Integration**: PostgreSQL with Supabase hosting
- **🎨 Modern UI**: Responsive design with TailwindCSS styling

## 🛠️ Technology Stack

- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL (Supabase)
- **Frontend**: HTML5, CSS3, JavaScript
- **Styling**: TailwindCSS
- **API**: RESTful endpoints with JSON responses

## 📋 API Endpoints

- `POST /api/registration/register` - Register new customer
- `GET /api/registration/status/:customerId` - Check registration status
- `GET /api/registration/plans` - Get available service plans
- `GET /api/registration/phone-numbers` - Get available phone numbers
- `POST /api/registration/validate` - Validate registration request

## 🚀 Quick Start

1. **Navigate to Project Directory**
   ```bash
   cd projects/customer-registration-demo
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment**
   ```bash
   cp .env.example .env
   # Update .env with your database credentials
   ```

4. **Setup Database**
   ```bash
   npm run setup-db
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

6. **Access Application**
   Open: `http://localhost:3000`

## 📱 Features Demonstration

### Searchable Phone Dropdown
- Type to filter phone numbers in real-time
- Shows number, category, and status
- Auto-populates from database

### Tabbed Interface
- **Register Customer**: Complete registration form
- **Check Status**: Query customer registration status
- **View Plans**: Browse available service plans
- **API Docs**: Interactive API documentation

### Phone Number Management
- **Count Phone Numbers**: Shows total, available, reserved, and assigned numbers
- **Refresh Numbers**: Reload phone number list
- **Search**: Filter by number, category, or status

## 🏗️ Project Structure

```
customer-registration-demo/
├── src/
│   ├── server.ts              # Main server application
│   ├── controllers/           # API route handlers
│   ├── services/             # Business logic services
│   ├── entities/             # Data models and types
│   ├── config/               # Database and app configuration
│   └── types/                # TypeScript type definitions

├── public/
│   ├── index.html            # Main frontend application
│   ├── styles/               # CSS stylesheets
│   └── assets/               # Static assets

├── package.json
├── tsconfig.json
├── jest.config.js
└── README.md
```

## 📊 Database Schema

The application uses the following main entities:
- **Customers**: Customer information and profiles
- **PhoneNumbers**: Available and assigned phone numbers
- **ServicePlans**: Mobile service plans and pricing
- **SIMCards**: Physical SIM card management
- **Subscriptions**: Customer subscription records

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run test` - Run test suite
- `npm run setup-db` - Initialize database

### Environment Variables

```env
DATABASE_URL=postgresql://username:password@localhost:5432/dbname
PORT=3000
NODE_ENV=development
```

## 🌐 Repository Information

This project is part of the **Windsurf Repository**:
- **Main Repository**: https://github.com/mordy185/Windsurf
- **Project Path**: `projects/customer-registration-demo/`
- **Parent Organization**: Windsurf Projects

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Navigate to the project directory
2. Fork the main Windsurf repository
3. Create a feature branch
4. Commit your changes
5. Create a Pull Request with project context

## 📞 Support

For questions or support, please open an issue in the main Windsurf repository.

---

**Built with ❤️ using Node.js, TypeScript, and PostgreSQL**

**Part of the Windsurf Project Collection**