import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./App.css";
import { Button, Loader, Modal, Tooltip } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Helmet } from "react-helmet";
import { useMediaQuery } from "react-responsive";
import ReactGA from "react-ga4";
import baseUrl from "./context/baseUrl";
import axios from "axios";
import Footer from "./componet/Footer";
const App = () => {
  const [e, setE] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);
  const navigation = useNavigate();

  const [opened1, setOpened] = useState(false);

  const [topFourBlogs, setTopFourBlogs] = useState([]);
  const storedUserId = localStorage.getItem("userId");

  const [width, setWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 0
  );

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    ReactGA.send(window.location.pathname);
    const SendAnalytics = () => {
      ReactGA.send({
        hitType: "pageview",
        page: window.location.pathname,
      });
    };
  }, []);
  const handleSearch = async () => {
    try {
      setIsLoading(true);

      const response = await fetch(`${baseUrl}/find-lego`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ itemCode: e }),
      });

      const data = await response.json();

      localStorage.setItem("SearchValue", e);
      if (data.message === "SUCCESS") {
        navigation(`/product/`, {
          state: { data, e },
        });
      } else {
        open(true);
        setE("");
        // alert("Could not find the LEGO you are looking for.")
      }
    } catch {
      open(true);
      // alert("Could not find the LEGO you are looking for.")
    } finally {
      setIsLoading(false); // Set loading state back to false
    }
  };
  const handleInputChange = (event) => {
    const inputValue = event.target.value;
    const numericValue = inputValue.replace(/\D/g, ""); // Remove non-digit characters

    setE(numericValue);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };
  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-width: 1224px)",
  });

  useEffect(() => {
    const apiUrl = baseUrl + "/admin/api/blog/";
    axios
      .get(apiUrl, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Accept: "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization, Accept",
          "Access-Control-Allow-Credentials": "true",
          "Access-Control-Max-Age": "86400",
          "Access-Control-Expose-Headers":
            "Content-Type, Authorization, Accept",
        },
      })
      .then((response) => {
        setTopFourBlogs(response.data.data.slice(0, 4));
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return (
    <div>
      <Helmet>
        <title>
          Sell Your LEGO® Sets and Make Extra Cash Today! Lego2Sell.com
        </title>
        <meta
          name="description"
          content="Looking to sell your LEGO® sets and make extra cash today? Look no further than Lego2Sell.com! Turn your unused LEGO® sets into money in no time."
        />
        <meta name="keywords" content="LEGO®,LEGO® Set,custom lego sets for sale,best place to sell legos,lego packaging,lego plastic bag sets,lego packaging boxes,lego sustainable packagingLEGO® Sell, sell lego sets,custom lego sets for sale,how to sell legos,sell lego" />

      </Helmet>
      {/* <div className="h-[87.6vh] lg:h-[85.6vh]"> */}
      <div className="">
        <div className="">
          <div className="">
            <div className="">
              <div className="flex items-center justify-center flex-col">
                <div className="mt-12">
                  <img
                    className="w-full object-contain h-[230px] lg:h-[290px] py-4"
                    src="/Images/Logo-min.png"
                    alt="search-img"
                    fetchpriority="high"
                  />
                </div>
                <Modal
                  size="lg"
                  opened={opened}
                  onClose={close}
                  title="Error"
                  centered
                >
                  <div className="flex items-center justify-center">
                    <img
                      className="w-3/4"
                      src="/Images/SearchErrorMessage.jpg"
                      alt=""
                      loading="lazy"
                    />
                  </div>
                  <div className="font-semibold mt-6 text-xl md:text-base order-1 md:order-2">
                    Could not find the LEGO® you are looking for.
                  </div>
                  <p className="text-gray-400 text-base font-normal py-4">
                    We apologize for the inconvenience, but the LEGO® set you
                    are searching for is currently unavailable on our website.
                    Please try searching for a different LEGO® set or check back
                    later as our inventory is regularly updated. If you have any
                    further questions or need assistance, please feel free to
                    contact our customer support team. Thank you for your
                    understanding.
                  </p>
                  {/* Modal content */}
                </Modal>

                <div className="w-full px-6 flex items-center justify-center">
                  <input
                    placeholder="Enter LEGO® Set Code here"
                    // disabled={e?.length === 5}
                    value={e}
                    onKeyPress={handleKeyPress}
                    onChange={handleInputChange}
                    type="text"
                    id="search"
                    className="border px-6 py-4 w-full md:w-[50%] text-xl font-medium  rounded-2xl"
                    required
                  />
                </div>
                <button className="mb-2" type="submit" onClick={handleSearch}>
                  <img
                    className="_search-btn_hj7zo_15"
                    src="/Images/search-img-6ce3ac56.png"
                    alt="search-btn"
                    loading="lazy"
                  />
                </button>

                <Tooltip
                  color="blue"
                  multiline
                  opened={!isDesktopOrLaptop ? opened1 : null}
                  width={isDesktopOrLaptop ? 480 : 280}
                  withArrow
                  transitionProps={{ duration: 200 }}
                  label="To search your LEGO® set just type in the LEGO® ID code found on all LEGO® sets and hit enter or the search button. (Example: 77941)"
                >
                  <button
                    variant="outline"
                    onClick={() => setOpened((o) => !o)}
                    className={`${opened1 ? "mt-16 lg:mt-0 " : ""
                      }text-base  font-medium text-gray-400`}
                  >
                    Search help
                  </button>
                </Tooltip>
                <br />
              </div>
              <div className="flex mt-5 w-full justify-center flex-col items-center" >
                <div
                  style={{
                    maxWidth: 1338,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                    paddingLeft: 24,
                    paddingRight: 24,
                    letterSpacing: width > 1024 ? 1 : -.5,
                  }}
                >
                  <p
                    style={{
                      fontWeight: "bold",
                      fontSize: 34,
                    }}
                  >
                    The best place to sell new{" "}
                    <span
                      style={{
                        color: "#428ABD",
                      }}
                    >
                      LEGO<span

                        style={{
                          fontSize: "1.2rem",
                          position: 'absolute',
                          // marginLeft: -1,
                          marginTop: 5

                        }}

                      >
                        ®
                      </span>&nbsp;&nbsp;&nbsp;
                    </span>
                    <span className=" ms-[-10px]">sets online.</span>
                  </p>
                  <p
                    style={{
                      fontWeight: "bold",
                      fontSize: 34,
                      marginBottom: 15,
                    }}
                  >
                    Turn your sets to cash in 4 easy steps…
                  </p>
                  <div className="rounded-lg mb-[95px]"
                    style={{
                      background: `url(/Images/videoBorder.jpg)`,
                      padding: width > 1024 ? 10 : 7,
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "100% 100%",
                      backgroundPosition: "center",
                      width: 1024 > width ? "100%" : "50%",
                    }}
                  >
                    <video
                      className=""
                      src="https://res.cloudinary.com/datptkvvx/video/upload/v1706654020/Lego_to_Sell_Home_Page_Video_1_qvpm2a.mp4"
                      controls
                    ></video>
                  </div>
                </div>
              </div>

              <div
                className="flex w-full justify-center flex-col items-center"
                style={{
                  marginTop: width > 1024 ? 20 : 0,
                }}


              >
                <div style={{
                  maxWidth: 1338,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'column',
                }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexDirection: "row",
                      marginLeft: width > 1024 ? 84 : 24,
                      marginRight: width > 1024 ? 84 : 24,
                      gap: 20,
                      flexWrap: width > 1300 ? "nowrap" : "wrap",
                    }}
                  >
                    <div
                      className="flex flex-col items-center justify-start"
                      style={{
                        width:
                          width > 1300 ? "25%" : width > 768 ? "45%" : "100%",
                        height: 280
                      }}
                    >
                      <img
                        className=""
                        style={{
                          width: 150,
                        }}
                        src="/Images/LEGO search alt.png"
                        alt=""
                        loading="lazy"
                      />
                      <h2>
                        <span
                          style={{
                            color: "red",
                          }}
                        >
                          1.
                        </span>{" "}
                        Search your LEGO<span

                          style={{
                            fontSize: ".8rem",
                            position: 'absolute',
                            // marginLeft: -1

                          }}

                        >
                          ®
                        </span>&nbsp;&nbsp; Code
                      </h2>
                      <p
                        className="text-center"
                        style={{
                          maxWidth: 240,
                        }}
                      >
                        Simple enter your new LEGO<span

                          style={{
                            fontSize: ".8rem",
                            position: 'absolute',
                            // marginLeft: -1

                          }}

                        >
                          ®
                        </span>&nbsp;&nbsp; set code into the search box above, Check the item image and enter the box condition.
                      </p>
                    </div>
                    {width > 1300 && (
                      <div>
                        <img
                          src="/Images/Blue Aroow Alt flipped.png"
                          style={{
                            width: 100,
                            marginTop: -80,
                            marginLeft: -50,
                            position: "absolute",
                          }}
                          alt=""
                          loading="lazy"
                        />
                      </div>
                    )}
                    <div
                      className="flex flex-col items-center justify-start"
                      style={{
                        width:
                          width > 1300 ? "25%" : width > 768 ? "45%" : "100%",
                        height: 280

                      }}
                    >
                      <img
                        style={{
                          width: 150,
                        }} src="/Images/iphone Payments alt.webp"
                        alt=""
                        loading="lazy"
                      />
                      <h2>
                        <span
                          style={{
                            color: "red",
                          }}
                        >
                          2.
                        </span>{" "}
                        Get an instant offer
                      </h2>
                      <p
                        className="text-center"
                        style={{
                          maxWidth: 230,
                        }}
                      >
                        We’ll offer you a great price for your new LEGO<span

                          style={{
                            fontSize: ".7rem",
                            position: 'absolute',
                            // marginLeft: -1

                          }}

                        >
                          ®
                        </span>&nbsp;&nbsp; sets!
                        Simply accept and checkout to continue.
                      </p>
                    </div>
                    {width > 1300 && (
                      <div>
                        <img
                          src="/Images/Blue Aroow Alt.png"
                          style={{
                            width: 100,
                            marginTop: -30,
                            marginLeft: -50,
                            position: "absolute",
                          }}
                          alt=""
                          loading="lazy"
                        />
                      </div>
                    )}
                    <div
                      className="flex flex-col items-center justify-start"
                      style={{
                        width:
                          width > 1300 ? "25%" : width > 768 ? "45%" : "100%",
                        height: 280

                      }}
                    >
                      <img
                        style={{
                          width: 150,
                        }} src="/Images/Lego Parcel alt.webp"
                        alt=""
                        loading="lazy"
                      />
                      <h2>
                        <span
                          style={{
                            color: "red",
                          }}
                        >
                          3.
                        </span>{" "}
                        Post it to us
                      </h2>
                      <p
                        className="text-center"
                        style={{
                          maxWidth: 240,
                        }}
                      >
                        Package up your LEGO<span

                          style={{
                            fontSize: ".6rem",
                            position: 'absolute',
                            // marginLeft: -1

                          }}

                        >
                          ®
                        </span>&nbsp;&nbsp; and take it to your local postage
                        drop off point and we will pay you up to £2.49 for all
                        accepted sets.
                      </p>
                    </div>
                    {width > 1300 && (
                      <div>
                        <img
                          src="/Images/Blue Aroow Alt flipped.png"
                          style={{
                            width: 100,
                            marginTop: -80,
                            marginLeft: -50,
                            position: "absolute",
                          }}
                          alt=""
                          loading="lazy"
                        />
                      </div>
                    )}
                    <div
                      className="flex flex-col items-center justify-center"
                      style={{
                        width:
                          width > 1300 ? "25%" : width > 768 ? "45%" : "100%",
                        height: 280

                      }}
                    >
                      <img
                        style={{
                          width: 150,
                        }} src="/Images/LEGO VIP Wallet alt.webp"
                        alt=""
                        loading="lazy"
                      />
                      <h2>
                        <span
                          style={{
                            color: "red",
                          }}
                        >
                          4.
                        </span>{" "}
                        Get paid
                      </h2>
                      <p
                        className="text-center"
                        style={{
                          maxWidth: 240,
                        }}
                      >
                        Choose either bank transfer or PayPal and we’ll send your
                        money the same day we receive and check your bricks!
                      </p>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      marginTop: "10rem",
                      // flexDirection: 'column'
                      marginLeft: width > 1024 ? 50 : 24,
                      marginRight: width > 1024 ? 50 : 24,
                      gap: 50,
                      marginBottom: width > 1024 ? "3rem" : "2rem",
                    }}
                  >
                    <h1
                      style={{
                        fontWeight: "bold",
                        fontSize: width > 1024 ? "2.5rem" : 34,
                        textAlign: "center",
                      }}
                    >
                      Why Sell Your LEGO<span style={{
                        fontSize: "1rem",
                        position: 'absolute',
                        marginLeft: -3,
                      }}>®</span>&nbsp; With{" "}
                      <span
                        style={{
                          color: "#ff3131",
                        }}
                      >
                        Lego
                      </span>
                      <span
                        style={{
                          color: "#1cbc7c",
                        }}
                      >
                        2
                      </span>
                      <span
                        style={{
                          color: "#4a71f6",
                        }}
                      >
                        Sell
                      </span>
                      <span
                        style={{
                          color: "#febf00",
                        }}
                      >
                        ?
                      </span>
                    </h1>
                    {width > 1024 && (
                      <div>
                        <img
                          src="/Images/downArrow.png"
                          alt=""
                          style={{
                            width: 60,
                            marginLeft: -90,
                            position: "absolute",
                          }}
                        />
                      </div>
                    )}
                  </div>

                  <div
                    style={{
                      display: "flex",
                      marginLeft: width > 1024 ? 50 : 24,
                      marginRight: width > 1024 ? 50 : 24,
                      flexWrap: width > 1024 ? "nowrap" : "wrap",
                      justifyContent: "center",
                      alignItems: "flex-end",
                      marginBottom: width > 1024 ? "10rem" : "2rem",
                    }}
                  >
                    <div
                      className="leftSection "
                      style={{
                        width: width > 1024 ? "50%" : "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "flex-end",
                        height: "100%",
                        marginRight: width > 1024 ? 20 : 0,
                      }}
                    >
                      <h2
                        style={{
                          fontSize: 34,
                          marginBottom: 30,
                          textAlign: width > 1024 ? "left" : "center",
                        }}
                      >
                        We are the UK’s first and only dedicated buyer of new
                        LEGO<span

                          style={{
                            fontSize: "1.1rem",
                            position: 'absolute',
                            // marginLeft: -1,
                            marginTop: 5

                          }}

                        >
                          ®
                        </span>&nbsp; sets!
                      </h2>
                      <p style={{
                        marginBottom: 30,
                      }}>
                        We have a unique data engine that searches multiple price
                        databases of New LEGO<span

                          style={{
                            fontSize: ".6rem",
                            position: 'absolute',
                            // marginLeft: -1

                          }}

                        >
                          ®
                        </span>&nbsp; being sold over the last 6 months
                        to give you the best second hand buy price on the market
                        for your sets.
                        <br />
                        <br />
                        With our cloud database that is updated daily we can give
                        you instant current market value quotes for your new LEGO <span

                          style={{
                            fontSize: ".6rem",
                            position: 'absolute',
                            // marginLeft: -1

                          }}

                        >
                          ®
                        </span>&nbsp; sets
                        <br />
                        <br />
                        And if our AI engine can not give you a price just email
                        Info@lego2sell.com for a bespoke quote.
                      </p>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          width: width > 1024 ? "auto" : "100%",
                        }}
                      >
                        <div
                          className="button"
                          style={{
                            marginLeft: width > 1024 ? -20 : 0,
                            marginTop: 20,
                            width: width > 1024 ? "auto" : "100%",
                            marginBottom: width > 1024 ? 0 : 60,
                          }}
                        >
                          <Button
                            // className="w-full"
                            onClick={() => {
                              // move to top of the page
                              window.scrollTo(0, 0);
                            }}
                            variant="filled"
                            color="red"
                            size="lg"
                            radius="xl"
                            style={{
                              background: "red ",
                              width: "100%",
                            }}
                          >
                            Sell LEGO<span

                              style={{
                                fontSize: ".6rem",
                                marginRight: 1,
                                marginTop: -5
                                // position: 'absolute',
                                // marginLeft: -1

                              }}

                            >
                              ®
                            </span>
                          </Button>
                        </div>

                        {width > 1024 && (
                          <img
                            src="/Images/Duplo Bricks alt.png"
                            alt=""
                            style={{
                              width: 100,
                            }}
                          />
                        )}
                      </div>
                    </div>

                    <div
                      className="rightSection flex gap-5"
                      style={{
                        width: width > 1024 ? "50%" : "100%",
                        flexWrap: width > 768 ? "nowrap" : "wrap",
                        justifyContent: width > 1024 ? "flex-end" : "flex-start",
                      }}
                    >
                      <div
                        className="card1-column "
                        style={{
                          width:
                            width > 1024 ? "auto" : width > 768 ? "50%" : "100%",
                        }}
                      >
                        <div
                          className="card1"
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: width > 1024 ? "flex-start" : "flex-start",
                            alignItems: width > 1024 ? "flex-start" : "flex-start",
                            paddingLeft: width > 1024 ? 5 : 24,
                            paddingRight: width > 1024 ? 5 : 24,
                            background: "#EAFED1",
                            paddingBottom: width > 1024 ? 20 : 24,
                            height: 250,
                            width: width > 1024 ? 200 : "auto",
                            paddingTop: width > 1024 ? 20 : 24,

                          }}
                        >
                          <div
                            className="card1-image"
                            style={{
                              display: "flex",
                              alignItems: width > 1024 ? "center" : "flex-start",
                              justifyContent: width > 1024 ? "center" : "flex-start",
                              flexDirection: width > 1024 ? "row" : "column",
                            }}
                          >
                            <img
                              src="/Images/LEGO POINTS alt.png"
                              alt=""
                              style={{
                                width: 80,
                              }}
                            />
                            <h3
                              className="card1-title"
                              style={{
                                fontSize: width > 1024 ? "0.9rem" : "1rem",
                                marginLeft: width > 1024 ? -6 : 10,

                              }}
                            >
                              High Payouts
                            </h3>
                          </div>
                          <p
                            className="card1-body"
                            style={{
                              textAlign: width > 1024 ? "center" : "left",
                              marginLeft: width > 1024 ? 0 : 10,
                              marginTop: width > 1024 ? 0 : 10,
                            }}
                          >
                            We pride ourselves on offering some of the highest
                            price for your LEGO<span

                              style={{
                                fontSize: ".6rem",
                                position: 'absolute',
                                marginLeft: -1

                              }}

                            >
                              ®
                            </span>&nbsp;&nbsp;Sets online.
                          </p>
                        </div>
                        <div
                          className="card1"
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: width > 1024 ? "flex-start" : "flex-start",
                            alignItems: width > 1024 ? "flex-start" : "flex-start",
                            paddingLeft: width > 1024 ? 5 : 24,
                            paddingRight: width > 1024 ? 5 : 24,
                            background: "#CFEBFA",
                            paddingBottom: 20,
                            marginTop: 20,
                            height: 250,
                            width: width > 1024 ? 200 : "auto",
                          }}
                        >
                          <div
                            className="card1-image"
                            style={{
                              display: "flex",
                              alignItems: width > 1024 ? "center" : "flex-start",
                              justifyContent: width > 1024 ? "center" : "flex-start",
                              gap: 10,
                              marginTop: 10,
                              flexDirection: width > 1024 ? "row" : "column",
                              paddingTop: 20,


                            }}
                          >
                            <img
                              src="/Images/LEGO REd Parcel Icon alt.png"
                              alt=""
                              style={{
                                width: 40,
                                marginLeft: width > 1024 ? 0 : 15,
                              }}
                            />
                            <h3
                              className="card1-title"
                              style={{
                                fontSize: width > 1024 ? "0.9rem" : "1rem",
                                marginLeft: width > 1024 ? 0 : 10,
                              }}
                            >
                              Postage Refund
                            </h3>
                          </div>
                          <p
                            className="card1-body"
                            style={{
                              textAlign: width > 1024 ? "center" : "left",
                              marginLeft: width > 1024 ? 0 : 10,
                              marginTop: 20,
                              width: width > 1024 ? "140px" : "auto",
                              alignSelf: width > 1024 ? "center" : "flex-start",

                            }}
                          >
                            We refund you up to £2.49 to cover the cost of postage
                          </p>
                        </div>
                      </div>
                      <div
                        className="card2-column "
                        style={{
                          marginTop: width > 1024 && 30,
                          width:
                            width > 1024 ? "auto" : width > 768 ? "50%" : "100%",
                        }}
                      >
                        <div
                          className="card1"
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: width > 1024 ? "flex-start" : "flex-start",
                            alignItems: width > 1024 ? "flex-start" : "flex-start",
                            paddingLeft: width > 1024 ? 5 : 24,
                            paddingRight: width > 1024 ? 5 : 24,
                            background: "#F7BBC0",
                            paddingBottom: 20,
                            height: 250,
                            paddingTop: 20,
                            width: width > 1024 ? 200 : "auto",
                          }}
                        >
                          <div
                            className="card1-image"
                            style={{
                              display: "flex",
                              alignItems: width > 1024 ? "center" : "flex-start",
                              justifyContent: width > 1024 ? "center" : "flex-start",
                              gap: 10,
                              flexDirection: width > 1024 ? "row" : "column",
                              marginBottom: 10,
                              marginLeft: width > 1024 ? 10 : 0,
                            }}
                          >
                            <img
                              src="/Images/Lego Clock alt.png"
                              alt=""
                              style={{
                                width: 50,
                                marginLeft: width > 1024 ? 0 : 10,
                              }}
                            />
                            <h3
                              className="card1-title"
                              style={{
                                fontSize: width > 1024 ? ".9rem" : "1rem",
                                marginLeft: width > 1024 ? 0 : 10,
                              }}
                            >
                              Next & Same
                              <br />
                              Day Payments
                            </h3>
                          </div>
                          <p
                            className="card1-body"
                            style={{
                              textAlign: width > 1024 ? "center" : "left",
                              marginLeft: width > 1024 ? 0 : 10,
                              width: width > 1024 ? "150px" : "auto",
                              alignSelf: "center",
                            }}
                          >
                            Need your money in a hurry? We’ll send your money the same day we receive and check your Sets!
                          </p>
                        </div>
                        <div
                          className="card1"
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: width > 1024 ? "flex-start" : "flex-start",
                            alignItems: width > 1024 ? "flex-start" : "flex-start",
                            paddingLeft: width > 1024 ? 5 : 24,
                            paddingRight: width > 1024 ? 5 : 24,
                            background: "#FEF8DE",
                            paddingBottom: 20,
                            marginTop: 20,
                            height: 250,
                            width: width > 1024 ? 200 : "auto",
                          }}
                        >
                          <div
                            className="card1-image"
                            style={{
                              display: "flex",
                              alignItems: width > 1024 ? "center" : "flex-start",
                              justifyContent: width > 1024 ? "center" : "flex-start",
                              gap: 10,
                              marginTop: 10,
                              flexDirection: width > 1024 ? "row" : "column",
                              paddingTop: 20,
                              marginLeft: width > 1024 ? 5 : 0,
                              marginBottom: 10,
                            }}
                          >
                            <img
                              src="/Images/happy LEGO face alt.png"
                              alt=""
                              style={{
                                width: 30,
                                marginLeft: width > 1024 ? 0 : 15,
                              }}
                            />
                            <h3
                              className="card1-title"
                              style={{
                                fontSize: width > 1024 ? "0.9rem" : "1rem",
                                marginLeft: width > 1024 ? 0 : 10,
                              }}
                            >
                              Totally Hassle-Free
                            </h3>
                          </div>
                          <p
                            className="card1-body"
                            style={{
                              textAlign: width > 1024 ? "center" : "left",
                              marginLeft: width > 1024 ? 0 : 10,
                              marginTop: width > 1024 ? 10 : 0,
                              width: width > 1024 ? "150px" : "auto",
                              alignSelf: width > 1024 ? "center" : "flex-start",
                            }}
                          >
                            Just accept the offer
                            <ul
                              style={{
                                listStyleType: "disc",
                                marginTop: width > 1024 ? 10 : 0,
                                fontWeight: "bold",
                                marginLeft: 20,
                              }}
                            >
                              <li>Box it</li>
                              <li>Send it</li>
                              <li>Get paid</li>
                            </ul>
                            As easy as that!
                          </p>
                        </div>
                      </div>

                      {width > 1024 && (
                        <div className="third-col w-1/3 flex items-center">
                          <img
                            src="/Images/LEGO bricks alt.png"
                            style={{
                              width: "100%",
                              marginLeft: -20,
                            }}
                            alt=""
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div
                    className="blogs"
                    style={{
                      backgroundColor: width > 1024 ? "#EAFED1" : "#fff",
                      display: "flex",
                      alignItems: "center",
                      flexDirection: "column",
                      marginLeft: 50,
                      marginRight: 50,
                      marginTop: 50,
                      marginBottom: 50,
                      borderRadius: 10,
                    }}
                  >
                    <h2
                      style={{
                        fontWeight: "bold",
                        fontSize: "1.5rem",
                        wordSpacing: "0.5rem",
                        marginTop: 20,
                      }}
                    >
                      News And Reviews
                    </h2>
                    <div
                      className="blogs-container flex justify-between gap-5"
                      style={{
                        backgroundColor: "#fff",
                        marginTop: 20,
                        marginBottom: 20,
                        marginLeft: width > 1024 ? 80 : 0,
                        marginRight: width > 1024 ? 80 : 0,
                        flexWrap: width > 1024 ? "nowrap" : "wrap",
                        borderRadius: 10,
                        padding: 20,
                      }}
                    >
                      {topFourBlogs.map((blog, index) => (
                        <div
                          className="blog-card flex flex-col items-center "
                          style={{
                            width: width > 1024 ? "25%" : "100%",
                          }}
                          key={index}
                        >
                          <div
                            className=""
                            style={{
                              height: width > 1024 ? 200 : "auto",
                              borderRadius: 10,
                              overflow: "hidden",
                            }}
                          >
                            <img
                              src={blog.image}
                              alt=""
                              style={{
                                width: width > 1024 ? "auto" : "100%",
                                height: width > 1024 ? 200 : "auto",
                                objectFit: "cover",
                              }}
                            />
                          </div>
                          <div
                            className=""
                            style={{
                              width: width > 1024 ? "auto" : "100%",
                            }}
                          >
                            <h3
                              style={{
                                fontWeight: "bold",
                                fontSize: width > 1024 ? ".7rem" : "1rem",
                                marginTop: 10,
                                textAlign: "left"

                              }}
                              className="w-full text-left"
                            >
                              {blog.title}
                            </h3>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div
                      className="readNow"
                      style={{
                        alignSelf: "flex-start",
                        marginLeft: 80,
                        marginBottom: 20,
                      }}
                    >
                      <Link to="/blogs">
                        <Button
                          className="w-full"
                          variant="filled"
                          color="red"
                          size="sm"
                          radius="xl"
                          style={{
                            background: "#4AB5FE ",
                          }}
                        >
                          Read Now
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="2"
                            stroke="currentColor"
                            class="w-6 h-6"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              d="m8.25 4.5 7.5 7.5-7.5 7.5"
                            />
                          </svg>
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer rounded={true} width={width} />
    </div>
  );
};

export default App;
