import { Modal } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import axios from "axios"
import React, { useEffect, useState } from "react"
import { Link, useLocation, useNavigate, useParams } from "react-router-dom"
import CryptoJS from 'crypto-js';
import baseUrl from "../context/baseUrl"

const ChangePassword = () => {
  const [validUrl, setValidUrl] = useState()
  const param = useParams()
  const [opened, { open, close }] = useDisclosure(false)
  const location = useLocation()
  const navigation = useNavigate()
  const route = location.pathname
  const [message, setMessage] = useState()
  const storedUserId = localStorage.getItem("userId")

  const [data, setData] = useState()
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}/contactus/submit`
        )
        setData(response.data.Mydetails[0])
      } catch (error) {
        console.error("An error occurred:", error)
        // Handle the error as needed
      }
    }

    fetchData()
  }, [])
  const [email, setEmail] = useState(data?.email)
  const handleSubmit = async (e) => {
    e.preventDefault()

    // Data to encrypt
    const sensitiveData = 'frontend';
    // Encryption key (must be a secret)
    const encryptionKey = 'legotwosell';
    // Encrypt the data
    const encryptedData = CryptoJS.AES.encrypt(sensitiveData, encryptionKey).toString();

    try {
      const response = await axios.post(
        `${baseUrl}/sendpasswordlink`,
        {
          email: email?.toLowerCase(),
          headers: {
            "Content-Type": "application/json",
            "source": encryptedData
          },
        }
      )
      open()
      setMessage(response.data.message)
      // You can perform any additional logic here after receiving the response
    } catch (error) {
      setMessage("Email Id is Not Valid. Please try again.")
    }
  }
  // console.log("8888", data?.email)
  return (
    <div className="flex items-center justify-center">
      <Modal
        size={"xl"}
        opened={opened}
        onClose={close}
        title="Check Your Email"
        centered
      >
        {/* Modal content */}
        <div className="py-4 px-4">
          {/* <h4 className="text-xl py-4 font-semibold"></h4> */}
          <div className="flex gap-4">
            <div className="">
              <img
                className="w-50% rounded-xl h-[300px] object-cover"
                src="/emailimg.jpg"
                alt=""
              />
            </div>
            <div className="">
              <h4 className="text-xl py-4 font-semibold">
                We've sent your password reset instructions to:
              </h4>
              <h1 className="text-blue-500 cursor-pointer py-2 text-lg font-medium">
                {email}
              </h1>
              <h6 className="text-base text-red-500  py-2 font-medium">
                Change Password is only valid for 20 minutes
              </h6>
              <h6 className="text-base  py-2 font-medium">
                If it doesn't arrive soon, check your spam folder.
              </h6>
              <h4 className="text-base font-normal">
                Need help ?{" "}
                <Link className="text-blue-500" to={"/contact"}>
                  Contact support.
                </Link>
              </h4>
              <button
                className="text-md  py-4 font-semibold text-blue-500"
                onClick={() => navigation("/login")}
              >
                Back to Login
              </button>
            </div>
          </div>
        </div>
      </Modal>
      <div
        className={`${
          location.pathname === "/forgot-password"
            ? "lg:w-[40%] w-full"
            : "w-full"
        } w-full lg:pl-20 py-12 lg:py-24"`}
      >
        <h1 className="h1 text-3xl lg:text-4xl text-center font-bold mb-8">
          I've forgotten my password
        </h1>
        <form className=" px-2 lg:px-8" onSubmit={handleSubmit}>
          <p className="mb-6 text-base font-medium">
            Enter your email address and we'll send you a link to reset your
            password.
          </p>
          <div className="mb-8">
            <label className="w-full flex font-bold text-base mb-2">
              Email<span className="text-[#E52D3B]">*</span>
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              name="customer_email"
              id="customer_email"
              className="h-[67px] border border-[rgba(133,138,149,0.4)] rounded-xl lg:rounded-xl w-full pl-6"
              placeholder="Your email"
              type="email"
            />
            <h4
              className={`${
                message === "Email Id is Not Valid. Please try again."
                  ? "text-red-500"
                  : "text-green-500"
              } py-4`}
            >
              {message}
            </h4>
          </div>

          <button
            className="cursor-pointer bg-blue-500 text-white rounded-xl h-[50px] lg:h-[80px] w-full flex items-center justify-center font-bold text-lg"
            type="submit"
          >
            Send Link
          </button>
        </form>
      </div>
    </div>
  )
}

export default ChangePassword
