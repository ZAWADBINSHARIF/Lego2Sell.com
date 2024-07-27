import { Modal, Select } from "@mantine/core"
import axios from "axios"
import React, { useEffect, useState } from "react"
import { degrees, PDFDocument, rgb, StandardFonts } from "pdf-lib"
import download from "downloadjs"
import { useDisclosure } from "@mantine/hooks"
import CryptoJS from 'crypto-js';
import baseUrl from "../context/baseUrl"

const Adminorder = ({ items, data, SearchValue, index }) => {
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
  var userID = items.user?._id
  // console.log(items.user, "lego")

  const [opened, { open, close }] = useDisclosure(false)

  const handleDeleteAccount = async () => {
    // console.log(email)
    const email = items?.user?.email
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
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ email }),
      })
      window.location.reload()
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
    firstPage.drawText(`${items.order.timestamp}`, {
      x: 220,
      y: 240,
      size: 18,
      font: helveticaFont,
      color: rgb(0, 0, 0),
      rotate: degrees(0),
    })
    const second = pages[1]
    const { width1, height1 } = second.getSize()
    firstPage.drawText(`#${items.order.offerId}`, {
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
  const [activeStatus, setActiveStatus] = useState()
  // const filteredOrders = items?.Order.filter((value) => {
  //   return value.Status !== "Paid" && value.Status !== "Rejected"
  // }).map((value, index) => {
  //   return <div key={index}>{value.Status}</div>
  // })
  // const mappedData = items.order.map((item) => {
  //   // Your mapping logic here
  //   return item
  // })

  return (
    <div className="">
      <div onClick={() => open()} class="py-3">
        <div class="mb-4 last:mb-0 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.15)] rounded-2xl p-6 px-8 cursor-pointer">
          <div className="flex flex-wrap items-center justify-between">
            <div className="mr-auto lg:py-0 py-4 font-medium">
              Offer ID: # {items.order.offerId}
              <br className="md:hidden" />
            </div>
            <div className="mr-auto lg:py-0 py-4 text-xs font-medium">
              Email Id : {items?.user?.email}
              <br className="md:hidden" />
            </div>
            <div className="mr-auto lg:py-0 py-4 font-medium">
              {`${items?.user?.Mydetails[0].title}
            ${items?.user?.Mydetails[0].firstName}
            ${items?.user?.Mydetails[0].lastName}`}
            </div>
            <div class="rounded-full lg:py-2 py-4 text-[10px] lg:text-xs px-6  font-bold bg-[#FDEDD0] text-[#F4A414] mr-7">
              <div>{items.order.Status}</div>
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
      </div>

      <Modal size={"lg"} onClose={close} opened={opened}>
        <div className="flex  items-start w-full lg:flex-row flex-wrap flex-col">
          <div className=" w-full">
            <div className="px-6 border-t">
              <h1 className="text-2xl font-bold py-4 ">
                What you will be sending to us.
              </h1>
              <div className="flex lg:flex-row flex-col items-center py-6 border rounded-2xl  px-6 justify-between">
                <div className="flex lg:flex-row flex-col items-center gap-6">
                  <img
                    className="w-44 object-contain  border rounded-lg px-4 border-gray-300 h-32"
                    src={items.order.ProductImg}
                    alt=""
                  />
                  <h3 className="text-lg font-semibold">
                    {items.order.ProductName} {items.order.ProductId}
                  </h3>
                </div>
                <div className="flex w-24 text-blue-500 font-bold items-center gap-6">
                  <h2> £ {items.order.Price.toFixed(2)}</h2>
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
                  Offer ID: # {items.order.offerId}
                </h3>
                {/* <div className="rounded-full text-xs px-2 lg:px-6 py-2 font-bold text-[#F4A414] w-full">
                  <div className="mantine-InputWrapper-root mantine-Select-root mantine-1ejqehl">
                    <label
                      className="mantine-InputWrapper-label mantine-Select-label mantine-1fzet7j"
                      htmlFor="mantine-n0b2ovs5l"
                      id="mantine-n0b2ovs5l-label"
                    >
                      Change Product Status
                    </label>
                    <div
                      role="combobox"
                      aria-haspopup="listbox"
                      aria-controls="mantine-n0b2ovs5l"
                      aria-expanded="false"
                      tabIndex={-1}
                      className=""
                    >
                      <input type="hidden" defaultValue="" />
                      <div className="mantine-Input-wrapper mantine-Select-wrapper mantine-1v7s5f8">
                        <input
                          className="mantine-Input-input mantine-Select-input mantine-1cn2mlo"
                          autoComplete="off"
                          type="search"
                          id="mantine-n0b2ovs5l"
                          placeholder="Pick one"
                          aria-autocomplete="list"
                          readOnly=""
                          data-mantine-stop-propagation="false"
                          aria-invalid="false"
                          defaultValue=""
                        />
                        <div className="mantine-1qj7q0z mantine-Input-rightSection mantine-Select-rightSection">
                          <svg
                            viewBox="0 0 15 15"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            data-chevron="true"
                            style={{
                              color: "rgb(134, 142, 150)",
                              width: "1.125rem",
                              height: "1.125rem",
                            }}
                          >
                            <path
                              d="M4.93179 5.43179C4.75605 5.60753 4.75605 5.89245 4.93179 6.06819C5.10753 6.24392 5.39245 6.24392 5.56819 6.06819L7.49999 4.13638L9.43179 6.06819C9.60753 6.24392 9.89245 6.24392 10.0682 6.06819C10.2439 5.89245 10.2439 5.60753 10.0682 5.43179L7.81819 3.18179C7.73379 3.0974 7.61933 3.04999 7.49999 3.04999C7.38064 3.04999 7.26618 3.0974 7.18179 3.18179L4.93179 5.43179ZM10.0682 9.56819C10.2439 9.39245 10.2439 9.10753 10.0682 8.93179C9.89245 8.75606 9.60753 8.75606 9.43179 8.93179L7.49999 10.8636L5.56819 8.93179C5.39245 8.75606 5.10753 8.75606 4.93179 8.93179C4.75605 9.10753 4.75605 9.39245 4.93179 9.56819L7.18179 11.8182C7.35753 11.9939 7.64245 11.9939 7.81819 11.8182L10.0682 9.56819Z"
                              fill="currentColor"
                              fillRule="evenodd"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button className="text-md my-6 text-white font-bold bg-blue-500 rounded-xl px-6 py-2">
                    Change
                  </button>
                </div> */}
                <div className="rounded-full text-xs px-2 lg:px-6 py-2 font-bold text-[#F4A414] w-full">
                  {/* {value.Status} */}
                  <Select
                    onChange={(e) => {
                      setStatus(e)
                      setUserId(items.user._id)
                      setOrderId(items.order._id)
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
                  {items.order.Status}
                </div>
                <div className="bg-[#F8F8FE] rounded-lg p-2 lg:p-8 mt-8">
                  <div className="flex flex-wrap w-full items-center justify-between">
                    <div>Date &amp; Time</div>
                    <div> {items.order.timestamp}</div>
                  </div>
                  <div className="flex  flex-wrap w-full items-center justify-between mt-2">
                    <div>No. of items</div>
                    <div> {items.order.noItems}</div>
                  </div>
                  <div className="flex  flex-wrap w-full items-center justify-between mt-2">
                    <div>Condition</div>
                    <div> {items.order.setCondition}</div>
                  </div>
                  <div className="flex  flex-wrap w-full items-center justify-between mt-2">
                    <div>Delivery method</div>
                    <div className="flex flex-col justify-end items-end">
                      Drop off
                    </div>
                  </div>
                  <div className="flex  flex-wrap w-full items-center justify-between mt-2">
                    <div>Status</div>
                    <div> {items.order.Status}</div>
                  </div>
                  <hr className="mt-4" />
                  <div className="flex  flex-wrap w-full items-center justify-between mt-4">
                    <div className="font-bold text-lg">Total offer value</div>
                    <div className="font-bold text-lg text-blue-500">
                      £{items.order.Price.toFixed(2)}
                    </div>
                  </div>
                  <div className="flex  flex-wrap flex-col mt-8">
                    <button
                      onClick={handleModifyPdf}
                      className="inline-flex w-auto justify-center items-center px-6 lg:px-12 rounded-full bg-blue-500 text-white font-bold h-[49px] lg:h-[65px] text-[15px] xl:text-[15px] mb-2"
                    >
                      Download and print label
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default Adminorder
