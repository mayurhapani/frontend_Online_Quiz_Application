# Online Quiz Application Frontend

This is the frontend application for an Online Quiz Application, built with React and Vite.

## Live Demo

You can access the live application here: https://frontend-online-quiz-application.vercel.app

## Features

- User authentication (login/signup)
- Dashboard for users and admins
- Manage quizzes and questions
- Submit quizzes and view scores
- Role-based access control (RBAC)
- Responsive design for mobile and desktop

## Technologies Used

- React 18
- Vite
- Material-UI
- Axios for API requests
- React Router for navigation
- React Toastify for notifications

## Getting Started

### Prerequisites

- Node.js (v14 or later recommended)
- npm or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/mayurhapani/frontend_Online_Quiz_Application.git
   ```

2. Navigate to the project directory:

   ```bash
   cd frontend_Online_Quiz_Application
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

   or if you're using yarn:

   ```bash
   yarn
   ```

4. Create a `.env` file in the root directory and add the following:

   ```env
   VITE_BASE_URL=http://localhost:8001
   ```

   Replace the URL with your backend API URL if different.

### Running the Application

To start the development server:

```
npm run dev
```

or with yarn:

```
yarn dev
```

The application will be available at `http://localhost:5173` (or the next available port).

## Building for Production

To create a production build:

```
npm run build
```

or with yarn:

```
yarn build
```

## Deployment

This project is set up for easy deployment on Vercel. Connect your GitHub repository to Vercel for automatic deployments on every push to the main branch.

## License

This project is open source and available under the [MIT License](LICENSE).

## Contact

Project Link: https://github.com/mayurhapani/frontend_Online_Quiz_Application.git

## Acknowledgements

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Material-UI](https://mui.com/)
- [Vercel](https://vercel.com/)
