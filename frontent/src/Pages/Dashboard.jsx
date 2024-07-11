import { Modal, Select } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import axios from "axios"
import React, { useEffect, useState } from "react"
import OrderCards from "../componet/OrderCards"
import { Link, Navigate, useLocation, useNavigate, useParams } from "react-router-dom"
import MyDetails from "../componet/MyDetails"
import { useForm } from "@mantine/form"
import ChangePassword from "../componet/ChangePassword"
import ReactDropdown from "react-dropdown"
import "react-dropdown/style.css"
import baseUrl from "../context/baseUrl"
const Dashboard = (props) => {
  const [orderitems, setOrderitems] = useState()
  const navigation = useNavigate()
  const location = useLocation()
  const [totalPrice, setTotalPrice] = useState(0)
  // console.log(orderitems)
  const storedUserId = localStorage.getItem("userId")
  useEffect(() => {
    if(storedUserId == 'null') {
      navigation("/login");
    }

    const fetchUserOrders = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}/Getorder/${storedUserId}`
        )

        if (response.status === 200) {
          const { orders } = response.data
          // console.log("User orders:", orders)
          setOrderitems(orders)
          // Process the orders data as needed
        } else {
          throw new Error("Error: " + response.status)
        }
      } catch (error) {
        console.error("An error occurred:", error)
        // Handle the error as needed
      }
    }

    fetchUserOrders()
  }, [storedUserId, setOrderitems])
  const [getMyDetails, setGetMyDetails] = useState()
  // console.log("Gokil", getMyDetails?.paymentMethod)
  useEffect(() => {
    const fetchUserOrders = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}/Mydetails/${storedUserId}`
        )

        if (response.status === 200) {
          const { Mydetails } = response.data
          // console.log("User orders:9999999", Mydetails)
          setGetMyDetails(Mydetails[0])
          // Process the orders data as needed
        } else {
          throw new Error("Error: " + response.status)
        }
      } catch (error) {
        console.error("An error occurred:", error)
        // Handle the error as needed
      }
    }

    fetchUserOrders()
  }, [storedUserId, setGetMyDetails])
  useEffect(() => {
    if (orderitems) {
      const totalPrice = orderitems.reduce(
        (sum, value) => sum + (value?.Price || 0),
        0
      )
      setTotalPrice(totalPrice)
      localStorage.setItem("totalPrice", totalPrice.toFixed(2))
    }
  }, [orderitems])

  const [SidebarActive, setSidebarActive] = useState(0)
  const DashboardSidebar = [
    {
      title: "Dashboard",
    },
    { title: "Past offers" },
    { title: "My details" },
    { title: "Marketing Preferences" },
    { title: "Change password" },
    { title: "Logout" },
  ]
  const form = useForm({
    initialValues: {
      MarketingPreferences: "",
    },

    validate: {},
  })
  // const data = location.state && location.state.data

  const [MarketingPreferencesStatus, setMarketingPreferencesStatus] = useState()
  const [marketper, setMarketper] = useState(
    getMyDetails?.Marketingpreferences.value
  )
  // console.log("go", getMyDetails?.Marketingpreferences.value)
  const handleUpdateMarketingPreferences = async () => {
    try {
      const response = await axios.put(
        `${baseUrl}/Mydetails/Marketingpreferences/${storedUserId}`,
        {
          Marketingpreferences: marketper.label,
        }
      )
      // console.log(response.data)
      setMarketingPreferencesStatus(response.data.message) // Assuming the server sends a response message
    } catch (error) {
      console.error(error)
    }
  }
  const options = ["Yes", "No"]
  return (
    <div>
      <section className="overflow-y-scroll  lg:flex-row flex-col flex ">
        <div class="w-full lg:w-4/12 bg-blue-100 relative py-12 lg:py-24">
          <div class="lg:h-[60vh] h-full lg:flex">
            <ul class="xl:pl-24 pl-4 hidden lg:flex  items-start flex-col lg:space-x-0 space-x-0">
              {DashboardSidebar?.map((value, index) => (
                <button
                  onClick={() => setSidebarActive(index)}
                  class="lg:block items-start flex last:pb-0 relative"
                  style={{
                    paddingBottom:'1.25rem '
                  }}
                >
                  {SidebarActive === index && (
                    <div class="text-xl text-blue-500 hidden lg:block absolute top-[4px] left-[-18px]">
                      <svg
                        className="pt-1"
                        width={7}
                        aria-hidden="true"
                        focusable="false"
                        data-prefix="far"
                        data-icon="angle-right"
                        class="svg-inline--fa fa-angle-right fa-w-6 "
                        role="img"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 192 512"
                      >
                        <path
                          fill="currentColor"
                          d="M187.8 264.5L41 412.5c-4.7 4.7-12.3 4.7-17 0L4.2 392.7c-4.7-4.7-4.7-12.3 0-17L122.7 256 4.2 136.3c-4.7-4.7-4.7-12.3 0-17L24 99.5c4.7-4.7 12.3-4.7 17 0l146.8 148c4.7 4.7 4.7 12.3 0 17z"
                        ></path>
                      </svg>
                    </div>
                  )}
                  <button
                    onClick={
                      value?.title === "Logout"
                        ? () => {
                            localStorage.setItem("userId", "null")
                            localStorage.setItem("Basket", "0")
                            navigation("/")
                            window.location.reload()
                          }
                        : ""
                    }
                    style={{
                      fontSize: "1.125rem",
                      fontWeight:700
                    }}
                    title={value?.title}
                    class={` text-[14px] lg:text-lg lg:bg-transparent px-4 font-medium lg:font-bold lg:px-0 py-1 lg:py-0 rounded-full bg-blue-500 ${
                      SidebarActive === index
                        ? "lg:text-blue-500 text-black"
                        : "lg:text-black text-black"
                    } `}
                    
                  >
                    {value?.title}
                  </button>
                </button>
              ))}
              <h1 className=" text-base lg:text-xl font-semibold py-4">
                Account ID: {storedUserId.slice(0, 6)}
              </h1>
            </ul>
            <ul class="xl:pl-24 pl-4 lg:hidden  items-start flex overflow-y-scroll space-x-6  lg:space-x-0 ">
              {DashboardSidebar?.map((value, index) => (
                <button
                  onClick={() => setSidebarActive(index)}
                  class="pb-5 lg:block items-start flex last:pb-0 relative"
                >
                  {SidebarActive === index && (
                    <div class="text-xl text-blue-500 hidden lg:block absolute top-[4px] left-[-18px]">
                      <svg
                        className="pt-1"
                        width={7}
                        aria-hidden="true"
                        focusable="false"
                        data-prefix="far"
                        data-icon="angle-right"
                        class="svg-inline--fa fa-angle-right fa-w-6 "
                        role="img"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 192 512"
                      >
                        <path
                          fill="currentColor"
                          d="M187.8 264.5L41 412.5c-4.7 4.7-12.3 4.7-17 0L4.2 392.7c-4.7-4.7-4.7-12.3 0-17L122.7 256 4.2 136.3c-4.7-4.7-4.7-12.3 0-17L24 99.5c4.7-4.7 12.3-4.7 17 0l146.8 148c4.7 4.7 4.7 12.3 0 17z"
                        ></path>
                      </svg>
                    </div>
                  )}
                  <button
                    onClick={
                      value?.title === "Logout"
                        ? () => {
                            localStorage.setItem("userId", "null")
                            localStorage.setItem("Basket", "0")
                            navigation("/")
                            window.location.reload()
                          }
                        : console.log("demo", value)
                    }
                    title={value?.title}
                    class={` text-[14px] w-max flex lg:text-lg lg:bg-transparent px-4 font-medium lg:font-bold lg:px-0 py-1 lg:py-0 rounded-full bg-blue-500 ${
                      SidebarActive === index
                        ? "lg:text-blue-500 text-white"
                        : "lg:text-black text-white"
                    } `}
                  >
                    {value?.title}
                  </button>
                </button>
              ))}
            </ul>
            <h1 className=" text-base lg:text-xl ml-6 lg:hidden block font-semibold py-4">
              Account ID: {storedUserId.slice(0, 6)}
            </h1>
          </div>
        </div>
        <div className="flex flex-col px-6 lg:px-24 w-full  lg:flex-row">
          {SidebarActive === 0 && (
            <div className="w-full lg:pl-20 py-12 lg:py-24">
              <h1 className="text-3xl lg:text-4xl font-extrabold h1 mb-6" style={{
                fontSize:'2.25rem',
                fontWeight:800
              }}>
                My dashboard
              </h1>
              <p className="mb-8 text-[#373845] font-bold" style={{
                fontWeight:700
              }}>
                Packages you're sending
              </p>

              {orderitems?.length === 0 ? (
                <p>No order available.</p>
              ) : (
                orderitems
                  ?.filter((value) => {
                    const validStatuses = [
                      "Pending",
                      "Received",
                      "Checking",
                      "Accepted",
                    ]
                    return validStatuses.includes(value.Status)
                  })
                  .map((value, index) => (
                    <OrderCards
                      getMyDetails={getMyDetails}
                      setCondition={value.setCondition}
                      productId={value.ProductId}
                      items={index + 1}
                      length={orderitems.length}
                      key={index}
                      Deliverymethod={value.Deliverymethod}
                      timestamp={value.timestamp}
                      Price={value?.Price}
                      Status={value?.Status}
                      offerId={value?.offerId}
                    />
                  ))
              )}

              <Link
                title="Sell more Lego®"
                className="hover:scale-[1.05] mb-12 transition-all ml-auto mt-10 lg:ml-0 text-center flex lg:inline-flex justify-center items-center px-6 lg:px-14 rounded-xl bg-blue-500 text-white font-bold text-[15px] h-[49px] lg:h-[65px] text-[15px] xl:text-[18px]"
                to="/"
              >
                Sell more LEGO®
              </Link>
              <div className="lg:hidden mt-10">
                <ul>
                  <li className="relative">
                    <button
                      onClick={() => {
                        localStorage.setItem("userId", "null")
                        navigation("/")
                      }}
                      className="font-bold flex justify-center w-full items-center text-[#E52D3B] cursor-pointer h-[49px]"
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          )}
          {SidebarActive === 1 && (
            <div className="w-full lg:pl-20 py-12 lg:py-24">
              <h1 className="text-3xl lg:text-4xl font-extrabold h1 mb-6">
                Past offers
              </h1>
              <p className="mb-8 text-[#373845] font-bold">
                Here is a list of your past offers...
              </p>
              {orderitems?.length === 0 ? (
                <p>No order available.</p>
              ) : (
                orderitems
                  ?.filter((value) => {
                    // console.log(value.Status === "paid")
                    return (
                      value.Status === "Paid" || value.Status === "Rejected"
                    )
                  })
                  .map((value, index) => (
                    <OrderCards
                      getMyDetails={getMyDetails}
                      setCondition={value.setCondition}
                      productId={value.ProductId}
                      items={index + 1}
                      length={orderitems.length}
                      key={index}
                      Deliverymethod={value.Deliverymethod}
                      timestamp={value.timestamp}
                      Price={value?.Price}
                      Status={value?.Status}
                      offerId={value?.offerId}
                    />
                  ))
              )}

              <a
                title="Sell more Lego®"
                className="hover:scale-[1.05] mb-12 transition-all ml-auto mt-10 lg:ml-0 text-center flex lg:inline-flex justify-center items-center px-6 lg:px-14 rounded-xl bg-blue-500 text-white font-bold text-[15px] h-[49px] lg:h-[65px] text-[15px] xl:text-[18px]"
                href=""
              >
                Sell more LEGO®
              </a>
              <div className="lg:hidden mt-10">
                <ul>
                  <li className="relative">
                    <a
                      href="/"
                      className="font-bold flex justify-center font-bold w-full items-center text-[#E52D3B] cursor-pointer h-[49px]"
                    >
                      Logout
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {SidebarActive === 2 && (
            <MyDetails setSidebarActive={setSidebarActive} />
          )}
          {SidebarActive === 3 && (
            <div className="">
              <div className="w-full lg:pl-20 py-12 lg:py-24">
                <h1 className="mb-6 text-3xl lg:text-5xl font-bold h1">
                  Marketing Preferences
                </h1>
                <p className="mb-4 font-medium text-base">
                  You're in control. Please update your marketing preferences.
                </p>
                <form
                  onSubmit={form.onSubmit(handleUpdateMarketingPreferences)}
                  method="post"
                  className="my-6"
                >
                  <label className="w-full flex font-medium text-base  mb-2">
                    Do you want to hear about special offers, voucher codes and
                    our latest news?
                  </label>

                  <ReactDropdown
                    value={getMyDetails?.Marketingpreferences.value}
                    options={options}
                    onChange={setMarketper}
                    placeholder={getMyDetails?.Marketingpreferences}
                  />

                  <h3 className="text-green-500 py-4">
                    {MarketingPreferencesStatus}
                  </h3>
                  <button
                    type="submit"
                    className="cursor-pointer bg-blue-500 text-white rounded-xl h-[50px] lg:h-[80px] mt-10 px-16 inline-flex items-center justify-center font-bold text-lg"
                  >
                    Confirm preferences
                  </button>
                </form>
                <div className="lg:hidden mt-10">
                  <ul>
                    <li className="relative">
                      <a className="flex justify-center font-bold w-full items-center text-[#E52D3B] cursor-pointer h-[49px]">
                        Logout
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
          {SidebarActive === 4 && <ChangePassword />}
        </div>
      </section>
    </div>
  )
}

export default Dashboard
