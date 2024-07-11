import { Modal } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import React, { useEffect, useState } from "react"
import { degrees, PDFDocument, rgb, StandardFonts } from "pdf-lib"
import download from "downloadjs"
import baseUrl from "../context/baseUrl"
const OrderCards = ({
  timestamp,
  length,
  Deliverymethod,
  offerId,
  Status,
  Price,
  items,
  productId,
  setCondition,
  getMyDetails,
}) => {
  const [opened, { open, close }] = useDisclosure(false)
  const [data, setData] = useState()
  // console.log("go8", getMyDetails)
  const handleSearch = async () => {
    try {
      const response = await fetch(`${baseUrl}/find-lego`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ itemCode: productId }),
      })

      const data = await response.json()
      setData(data)
      // console.log("data", data?.body.no)
      // console.log("Data", data)
    } catch {
      // alert("Could not find the LEGO you are looking for.")
    } finally {
      // Set loading state back to false
    }
  }
  useEffect(() => {
    // Retrieve the length value from local storage when the component mounts

    localStorage.setItem("savedLength", length)
    handleSearch()
  }, [length])
  const handleModifyPdf = async () => {
    const url = "/completpdf.pdf"

    const existingPdfBytes = await fetch(url).then((res) => res.arrayBuffer())

    const pdfDoc = await PDFDocument.load(existingPdfBytes)
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

    const pages = pdfDoc.getPages()
    const firstPage = pages[1]
    const { width, height } = firstPage.getSize()
    firstPage.drawText(`${timestamp}`, {
      x: 220,
      y: 240,
      size: 18,
      font: helveticaFont,
      color: rgb(0, 0, 0),
      rotate: degrees(0),
    })
    const second = pages[1]
    const { width1, height1 } = second.getSize()
    firstPage.drawText(`#${offerId}`, {
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
  }

  return (
    <div className="py-3">
      <div
        onClick={open}
        className="last:mb-0 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.15)] rounded-2xl p-6 px-4 lg:px-8 cursor-pointer"
      >
        <div className="flex items-center justify-between">
          <div className="mr-auto font-medium">
            Offer ID: #{offerId}
            <br className="md:hidden" />
            <span className="md:hidden text-blue-500 font-bold">£{Price}</span>
            <div className="text-sm lg:hidden flex font-medium text-black pr-4">
              {timestamp}
            </div>
          </div>
          <div className="text-sm lg:block hidden font-medium text-black pr-4">
            {timestamp}
          </div>
          <div className="rounded-full text-xs px-6 lg:mt-0 py-2 font-bold bg-blue-500 text-white mr-5 lg:mr-7">
            {Status}
          </div>
          <div className="text-blue-500 font-bold mr-6 hidden md:flex">
            £{Price?.toFixed(2)}
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
              {data?.body?.name} {productId}
            </h4>
            <h3 className="mr-auto text-lg font-medium mb-4">
              Offer ID: #{offerId}
            </h3>
            <div className="rounded-full text-xs px-2 lg:px-6 py-2 font-bold bg-blue-500 text-white w-full">
              {Status}
            </div>
            <div className="bg-[#F8F8FE] rounded-lg p-2 lg:p-8 mt-8">
              <div className="flex flex-wrap w-full items-center justify-between">
                <div>Date &amp; Time</div>
                <div>{timestamp}</div>
              </div>
              <div className="flex  flex-wrap w-full items-center justify-between mt-2">
                <div>No. of items</div>
                <div>{items}</div>
              </div>
              <div className="flex  flex-wrap w-full items-center justify-between mt-2">
                <div>Delivery method</div>
                <div className="flex flex-col justify-end items-end">
                  drop off
                </div>
              </div>
              <div className="flex  flex-wrap w-full items-center justify-between mt-2">
                <div>Condition</div>
                <div>{setCondition}</div>
              </div>

              <div className="flex  flex-wrap w-full items-center justify-between mt-2">
                <div>Payment Method</div>
                <div>{getMyDetails?.paymentMethod}</div>
              </div>
              <div className="flex  flex-wrap w-full items-center justify-between mt-2">
                <div>Status</div>
                <div>{Status}</div>
              </div>
              <hr className="mt-4" />
              <div className="flex  flex-wrap w-full items-center justify-between mt-4">
                <div className="font-bold text-lg">Total offer value</div>
                <div className="font-bold text-lg text-blue-500">£{Price}</div>
              </div>
              <div className="flex  flex-wrap flex-col mt-8">
                <button
                  onClick={handleModifyPdf}
                  target="_blank"
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

export default OrderCards
