import React from 'react'
import Login from './components/pages/auth/LoginUser.jsx'
import { Outlet } from 'react-router-dom';


function App() {
  return (
    <div class="App">
      <Outlet/>
    </div>
  );
}

export default App;
