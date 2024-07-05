import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import LoginUser from './components/pages/auth/LoginUser.jsx'
import CreateUser from './components/pages/auth/CreateUser.jsx'
import Dashboard from './components/pages/content/dashboard.jsx'

const routes = createBrowserRouter([
  {
    path: '/',
    element : <App />,
    children: [
      {
        path : '/',
        element : <LoginUser />
      },
      {
        path: 'criar-user',
        element : <CreateUser />
      },{
        path: 'dashboard',
        element: <Dashboard />,
      }
    ] 
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={routes}/>
)
