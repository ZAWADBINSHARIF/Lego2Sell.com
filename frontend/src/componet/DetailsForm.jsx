import { Divider, Group, Radio, Select, TextInput, Loader } from "@mantine/core";
import { useForm } from "@mantine/form";
import React, { useEffect, useState } from "react";
import { DatePickerInput } from "@mantine/dates";
// import CountryData from "../../CountryData.json"
// import cities from "../../cities.json"
// import CountryCitits from "../../CountryCitits.json"
import CountryCitits from "../CountryCitits.json";
import axios from "axios";
import { Helmet } from "react-helmet";
import { useLocation } from "react-router-dom";
import Editdetails from "./Editdetails";
import { useDisclosure } from "@mantine/hooks";
import baseUrl from "../context/baseUrl";
// import Select from "react-select"
const DetailsForm = ({ setActive, setFormData, storedUserId }) => {
  const [searchValue, onSearchChange] = useState("");

  const [data, setData] = useState();
  // console.log("gokulakrishhsn", data)
  const [countryid, setCountryid] = useState("");
  const location = useLocation();
  useEffect(() => {
    // Check if the page has already been reloaded
    const hasReloaded = sessionStorage.getItem("hasReloaded");

    if (!hasReloaded) {
      // If the page has not been reloaded yet, set the flag and reload the page
      sessionStorage.setItem("hasReloaded", true);
      window.location.reload();
    } else {
      // If the page has already been reloaded, perform any desired action
      // console.log("Page has already been reloaded")
    }
  }, []);
  const [PaymentDetails, setPaymentDetails] = useState(null); // Initialize with null or appropriate default value

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${baseUrl}/Mydetails/${storedUserId}`
        );
        const jsonData = await response.json();
        // Assuming you have a 'setData' function to set the fetched data
        setData(jsonData.Mydetails[0]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData(); // Fetch the data first

    // Now, set the PaymentDetails state after the data has been fetched and 'data' is updated.
    setPaymentDetails(data?.paymentMethod);
  }, [data?.paymentMethod, storedUserId]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://pkgstore.datahub.io/core/world-cities/world-cities_json/data/5b3dd46ad10990bca47b04b4739a02ba/world-cities_json.json"
        );
        const data = await response.json();
        setCityData(data);
      } catch (error) {
        console.error("Error fetching city data:", error);
      }
    };

    fetchData();
  }, []);
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await axios.get(
  //         `https://api.lego2sell.com/Mydetails/${storedUserId}`
  //       )
  //       setData(response.data.Mydetails[0])
  //     } catch (error) {
  //       console.error("An error occurred:", error)
  //       // Handle the error as needed
  //     }
  //   }

  //   fetchData()
  // }, [storedUserId])

  // console.log("Paa", data?.paymentMethod)
  const [state, setState] = useState([]);
  // console.log(state)
  const [stateid, setStateid] = useState("");
  const price = localStorage.getItem("Price");
  const handlecounty = (e) => {
    const getcountryId = e.target.value;
    const getStatedata = CountryCitits.find(
      (country) => country.country_id === getcountryId
    ).states;
    setState(getStatedata);
    setCountryid(getcountryId);
  };

  const handlestate = (e) => {
    const stateid = e.target.value;
    setStateid(stateid);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // alert("Get Country id" + countryid + " And " + stateid)
  };

  // const [reload, setReload] = useState("0")
  // // console.log(reload)
  // if (reload === "1") {
  //   useEffect(() => {
  //     const reloadTimeout = setTimeout(() => {
  //       setReload("1")
  //       window.location.reload()
  //       setReload("0")
  //     }, 5000)

  //     return () => {
  //       clearTimeout(reloadTimeout)
  //     }
  //   }, [])
  // }
  const [opened, { open, close }] = useDisclosure(false);
  const [firstName, setFirstName] = useState();
  const form = useForm({
    initialValues: {
      email: data?.email,
      paymentMethod: PaymentDetails,
      firstName: data?.firstName,
      lastName: data?.lastName,
      Telephone: data?.Telephone,
      title: data?.title,
      StreetAddress1: data?.StreetAddress1,
      termsOfService: true,
      StreetAddress2: data?.StreetAddress2,
      city: data?.city,
      Country: data?.Country,
      Paypalemail: data?.Paypalemail,
      accountNumber: data?.accountNumber,
      sortCode1: data?.sortCode1,
      sortCode2: data?.sortCode2,
      sortCode3: data?.sortCode3,
    },

    validate: {},
  });
  const nextStep = () => {
    setActive((current) => {
      // if (form.validate().hasErrors) {
      //   return current
      // }
      if (window.innerWidth <= 768) {
        // Scroll to the top of the page with a smooth animation
        if (window.innerWidth <= 768) {
          // Scroll to the top of the page using the scrollTo() method
          window.scrollTo(0, 0);
        }
      }
      return current < 3 ? current + 1 : current;
    });
  };
  // console.log("gokula", formData)
  // const payload = {
  //   paymentMethod: formData.paymentMethod,
  //   paypalEmail: formData.Paypalemail,
  //   sortCode: formData.sortCode1,
  // }
  // if (PaymentDetails !== "paypal") {
  //   payload.accountNumber = formData.accountNumber
  // }
  const [cityData, setCityData] = useState([]);
  // console.log(cityData)
  const country = [...new Set(cityData.map((items) => items.country))];

  // console.log("demo66", data)
  return (
    <div className="!h-[100%]">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Confirm your details| LEGO®</title>

        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="keywords" content="Lego, sell, Lego2Sell, Lego 2 Sell" />
        <meta name="viewport" content="width=device-width" />
        <meta
          property="og:description"
          content="Lego2Sell.com is the quick, convenient, and free online platform to sell your LEGO® sets for cash! Whether you have a complete collection or a mixed assortment of lego, we're here to buy. Start selling your LEGO with Lego2Sell.com today!"
        />
      </Helmet>
      <h1 className=" text-xl lg:text-4xl font-bold text-center">
        Confirm your details
      </h1>

      <div id="login-form" className="" method="post">
        <div className="py-6 w-full flex-col lg:flex-row space-x-0 lg:space-x-12 flex">
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className=" text-3xl h3 font-bold">My Details</h3>
              <div
                onClick={open}
                className="bg-blue-500 cursor-pointer px-6 py-2 text-white rounded-lg"
              >
                Edit Details
              </div>
              <Editdetails
                // setSidebarActive={setSidebarActive}
                data={data}
                opened={opened}
                close={close}
              />
            </div>
            <div className="py-3">
              <Select
                value={data?.title}
                defaultValue={data?.title}
                {...form.getInputProps("title")}
                withAsterisk
                label="Title"
                placeholder="Pick one"
                searchable
                onSearchChange={onSearchChange}
                searchValue={data?.title}
                nothingFound="No options"
                data={["Dr", "Miss", "Mr", "Mrs", "Ms", "Rev", "Sir"]}
              />
            </div>
            <div class=" py-3">
              <TextInput
                // onChange={setFirstName}
                defaultValue={data?.firstName}
                value={data?.firstName}
                type="text"
                withAsterisk
                label="First Name"
                placeholder="First Name"
              // {...form.getInputProps("firstName")}
              />
            </div>
            <div class=" py-3">
              <TextInput
                value={data?.lastName}
                defaultValue={data?.lastName}
                withAsterisk
                label="Last Name"
                placeholder="Last Name"
              // {...form.getInputProps("lastName")}
              />
            </div>
            <div class=" py-3">
              <TextInput
                defaultValue={data?.email}
                value={data?.email}
                type="email"
                withAsterisk
                label="Email"
                placeholder="your@email.com"
              // {...form.getInputProps("email")}
              />
            </div>
            <div class=" py-3">
              <TextInput
                defaultValue={data?.Telephone}
                value={data?.Telephone}
                withAsterisk
                label="Telephone"
                placeholder="Telephone"
              // {...form.getInputProps("Telephone")}
              />
            </div>
            {/* <div class=" py-4">
              <DatePickerInput
                {...form.getInputProps("DOB")}
                label="Date of Birth"
                placeholder="DOB"
                value={value}
                onChange={setValue}
                mx="auto"
              />
            </div> */}
            {/* <Divider className="" /> */}
            <div className="py-4">
              <h1 className="text-2xl h3 font-bold ">Address Details</h1>

              <p className="text-gray-500 py-1">
                Please enter your address details below.
              </p>
              <div className="">
                <div class=" flex items-center justify-between py-3">
                  {/* <div className="flex w-full gap-12 items-center"> */}
                  {/* <Select
                      {...form.getInputProps("PostCode")}
                      withAsterisk
                      label="Find by post code"
                      placeholder="Pick one"
                      searchable
                      onSearchChange={setSearchPost}
                      searchValue={SearchPost}
                      nothingFound="No options"
                      data={["React", "Angular", "Svelte", "Vue"]}
                    /> */}
                  {/* <button
                      onClick={() => navigation("/check-your-details")}
                      type="button"
                      className="hover:scale-[1.05] transition-all mt-4 w-1/5 text-center lg:ml-0 flex items-center justify-center px-6 lg:px-9 rounded-full bg-blue-500 hover:bg-white hover:text-black  hover:border text-white font-bold text-[15px] h-[49px] lg:h-[45px]  xl:text-[18px]"
                    >
                      Search
                    </button> */}
                  {/* </div> */}
                  {/* <button onClick={() => setOpenaddress(!openaddress)}>
                    <a
                      title="Forgotten Password"
                      class="text-sm  font-bold text-blue-500"
                    >
                      Enter address manually
                    </a>
                  </button> */}
                </div>

                <div className="">
                  <div class=" py-3">
                    <TextInput
                      defaultValue={data?.StreetAddress1}
                      value={data?.StreetAddress1}
                      withAsterisk
                      label="Street Address1"
                      placeholder="StreetAddress1"
                    // {...form.getInputProps("StreetAddress1")}
                    />
                  </div>
                  <div class=" py-3">
                    <TextInput
                      defaultValue={data?.StreetAddress2}
                      value={data?.StreetAddress2}
                      withAsterisk
                      label="Street Address2"
                      placeholder="StreetAddress2"
                    // {...form.getInputProps("StreetAddress2")}
                    />
                  </div>
                  <div className="py-3">
                    <Select
                      searchValue={data?.city}
                      // {...form.getInputProps("city")}
                      withAsterisk
                      label="Town / city"
                      placeholder=" Pick Town / city "
                      searchable
                      // nothingFound="No options"
                      data={["City"]}
                    />
                  </div>
                  <div className="py-3">
                    <Select
                      defaultValue={data?.Country}
                      value={data?.Country}
                      onChange={(e) => handlecounty(e)}
                      withAsterisk
                      label="Country"
                      placeholder="Pick Country"
                      name="Country"
                      searchable
                      searchValue={data?.Country}
                      data={["Country"]}
                    // {...form.getInputProps("Country")}
                    />
                  </div>

                  <div class=" py-4">
                    <TextInput
                      defaultValue={data?.Postcode}
                      value={data?.Postcode}
                      withAsterisk
                      label="Postcode"
                      placeholder="Enter a Postcode"
                    // {...form.getInputProps("Postcode")}
                    />
                  </div>
                  {/* {data?.city && (
                    <div className="py-3">
                      <Select
                        searchValue={data?.city}
                        // {...form.getInputProps("city")}
                        withAsterisk
                        label="city"
                        placeholder=" Pick Town / city "
                        searchable
                        // nothingFound="No options"
                        data={["app"]}
                      />
                    </div>
                  )} */}
                </div>
              </div>
            </div>
            <Divider className="" />
            <div className="py-6">
              <h1 className="text-2xl h3 font-bold ">Payment details</h1>

              <p className="text-gray-500 py-1">
                How would you like to get paid?
              </p>
              <div className="">
                <div className="">
                  <Radio.Group
                    value={PaymentDetails}
                    defaultValue={PaymentDetails}
                    onChange={setPaymentDetails}
                    withAsterisk
                  >
                    <Group mt="xs">
                      <label
                        className={` ${PaymentDetails === "BankTransfer"
                          ? "border-2 border-blue-500 "
                          : ""
                          } flex items-center gap-4 border rounded-xl px-8 py-7`}
                      >
                        <Radio
                          checked={PaymentDetails === "BankTransfer"}
                          value="BankTransfer"
                          label="Bank Transfer"
                        />
                      </label>
                      <label
                        className={`${PaymentDetails === "Paypal"
                          ? "border-2 border-blue-500"
                          : ""
                          } flex items-center gap-4 border rounded-xl px-8 py-6`}
                      >
                        <Radio
                          checked={PaymentDetails === "Paypal"}
                          value="Paypal"
                        />
                        <img
                          className="w-24"
                          src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/1200px-PayPal.svg.png"
                          alt=""
                        />
                      </label>
                    </Group>
                  </Radio.Group>
                </div>
              </div>
              {PaymentDetails === "Paypal" && (
                <div className="py-6">
                  <h1 className="text-2xl h3 font-bold ">Paypal Email *</h1>
                  <div class=" py-3">
                    <TextInput
                      defaultValue={data?.Paypalemail}
                      value={data?.Paypalemail}
                      type="email"
                      withAsterisk
                      label="Need for revice your payment"
                      placeholder="Paypal Email"
                    // {...form.getInputProps("Paypalemail")}
                    />
                  </div>
                  <div class="rounded-md bg-[#F8F8FE] p-4 text-sm text-blue-500 text-center mt-4">
                    We'll direct transfer to your PayPal account within{" "}
                    <strong class="font-bold">5 working days</strong> of Accept
                    your LEGO®.
                  </div>
                </div>
              )}
              {PaymentDetails === "BankTransfer" && (
                <div className="py-6">
                  <div className="flex flex-col md:flex-row">
                    <div className="w-full md:w-1/2 md:pr-4 mb-4 md:mb-0">
                      <label className="w-full flex h3 text-2xl font-bold mb-2">
                        Account number
                        <span className="text-[#E52D3B]">*</span>
                      </label>
                      <TextInput
                        defaultValue={data?.accountNumber}
                        value={data?.accountNumber}
                        // {...form.getInputProps("accountNumber")}
                        placeholder="Account number"
                        type="text"
                        autoComplete="off"
                        name="customer_paymentinfo_bank"
                        id="customer_paymentinfo_bank"
                        title="Enter Account Number"
                        className="h-[67px] rounded-3xl lg:rounded-xl w-full lg:pl-6 pl-0 km_ignore"
                      />
                    </div>
                    <div className="w-full md:w-1/2 md:pl-4">
                      <label className="w-full flex text-2xl font-bold mb-2">
                        Sort code<span className="text-[#E52D3B]">*</span>
                      </label>
                      <div className="flex items-center">
                        <div className=" w-full lg:w-3/12">
                          <TextInput
                            defaultValue={data?.sortCode1}
                            value={data?.sortCode1}
                            // {...form.getInputProps("sortCode1")}
                            type="text"
                            maxLength={2}
                            autoComplete="off"
                            title="Sort code digits 1 & 2"
                            className="h-[67px] rounded-3xl lg:rounded-xl w-full lg:pl-6 pl-1 km_ignore"
                            name="customer_paymentinfo_bank_sort1"
                            id="customer_paymentinfo_bank_sort1"
                          />
                        </div>
                        <div className="lg:px-4 px-1 -mt-3">-</div>
                        <div className=" w-full lg:w-3/12">
                          <TextInput
                            // {...form.getInputProps("sortCode2")}
                            type="text"
                            defaultValue={data?.sortCode2}
                            value={data?.sortCode2}
                            autoComplete="off"
                            title="Sort code digits 3 & 4"
                            maxLength={2}
                            className="h-[67px]  rounded-3xl lg:rounded-xl w-full lg:pl-6 pl-1 km_ignore"
                            name="customer_paymentinfo_bank_sort2"
                            id="customer_paymentinfo_bank_sort2"
                          />
                        </div>
                        <div className="lg:px-4 px-1  -mt-3">-</div>
                        <div className=" w-full lg:w-3/12">
                          <TextInput
                            // {...form.getInputProps("sortCode3")}
                            defaultValue={data?.sortCode3}
                            value={data?.sortCode3}
                            type="text"
                            autoComplete="off"
                            title="Sort code digits 5 & 6"
                            maxLength={2}
                            className="h-[67px]  rounded-3xl lg:rounded-xl w-full lg:pl-6 pl-1 km_ignore"
                            name="customer_paymentinfo_bank_sort3"
                            id="customer_paymentinfo_bank_sort3"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-xl bg-[#F8F8FE] p-4 text-sm text-blue-500 text-center mt-4">
                    We'll pay directly to your account the{" "}
                    <strong className="font-bold">same day</strong> we Accept
                    your LEGO®.
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="flex-[0.4]">
            <div className="bg-white relative lg:!fixed !top-18 w-full lg:w-[340px] rounded-2xl shadow-[0_4px_25px_rgba(38,50,92,0.1)] p-4 px-6 md:p-8 text-center">
              <h2 className="h4 mb-4 hidden md:block">Offer summary</h2>
              <div className="flex flex-row md:flex-col items-center justify-between">
                <div className="text-blue-500 text-xl md:text-5xl font-bold mb-0 md:mb-2 order-2 md:order-1">
                  <h2>
                    {price ? <h2>{` £${price}`}</h2> : <Loader size="xs" />}
                  </h2>
                </div>
                <div className="font-bold text-xl md:text-base order-1 md:order-2">
                  1 Item
                </div>
              </div>
              <button
                onClick={nextStep}
                type="submit"
                className="hover:scale-[1.05] transition-all mt-4 w-full text-center lg:ml-0 flex items-center justify-center px-6 lg:px-9 rounded-xl bg-blue-500 hover:bg-white hover:text-black  hover:border text-white font-bold text-[15px] h-[49px] lg:h-[65px]  xl:text-[18px]"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsForm;
