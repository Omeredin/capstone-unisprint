import React, { useState } from 'react';
import Navbar_Login_CreateAcc from '../../components/mycomponents/Navbar/Navbar_Login_CreateAcc';
import { Link, useNavigate } from "react-router-dom";
import PasswordInput from "../../components/mycomponents/Input/PasswordInput";
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosInstance';
// import {}} from '../../utils/constants';


const Login = () => {
  const [email, setEmail] =useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!password) {
      setError("Please enter the password");
      return;
    }
    
    try {
      const response = await axiosInstance.post("/login", {
        email:email,
        password: password,
      });
  
  
      if (response.data && response.data.accessToken) {
        localStorage.setItem("token", response.data.accessToken);
        navigate("/dashboard");
      }} catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
          console.error('Error during login:', error);
          setError(error.response.data.message);
        } else {
          setError("error just occured");
        }
      };
  };


  return (
    <>
    {/* <Navbar_Login_CreateAcc /> */}

 

        <div class="min-h-screen flex flex-col items-center justify-center w-full dark:bg-gray-950">
          <img src="../../src/assets/unisprint_logo.webp" className='w-1/6 rounded-full mb-10' alt="" />
      <div class="bg-white dark:bg-gray-900 shadow-md rounded-lg px-8 py-6 max-w-md">
        <h1 class="text-black text-2xl font-bold text-center mb-4 dark:text-gray-200">Welcome Back!</h1>
        <form>
          <div class="mb-4">
            <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
            <input type="email" id="email" class="shadow-sm rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black" placeholder="your@email.com" required
            
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          < PasswordInput value={password}
          onChange = {(e) => setPassword(e.target.value)}
          />

          {error && <p className='text-red-500 text-xs pb-1'>{error}</p>} 
          
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center">
              <input type="checkbox" id="remember" class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 focus:outline-none" checked/>
              <label for="remember" class="ml-2 block text-sm text-gray-700 dark:text-gray-300">Remember me</label>
            </div>
              <Link to="/signup" class="text-xs text-indigo-500 hover:text-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Create Account</Link>
          </div>
          <button onClick={handleLogin} type="submit" class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Login</button>
        </form>
      </div>
    </div>

    </>

  )
}

export default Login