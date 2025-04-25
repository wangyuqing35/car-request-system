import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from 'antd';
import './App.css';
import Login from './pages/Login';
import CarRequest from './pages/CarRequest';
import RequestList from './pages/RequestList';
import ApprovalList from './pages/ApprovalList';
import PrivateRoute from './components/PrivateRoute';

const { Content } = Layout;

function App() {
  return (
    <Router>
      <Layout style={{ minHeight: '100vh' }}>
        <Content style={{ padding: '20px' }}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/create"
              element={
                <PrivateRoute>
                  <CarRequest />
                </PrivateRoute>
              }
            />
            <Route
              path="/edit/:id"
              element={
                <PrivateRoute>
                  <CarRequest />
                </PrivateRoute>
              }
            />
            <Route
              path="/request-list"
              element={
                <PrivateRoute>
                  <RequestList />
                </PrivateRoute>
              }
            />
            <Route
              path="/approval-list"
              element={
                <PrivateRoute>
                  <ApprovalList />
                </PrivateRoute>
              }
            />
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </Content>
      </Layout>
    </Router>
  );
}

export default App;
