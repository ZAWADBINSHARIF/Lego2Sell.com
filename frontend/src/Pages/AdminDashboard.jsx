import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import CryptoJS from 'crypto-js';
import baseUrl from "../context/baseUrl";

const AdminDashboard = () => {
  const navigation = useNavigate();
  const [orders, setOrders] = useState([]);
  const [MintValue, setMintValue] = useState();
  const [VeryGood, setVeryGoodValue] = useState();
  const [TotalOffer, setTotalOffer] = useState();
  const [error, setError] = useState(null);
  const [MintMessage, setMintMessage] = useState();
  const storedUserId = localStorage.getItem("userId");
  // console.log(MintMessage)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `${baseUrl}/DiscountValue`,
        {
          MintValue,
          VeryGood,
        }, {
        headers: {
          "Content-Type": "application/json",
          "user-id": storedUserId,
          "Authorization": `Bearer ${localStorage.getItem("token")}`,

        },
      }
      );
      setMintMessage(response.data.message);
      console.log("Data saved successfully:", response.data.message);
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  useEffect(() => {
    async function fetchOrders() {

      // Data to encrypt
      const sensitiveData = 'frontend';
      // Encryption key (must be a secret)
      const encryptionKey = 'legotwosell';
      // Encrypt the data
      const encryptedData = CryptoJS.AES.encrypt(sensitiveData, encryptionKey).toString();

      try {
        // Replace with the actual user ID
        const response = await axios.get(`${baseUrl}/data`, {
          headers: {
            "Content-Type": "application/json",
            "source": encryptedData,
          },
        });
        setOrders(response.data);
      } catch (error) {
        setError("Error fetching orders");
      }
    }

    fetchOrders();
  }, []);
  const [CustomerOrder, setCustomerOrder] = useState();

  const fetchInfo = () => {

    // Data to encrypt
    const sensitiveData = 'frontend';
    // Encryption key (must be a secret)
    const encryptionKey = 'legotwosell';
    // Encrypt the data
    const encryptedData = CryptoJS.AES.encrypt(sensitiveData, encryptionKey).toString();

    return fetch(`${baseUrl}/data`, {
      headers: {
        "Content-Type": "application/json",
        "source": encryptedData,
      },
    })
      .then((res) => res.json())
      .then((d) => setCustomerOrder(d));
  };
  useEffect(() => {
    fetchInfo();
  }, []);
  // console.log("log", CustomerOrder.length)
  const countUnpaidOrders = (orders) => {
    return orders?.reduce((count, order) => {
      if (order.Status !== "Paid") {
        return count + 1;
      }
      return count;
    }, 0);
  };
  let NumberTotal = 0;
  const calculateTotalPrice = () => {
    let total = 0;
    orders.forEach((user) => {
      NumberTotal = countUnpaidOrders(user.Order);
      user.Order.forEach((order) => {
        if (order.Status === "Paid") {
          total += order.Price;
        }
      });
    });
    return total.toFixed(2);
  };
  // console.log("fix")
  let ordersWithoutPaidOrRejected = 0;

  orders.forEach((user) => {
    user.Order.forEach((order) => {
      if (order.Status !== "Paid" && order.Status !== "Rejected") {
        ordersWithoutPaidOrRejected++;
      }
    });
  });

  // console.log(
  //   "Number of orders without Paid or Rejected status:",
  //   ordersWithoutPaidOrRejected
  // )
  return (
    <div>
      <div className="">
        <div className="flex flex-col-reverse lg:flex-row">
          <div className="  lg:flex-[0.3] 2xl:flex-[0.2] sm:mt-0 lg:mt-44 px-2 flex-col">
            <div className=" border-[7px] ml-3 lg:ml-9 mb-8  py-4 h-full lg:h-[60vh] border-blue-500 rounded-[30px]">
              <Link
                to={`${baseUrl}/export/csv/alldata6`}
                className="flex items-center"
              >
                <img
                  className="w-[20%]"
                  src="/Images/LegoCSV icon.png"
                  alt=""
                />
                <p className=" text-[black] text-[20px] text-center  font-semibold w-full">
                  Download Sets Database
                </p>
              </Link>
              <Link
                to={`${baseUrl}/export/csv/email`}
                className="flex items-center"
              >
                <img
                  className="w-[20%]"
                  src="/Images/emaillist3dicon.png"
                  alt=""
                />
                <p className="w-full font-semibold text-[black] text-[20px] text-center">
                  Download Email Database
                </p>
              </Link>
              <div className="px-6  py-6">
                <h4 className="font-medium text-base">Mint Discount</h4>
                <input
                  placeholder="Change Mint Discount %"
                  onChange={(e) => setMintValue(e.target.value)}
                  type="text"
                  className="py-2 px-6 w-full lg:w-auto rounded-full border-2 border-blue-500 outline-none"
                />
              </div>
              <div className="px-6">
                <h4 className="font-medium text-base">Very Good Discount</h4>
                <input
                  placeholder="Change Very Good Discount %"
                  onChange={(e) => setVeryGoodValue(e.target.value)}
                  type="text"
                  className="py-2 px-6 border-2 w-full lg:w-auto rounded-full border-blue-500 outline-none"
                />
              </div>
              <button
                onClick={handleSubmit}
                className="px-4 text-white font-medium ml-6 mt-2 py-2 bg-blue-500 rounded-xl"
              >
                Change %
              </button>
              {MintValue !== "" && (
                <h4 className="text-lg pl-4 mt-5 text-green-500 font-medium">
                  {MintMessage}
                </h4>
              )}
            </div>
          </div>
          <div className="flex-1">
            <h5 className="lg:text-4xl text-2xl py-10 lg:w-full text-center font-bold">
              Welcome To the Admin Dashboard
            </h5>
            <div className="lg:px-0 2xl:px-44 lg:flex-row flex-col w-full items-center justify-around py-6 flex px-0">
              <div className="flex flex-wrap mb-12 flex-col lg:space-y-0 space-y-8 justify-between items-center">
                <div className="border-3 gap-3 flex items-center border-blue-500 rounded-full 2xl:w-[80%]  justify-center lg:py-6 py-4 px-6 lg:px-4"
                  style={{
                    border: '3px solid #3B82F6'
                  }}
                >
                  <img
                    className="w-16"
                    src="/Images/People_Lego_Icon.png"
                    alt=""
                  />
                  <div className="flex items-center flex-col">
                    <h4 className="text-base lg:text-lg font-semibold">
                      Customer Accounts
                    </h4>
                    <p className="text-base lg:text-xl font-bold">
                      {CustomerOrder?.length}
                    </p>
                  </div>
                </div>
                <Link to={"/admin"} className="flex items-center flex-col">
                  <img
                    className="lg:w-[40%] w-[40%]"
                    src="/Images/totalcustomers.png"
                    alt=""
                  />
                  <h4 className="text-base lg:text-base lg:text-xl font-bold">
                    Customer <br /> Accounts
                  </h4>
                </Link>
              </div>
              <div className="flex flex-wrap  mb-12 flex-col lg:space-y-0 space-y-8 justify-between items-center">
                <div className="border-3 gap-3 flex items-center border-green-500 2xl:w-[80%] justify-center rounded-full py-6 px-14" style={{
                  border: '3px solid #10B981'

                }}>
                  <img
                    className="w-16"
                    src="/Images/shopping_cart_lego_icon.png"
                    alt=""
                  />
                  <div className="flex items-center flex-col">
                    <h4 className="text-lg font-semibold">Total Offers</h4>
                    <p className="text-base lg:text-xl font-bold">
                      {ordersWithoutPaidOrRejected}
                    </p>
                  </div>
                </div>
                <Link
                  to={"/customeroffers"}
                  className="flex items-center flex-col"
                >
                  <img
                    className="lg:w-[40%] w-[40%]"
                    src="/Images/totalnumbericon.png"
                    alt=""
                  />
                  <h4 className="text-base lg:text-xl text-center font-bold">
                    Customer <br /> Offers
                  </h4>
                </Link>
              </div>
              <div className="flex flex-wrap mb-12  flex-col lg:space-y-0 space-y-8 justify-between items-center">
                <div className="border-3 gap-3 flex items-center border-yellow-500 2xl:w-[80%] justify-center rounded-full py-6 px-12"
                  style={{
                    border: '3px solid #FBBF24'
                  }}
                >
                  <img
                    className="w-16"
                    src="/Images/Pound_lego_icon.png"
                    alt=""
                  />
                  <div className="flex items-center flex-col">
                    <h4 className="text-lg font-semibold">Total Paid Out</h4>
                    <p className="text-base lg:text-xl font-bold text-blue-500">
                      £ {calculateTotalPrice()}
                    </p>
                  </div>
                </div>
                <div
                  onClick={() =>
                    window.open(
                      "https://lego2sell-das.vercel.app/#/admin/default"
                    )
                  }
                  className="flex items-center flex-col"
                >
                  <img
                    className="lg:w-[40%] w-[40%]"
                    src="/Images/reportsicon.png"
                    alt=""
                  />

                  <h4 className="text-base lg:text-xl text-center font-bold">
                    Management <br />
                    Reports
                  </h4>
                </div>
              </div>



              <div className="flex flex-wrap mb-12 flex-col lg:space-y-0 space-y-8 justify-between items-center" style={{
                marginTop: '20px',
              }}>

                <div className="border-3 gap-3 flex items-center border-green-500 2xl:w-[80%] justify-center rounded-full py-6 px-14"
                  style={{
                    border: '3px solid #10B981'
                  }}
                >
                  <div className="flex items-center flex-col">
                    <h4 className="text-lg font-semibold">Blogs</h4>

                  </div>

                </div>
                <Link
                  to={"/userblogs"}
                  className="flex items-center flex-col"
                >
                  <img
                    className="lg:w-[40%] w-[40%]"
                    src="/Images/blogs.png"
                    alt=""
                  />
                  <h4 className="text-base lg:text-xl text-center font-bold">
                    Blogs
                  </h4>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
