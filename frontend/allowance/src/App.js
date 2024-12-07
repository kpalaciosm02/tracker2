import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';
import SignUp from './SignUp';
import UserSelector from './pages/UserSelector';
import AdminDashboard from './pages/adminDashboard';
import AdminTransactionList from './pages/adminTransactionList';
import AdminManageFamily from './pages/adminManageFamily';
import ChildTransactionList from './pages/childTransactionList';

const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<SignUp/>} />
          <Route path="/userSelector" element={<UserSelector/>} />
          <Route path="/adminDashboard" element={<AdminDashboard/>} />
          <Route path="/adminTransactionList" element={<AdminTransactionList/>} />
          <Route path="/adminManageFamily" element={<AdminManageFamily/>} />
          <Route path="/childTransactionList" element={<ChildTransactionList/>} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
