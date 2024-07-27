import React, { useEffect, useState, Fragment } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"
import { Loader, Modal } from "@mantine/core"
import PasswordStrengthMeter from "../Password"
import { useDisclosure } from "@mantine/hooks"
import CryptoJS from 'crypto-js';
import baseUrl from "../../context/baseUrl"

const PasswordReset = () => {
  const [validUrl, setValidUrl] = useState(false)

  const [password, setPassword] = useState("")
  const [repeatpassword, setRepeatpassword] = useState()
  const [msg, setMsg] = useState("")
  const [error, setError] = useState("")
  const param = useParams()
  const url = `${baseUrl}/forgotpassword/${param.id}/${param.token}`

  useEffect(() => {
    const verifyUrl = async () => {
      try {

        // Data to encrypt
        const sensitiveData = 'frontend';
        // Encryption key (must be a secret)
        const encryptionKey = 'legotwosell';
        // Encrypt the data
        const encryptedData = CryptoJS.AES.encrypt(sensitiveData, encryptionKey).toString();

        await axios.get(url, {
          headers: {
            "Content-Type": "application/json",
            "source": encryptedData
          }
        })

        setValidUrl(true)
      } catch (error) {
        setValidUrl(false)
      }
    }
    verifyUrl()
  }, [param, url])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const { data } = await axios.post(url, { password })

      setMsg(data.message)
      setError("")
      window.location = "/login"
    } catch (error) {
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        setError(error.response.data.message)
        setMsg("")
      }
    }
  }

  return (
    <Fragment>
      {validUrl ? (
        <div className="">
          <section className="lg:pt-24 py-10">
            <div className=" md:text-center">
              <h1 className="h1 text-5xl font-extrabold">
                I've forgotten my password
              </h1>
            </div>
          </section>
          <section className="py-10 lg:pb-24">
            <div className=" ">
              <form
                className="flex items-center flex-col max-w-2xl lg:max-w-5xl mx-auto"
                onSubmit={handleSubmit}
              >
                <div className="w-full lg:w-6/12 text-left">
                  <div>
                    <h3 className="h3 text-xl font-bold mb-6">New Password</h3>
                    <p className="mb-6 text-gray-400">
                      Choose a secure password - a combination of letters,
                      numbers and special characters is usually best.
                    </p>
                    <div className="mb-6">
                      <label className="w-full flex font-bold text-sm mb-2">
                        New Password<span className="text-[#E52D3B]">*</span>
                      </label>
                      <input
                        placeholder="New Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="h-[67px] border border-[rgba(133,138,149,0.4)] rounded-3xl lg:rounded-xl w-full pl-6"
                        type="password"
                        name="customer_password"
                        id="customer_password"
                      />
                    </div>
                    <div>
                      <label className="w-full flex font-bold text-sm mb-2">
                        Repeat password<span className="text-[#E52D3B]">*</span>
                      </label>
                      <input
                        value={repeatpassword}
                        onChange={(e) => setRepeatpassword(e.target.value)}
                        placeholder="repeatpassword"
                        className="py-4 px-6 border rounded-xl w-full"
                        // {...form.getInputProps("password")}
                        type="password"
                      />
                      {password !== repeatpassword && (
                        <p className="py-2 text-red-500">
                          Repeat Password Most Be Some
                        </p>
                      )}
                    </div>
                    <PasswordStrengthMeter password={password} />
                  </div>

                  <div className="mt-8">
                    <button
                      disabled={password !== repeatpassword}
                      type="submit"
                      className={` ${
                        password === repeatpassword
                          ? "cursor-pointer"
                          : "cursor-not-allowed"
                      }  bg-blue-500 text-white rounded-xl h-[80px] w-full flex items-center justify-center font-bold text-lg`}
                    >
                      Reset password
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </section>
        </div>
      ) : (
        <Loader />
      )}
    </Fragment>
  )
}

export default PasswordReset
