import React, { useEffect, useState } from "react"
import AdminOffer from "../componet/AdminOffer"
import { useNavigate } from "react-router-dom"
import CryptoJS from 'crypto-js';
import baseUrl from "../context/baseUrl";

const CustomerOffers = () => {
  const [data, setData] = useState()
  const fetchInfo = () => {
    // Data to encrypt
    const sensitiveData = 'frontend';
    // Encryption key (must be a secret)
    const encryptionKey = 'legotwosell';
    // Encrypt the data
    const encryptedData = CryptoJS.AES.encrypt(sensitiveData, encryptionKey).toString();

    return fetch(`${baseUrl}/GetorderValue`, {
      headers: {
        "Content-Type": "application/json",
        "source": encryptedData,
      },
    })
      .then((res) => res.json())
      .then((d) => setData(d.orders))
  }
  useEffect(() => {
    fetchInfo()
  }, [])
  // console.log(data, "lego")
  const [SearchValue, setSearchValue] = useState()
  const navigation = useNavigate()
  return (
    <div className="">
      <div className="lg:px-44 px-6 py-4 my-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigation("/AdminDashboard")}
            className="px-6 py-2 rounded-xl bg-blue-500 text-white font-medium"
          >
            Back
          </button>
          <h4 className="lg:text-2xl text-sm pl-6 font-semibold">
            Customer Offers
          </h4>
          <button
            onClick={() => navigation("/admin")}
            className="px-6 py-0.5 lg:py-2 text-sm lg:text-base rounded-xl bg-blue-500 text-white font-medium"
          >
            Customer Accounts
          </button>
        </div>
        <div className="mt-4 mb-6">
          <h3 className="text-lg font-bold py-2">Search Order</h3>
          <input
            placeholder="Search Customer Offers"
            className="border px-6 rounded-xl w-full py-4"
            type="text"
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
        {data
          ?.filter((value) => {
            // console.log(value, "lol")
            const { order, Mydetails, email } = value
            const offerId = String(order?.offerId || "") // Convert offerId to a string

            if (!SearchValue) {
              return true // If no search value, show all data
            }

            const searchLower = SearchValue?.toLowerCase() // Convert search value to lowercase
            const firstName = value?.user?.Mydetails[0].firstName || ""
            const emailLower = value?.user?.email?.toLowerCase()

            return (
              offerId.includes(searchLower) ||
              emailLower.includes(searchLower) ||
              firstName?.toLowerCase().includes(searchLower)
            )
          })
          .map((value, index) => {
            if (
              value.order.Status !== "Paid" &&
              value.order.Status !== "Rejected"
            ) {
              return (
                <AdminOffer
                  order={value.order}
                  index={index}
                  key={value._id}
                  SearchValue={SearchValue}
                  data={value.Mydetails}
                  items={value}
                />
              )
            }
            return null
          })}

        {/* {data
          ?.filter((value) => {
            console.log("demo888", value.Order.length === 0)
            return SearchValue
              ? value?._id?.includes(SearchValue)
                ? value?._id
                : value?.Mydetails[0]?.firstName?.includes(SearchValue)
                ? value?.Mydetails[0]?.firstName
                : null
              : value + " " + value?.email && value.Order.length !== 0
          })
          .reverse()
          .map((value, index) => {
            console.log("lego", value.Order)

            var userID = value?._id
            return (
              <>
                <AdminOffer
                  index={index}
                  key={value._id}
                  SearchValue={SearchValue}
                  data={value.Mydetails}
                  items={value}
                />
              </>
            )
          })} */}
      </div>
    </div>
  )
}

export default CustomerOffers
