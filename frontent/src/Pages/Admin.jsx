import React, { useEffect, useState } from "react"
import Adminorder from "../componet/Adminorder"
import { useNavigate } from "react-router-dom"
import baseUrl from "../context/baseUrl"

const Admin = () => {
  const [data, setData] = useState()
  
  const fetchInfo = () => {
    return fetch(`${baseUrl}/GetOrder`)
      .then((res) => res.json())
      .then((d) => setData(d.data))
  }
  // console.log(data)
  useEffect(() => {
    fetchInfo()
  }, [])
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
          <h4 className="lg:text-2xl text-sm text-center font-semibold">
            Customer Accounts
          </h4>
          <button
            onClick={() => navigation("/customeroffers")}
            className="px-6 py-2 text-sm lg:text-base rounded-xl bg-blue-500 text-white font-medium"
          >
            Customer Offers
          </button>
        </div>
        <div className="mt-4 mb-6">
          <h3 className="text-xl lg:text-lg font-bold py-2">Search Order</h3>
          {/* <SearchDas data={data} /> */}
          <input
            placeholder="search Customer account "
            className="border px-6 rounded-xl w-full py-4"
            type="text"
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
        {data
          ?.filter((value) => {
            return SearchValue
              ? value?._id?.includes(SearchValue)
                ? value?._id
                : value?.Mydetails[0]?.firstName?.includes(SearchValue)
                ? value?.Mydetails[0]?.firstName
                : null
              : value + " " + value?.email
          })
          .reverse()
          .map((value) => (
            <Adminorder
              key={value._id}
              SearchValue={SearchValue}
              data={value.Mydetails}
              items={value}
            />
          ))}
      </div>
    </div>
  )
}

export default Admin
