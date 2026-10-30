import React from 'react';
import './App.css';
import Landing from './component/hero';
import Dashboard from './component/dashboard';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux'; // Import Redux Provider
import store from './store/store'; // Import your Redux store

const App: React.FC = () => {
  return (
    <Provider store={store}> {/* Wrap your app with Redux Provider */}
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={<Dashboard/>}/>
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
