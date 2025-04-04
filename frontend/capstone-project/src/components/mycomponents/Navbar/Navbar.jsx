"use client"
import { Link } from "react-router-dom"
import MessagingDropdown from "../Messaging/MessagingDropdown"

const Navbar = ({ onSearch, searchTerm }) => {
  //const [searchTerm, setSearchTerm] = useState('');
  const handleSearch = (e) => {
    const value = e.target.value
    //setSearchTerm(value);
    //onSearch(value);
    onSearch(e.target.value)
  }
  return (
    <nav className="border-gray-200 dark:bg-gray-900 dark:border-gray-700">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a href="#" className="flex items-center space-x-3 rtl:space-x-reverse">
          <img src="../../src/assets/unisprint_logo.webp" alt="Logo" className="w-20 h-20 rounded-xl" />
          <Link to="/dashboard">
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">UniSprint</span>
          </Link>
        </a>
        <div className="flex-1 max-w-md mx-4 text-black">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus: ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
        <button
          data-collapse-toggle="navbar-dropdown"
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          aria-controls="navbar-dropdown"
          aria-expanded="false"
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 17 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </button>
        <div className="hidden w-full md:block md:w-auto" id="navbar-dropdown">
          <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 dark:bg-gray-800 md:dark:bg-gray-900">
            <li>
              <Link
                to="/dashboard"
                className="block py-2 px-3 text-white rounded md:bg-transparent md:p-0 md:dark:text-blue-500 dark:bg-blue-600 md:dark:bg-transparent"
                aria-current="page"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/profile"
                className="block py-2 px-3 text-gray rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
              >
                Profile{" "}
              </Link>
            </li>
            <li>
              <Link to="/">
                <a
                  href="#"
                  className="block py-2 px-3 text-white rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                >
                  About UniSprint
                </a>
              </Link>
            </li>
            <li>
              <Link to="/notifications">
                <a
                  href="#"
                  className="block py-2 px-3 text-white rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                >
                  Activity
                </a>
              </Link>
            </li>
            <li>
              <MessagingDropdown />
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar

