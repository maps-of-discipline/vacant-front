# Moscow Polytechnic University | Applications

[Main portal](https://vm.mospolytech.ru)

Web application for submission, processing, and viewing of Moscow Polytechnic University student applications. Built with Vue 3 + Vite using PrimeVue, Pinia, and PrimeFlex.

## Features

- **Authentication system** with support for external users
- **Application management**:
  - Create and submit different types of applications
  - Track application status
  - Upload required documents
  - Edit draft applications
- **Staff tools**:
  - Process student applications
  - Add comments to applications
  - Change application status
- **RUP comparison tool** for academic plan analysis
- **Dark/light theme** support
- **Responsive design**

## Tech Stack

- [Vue 3](https://vuejs.org/) with Composition API and SFCs
- [Vite](https://vitejs.dev/) for fast development and building
- [Pinia](https://pinia.vuejs.org/) for state management
- [Vue Router](https://router.vuejs.org/) for routing
- [PrimeVue](https://primevue.org/) for UI components
- [PrimeFlex](https://primeflex.org/) for layout utilities
- [Axios](https://axios-http.com/) for API requests
- [JWT](https://jwt.io/) for authentication

## Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd vacant_front
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Copy the environment example file and configure your environment variables:

   ```bash
   cp .env.example .env
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Environment Variables

Create a .env file in the root directory with the following variables:

```
VITE_VACANT_API=<API endpoint for vacancies>
VITE_ADMIN_API=<API endpoint for admin functions>
VITE_ADMIN_API_BACKED=<API endpoint for admin backend>
VITE_MAPS_API=<API endpoint for maps/RUPs>
VITE_BASE_URL=<Base URL for the application>
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Application Structure

An application consists of:

- **header** - information (purpose, years, group, etc.)
- **programs** - array of programs (before/after transfer)
- **footer** - confirmations and agreements
- **files** - uploaded documents

## Theming

Uses PrimeVue Theme Preset with light/dark theme support. Theme switching is available in the application header.

## Academic Plan Comparison (RUPs)

The "RUPs" section implements comparison of disciplines between two academic plans with visualization of matches, differences, and credit options.

## Docker Support

This project includes Docker configuration for containerization:

```bash
# Build the Docker image
docker build -t vacant_front .

# Run the container
docker run -p 8080:80 vacant_front
```

---

> A separate mode for viewing and processing applications is implemented for staff members.
