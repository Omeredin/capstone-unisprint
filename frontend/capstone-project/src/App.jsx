import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home/Home'
import Login from './pages/Login/Login'
import SignUp from './pages/SignUp/SignUp'
import ProfileInfo from './components/mycomponents/Cards/ProfileInfo'
import AddOrderCard from './pages/Home/AddOrderCard'
import LandingPage from './pages/Landing/LandingPage'
import Notifications from './pages/Activity/Notifications'

const routes = (
  <Router>
    <Routes>
    <Route path="" exact element={<LandingPage />}/>
    <Route path="/dashboard" exact element={<Home />}/>
    <Route path="/login" exact element={<Login />}/>
    <Route path="/signup" exact element={<SignUp />}/>
    <Route path="/profile" exact element={<ProfileInfo />}/>
    <Route path='/create-post' exact element={<AddOrderCard />}/>
    <Route path='/notifications' exact element={<Notifications />}/>
    </Routes>
  </Router>
)

const App = () => {
  return (
    <div>
      {routes}
    </div>
  )
}

export default App