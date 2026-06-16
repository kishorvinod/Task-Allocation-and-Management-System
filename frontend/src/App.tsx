import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import LoginPage from "./pages/Login/LoginPage";

import DashboardPage from "./pages/Dashboard/DashboardPage";

import UsersPage from "./pages/Users/UsersPage";

import TasksPage from "./pages/Tasks/TasksPage";

import PrivateRoute from "./routes/PrivateRoute";

import AdminRoute from "./routes/AdminRoute";

import { AuthProvider }
  from "./context/AuthContext";

function App() {

  return (
    <AuthProvider>

      <BrowserRouter>

        <Routes>

          <Route
            path="/"
            element={
              <LoginPage />
            }
          />

          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <DashboardPage />
              </PrivateRoute>
            }
          />

          <Route
            path="/users"
            element={
              <AdminRoute>
                <UsersPage />
              </AdminRoute>
            }
          />

          <Route
            path="/tasks"
            element={
              <PrivateRoute>
                <TasksPage />
              </PrivateRoute>
            }
          />

        </Routes>

      </BrowserRouter>

    </AuthProvider>
  );
}

export default App;