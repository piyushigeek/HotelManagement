import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Pages/Login'
import Dashboard from './Pages/Dashboard'
import { Provider } from 'react-redux';
import Store from './Pages/Redux/Store';

function App() {
  return (
    
    <Provider store={Store}>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
