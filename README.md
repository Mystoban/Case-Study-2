# Management System

This is an Electron + React application that provides a management system interface.

## Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)
- MongoDB (local installation or MongoDB Atlas account)

## Quick Start

1. Clone the repository:
```bash
git clone <repository-url>
cd <repository-name>
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   Create a `.env` file in the `backend` directory with the following content:
   ```
   # Server Configuration
   PORT=5001

   # MongoDB Connection
   MONGODB_URI=mongodb://localhost:27017/barangay_management

   # JWT Configuration
   JWT_SECRET=your_jwt_secret_key_here

   # CORS Configuration
   ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5001

   # Default Admin Credentials
   DEFAULT_ADMIN_USERNAME=admin
   DEFAULT_ADMIN_PASSWORD=admin123
   ```

   Important notes:
   - If using MongoDB Atlas, replace MONGODB_URI with your Atlas connection string
   - Use the same JWT_SECRET across all installations
   - Add your frontend URL to ALLOWED_ORIGINS if different from default

4. Start the backend server:
```bash
cd backend
npm start
```

5. In a new terminal, start the frontend:
```bash
npm run electron-react
```

## Available Scripts

- `npm run electron-react` - Starts the application in development mode
- `npm run build` - Builds the application for production
- `npm start` - Starts the React development server
- `npm test` - Runs the test suite
- `npm run lint` - Runs the linter
- `npm run format` - Formats the code using Prettier

## Project Structure

- `/src` - React application source code
- `/public` - Static files
- `/backend` - Backend server code
- `main.js` - Electron main process file

## Troubleshooting

If you encounter any issues:

1. Make sure MongoDB is running and accessible
2. Check that all environment variables are properly set
3. Ensure the JWT_SECRET is the same across all installations
4. Verify that the ALLOWED_ORIGINS includes your frontend URL
5. If you get authentication errors:
   - Clear your browser's local storage
   - Log out and log back in
   - Check the backend console for detailed error messages

## Security Notes

- Change the default admin credentials in production
- Use a strong JWT_SECRET
- Restrict ALLOWED_ORIGINS to only necessary domains
- Use HTTPS in production
- Never commit the `.env` file to version control 