// import React, { useState, useEffect } from 'react';
// import Navbar from '../../components/mycomponents/Navbar/Navbar';
// import OrderCard from '../../components/mycomponents/Cards/OrderCard';
// import Modal from "react-modal";
// import AddOrderCard from './AddOrderCard';
// import axiosInstance from '@/utils/axiosInstance';
// import { Link } from 'react-router-dom';



// const Home = () => {
//   const [orders, setPosts] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const [openAddEditJob, setOpenAddEditJob] = useState({
//     isShown: false,
//     type: "add",
//     data: null,
//   });

//   const fetchPosts = async () => {
//     try {
//         setLoading(true);
//         const response = await axiosInstance.get("/get-all-orders");
//         setPosts(response.data.orders);
//     } catch (error) {
//         console.error("Error fetching posts:", error);
//     } finally {
//         setLoading(false);
//     }
// };

//   const toggleModal = () => {
//     setOpenAddEditJob(prevState => ({
//       ...prevState,
//       isShown: !prevState.isShown
//     }));
//   };

//   useEffect(() => {
//     fetchPosts();
// }, []);

// if (loading) {
//   return <p>Loading posts...</p>;
// }

//   return (
//     <>
//       <Navbar />

//       <div className='flex flex-row justify-center space-x-5'>
//       {orders && orders.length === 0 ? (
//                 <p>No posts available</p>
//             ) : (
//                 orders.map((order) => (
//                     <OrderCard
//                         // key={order._id}
//                         title={order.title}
//                         content={order.content}
//                         category={order.category}
//                         location={order.location}
//                         price={order.payment}
//                         urgency={order.urgency}
//                         date={order.datePosted}
//                     />
//                 ))
//             )} 
//             </div>  
//             <div className='flex justify-center mt-10'>
//       <button
//         className=" bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md"
//       ><Link to={"/create-post"}>Post a Job</Link>
//       </button></div>

//       <Modal
//         isOpen={openAddEditJob.isShown}
//         onRequestClose={toggleModal}
//         style={{
//           overlay: {
//             backgroundColor: "rgba(0,0,0,0.2)"
//           },
//         }}
//         className="custom-modal-class"
//       >
//       </Modal>
//     </>
//   );
// };

// export default Home;


import React, { useState, useEffect } from 'react';
import Navbar from '../../components/mycomponents/Navbar/Navbar';
import OrderCard from '../../components/mycomponents/Cards/OrderCard';
import Modal from "react-modal";
import axiosInstance from '@/utils/axiosInstance';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-hot-toast";
import axios from "axios";


const Home = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [userId, setUserId] = useState(null);
  const [acceptedJobs, setAcceptedJobs] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
        setLoading(true);
        const response = await axiosInstance.get("/get-all-orders");
        setOrders(response.data.orders);
    } catch (error) {
        console.error("Error fetching posts:", error);
    } finally {
        setLoading(false);
    }
};


  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  // const handleAcceptJob = async (orderId) => {
  //   try {
  //     const token = localStorage.getItem("token");
  //     if (!token) {
  //       alert("You must be logged in to accept a job.");
  //       return;
  //     }

  //     const response = await axiosInstance.post("/accept-job", { orderId }, {
  //       headers: { Authorization: `Bearer ${token}` },
  //     });

  //     if (response.data.success) {
  //       alert("Job accepted successfully!");
  //       setAcceptedJobs([...acceptedJobs, orderId]);
  //     }
  //   } catch (error) {
  //     console.error("Error accepting job:", error);
  //     alert("Failed to accept job. Please try again.");
  //   }
  // };

  const handleApply = async (orderId) => {
    try {
      await axiosInstance.post(`/apply-job/${orderId}`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Adjust as needed
        },
      }
    );
      alert("Applied to job successfully!");
    } catch (error) {
      alert(error.response?.data?.message || "Error applying to job");
      
    }
  };

  const filteredOrders = orders.filter(order =>
    order.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <>
        <Navbar onSearch={handleSearch} searchTerm={searchTerm} />
        <p className="text-center mt-8">Loading posts...</p>
      </>
    );
  }

  return (
    <>
      <Navbar onSearch={handleSearch} searchTerm={searchTerm} />

      <div className='container mx-auto mt-8'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {filteredOrders.length === 0 ? (
            <p className="col-span-full text-center">No posts available</p>
          ) : (
            filteredOrders.map((order) => (
              <div key={order._id} className="flex flex-col">
                <OrderCard
                  title={order.title}
                  content={order.content}
                  category={order.category}
                  location={order.location}
                  price={order.payment}
                  urgency={order.urgency}
                  date={order.datePosted}
                  name={order.userName}
                />
                {/* {!acceptedJobs.includes(order._id) && ( */}
                  <button
                    onClick={() => handleApply(order._id)}
                    className="mt-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-md"
                  >
                    Accept Job
                  </button>
                
              </div>
            ))
          )}
        </div>
        <div className='flex justify-center mt-10'>
          <Link to="/create-post" className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md">
            Post a Job
          </Link>
        </div>
      </div>
    </>
  );
};

export default Home;

