import { Modal, Select } from "@mantine/core"
import axios from "axios"
import React, { useEffect, useState } from "react"
import { degrees, PDFDocument, rgb, StandardFonts } from "pdf-lib"
import download from "downloadjs"
import { useDisclosure } from "@mantine/hooks"
import CryptoJS from 'crypto-js';
import baseUrl from "../context/baseUrl"

const Adminorder = ({ items, data, SearchValue }) => {
  const [OrderOpen, setOrderOpen] = useState()
  const [userId, setUserId] = useState()
  const [Status, setStatus] = useState("pending")
  const [orderId, setOrderId] = useState()
  const storedUserId = localStorage.getItem("userId")
  // useEffect(() => {
  //   handleUpdate()
  // }, [storedUserId, Status, Status])
  const handleUpdate = () => {
    axios
      .put(`${baseUrl}/Getorder/status/${userId}`, {
        Status,
        orderId,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,

        },
      }
      )
      .then((response) => {
        window.location.reload()
        // console.log("Data updated:", response.data)
        // Handle successful update
      })
      .catch((error) => {
        console.error("Error updating data:", error)
        // Handle error
      })
  }
  var userID = items?._id

  const [opened, { open, close }] = useDisclosure(false)

  const handleDeleteAccount = async () => {
    // console.log(email)
    const email = items?.email
    // Data to encrypt
    const sensitiveData = 'frontend';

    // Encryption key (must be a secret)
    const encryptionKey = 'legotwosell';

    // Encrypt the data
    const encryptedData = CryptoJS.AES.encrypt(sensitiveData, encryptionKey).toString();

    try {
      const response = await fetch(`${baseUrl}/delete-account`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "source": encryptedData,
          "user-id": storedUserId,
          "Authorization": `Bearer ${localStorage.getItem("token")}`,

        },
        body: JSON.stringify({ email }),
      })
      // window.location.reload()
      const data = await response.json()
      // console.log(data)
      if (response.ok) {
        // setMessage(data.message)
        // setEmail("")
      } else {
        // setMessage(data.message)
      }
    } catch (error) {
      console.error(error)
      // setMessage("Internal Server Error")
    }
    close()
  }

  const [offerIdPdf, setOfferIdPdf] = useState()
  const [offerIdTime, setOfferIdTime] = useState()
  // console.log(offerIdPdf)
  const handleModifyPdf = async () => {
    const url = "/completpdf.pdf"

    const existingPdfBytes = await fetch(url).then((res) => res.arrayBuffer())

    const pdfDoc = await PDFDocument.load(existingPdfBytes)
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

    const pages = pdfDoc.getPages()
    const firstPage = pages[1]
    const { width, height } = firstPage.getSize()
    firstPage.drawText(`${offerIdTime}`, {
      x: 220,
      y: 240,
      size: 18,
      font: helveticaFont,
      color: rgb(0, 0, 0),
      rotate: degrees(0),
    })
    const second = pages[1]
    const { width1, height1 } = second.getSize()
    firstPage.drawText(`#${offerIdPdf}`, {
      x: 220,
      y: 200,
      size: 18,
      font: helveticaFont,
      color: rgb(0, 0, 0),
      rotate: degrees(0),
    })

    const pdfBytes = await pdfDoc.save()

    download(pdfBytes, "lego2sellPDF.pdf", "application/pdf")
  }
  // console.log("apiValue", data[0]?.Marketingpreferences)
  const filteredOrders = items?.Order.filter((value) => {
    return value.Status !== "Paid" && value.Status !== "Rejected"
  }).map((value, index) => {
    return <div key={index}>{value.Status}</div>
  })
  return (
    <div className="py-2">
      <div
        onClick={() => setOrderOpen(!OrderOpen)}
        className="last:mb-0 duration-300 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.15)] rounded-2xl py-6 px-8 cursor-pointer"
      >
        <div className="flex flex-wrap items-center justify-between">
          <div className="mr-auto lg:py-0 py-4 font-medium">
            Account ID: # {userID.slice(0, 6)}
            <br className="md:hidden" />
          </div>
          <div className="mr-auto lg:py-0 py-4 text-xs font-medium">
            Email Id : {data[0]?.email}
            <br className="md:hidden" />
          </div>
          <div className="mr-auto lg:py-0 py-4 font-medium">
            {`    ${data[0]?.title}
            ${data[0]?.firstName}
            ${data[0]?.lastName}`}
          </div>
          <div className="text-blue-500 lg:py-0 py-4 font-bold mr-6 flex">
            Watch Details
          </div>
          <div className="text-blue-500 text-lg">
            <svg
              width={8}
              aria-hidden="true"
              focusable="false"
              data-prefix="far"
              data-icon="angle-right"
              className="svg-inline--fa fa-angle-right fa-w-6 "
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 192 512"
            >
              <path
                fill="currentColor"
                d="M187.8 264.5L41 412.5c-4.7 4.7-12.3 4.7-17 0L4.2 392.7c-4.7-4.7-4.7-12.3 0-17L122.7 256 4.2 136.3c-4.7-4.7-4.7-12.3 0-17L24 99.5c4.7-4.7 12.3-4.7 17 0l146.8 148c4.7 4.7 4.7 12.3 0 17z"
              />
            </svg>
          </div>
        </div>
      </div>
      {OrderOpen && (
        <div className="bg-white duration-300 mt-4 shadow-[0_4px_20px_rgba(0,0,0,0.15)] rounded-2xl">
          <button
            onClick={open}
            className="flex ml-auto px-6 py-6 items-center justify-between"
          >
            <div className=""></div>
            <svg
              width={24}
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                {" "}
                <path
                  d="M10 12V17"
                  stroke="#000000"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>{" "}
                <path
                  d="M14 12V17"
                  stroke="#000000"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>{" "}
                <path
                  d="M4 7H20"
                  stroke="#000000"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>{" "}
                <path
                  d="M6 10V18C6 19.6569 7.34315 21 9 21H15C16.6569 21 18 19.6569 18 18V10"
                  stroke="#000000"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>{" "}
                <path
                  d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z"
                  stroke="#000000"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>{" "}
              </g>
            </svg>
          </button>
          <Modal opened={opened} onClose={close} title="Authentication">
            {/* Modal content */}
            <h4>Delete Account</h4>
            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                type="button"
                className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                onClick={handleDeleteAccount}
              >
                Delete
              </button>
              <button
                onClick={close}
                type="button"
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
              >
                Cancel
              </button>
            </div>
          </Modal>
          <div class="px-6 my-4 py-4 rounded-xl">
            <div className="">
              <div class="flex items-center py-1 gap-4">
                <h3 class="text-base font-semibold">Title:</h3>
                <h6 class="text-base">{data[0]?.title}</h6>
              </div>
              <div class="flex items-center py-1 gap-4">
                <h3 class="text-base font-semibold">First Name:</h3>
                <h6 class="text-base">{data[0]?.firstName}</h6>
              </div>
              <div class="flex items-center py-1 gap-4">
                <h3 class="text-base font-semibold">Last Name:</h3>
                <h6 class="text-base">{data[0]?.lastName}</h6>
              </div>

              <div class="flex items-center py-1 gap-4">
                <h3 class="text-base font-semibold">Email:</h3>
                <h6 class="text-base line-clamp-1 ">{data[0]?.email} </h6>
              </div>
              <div class="flex items-center py-1 gap-4">
                <h3 class="text-base font-semibold">Telephone:</h3>
                <h6 class="text-base">{data[0]?.Telephone} </h6>
              </div>
              <div class="flex items-center py-1 gap-4">
                <h3 class="text-base font-semibold">Street Address-1:</h3>
                <h6 class="text-base">{data[0]?.StreetAddress1} </h6>
              </div>
              <div class="flex items-center py-1 gap-4">
                <h3 class="text-base font-semibold">Street Address-2:</h3>
                <h6 class="text-base">{data[0]?.StreetAddress2} </h6>
              </div>
              <div class="flex items-center py-1 gap-4">
                <h3 class="text-base font-semibold">City :</h3>
                <h6 class="text-base">{data[0]?.city} </h6>
              </div>
              <div class="flex items-center py-1 gap-4">
                <h3 class="text-base font-semibold">Country :</h3>
                <h6 class="text-base">{data[0]?.Country} </h6>
              </div>
              <div class="flex items-center py-1 gap-4">
                <h3 class="text-base font-semibold">Postcode:</h3>
                <h6 class="text-base">{data[0]?.Postcode} </h6>
              </div>
              <div class="flex items-center py-1 gap-4">
                <h3 class="text-base font-semibold">Payment Method:</h3>
                <h6 class="text-base">{data[0]?.paymentMethod} </h6>
              </div>
              <div class="flex items-center py-1 gap-4">
                <h3 class="text-base font-semibold">Account Number:</h3>
                <h6 class="text-base">{data[0]?.accountNumber} </h6>
              </div>
              <div class="flex items-center py-1 gap-4">
                <h3 class="text-base font-semibold">Sort Code:</h3>
                <h6 class="text-base">
                  {`${data[0]?.sortCode1} - ${data[0]?.sortCode2} - ${data[0]?.sortCode3} `}
                </h6>
              </div>
              <div class="flex items-center py-1 gap-4">
                <h3 class="text-base font-semibold">Paypal Email :</h3>
                <h6 class="text-base">{data[0]?.Paypalemail} </h6>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center gap-4">
            <h5 className="text-xl font-semibold">
              <h5>Marketing Preferences</h5>
            </h5>
            <h2 className="text-xl bg-blue-500 my-8 text-white px-6 py-1 rounded-full font-medium">
              {data[0]?.Marketingpreferences}
            </h2>
          </div>
          <div className="flex  items-start w-full lg:flex-row flex-wrap flex-col">
            {items?.Order.filter((value) => {
              return value
            }).map((value, index) => {
              return (
                <div className="lg:w-2/4 w-full">
                  <div class="px-6 border-t">
                    <h1 class="text-2xl font-bold py-4 ">
                      What you will be sending to us.
                    </h1>
                    <div class="flex lg:flex-row flex-col items-center py-6 border rounded-2xl  px-6 justify-between">
                      <div class="flex lg:flex-row flex-col items-center gap-6">
                        <img
                          class="w-44 object-contain  border rounded-lg px-4 border-gray-300 h-32"
                          src={value?.ProductImg}
                          alt=""
                        />
                        <h3 class="text-lg font-semibold">
                          {value?.ProductName} {value?.ProductId}
                        </h3>
                      </div>
                      <div class="flex w-24 text-blue-500 font-bold items-center gap-6">
                        <h2> £{value?.Price.toFixed(2)}</h2>
                      </div>
                    </div>
                  </div>
                  <div className="absolute top-0 right-0 p-0 lg:p-6 text-xl cursor-pointer">
                    <svg
                      aria-hidden="true"
                      focusable="false"
                      data-prefix="far"
                      data-icon="times"
                      className="svg-inline--fa fa-times fa-w-10 "
                      role="img"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 320 512"
                    >
                      <path
                        fill="currentColor"
                        d="M207.6 256l107.72-107.72c6.23-6.23 6.23-16.34 0-22.58l-25.03-25.03c-6.23-6.23-16.34-6.23-22.58 0L160 208.4 52.28 100.68c-6.23-6.23-16.34-6.23-22.58 0L4.68 125.7c-6.23 6.23-6.23 16.34 0 22.58L112.4 256 4.68 363.72c-6.23 6.23-6.23 16.34 0 22.58l25.03 25.03c6.23 6.23 16.34 6.23 22.58 0L160 303.6l107.72 107.72c6.23 6.23 16.34 6.23 22.58 0l25.03-25.03c6.23-6.23 6.23-16.34 0-22.58L207.6 256z"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="text-center py-6 px-2 lg:px-6">
                      <h3 className="mr-auto text-lg font-medium mb-4">
                        Offer ID: #{value?.offerId}
                      </h3>
                      <div className="rounded-full text-xs px-2 lg:px-6 py-2 font-bold text-[#F4A414] w-full">
                        {/* {value.Status} */}
                        <Select
                          onChange={(e) => {
                            setStatus(e)
                            setUserId(items._id)
                            setOrderId(value._id)
                          }}
                          label="Change Product Status"
                          placeholder="Pick one"
                          data={[
                            { value: "Pending", label: "Pending" },
                            { value: "Received", label: "Received" },
                            { value: "Checking", label: "Checking" },
                            { value: "Accepted", label: "Accepted" },
                            { value: "Rejected", label: "Rejected" },
                            { value: "Paid", label: "Paid" },
                          ]}
                        />
                        <button
                          onClick={handleUpdate}
                          className="text-md my-6 text-white font-bold bg-blue-500 rounded-xl px-6 py-2"
                        >
                          Change
                        </button>
                      </div>
                      <div className="rounded-full text-xs px-2 lg:px-6 py-2 font-bold bg-[#FDEDD0] text-[#F4A414] w-full">
                        {value.Status}
                      </div>
                      <div className="bg-[#F8F8FE] rounded-lg p-2 lg:p-8 mt-8">
                        <div className="flex flex-wrap w-full items-center justify-between">
                          <div>Date &amp; Time</div>
                          <div>{value?.timestamp}</div>
                        </div>
                        <div className="flex  flex-wrap w-full items-center justify-between mt-2">
                          <div>No. of items</div>
                          <div>{index + 1}</div>
                        </div>
                        <div className="flex  flex-wrap w-full items-center justify-between mt-2">
                          <div>Condition</div>
                          <div>{value?.setCondition}</div>
                        </div>
                        <div className="flex  flex-wrap w-full items-center justify-between mt-2">
                          <div>Delivery method</div>
                          <div className="flex flex-col justify-end items-end">
                            Drop off
                          </div>
                        </div>
                        <div className="flex  flex-wrap w-full items-center justify-between mt-2">
                          <div>Status</div>
                          <div>{value?.Status}</div>
                        </div>
                        <hr className="mt-4" />
                        <div className="flex  flex-wrap w-full items-center justify-between mt-4">
                          <div className="font-bold text-lg">
                            Total offer value
                          </div>
                          <div className="font-bold text-lg text-blue-500">
                            £{value?.Price.toFixed(2)}
                          </div>
                        </div>
                        <div className="flex  flex-wrap flex-col mt-8">
                          <button
                            onClick={async () => {
                              setOfferIdPdf(value?.offerId)
                              setOfferIdTime(value?.timestamp)
                              const url = "/completpdf.pdf"

                              const existingPdfBytes = await fetch(url).then(
                                (res) => res.arrayBuffer()
                              )

                              const pdfDoc = await PDFDocument.load(
                                existingPdfBytes
                              )
                              const helveticaFont = await pdfDoc.embedFont(
                                StandardFonts.HelveticaBold
                              )

                              const pages = pdfDoc.getPages()
                              const firstPage = pages[1]
                              const { width, height } = firstPage.getSize()
                              firstPage.drawText(`${value?.timestamp}`, {
                                x: 220,
                                y: 240,
                                size: 18,
                                font: helveticaFont,
                                color: rgb(0, 0, 0),
                                rotate: degrees(0),
                              })
                              const second = pages[1]
                              const { width1, height1 } = second.getSize()
                              firstPage.drawText(`#${value?.offerId}`, {
                                x: 220,
                                y: 200,
                                size: 18,
                                font: helveticaFont,
                                color: rgb(0, 0, 0),
                                rotate: degrees(0),
                              })

                              const pdfBytes = await pdfDoc.save()
                              // Trigger the browser to download the PDF document
                              download(
                                pdfBytes,
                                "lego2sellPDF.pdf",
                                "application/pdf"
                              )
                            }}
                            className="inline-flex w-auto justify-center items-center px-6 lg:px-12 rounded-full bg-blue-500 text-white font-bold h-[49px] lg:h-[65px] text-[15px] xl:text-[15px] mb-2"
                          >
                            Download and print label
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default Adminorder
