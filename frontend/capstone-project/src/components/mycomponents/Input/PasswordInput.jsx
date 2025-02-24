import React, { useState } from 'react'
// import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

const PasswordInput = ({value, onChange, placeholder}) => {
  const [isShowPassword, setisShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setisShowPassword(!isShowPassword);
  }

  return (
    <div className='mb-4'>
      

              <div class="mb-4">
            <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Password</label>
            <input id="password" className="shadow-sm rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black" placeholder="Enter your password" required
            value={value}
            onChange={onChange} 
            type={isShowPassword ? "text" : "password"}/>
            <a href="#"
              class="text-xs text-gray-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Forgot
              Password?</a>
          </div>

      
      {/* {isShowPassword ? (
        <FaRegEye 
        size={22}
        className='text-primary cursor-pointer'
        onClick={() => toggleShowPassword()}
        />
      ) : (
        <FaRegEyeSlash 
        size={22}
        className='text-slate-400 cursor-pointer'
        onClick={() => toggleShowPassword()}
        /> */}
      {/* )
    } */}


    </div>
    
  )
}

export default PasswordInput