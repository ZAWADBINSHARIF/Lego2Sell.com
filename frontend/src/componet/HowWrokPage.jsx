import React from "react"
import { Link } from "react-router-dom"
import { Helmet } from 'react-helmet'

const HowWrokPage = () => {

  const handleClick = () => {
    if (typeof window !== "undefined"){

      window.scrollTo(0, 0);
    }
  };

  return (
    <div>
      <Helmet>
        <title>Sell New LEGO Sets Easily | LEGO2SELL </title>
        <meta
          name="description"
          content="Learn how to easily sell your unwanted new LEGO sets to LEGO2SELL.com. Follow these 4 simple steps to get paid quickly for your LEGO sets. No hassles at all!"
        />
        <meta
          name="keywords"
          content="Sell LEGO sets, LEGO2SELL process, new LEGO sets, instant offer lego set, LEGO code, sell LEGO online"
        />
      </Helmet>
      <div className="">
        <section className="lg:pt-24 lg:px-0 px-6  py-10">
          <div className="mb-12 md:text-center">
            <h1 className="lg:text-2xl text-3xl text-center font-bold">
              How it works
            </h1>
          </div>
          <div className="max-w-5xl text-sm lg:text-lg mx-auto text-left md:text-center">
            <p>
              Selling your unwanted new LEGO® set to lego2sell.com is easy!
              There's no need to worry about messing around trying to sell on
              platforms and waiting weeks to get paid or dealing with customers
              and their returns you just sell to us. We accept nearly all new
              sets, Just type in the code see your set appear and get an instant
              offer.
            </p>
          </div>
        </section>
        <section className="py-8 lg:px-0 px-6 lg:pt-10 lg:pb-12 relative overflow-hidden">
          <div className="absolute top-[50%] left-0 right-0 bg-[#F8F8FE] bottom-0 z-0" />
          <div className="">
            {/* <div className="aspect-video mx-auto max-w-5xl rounded-lg flex items-center justify-center text-5xl my-12 z-10 relative">
              <video
                loop=""
                playsInline=""
                preload="auto"
                controls=""
                poster="/img/video_poster.jpg"
                className="rounded-lg overflow-hidden"
              >
                <source src="https://player.vimeo.com/progressive_redirect/playback/839685270/rendition/1080p/file.mp4?loc=external&log_user=0&signature=8ece92c98b8a30e61862fe0cec6196a9f05b43dd04bd0e2818168f2038de1ac9" />
              </video>
              <div className="hidden md:block absolute left-[-280px] bottom-0">
                <span
                  style={{
                    boxSizing: "border-box",
                    display: "inline-block",
                    overflow: "hidden",
                    width: "initial",
                    height: "initial",
                    background: "none",
                    opacity: 1,
                    border: 0,
                    margin: 0,
                    padding: 0,
                    position: "relative",
                    maxWidth: "100%",
                  }}
                >
                  <span
                    style={{
                      boxSizing: "border-box",
                      display: "block",
                      width: "initial",
                      height: "initial",
                      background: "none",
                      opacity: 1,
                      border: 0,
                      margin: 0,
                      padding: 0,
                      maxWidth: "100%",
                    }}
                  >
                    <img
                      alt=""
                      aria-hidden="true"
                      src="data:image/svg+xml,%3csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20version=%271.1%27%20width=%27251%27%20height=%27242%27/%3e"
                      style={{
                        display: "block",
                        maxWidth: "100%",
                        width: "initial",
                        height: "initial",
                        background: "none",
                        opacity: 1,
                        border: 0,
                        margin: 0,
                        padding: 0,
                      }}
                    />
                  </span>
                  <img
                    alt="bricks left"
                    src="/_next/static/media/how_bricks_1.5cdffa0a.svg"
                    decoding="async"
                    data-nimg="intrinsic"
                    style={{
                      position: "absolute",
                      inset: 0,
                      boxSizing: "border-box",
                      padding: 0,
                      border: "none",
                      margin: "auto",
                      display: "block",
                      width: 0,
                      height: 0,
                      minWidth: "100%",
                      maxWidth: "100%",
                      minHeight: "100%",
                      maxHeight: "100%",
                    }}
                    srcSet="/_next/static/media/how_bricks_1.5cdffa0a.svg 1x, /_next/static/media/how_bricks_1.5cdffa0a.svg 2x"
                  />
                </span>
              </div>
              <div className="hidden md:block absolute right-[-360px] top-0">
                <span
                  style={{
                    boxSizing: "border-box",
                    display: "inline-block",
                    overflow: "hidden",
                    width: "initial",
                    height: "initial",
                    background: "none",
                    opacity: 1,
                    border: 0,
                    margin: 0,
                    padding: 0,
                    position: "relative",
                    maxWidth: "100%",
                  }}
                >
                  <span
                    style={{
                      boxSizing: "border-box",
                      display: "block",
                      width: "initial",
                      height: "initial",
                      background: "none",
                      opacity: 1,
                      border: 0,
                      margin: 0,
                      padding: 0,
                      maxWidth: "100%",
                    }}
                  >
                    <img
                      alt=""
                      aria-hidden="true"
                      src="data:image/svg+xml,%3csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20version=%271.1%27%20width=%27405%27%20height=%27404%27/%3e"
                      style={{
                        display: "block",
                        maxWidth: "100%",
                        width: "initial",
                        height: "initial",
                        background: "none",
                        opacity: 1,
                        border: 0,
                        margin: 0,
                        padding: 0,
                      }}
                    />
                  </span>
                  <img
                    alt="bricks right"
                    src="/_next/static/media/how_bricks_2.fb368a90.svg"
                    decoding="async"
                    data-nimg="intrinsic"
                    style={{
                      position: "absolute",
                      inset: 0,
                      boxSizing: "border-box",
                      padding: 0,
                      border: "none",
                      margin: "auto",
                      display: "block",
                      width: 0,
                      height: 0,
                      minWidth: "100%",
                      maxWidth: "100%",
                      minHeight: "100%",
                      maxHeight: "100%",
                    }}
                    srcSet="/_next/static/media/how_bricks_2.fb368a90.svg 1x, /_next/static/media/how_bricks_2.fb368a90.svg 2x"
                  />
                </span>
              </div>
            </div> */}
          </div>
        </section>
        <section className="py-10 lg:px-0 px-6 flex items-center justify-center lg:pb-20 lg:pt-20 bg-[#F8F8FE] overflow-hidden">
          <div className=" text-center max-w-7xl">
            <h2 className="h1 font-bold text-3xl mb-16" style={{
              marginBottom: "4rem",
              fontWeight: 700,
              fontSize: '1.875rem'
            }}>
              Sell Your New LEGO® Sets In 4 Easy Steps….
            </h2>
            <div className="relative mb-16 mt-">
              <div className="absolute left-[20px] lg:left-[50%] top-0 bottom-0 w-[4px] bg-[#EAEAFC] ml-[-2px]" />
              <div
                className="react-reveal  relative flex flex-col pl-[50px] lg:pl-0 lg:grid gap-10 lg:gap-32 grid-rows-2 lg:grid-cols-2 lg:grid-rows-none items-center pb-12"
                style={{
                  animationFillMode: "both",
                  animationDuration: "1000ms",
                  animationDelay: "0ms",
                  animationIterationCount: 1,
                  opacity: 1,
                  backgroundColor: "#F8F8FE",
                  animationName: "react-reveal-401627926166202-1",
                }}
              >
                <div className="absolute left-[20px] lg:left-[50%] top-5 lg:top-[125px]  bottom-0 w-[4px] bg-[#4bc160] ml-[-2px]" />
                <div className="absolute left-[20px] lg:left-[50%] top-5 lg:top-[125px]  ml-[-25px] mt-[-30px] w-[50px] h-[50px]">
                  <img
                    data-aos="fade-up"
                    alt="Step marker"
                    src="/Images/timeline_marker.e6d0b1ec.svg"
                    decoding="async"
                    data-nimg="intrinsic"
                    style={{
                      position: "absolute",
                      inset: 0,
                      boxSizing: "border-box",
                      padding: 0,
                      border: "none",
                      margin: "auto",
                      display: "block",
                      width: 0,
                      height: 0,
                      minWidth: "100%",
                      maxWidth: "100%",
                      minHeight: "100%",
                      maxHeight: "100%",
                    }}
                  />
                </div>
                <div className="order-1 lg:order-1 text-left">
                  <div className="text-lg  lg:text-2xl font-bold lg:mb-8 mb-2">
                    <span className="text-[#4ccd5b]">1. </span>Search Your LEGO®
                    code
                  </div>
                  <p className=" text-sm lg:text-lg">
                    Simply pop your LEGO® code in and hit search where your set and set
                    number will pop up with the options to choose your condition.
                  </p>
                </div>
                <div className="order-1 lg:order-2">
                  <span
                    style={{
                      boxSizing: "border-box",
                      display: "inline-block",
                      overflow: "hidden",
                      width: "initial",
                      height: "initial",
                      background: "none",
                      opacity: 1,
                      border: 0,
                      margin: 0,
                      padding: 0,
                      position: "relative",
                      maxWidth: "100%",
                    }}
                  >
                    <span
                      style={{
                        boxSizing: "border-box",
                        display: "block",
                        width: "initial",
                        height: "initial",
                        background: "none",
                        opacity: 1,
                        border: 0,
                        margin: 0,
                        padding: 0,
                        maxWidth: "100%",
                      }}
                    >
                      <img
                        data-aos="fade-up"
                        className="rounded-3xl"
                        alt="Search Your LEGO code | sell your new LEGO"
                        aria-hidden="true"
                        src="/Images/SearchLego.png"
                        style={{
                          display: "block",
                          maxWidth: "100%",
                          width: "initial",
                          height: "initial",
                          background: "none",
                          opacity: 1,
                          border: 0,
                          margin: 0,
                          padding: 0,
                        }}
                      />
                    </span>
                  </span>
                </div>
              </div>
              <div className="react-reveal relative flex flex-col pl-[50px] lg:pl-0 lg:grid gap-10 lg:gap-32 grid-rows-2 lg:grid-cols-2 lg:grid-rows-none items-center pb-12">
                <div className="absolute left-[20px] lg:left-[50%] top-0 bottom-0 w-[4px] bg-[#4bc160] ml-[-2px]" />
                <div className="absolute left-[20px] lg:left-[50%] top-5 lg:top-[125px] ml-[-25px] mt-[-30px] w-[50px] h-[50px]">
                  <span
                    style={{
                      boxSizing: "border-box",
                      display: "inline-block",
                      overflow: "hidden",
                      width: "initial",
                      height: "initial",
                      background: "none",
                      opacity: 1,
                      border: 0,
                      margin: 0,
                      padding: 0,
                      position: "relative",
                      maxWidth: "100%",
                    }}
                  >
                    <span
                      style={{
                        boxSizing: "border-box",
                        display: "block",
                        width: "initial",
                        height: "initial",
                        background: "none",
                        opacity: 1,
                        border: 0,
                        margin: 0,
                        padding: 0,
                        maxWidth: "100%",
                      }}
                    >
                      <img
                        data-aos="fade-up"
                        alt=""
                        aria-hidden="true"
                        src="/Images/timeline_marker.e6d0b1ec.svg"
                        style={{
                          display: "block",
                          maxWidth: "100%",
                          width: "initial",
                          height: "initial",
                          background: "none",
                          opacity: 1,
                          border: 0,
                          margin: 0,
                          padding: 0,
                        }}
                      />
                    </span>
                  </span>
                </div>
                <div className="sm:order-1 lg:order-2 text-left">
                  <div className="text-lg  lg:text-2xl font-bold lg:mb-8 mb-2">
                    <span className="text-[#4ccd5b]">2. </span>Get an instant
                    offer
                  </div>
                  <p className=" text-sm lg:text-lg">
                    Confirm your set and accept the quote, Log in to your account or fill out the details create an account
                    and get your shipping information.
                  </p>
                </div>
                <div className=" sm:order-2 lg:order-1">
                  <span
                    style={{
                      boxSizing: "border-box",
                      display: "inline-block",
                      overflow: "hidden",
                      width: "initial",
                      height: "initial",
                      background: "none",
                      opacity: 1,
                      border: 0,
                      margin: 0,
                      padding: 0,
                      position: "relative",
                      maxWidth: "100%",
                    }}
                  >
                    <span
                      style={{
                        boxSizing: "border-box",
                        display: "block",
                        width: "initial",
                        height: "initial",
                        background: "none",
                        opacity: 1,
                        border: 0,
                        margin: 0,
                        padding: 0,
                        maxWidth: "100%",
                      }}
                    >
                      <img
                        data-aos="fade-up"
                        className="rounded-3xl"
                        alt="Get an instant offer | Sell your new LEGO sets online"
                        aria-hidden="true"
                        src="/Images/instantofferimage.jpeg"
                        style={{
                          display: "block",
                          maxWidth: "100%",
                          width: "initial",
                          height: "initial",
                          background: "none",
                          opacity: 1,
                          border: 0,
                          margin: 0,
                          padding: 0,
                        }}
                      />
                    </span>
                  </span>
                </div>
              </div>
              <div className="react-reveal relative lg:flex flex-col pl-[50px] lg:pl-0 lg:grid gap-10 lg:gap-32 grid-rows-2 lg:grid-cols-2 lg:grid-rows-none items-center pb-12">
                <div className="absolute left-[20px] lg:left-[50%] top-0 bottom-0 w-[4px] bg-[#4bc160] ml-[-2px]" />
                <div className="absolute left-[20px] lg:left-[50%] top-5 lg:top-[120px] ml-[-25px] mt-[-30px] w-[50px] h-[50px]">
                  <span
                    style={{
                      boxSizing: "border-box",
                      display: "inline-block",
                      overflow: "hidden",
                      width: "initial",
                      height: "initial",
                      background: "none",
                      opacity: 1,
                      border: 0,
                      margin: 0,
                      padding: 0,
                      position: "relative",
                      maxWidth: "100%",
                    }}
                  >
                    <span
                      style={{
                        boxSizing: "border-box",
                        display: "block",
                        width: "initial",
                        height: "initial",
                        background: "none",
                        opacity: 1,
                        border: 0,
                        margin: 0,
                        padding: 0,
                        maxWidth: "100%",
                      }}
                    >
                      <img
                        data-aos="fade-up"
                        alt=""
                        aria-hidden="true"
                        src="/Images/timeline_marker.e6d0b1ec.svg"
                        style={{
                          display: "block",
                          maxWidth: "100%",
                          width: "initial",
                          height: "initial",
                          background: "none",
                          opacity: 1,
                          border: 0,
                          margin: 0,
                          padding: 0,
                        }}
                      />
                    </span>
                  </span>
                </div>
                <div data-aos="fade-up" className="order-1 lg:order-1 text-left">
                  <div className="text-lg  lg:text-2xl font-bold lg:mb-8 mb-2">
                    <span className="text-[#4ccd5b]">3. </span> Send it to us
                  </div>
                  <p className=" text-sm lg:text-lg">
                    Package up your LEGO® set purchase your postage and pop it in the post.
                  </p>
                </div>
                <div className="order-1 lg:order-2">
                  <span
                    style={{
                      boxSizing: "border-box",
                      display: "inline-block",
                      overflow: "hidden",
                      width: "initial",
                      height: "initial",
                      background: "none",
                      opacity: 1,
                      border: 0,
                      margin: 0,
                      padding: 0,
                      position: "relative",
                      maxWidth: "100%",
                    }}
                  >
                    <span
                      style={{
                        boxSizing: "border-box",
                        display: "block",
                        width: "initial",
                        height: "initial",
                        background: "none",
                        opacity: 1,
                        border: 0,
                        margin: 0,
                        padding: 0,
                        maxWidth: "100%",
                      }}
                    >
                      <img
                        data-aos="fade-up"
                        className="rounded-3xl"
                        alt="Send it to us | sell your new LEGO Online"
                        aria-hidden="true"
                        src="/Images/postittousimage.jpeg"
                        style={{
                          display: "block",
                          maxWidth: "100%",
                          width: "initial",
                          height: "initial",
                          background: "none",
                          opacity: 1,
                          border: 0,
                          margin: 0,
                          padding: 0,
                        }}
                      />
                    </span>
                  </span>
                </div>
              </div>
              <div className="react-reveal relative flex flex-col pl-[50px] lg:pl-0 lg:grid gap-10 lg:gap-32 grid-rows-2 lg:grid-cols-2 lg:grid-rows-none items-center pb-12">
                <div className="absolute left-[20px] lg:left-[50%] top-0 bottom-0 w-[4px] bg-[#4bc160] ml-[-2px]" />
                <div className="absolute left-[20px] lg:left-[50%] top-5 lg:top-[130px] ml-[-25px] mt-[-30px] w-[50px] h-[50px]">
                  <span
                    style={{
                      boxSizing: "border-box",
                      display: "inline-block",
                      overflow: "hidden",
                      width: "initial",
                      height: "initial",
                      background: "none",
                      opacity: 1,
                      border: 0,
                      margin: 0,
                      padding: 0,
                      position: "relative",
                      maxWidth: "100%",
                    }}
                  >
                    <span
                      style={{
                        boxSizing: "border-box",
                        display: "block",
                        width: "initial",
                        height: "initial",
                        background: "none",
                        opacity: 1,
                        border: 0,
                        margin: 0,
                        padding: 0,
                        maxWidth: "100%",
                      }}
                    >
                      <img
                        alt=""
                        aria-hidden="true"
                        src="/Images/timeline_marker.e6d0b1ec.svg"
                        style={{
                          display: "block",
                          maxWidth: "100%",
                          width: "initial",
                          height: "initial",
                          background: "none",
                          opacity: 1,
                          border: 0,
                          margin: 0,
                          padding: 0,
                        }}
                      />
                    </span>
                  </span>
                </div>
                <div data-aos="fade-up" className="sm:order-1 lg:order-2 text-left">
                  <div className="text-lg lg:text-2xl font-bold lg:mb-8 mb-2">
                    <span className="text-[#4ccd5b]">4. </span> Get paid
                  </div>
                  <p className=" text-sm lg:text-lg">
                    Once your LEGO® set has been checked and accepted,
                    See the money land in your chosen payment method (bank transfer or PayPal)
                    as quickly as the very next day!
                  </p>
                </div>
                <div className="sm:order-2 lg:order-1">
                  <span
                    style={{
                      boxSizing: "border-box",
                      display: "inline-block",
                      overflow: "hidden",
                      width: "initial",
                      height: "initial",
                      background: "none",
                      opacity: 1,
                      border: 0,
                      margin: 0,
                      padding: 0,
                      position: "relative",
                      maxWidth: "100%",
                    }}
                  >
                    <span
                      style={{
                        boxSizing: "border-box",
                        display: "block",
                        width: "initial",
                        height: "initial",
                        background: "none",
                        opacity: 1,
                        border: 0,
                        margin: 0,
                        padding: 0,
                        maxWidth: "100%",
                      }}
                    >
                      <img
                        data-aos="fade-up"
                        className="rounded-3xl"
                        alt="Get paid | Sell Lego Online"
                        aria-hidden="true"
                        src="/Images/GetpaidImage.png"
                        style={{
                          display: "block",
                          maxWidth: "100%",
                          width: "initial",
                          height: "initial",
                          background: "none",
                          opacity: 1,
                          border: 0,
                          margin: 0,
                          padding: 0,
                        }}
                      />
                    </span>
                  </span>
                </div>
              </div>
            </div>
            <div data-aos="fade-up" className="mb-12 md:text-center">
              <h1 className="text-2xl font-bold">
                So don’t delay and sell today!
              </h1>
            </div>
            <Link
              data-aos="fade-up"
              title="Start selling LEGO®"
              className="flex w-full lg:inline-flex lg:w-auto justify-center items-center px-6 lg:px-12 rounded-xl bg-blue-500 text-white font-bold text-[15px] h-[49px] lg:h-[65px] xl:text-[18px]"
              to="/"
              onClick={handleClick}
            >
              Get Selling That LEGO®
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}

export default HowWrokPage
