import React, { useState } from 'react';
import PasswordInput from '../../components/mycomponents/Input/PasswordInput';
import { Link, useNavigate } from "react-router-dom";
import Navbar_Login_CreateAcc from '../../components/mycomponents/Navbar/Navbar_Login_CreateAcc';
import axiosInstance from '../../utils/axiosInstance';




const SignUp = () => {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [major, setMajor] = useState("");
  const [year, setYear] = useState("");
  const [hometown, setHometown] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate()



  const handleSignup = async (e) => {
    e.preventDefault();
    console.log('Signup started...');

    try {
      console.log('Sending signup request...');
      const response = await axiosInstance.post("/create-account", {
        fullName: name,
        email: email,
        password: password,
        major: major,
        hometown: hometown,
        year: year
      });

      console.log('Signup response:', response.data);

      // If account creation was successful
      if (response.data) {
        console.log('Signup successful, preparing to navigate...');
        // Show success message
        alert("Account created successfully! Please log in.");
        // Redirect to login page
        console.log('Navigating to login page...');
        navigate("/login", { replace: true });
        console.log('Navigation called');
      }
    } catch (error) {
      console.error('Signup error:', error);
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("An error occurred during signup");
      }
    }
  }

  return (
    <>
      {/* Create Account */}

      <div class="min-h-screen flex flex-col items-center justify-center w-full dark:bg-gray-950">
        <img src="../../src/assets/unisprint_logo.webp" className='w-1/6 rounded-full mb-10' alt="" />
        <div class="bg-white dark:bg-gray-900 shadow-md rounded-lg px-8 py-6 max-w-md">
          <h1 class="text-2xl font-bold text-center mb-4 text-black">Create an Account</h1>
          <form onSubmit={handleSignup}>
            <div class="mb-4">
              <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Name</label>
              <input id="name" class="shadow-sm rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black" placeholder="Name" required

                value={name}
                onChange={(e) => setName(e.target.value)}
              />          </div>
            <div class="mb-4">
              <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
              <input type="email" id="email" class="shadow-sm rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black" placeholder="your@email.com" required

                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />          </div>
            <div class="mb-4">
              <label for="major" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Major</label>
              <input id="major" class="shadow-sm rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black" placeholder="Major" required

                value={major}
                onChange={(e) => setMajor(e.target.value)}
              />          </div>
            <div class="mb-4">
              <label for="year" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Year</label>
              <select class="text-black w-full border border-gray-300 rounded-md p-2 mb-4" value={year}
                onChange={(e) => setYear(e.target.value)}>
                <option value="" disabled>Select Year</option>
                <option>Freshman</option>
                <option>Sophomore</option>
                <option>Junior</option>
                <option>Senior</option>
                <option>Grad Student</option>
              </select>

            </div>
            <div class="mb-4">
              <label for="hometown" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Hometown <span>(Optional)</span> </label>
              <input id="hometown" class="shadow-sm rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black" placeholder="Hometown" required

                value={hometown}
                onChange={(e) => setHometown(e.target.value)}
              />          </div>

            < PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div class="flex items-center justify-center mb-4">
              <div class="flex items-center">

                <Link to="/login" class="text-xs text-indigo-500 hover:text-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Already have an account?</Link></div>
            </div>

            <button type="submit" class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Create account</button>
          </form>
        </div>
      </div>
    </>
  )
}

export default SignUp