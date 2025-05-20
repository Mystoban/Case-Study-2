# Management System

This is an Electron + React application that provides a management system interface.

## Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)

## Quick Start

1. Clone the repository:
```bash
git clone <repository-url>
cd <repository-name>
```

2. The dependencies will be automatically installed after cloning. If they don't install automatically, run:
```bash
npm install
```

3. To start the application in development mode:
```bash
npm run electron-react
```

4. To build the application for production:
```bash
npm run build
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

1. Make sure you have Node.js installed (v14 or higher)
2. Delete the `node_modules` folder and `package-lock.json`
3. Run `npm install` again
4. If the issue persists, try clearing npm cache: `npm cache clean --force` 