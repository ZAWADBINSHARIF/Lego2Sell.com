import React, { useEffect, useState } from "react";
import { Loader, Modal } from "@mantine/core";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import ReactGA from "react-ga4";
import baseUrl from "../context/baseUrl";
const Product = () => {
  const [condition, setCondition] = useState();
  const [damageOpen, setDamageOpen] = useState();
  const [productCondition, setProductCondition] = useState();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const data = location.state && location.state.data;
  const SearchValue = location.state && location.state.e;
  const navigation = useNavigate();
  const [isFormValid, setIsFormValid] = useState(true);
  const [DiscountValue, setDiscountValue] = useState(null);
  const [setCondtinmessage, setSetCondtinmessage] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        // Replace with the actual user ID
        const response = await axios.get(
          `${baseUrl}/DiscountValueGet`
        );
        console.log(response);
        if (response.data.length > 0) {
          setDiscountValue(response.data);
        } else {
          setDiscountValue(null);
        }
      } catch (error) {
        // console.log(error)
      }
    }
    ReactGA.send(window.location.pathname);
    fetchOrders();
  }, []);
  const ConditionData = [
    {
      img: "/mint.png",
      Discount: DiscountValue ? DiscountValue[0]?.MintValue : "50",
      title: "Mint",
    },
    {
      img: "/Images/verygood.png",
      Discount: DiscountValue ? DiscountValue[0]?.VeryGood : "55",
      title: "Very Good",
    },
    { img: "/Images/damaged.png", Discount: "no", title: "Damaged" },
  ];
  const [seletedvalue, setSeletedvalue] = useState();
  // console.log(ConditionData)
  const [formData, setFormData] = useState({
    SetCondition: "",
    email: "",
    ifcondition: "",
  });
  const storedUserId = localStorage.getItem("userId");
  // console.log("demo", storedUserId)
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Perform form validation
    if (!formData.email || !formData.ifcondition) {
      setIsFormValid(false);
      return;
    }
    if (!productCondition) {
      setSetCondtinmessage(false);
      return;
    }

    localStorage.setItem("condition", condition);
    localStorage.setItem("SearchValue", SearchValue);
    const payload = {
      SetCondition: formData.SetCondition,
      email: formData.email,
      ifSetcondition: formData.ifcondition,
    };
    ReactGA.send({
      category: payload.email,
      value: payload.SetCondition,
      action: "Demo",
    });
    try {
      const response = await axios.post(
        `${baseUrl}/get_Quote/${storedUserId}`,
        payload
      );

      // console.log("workingsdsd", response.data)
    } catch (error) {
      console.error(error);
    }
    // console.log(formData)
    console.log({ SearchValue, condition, productCondition });
    navigation(`/selling-basket/`, {
      state: { SearchValue, condition, productCondition },
    });
  };

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 100);
    if (formData.SetCondition === "no") {
      setDamageOpen(true);
    } else setDamageOpen(false);
  }, [formData]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center mx-auto my-auto ">
        <Loader />
      </div>
    );
  }

  return (
    <div className="flex h-full max-h-[786px]:py-0 py-9 justify-center overflow-hidden   lg:flex-row flex-col">
      <Helmet>
        <meta charSet="utf-8" />
        <title>{data.body.name} | LEGO®</title>

        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="keywords" content="Lego, sell, Lego2Sell, Lego 2 Sell" />
        <meta name="viewport" content="width=device-width" />
        <meta
          property="og:description"
          content="Lego2Sell.com is the quick, convenient, and free online platform to sell your LEGO® sets for cash! Whether you have a complete collection or a mixed assortment of lego, we're here to buy. Start selling your LEGO with Lego2Sell.com today!"
        />
      </Helmet>
      <div className="flex-1 py-8 max-w-3xl  px-6 lg:px-24">
        <div className="flex items-center max-w-lg flex-col justify-center">
          <h2 class="mb-3 text-2xl lg:text-2xl font-bold leading-9 tracking-tight text-gray-900">
            {` ${data.body.name} -
            ${SearchValue}`}
          </h2>
          <div className="">
            <img
              className="w-[340px] rounded-2xl  h-[210px] object-contain"
              src={data.body.image_url}
              alt="product-img"
            />
          </div>
        </div>
        <div className="bg-[#00a2ff] hidden lg:block mt-12 max-w-lg rounded-3xl px-6 py-4 border-2 border-black">
          <h2 class="text-center py-2 text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Why sell with Us?
          </h2>
          <div className="">
            <div className="flex items-center py-2 gap-4">
              <svg
                width={48}
                stroke="currentColor"
                fill="currentColor"
                stroke-width="0"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M20.995 6.9a.998.998 0 0 0-.548-.795l-8-4a1 1 0 0 0-.895 0l-8 4a1.002 1.002 0 0 0-.547.795c-.011.107-.961 10.767 8.589 15.014a.987.987 0 0 0 .812 0c9.55-4.247 8.6-14.906 8.589-15.014zM12 19.897C5.231 16.625 4.911 9.642 4.966 7.635L12 4.118l7.029 3.515c.037 1.989-.328 9.018-7.029 12.264z"></path>
                <path d="m11 12.586-2.293-2.293-1.414 1.414L11 15.414l5.707-5.707-1.414-1.414z"></path>
              </svg>
              <p className="text-base font-medium text-gray-900">
                {" "}
                Customers loves us as we are one of the largest new LEGO® set
                buyers in the country.
              </p>
            </div>
            <div className="flex items-center py-2 gap-4">
              <svg
                width={82}
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
                    d="M8 10V20M8 10L4 9.99998V20L8 20M8 10L13.1956 3.93847C13.6886 3.3633 14.4642 3.11604 15.1992 3.29977L15.2467 3.31166C16.5885 3.64711 17.1929 5.21057 16.4258 6.36135L14 9.99998H18.5604C19.8225 9.99998 20.7691 11.1546 20.5216 12.3922L19.3216 18.3922C19.1346 19.3271 18.3138 20 17.3604 20L8 20"
                    stroke="#000000"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></path>{" "}
                </g>
              </svg>
              <p className="text-base font-medium text-gray-900">
                No waiting for the payments or sales aggravation, once we accept
                your item you can be paid on the same day not in 2 weeks like
                some platforms.
              </p>
            </div>
            <div className="flex items-center py-2 gap-4">
              <svg
                width={48}
                stroke="currentColor"
                fill="currentColor"
                stroke-width=""
                viewBox="0 0 512 512"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M225.814 32.316c-3.955-.014-7.922-.01-11.9.007-19.147.089-38.6.592-58.219 1.32l5.676 24.893c20.431-2.31 42.83-4.03 65.227-4.89 12.134-.466 24.194-.712 35.892-.65 35.095.183 66.937 3.13 87.77 11.202l8.908 3.454-3.977 8.685c-29.061 63.485-35.782 124.732-31.228 184.826 2.248-71.318 31.893-134.75 70.81-216.068-52.956-8.8-109.634-12.582-168.959-12.78zm28.034 38.79c-8.74.007-17.65.184-26.559.526-41.672 1.6-83.199 6.49-110.264 12.096 30.233 56.079 54.69 112.287 70.483 167.082a71.934 71.934 0 0 1 5.894.045c4.018.197 7.992.742 11.875 1.59-16.075-51.397-34.385-98.8-57.146-146.131l-5.143-10.694 11.686-2.068c29.356-5.198 59.656-7.21 88.494-7.219 1.922 0 3.84.007 5.748.024 18.324.16 35.984 1.108 52.346 2.535l11.054.965-3.224 10.617c-18.7 61.563-22.363 127.678-11.79 190.582.176.163.354.325.526.49 3.813-1.336 7.38-2.698 10.705-4.154-8.254-67.394-4.597-136.923 26.229-209.201-17.202-4.383-43.425-6.674-72.239-7.034a656.656 656.656 0 0 0-8.675-.05zm144.945 7.385c-30.956 65.556-52.943 118.09-56.547 174.803 20.038-66.802 58.769-126.685 102.904-165.158a602.328 602.328 0 0 0-46.357-9.645zM103.832 97.02c-18.76 3.868-37.086 8.778-54.812 15.562 8.626 7.48 24.22 21.395 43.14 39.889 8.708-8.963 17.589-17.818 26.852-25.87a1067.587 1067.587 0 0 0-15.18-29.581zm142.023 7.482c-13.62-.066-27.562.324-41.554 1.293-1.468 13.682-9.56 26.482-19.225 39.07 15.431 36.469 28.758 73.683 40.756 113.194 18.375 5.42 36.554 11.827 51.28 19.504-5.47-42.458-4.722-85.963 2.38-128.508-12.885-13.31-19.597-28.09-20.135-44.34a621.48 621.48 0 0 0-13.502-.213zm182.018 26.985c-24.73 29.3-46.521 65.997-61.37 105.912 27.264-38.782 60.79-69.032 96.477-90.4a1318.664 1318.664 0 0 0-35.107-15.512zm-300.74 11.959c-14.594 13.188-29.014 29.017-44.031 44.097 32.289 19.191 59.791 41.918 82.226 67.66 1.393-.526 2.8-.999 4.215-1.43-10.498-36.096-24.885-73.033-42.41-110.327zM360.52 268.198c-16.397 19.788-31.834 30.235-53.09 38.57 2.391 9.22-1.16 19.805-9.334 27.901-4.808 4.761-10.85 10.188-19.684 13.715a62.896 62.896 0 0 0 3.9 2.127c12.364 6.17 34.207 4.18 54.5-5.049 20.23-9.2 38.302-25.092 45-41.191 3.357-9.05.96-13.77-4.917-20.692-4.184-4.925-10.295-9.89-16.375-15.38zm-170.079.586c-10.715-.098-21.597 2.994-30.59 9.76-12.79 9.623-22.65 26.784-22.738 55.934v.2l-.01.2c-2.92 61.381 1.6 89.7 10.555 105.065 7.904 13.562 21.05 20.054 40.28 31.994.916-2.406 1.87-5.365 2.765-9.098 2.277-9.499 4.161-22.545 5.355-36.975 2.389-28.858 2.04-63.51-1.955-88.445l-2.111-13.19 13.016 2.995c31.615 7.273 49.7 8.132 60.2 6.28 10.502-1.854 14.061-5.523 20.221-11.624 5.79-5.732 5.682-7.795 4.456-11.021-1.227-3.227-6.149-8.545-14.5-13.633-16.703-10.176-45.085-19.611-71.614-26.647a53.988 53.988 0 0 0-13.33-1.795zm189.1 69.416c-10.013 9.754-22.335 17.761-35.277 23.647-20.983 9.542-44.063 13.907-63.211 7.553-6.76 2.516-10.687 5.407-12.668 7.8-2.718 3.284-2.888 5.7-1.967 9.16.92 3.46 3.665 7.568 7.059 10.524 3.393 2.956 7.426 4.492 8.959 4.564 46.794 2.222 67.046-11.207 92.277-26.783 7.358-4.542 10.174-13.743 9.469-22.931-.353-4.594-1.69-8.911-3.233-11.63a9.009 9.009 0 0 0-1.408-1.904zm-166.187 9.096c2.727 25.068 2.772 54.314.642 80.053-1.247 15.072-3.175 28.779-5.789 39.685-1.137 4.746-2.388 8.954-3.9 12.659l146.697-6.465c-1.656-6.149-3.344-12.324-5.031-18.502a127.004 127.004 0 0 1-17.24 4.424l.044.73-8.316.518c-5.121.614-10.452.953-15.983.992l-83.86 5.21 2.493-11.607c7.947-37.006 8.68-69.589 3.778-105.234a353.433 353.433 0 0 1-13.536-2.463zm31.972 4.684c3.948 31.933 3.473 62.41-2.406 95.2l19.264-1.196a39.44 39.44 0 0 1-6.1-14.778c-1.296-6.88-.575-14.538 3.926-20.87.199-.281.414-.55.627-.821-5.246-4.845-9.628-11.062-11.614-18.524-2.114-7.944-.794-17.67 5.497-25.27 2.079-2.51 4.592-4.776 7.543-6.816-2.61-2.08-4.898-4.285-6.874-6.582-3.064.021-6.345-.093-9.863-.343zm132.666 41.785c-23.456 14.253-49.81 27.876-96.41 25.664a26.402 26.402 0 0 1-4.518-.615c-1.233.553-1.891 1.256-2.382 1.947-.963 1.355-1.532 3.8-.909 7.113 1.248 6.627 7.525 13.889 13.37 14.569 41.385 4.813 69.979-8.726 87.341-24.477 8-7.258 8.068-11.9 6.89-16.951-.59-2.523-1.89-4.969-3.382-7.25zm-6.683 49.062a114.657 114.657 0 0 1-8.547 4.86c1.65 6.051 3.304 12.102 4.937 18.154l19.92-3.572c-5.14-4.387-9.162-8.954-12.39-13.496-1.442-2.029-2.713-4.001-3.92-5.946z"></path>
              </svg>
              <p className="text-base font-medium text-gray-900">
                No selling fees like some platforms - eBay 15% + Amazon 20% +
                payment fees, with us none.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1  max-w-3xl  py-6 lg:py-0">
        <form
          className="flex items-center justify-center"
          onSubmit={handleSubmit}
        >
          <div className="max-w-[440px] px-6 lg:px-0">
            <h2 class="text-2xl text-center py-4 font-bold leading-9 tracking-tight text-gray-900">
              About your Set
            </h2>
            <div className="max-w-lg space-y-5">
              <div className="border-2 border-black rounded-3xl px-6 py-6 bg-[#6af99e]">
                <h4 className=" text-center text-xl font-bold leading-9 tracking-tight text-gray-900">
                  Set Condition
                </h4>
                <div className="flex items-center justify-between">
                  {/* {formData.SetCondition === "no"} */}
                  {ConditionData.map((value, index) => {
                    return (
                      <label
                        className={` ${productCondition === value.title
                          ? "border-2 border-blue-500 rounded-xl "
                          : ""
                          }`}
                      >
                        <img
                          className={`md:w-[100px] cursor-pointer object-contain h-[70px]`}
                          src={value.img}
                          alt="mint"
                        />

                        <input
                          onChange={(e) => {
                            setFormData({
                              ...formData,
                              SetCondition: value.Discount,
                            });
                            console.log(value);
                            setCondition(value.Discount);
                            setProductCondition(value.title);
                          }}
                          name="SetCondition"
                          type="checkbox"
                          className="hidden"
                        />
                      </label>
                    );
                  })}

                  {damageOpen && (
                    <Modal
                      className="font-bold"
                      centered
                      title="Woops"
                      opened
                      onClose={() => setDamageOpen(false)}
                    >
                      <div className="flex items-center justify-center">
                        <img
                          className="w-3/4"
                          src="/Images/SearchErrorMessage.jpg"
                          alt=""
                          loading="lazy"
                        />
                      </div>
                      <div className="py-2">
                        <div className="mt-8 text-xl font-medium">Sorry!</div>
                        <p className="font-normal text-gray-400 ">
                          We do not take Set's with damaged box's at this moment
                          in time.
                        </p>
                      </div>
                    </Modal>
                  )}
                </div>
                {!setCondtinmessage && (
                  <p className="text-red-500">
                    Please select in this required fields.
                  </p>
                )}
              </div>
              <div className="border-2 flex border-black rounded-3xl px-6 py-6 bg-[#6af99e]">
                <div className="">
                  <img
                    className="w-[102px] object-contain h-[100px]"
                    src="/Images/mr-_gold_waving-removebg-preview.png"
                    alt="mr-gold"
                  />
                </div>

                <div className="flex items-center flex-col">
                  <h3 className="text-base text-center font-medium">
                    Have you selected the right set condition and your item is
                    new and sealed?
                  </h3>
                  <div className="flex gap-2 items-center justify-center py-6">
                    {/* <Checkbox
                      {...form.getInputProps("conditionyes")}
                      label="Yes"
                    /> */}
                    <input
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          ifcondition: e.target.checked,
                        })
                      }
                      className="w-5 h-5"
                      type="checkbox"
                    />
                    <h3 className="text-base font-medium">Yes</h3>
                  </div>
                  {!isFormValid && (
                    <p className="text-red-500">
                      Please fill in this required fields.
                    </p>
                  )}
                </div>
              </div>
              <div className="border-2  border-black rounded-3xl px-6 py-6 bg-[#6af99e]">
                <h3 className="text-center text-xl font-bold leading-9 tracking-tight text-gray-900">
                  Email Address*
                </h3>
                <input
                  className=" border border-gray-800 py-2 px-6 w-full rounded-lg"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      email: e.target.value,
                    })
                  }
                  type="email"
                  placeholder="Enter your email"
                />

                <div className="flex items-center justify-center py-2">
                  <button className="" type="submit">
                    <img
                      className="flex object-contain w-[118px] h-[50px] items-center mx-auto"
                      src="/Images/get-quote-85e4043b.png"
                      alt="get-quote"
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
      <div className="bg-[#00a2ff] mb-7 mx-8 lg:hidden block mt-12 max-w-lg rounded-3xl px-6 py-4 border-2 border-black">
        <h2 class="text-center py-2 text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Why sell with Us?
        </h2>
        <div className="">
          <div className="flex items-center py-2 gap-4">
            <svg
              width={48}
              stroke="currentColor"
              fill="currentColor"
              stroke-width="0"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M20.995 6.9a.998.998 0 0 0-.548-.795l-8-4a1 1 0 0 0-.895 0l-8 4a1.002 1.002 0 0 0-.547.795c-.011.107-.961 10.767 8.589 15.014a.987.987 0 0 0 .812 0c9.55-4.247 8.6-14.906 8.589-15.014zM12 19.897C5.231 16.625 4.911 9.642 4.966 7.635L12 4.118l7.029 3.515c.037 1.989-.328 9.018-7.029 12.264z"></path>
              <path d="m11 12.586-2.293-2.293-1.414 1.414L11 15.414l5.707-5.707-1.414-1.414z"></path>
            </svg>
            <p className="text-base font-medium text-gray-900">
              {" "}
              Customers love us as we are one of the largest new LEGO® set
              buyers in the country.
            </p>
          </div>
          <div className="flex items-center py-2 gap-4">
            <svg
              width={82}
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
                  d="M8 10V20M8 10L4 9.99998V20L8 20M8 10L13.1956 3.93847C13.6886 3.3633 14.4642 3.11604 15.1992 3.29977L15.2467 3.31166C16.5885 3.64711 17.1929 5.21057 16.4258 6.36135L14 9.99998H18.5604C19.8225 9.99998 20.7691 11.1546 20.5216 12.3922L19.3216 18.3922C19.1346 19.3271 18.3138 20 17.3604 20L8 20"
                  stroke="#000000"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>{" "}
              </g>
            </svg>
            <p className="text-base font-medium text-gray-900">
              No waiting for the payments or sales aggravation, once we accept
              your item you can be paid on the same day not in 2 weeks like some
              platforms.
            </p>
          </div>
          <div className="flex items-center py-2 gap-4">
            <svg
              width={48}
              stroke="currentColor"
              fill="currentColor"
              stroke-width=""
              viewBox="0 0 512 512"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M225.814 32.316c-3.955-.014-7.922-.01-11.9.007-19.147.089-38.6.592-58.219 1.32l5.676 24.893c20.431-2.31 42.83-4.03 65.227-4.89 12.134-.466 24.194-.712 35.892-.65 35.095.183 66.937 3.13 87.77 11.202l8.908 3.454-3.977 8.685c-29.061 63.485-35.782 124.732-31.228 184.826 2.248-71.318 31.893-134.75 70.81-216.068-52.956-8.8-109.634-12.582-168.959-12.78zm28.034 38.79c-8.74.007-17.65.184-26.559.526-41.672 1.6-83.199 6.49-110.264 12.096 30.233 56.079 54.69 112.287 70.483 167.082a71.934 71.934 0 0 1 5.894.045c4.018.197 7.992.742 11.875 1.59-16.075-51.397-34.385-98.8-57.146-146.131l-5.143-10.694 11.686-2.068c29.356-5.198 59.656-7.21 88.494-7.219 1.922 0 3.84.007 5.748.024 18.324.16 35.984 1.108 52.346 2.535l11.054.965-3.224 10.617c-18.7 61.563-22.363 127.678-11.79 190.582.176.163.354.325.526.49 3.813-1.336 7.38-2.698 10.705-4.154-8.254-67.394-4.597-136.923 26.229-209.201-17.202-4.383-43.425-6.674-72.239-7.034a656.656 656.656 0 0 0-8.675-.05zm144.945 7.385c-30.956 65.556-52.943 118.09-56.547 174.803 20.038-66.802 58.769-126.685 102.904-165.158a602.328 602.328 0 0 0-46.357-9.645zM103.832 97.02c-18.76 3.868-37.086 8.778-54.812 15.562 8.626 7.48 24.22 21.395 43.14 39.889 8.708-8.963 17.589-17.818 26.852-25.87a1067.587 1067.587 0 0 0-15.18-29.581zm142.023 7.482c-13.62-.066-27.562.324-41.554 1.293-1.468 13.682-9.56 26.482-19.225 39.07 15.431 36.469 28.758 73.683 40.756 113.194 18.375 5.42 36.554 11.827 51.28 19.504-5.47-42.458-4.722-85.963 2.38-128.508-12.885-13.31-19.597-28.09-20.135-44.34a621.48 621.48 0 0 0-13.502-.213zm182.018 26.985c-24.73 29.3-46.521 65.997-61.37 105.912 27.264-38.782 60.79-69.032 96.477-90.4a1318.664 1318.664 0 0 0-35.107-15.512zm-300.74 11.959c-14.594 13.188-29.014 29.017-44.031 44.097 32.289 19.191 59.791 41.918 82.226 67.66 1.393-.526 2.8-.999 4.215-1.43-10.498-36.096-24.885-73.033-42.41-110.327zM360.52 268.198c-16.397 19.788-31.834 30.235-53.09 38.57 2.391 9.22-1.16 19.805-9.334 27.901-4.808 4.761-10.85 10.188-19.684 13.715a62.896 62.896 0 0 0 3.9 2.127c12.364 6.17 34.207 4.18 54.5-5.049 20.23-9.2 38.302-25.092 45-41.191 3.357-9.05.96-13.77-4.917-20.692-4.184-4.925-10.295-9.89-16.375-15.38zm-170.079.586c-10.715-.098-21.597 2.994-30.59 9.76-12.79 9.623-22.65 26.784-22.738 55.934v.2l-.01.2c-2.92 61.381 1.6 89.7 10.555 105.065 7.904 13.562 21.05 20.054 40.28 31.994.916-2.406 1.87-5.365 2.765-9.098 2.277-9.499 4.161-22.545 5.355-36.975 2.389-28.858 2.04-63.51-1.955-88.445l-2.111-13.19 13.016 2.995c31.615 7.273 49.7 8.132 60.2 6.28 10.502-1.854 14.061-5.523 20.221-11.624 5.79-5.732 5.682-7.795 4.456-11.021-1.227-3.227-6.149-8.545-14.5-13.633-16.703-10.176-45.085-19.611-71.614-26.647a53.988 53.988 0 0 0-13.33-1.795zm189.1 69.416c-10.013 9.754-22.335 17.761-35.277 23.647-20.983 9.542-44.063 13.907-63.211 7.553-6.76 2.516-10.687 5.407-12.668 7.8-2.718 3.284-2.888 5.7-1.967 9.16.92 3.46 3.665 7.568 7.059 10.524 3.393 2.956 7.426 4.492 8.959 4.564 46.794 2.222 67.046-11.207 92.277-26.783 7.358-4.542 10.174-13.743 9.469-22.931-.353-4.594-1.69-8.911-3.233-11.63a9.009 9.009 0 0 0-1.408-1.904zm-166.187 9.096c2.727 25.068 2.772 54.314.642 80.053-1.247 15.072-3.175 28.779-5.789 39.685-1.137 4.746-2.388 8.954-3.9 12.659l146.697-6.465c-1.656-6.149-3.344-12.324-5.031-18.502a127.004 127.004 0 0 1-17.24 4.424l.044.73-8.316.518c-5.121.614-10.452.953-15.983.992l-83.86 5.21 2.493-11.607c7.947-37.006 8.68-69.589 3.778-105.234a353.433 353.433 0 0 1-13.536-2.463zm31.972 4.684c3.948 31.933 3.473 62.41-2.406 95.2l19.264-1.196a39.44 39.44 0 0 1-6.1-14.778c-1.296-6.88-.575-14.538 3.926-20.87.199-.281.414-.55.627-.821-5.246-4.845-9.628-11.062-11.614-18.524-2.114-7.944-.794-17.67 5.497-25.27 2.079-2.51 4.592-4.776 7.543-6.816-2.61-2.08-4.898-4.285-6.874-6.582-3.064.021-6.345-.093-9.863-.343zm132.666 41.785c-23.456 14.253-49.81 27.876-96.41 25.664a26.402 26.402 0 0 1-4.518-.615c-1.233.553-1.891 1.256-2.382 1.947-.963 1.355-1.532 3.8-.909 7.113 1.248 6.627 7.525 13.889 13.37 14.569 41.385 4.813 69.979-8.726 87.341-24.477 8-7.258 8.068-11.9 6.89-16.951-.59-2.523-1.89-4.969-3.382-7.25zm-6.683 49.062a114.657 114.657 0 0 1-8.547 4.86c1.65 6.051 3.304 12.102 4.937 18.154l19.92-3.572c-5.14-4.387-9.162-8.954-12.39-13.496-1.442-2.029-2.713-4.001-3.92-5.946z"></path>
            </svg>
            <p className="text-base font-medium text-gray-900">
              No selling fees like some platforms - eBay 15% + Amazon 20% +
              payment fees, with us none.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
