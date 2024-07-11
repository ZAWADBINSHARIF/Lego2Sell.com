import axios from "axios"
import React, { useEffect, useState } from "react"
import { Navigate } from "react-router-dom"
import AdminDashboard from "./Pages/AdminDashboard"
import { Loader } from "@mantine/core"
import CustomerOffers from "./Pages/CustomerOffers"
import baseUrl from "./context/baseUrl"

const CustomerOffer = () => {
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true) // Track loading state
  const storedUserId = localStorage.getItem("userId")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}/user/${storedUserId}`
        )
        setUserData(response.data)
        setLoading(false) // Data fetched, set loading to false
      } catch (error) {
        console.error("An error occurred:", error)
        setLoading(false) // Error occurred, set loading to false
      }
    }

    fetchData()
  }, [storedUserId])

  // While loading, show a loading message or spinner
  if (loading) {
    return (
      <div className="flex items-center justify-center my-auto h-full">
        <Loader />
      </div>
    )
  }

  console.log("userData", userData)

  return (
    <div>
      {userData?.admin === "admin" ? <CustomerOffers /> : <Navigate to={"/"} />}
    </div>
  )
}

export default CustomerOffer
