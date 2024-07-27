import { Loader } from "@mantine/core"
import axios from "axios"
import React, { useEffect, useState } from "react"
import { Link, useLocation } from "react-router-dom"
// import PDFModificationExample from "../componet/PDFComplete"
import PDFModificationExample from "../componet/PDFComplete"
import { useDisclosure } from "@mantine/hooks"
import baseUrl from "../context/baseUrl"

const SuccessPage = () => {
  const location = useLocation()
  const storedUserId = localStorage.getItem("userId")
  const price = localStorage.getItem("Price")
  const condition = location.state.condition
  const offerId = location.state.offerId
  // console.log(offerId)
  const [PdfTime, setPdfTime] = useState()
  // console.log(PdfTime)
  const [opened, { open, close }] = useDisclosure(false)
  // const price = location.state.price
  const [orderitems, setOrderitems] = useState()
  // console.log(orderitems)
  useEffect(() => {
    localStorage.setItem("Basket", "")
    const fetchUserOrders = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}/Getorder/${storedUserId}`
        )

        if (response.status === 200) {
          const { orders } = response.data
          // console.log("User orders", orders.length - 1)
          setOrderitems(orders)
          open(true)
          setPdfTime(orders[orders.length - 1].timestamp)
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
  return (
    <div style={{
      marginBottom:'6rem !important'
    
    }}>
      <section className="lg:pt-24 px-6 py-10"
      style={{
        marginBottom:'6rem !important'
      
      }}>
        <div className=" md:text-center">
          <div className="text-5xl flex items-center justify-center lg:text-6xl mb-8">
            <svg
              width={44}
              aria-hidden="true"
              focusable="false"
              data-prefix="fas"
              data-icon="check-circle"
              className="svg-inline--fa fa-check-circle fa-w-16 text-[#69B832]"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <path
                fill="currentColor"
                d="M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z"
              />
            </svg>
          </div>
          <h1 className="h1 text-2xl text-center font-bold mb-6">
            Thank you for selling your LEGO®
          </h1>
          <div className="text-lg text-center font-medium md:text-2xl">
            Your offer ID is
            <strong className="font-bold text-blue-500"> #{offerId}</strong> |
            You'll receive
            {price ? (
              <strong className="font-bold text-blue-500"> £{price}</strong>
            ) : (
              <Loader size="xs" />
            )}
          </div>
        </div>
      </section>
      <section className="lg:py-10 py-0 lg:pb-24" style={{
        marginBottom:'6rem !important'
      }}>
        <div className="" style={{
          marginBottom:'6rem !important',
          paddingBottom:'6rem !important'
        
        }}>
          <h2 className="h3 px-6 mb-8 text-center">
            What you need to do next...
          </h2>
          <div className="relative py-24" style={{
            paddingBottom:'6rem !important'
          }} >
            <div className="grid grid-rows-3 md:grid-rows-2 md:grid-cols-2 lg:grid-rows-none lg:grid-cols-3 gap-16">
              <div className="flex flex-col items-center justify-start text-center">
                <div className="flex items-center justift-center h-[190px]">
                  <img
                    alt=""
                    aria-hidden="true"
                    src="/Images/Image 1.png"
                    className="w-44"
                  />
                </div>
                <div className="font-extrabold py-6 mb-4 text-lg">
                  <span className="text-blue-500">1.</span> Pack your LEGO®
                </div>
                <div className="text-[#87888F] leading-7 font-medium max-w-[366px] mx-auto">
                  Pack your LEGO® as per the packaging guidelines.
                </div>
                <div className="mt-auto">
                  <Link
                    to="/packaging-guidelines"
                    target="_blank"
                    className="text-blue-500 font-bold"
                    title="Packaging guidelines"
                  >
                    Packaging guidelines
                  </Link>
                </div>
              </div>
              <div className="flex flex-col items-center justify-start text-center">
                <div className="flex  items-center justift-center h-[120px] lg:h-[190px]">
                  <img
                    alt=""
                    className="w-44"
                    aria-hidden="true"
                    src="/Images/image 2.png"
                  />
                </div>
                <div className="font-extrabold py-6 mb-4 text-lg">
                  <span className="text-blue-500">2.</span> Print your label
                </div>
                <div className="text-[#87888F] leading-7 font-medium max-w-[366px] mx-auto">
                  Print off your postage label and attach it. No printer? No
                  Problem just simply write it on some paper and stick it on the
                  package.
                </div>
                <div className="mt-6">
                  {/* <a
                    className="text-blue-500 font-bold"
                    target="_blank"
                    title="EVRi Packing Label"
                    href="https://d2v4pwfq1wtp4e.cloudfront.net/64a684b913af71.38312776.pdf?Policy=ewogICJTdGF0ZW1lbnQiOlsKCXsKCSAgIlJlc291cmNlIjoiaHR0cHM6Ly9kMnY0cHdmcTF3dHA0ZS5jbG91ZGZyb250Lm5ldC82NGE2ODRiOTEzYWY3MS4zODMxMjc3Ni5wZGYiLAoJICAiQ29uZGl0aW9uIjp7CgkJIkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjogMTY4ODYzNjM1M30KCSAgfQoJfQogIF0KfQo_&Signature=BcKnyINnxW~8intzMtNpYPA-O5GPOy3ezYK3CZhArZzMB4sf0vPmvixWHAB9e5gE5M8mQTTAWr9oQ-SlOujxfcSacO7AxsUM1YcEmabwqaUHZHYU6wATaioC04Ud0pETDlZ8IxUX0rkE9zTJkZ9T2ARBoeSBurLMqohYAhN65p~PAdkp7~QOzKTMBnfR7qFW0V82bciYsGJKONLCB~WokIOyZrgY5oA9QfgYInAlRcIY3ThyXKIaNdKRNwWzG7jOvY0D-eh822YgwElq5GJQDiJK17hZir5UNJVTKNGFlFCIMJEnwsSKrMLhukpw~jK5Wx80pdxUAMCkOMAJTMRPJQ__&Key-Pair-Id=K15TXWZAX5M6EY"
                    rel="noreferrer"
                  >
                    Download your label
                  </a> */}
                  <PDFModificationExample
                    open={open}
                    close={close}
                    opened={opened}
                    orderId={offerId}
                    date={PdfTime}
                  />
                </div>
              </div>
              <div className="flex flex-col lg:mb-0 mb-12 items-center justify-start text-center">
                <div className="flex items-center justift-center h-[160px] lg:h-[190px]">
                  <img
                    className="w-44"
                    alt=""
                    aria-hidden="true"
                    src="/Images/image 3.png"
                  />
                </div>
                <div className="font-extrabold mb-4 py-6 text-lg">
                  <span className="text-blue-500">3.</span>Take to a drop off
                  point
                </div>
                <div className="text-[#87888F] leading-7 font-medium max-w-[366px] mx-auto">
                  Simply purchase your postage and drop off your package(s) at the post office or Evri
                  point and they’ll deliver your LEGO® to us.
                </div>
                <div className="mt-auto">
                  <Link
                    className="text-blue-500 font-bold mt-6"
                    target="_blank"
                    title="EVRi Drop Off point"
                    to="https://www.evri.com/"
                  >
                    Evri Postal Service
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default SuccessPage
