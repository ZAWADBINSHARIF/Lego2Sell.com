import React, { useEffect, useState } from "react"
import { degrees, PDFDocument, rgb, StandardFonts } from "pdf-lib"
import download from "downloadjs"
import { useDisclosure } from "@mantine/hooks"
import { Modal } from "@mantine/core"
import axios from "axios"
import baseUrl from "../context/baseUrl"
// import { Modal } from "flowbite"
// import pdf from "../../public/SellyournewsetsatLEGO2sell.pdf"
const PDFModificationExample = ({ orderId, date, opened, open, close }) => {
  const [allowDownload, setAllowDownload] = useState()
  const [orderitems, setOrderitems] = useState()
  const [data, setData] = useState()
  const storedUserId = localStorage.getItem("userId")
  const SearchValue = localStorage.getItem("SearchValue")
  const handleSearch = async () => {
    try {
      const response = await fetch(`${baseUrl}/find-lego`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ itemCode: orderitems?.ProductId }),
      })

      const data = await response.json()
      setData(data)
      // console.log("Data", data)
    } catch {
      // alert("Could not find the LEGO you are looking for.")
    } finally {
      // Set loading state back to false
    }
  }
  useEffect(() => {
    handleSearch()
  }, [setData, orderitems?.ProductId])
  const [details, setDetails] = useState()
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}/Mydetails/${storedUserId}`
        )
        setDetails(response.data.Mydetails[0])
        const response1 = await fetch(`${baseUrl}/find-lego`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ itemCode: SearchValue }),
        })

        const data = await response1.json()
        // console.log("Data", data)
        // localStorage.setItem("data", data)
        if (data.message === "SUCCESS") {
          setData(data)
        } else {
          // console.log("error")
          // alert("Could not find the LEGO you are looking for.")
        }
      } catch (error) {
        console.error("An error occurred:", error)
        // Handle the error as needed
      }
    }

    fetchData()
  }, [])
  const handleModifyPdf = async () => {
    const url = "/completpdf.pdf"

    const existingPdfBytes = await fetch(url).then((res) => res.arrayBuffer())

    const pdfDoc = await PDFDocument.load(existingPdfBytes)
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

    const pages = pdfDoc.getPages()
    const firstPage = pages[1]
    const { width, height } = firstPage.getSize()
    firstPage.drawText(`${date}`, {
      x: 220,
      y: 240,
      size: 18,
      font: helveticaFont,
      color: rgb(0, 0, 0),
      rotate: degrees(0),
    })
    const second = pages[1]
    const { width1, height1 } = second.getSize()
    firstPage.drawText(`#${orderId}`, {
      x: 220,
      y: 200,
      size: 18,
      font: helveticaFont,
      color: rgb(0, 0, 0),
      rotate: degrees(0),
    })

    const pdfBytes = await pdfDoc.save()
    // Trigger the browser to download the PDF document
    download(pdfBytes, "lego2sellPDF.pdf", "application/pdf")
    close()
  }

  // console.log(orderitems)
  useEffect(() => {
    const fetchUserOrders = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}/Getorder/${storedUserId}`
        )

        if (response.status === 200) {
          const { orders } = response.data
          // console.log("User orders:", orders)
          setOrderitems(orders[orders.length - 1])
          // Process the orders data as needed
        } else {
          throw new Error("Error: " + response.status)
        }
      } catch (error) {
        console.error("An error occurred:", error)
      }
    }

    fetchUserOrders()
  }, [storedUserId, setOrderitems])

  return (
    <div>
      <button className="text-blue-500 font-bold" onClick={open}>
        Download your label
      </button>
      <Modal
        title="Offer Details"
        centered
        opened={opened}
        onClose={close}
        withCloseButton={true}
      >
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
            <h4 className="text-xl font-medium py-2">
              {data?.body?.name} {orderitems?.ProductId}
            </h4>
            <h3 className="mr-auto text-lg font-medium mb-4">
              Offer ID: #{orderId}
            </h3>
            <div className="rounded-full text-xs px-2 lg:px-6 py-2 font-bold bg-blue-500 text-white w-full">
              {orderitems?.Status}
            </div>
            <div className="bg-[#F8F8FE] rounded-lg p-2 lg:p-8 mt-8">
              <div className="flex flex-wrap w-full items-center justify-between">
                <div>Date &amp; Time</div>
                <div>{orderitems?.timestamp}</div>
              </div>
              <div className="flex  flex-wrap w-full items-center justify-between mt-2">
                <div>No. of items</div>
                <div>{1}</div>
              </div>
              <div className="flex  flex-wrap w-full items-center justify-between mt-2">
                <div>Delivery method</div>
                <div className="flex flex-col justify-end items-end">
                  Drop off
                </div>
              </div>
              <div className="flex  flex-wrap w-full items-center justify-between mt-2">
                <div>Status</div>
                <div>{orderitems?.Status}</div>
              </div>
              <div className="flex  flex-wrap w-full items-center justify-between mt-2">
                <div>Payment Method</div>
                <div>{details?.paymentMethod}</div>
              </div>
              <div className="flex  flex-wrap w-full items-center justify-between mt-2">
                <div>Condition</div>
                <div>{orderitems?.setCondition}</div>
              </div>
              <hr className="mt-4" />
              <div className="flex  flex-wrap w-full items-center justify-between mt-4">
                <div className="font-bold text-lg">Total offer value</div>
                <div className="font-bold text-lg text-blue-500">
                  {/* £{orderitems?.Price.toFixed(2)} */}£
                  {orderitems?.Price.toFixed(2)}
                </div>
              </div>
              <div className="flex  flex-wrap flex-col mt-8">
                <button
                  onClick={handleModifyPdf}
                  className="inline-flex w-auto justify-center items-center px-6 lg:px-12 rounded-xl bg-blue-500 text-white font-bold h-[49px] lg:h-[65px] text-[15px] xl:text-[15px] mb-2"
                  rel="noreferrer"
                  tabIndex={0}
                >
                  Download and print label
                </button>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default PDFModificationExample
