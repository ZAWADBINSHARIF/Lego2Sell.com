import {
  Checkbox,
  Divider,
  Group,
  Radio,
  Select,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import PasswordStrengthMeter from "./Password";
import Country from "../componet/Country";
import CountryCity from "../componet/Country";
import { Helmet } from "react-helmet";
import CryptoJS from 'crypto-js';
import baseUrl from "../context/baseUrl";

const SignUpForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatpassword, setRepeatpassword] = useState();
  const navigation = useNavigate();
  const location = useLocation();
  const isLogin = location.state?.isLogin ?? "";
  const productCondition = location.state?.productCondition;

  const [Marketingpreferences, setMarketingpreferences] = useState(false);

  const [searchValue, onSearchChange] = useState("");
  const [selectedCoutry, setSelectedCoutry] = useState("");
  const [selectedCity, setSelectedCity] = useState("london");

  const [selectedState, setSelectedState] = useState("");
  const [PaymentDetails, setPaymentDetails] = useState("Paypal");
  const [isTerm, setIsTerm] = useState();
  const form = useForm({
    initialValues: {
      email: "",
      paymentMethod: PaymentDetails,
      firstName: "",
      lastName: "",
      Telephone: "",
      title: "",
      StreetAddress1: "",
      termsOfService: true,
      StreetAddress2: "",
      city: "",
      Country: selectedCoutry,
      Paypalemail: "",
      accountNumber: "",
      sortCode1: "",
      sortCode2: "",
      sortCode3: "",
      TermsCheck: "",
      Marketingpreferences: Marketingpreferences === true ? "Yes" : "No",
      Postcode: "",
    },

    validate: {
      firstName: (value) =>
        value < 2
          ? "firstName must have at least 2 letters must have at least 2 letters"
          : null,
      lastName: (value) =>
        value < 2 ? "LastName must have at least 2 letters" : null,
      title: (value) =>
        value < 2 ? "title must have at select One Option" : null,
      Telephone: (value) =>
        value < 2 ? "Telephone must have at least 2 letters" : null,
      StreetAddress1: (value) =>
        value < 2 ? "StreetAddress1 must have at least 2 letters" : null,
      StreetAddress2: (value) =>
        value < 2 ? "StreetAddress2 must have at least 2 letters" : null,

      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
    },
  });

  const handleSubmit = async (values) => {
    try {
      const payload = {
        email: form.values.email,
        paymentMethod: PaymentDetails,
        firstName: form.values.firstName,
        lastName: form.values.lastName,
        Telephone: form.values.Telephone,
        title: form.values.title,
        StreetAddress1: form.values.StreetAddress1,
        termsOfService: form.values.termsOfService,
        StreetAddress2: form.values.StreetAddress2,
        city: form.values.city,
        Country: selectedCoutry,
        Paypalemail: form.values.Paypalemail,
        accountNumber: form.values.accountNumber,
        sortCode1: form.values.sortCode1,
        sortCode2: form.values.sortCode2,
        sortCode3: form.values.sortCode3,
        TermsCheck: form.values.TermsCheck,
        Marketingpreferences: Marketingpreferences === true ? "Yes" : "No",
        Postcode: form.values.Postcode,
      };

      // Data to encrypt
      const sensitiveData = 'frontend';
      // Encryption key (must be a secret)
      const encryptionKey = 'legotwosell';
      // Encrypt the data
      const encryptedData = CryptoJS.AES.encrypt(sensitiveData, encryptionKey).toString();

      const response = await fetch(`${baseUrl}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "source": encryptedData,
        },
        body: JSON.stringify({ email: form.values.email, password }),
      });
      if (!response.ok) {
        throw new Error("Error: " + response.status);
      }

      // console.log("workingsdsd", response1.data)
      // Sign-up successful
      const responseData = await response.json();
      const userId = responseData.userId;
      const token = responseData?.token;

      localStorage?.setItem("token", token);

      const res = await axios.post(
        `${baseUrl}/MyDetails/${userId}`,
        payload
      );

      console.log(res);

      localStorage.setItem("userId", userId);
      // console.log("Sign-up successful User ID:", userId)
      if (isLogin === "/selling-basket/") {
        navigation(`/check-your-details`, { state: { productCondition } });
        window.location.reload();
      } else {
        navigation(`/`);
      }
      // Navigate to another route
      try {
        const response = await fetch(
          `${baseUrl}/Mydetails/${userId}`
        );
        const jsonData = await response.json();
        // console.log(jsonData.Mydetails[0])
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    } catch (error) {
      console.error("An error occurred:", error);
      // Handle the error as needed
    }

    // Reset form inputs
    setEmail("");
    setPassword("");

    // setFormData(values)
    window.scrollTo({ top: 0, behavior: "smooth" });
    // nextStep()
  };

  return (
    <div className="flex w-full px-6 items-center justify-center flex-col">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Create Account | LEGO®</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="keywords" content="Lego, sell, Lego2Sell, Lego 2 Sell" />
        <meta name="viewport" content="width=device-width" />
        <meta
          property="og:description"
          content="Lego2Sell.com is the quick, convenient, and free online platform to sell your LEGO® sets for cash! Whether you have a complete collection or a mixed assortment of lego, we're here to buy. Start selling your LEGO with Lego2Sell.com today!"
        />
      </Helmet>
      <section className="lg:pt-24 py-10">
        <div className="container max-w-6xl md:text-center">
          <h1 className="h1 text-xl lg:text-4xl font-bold mb-6">
            Create your account
          </h1>
          <p className="font-medium lg:text-base text-sm text-gray-400">
            Ready to create an account and start selling LEGO®? Enter your
            details below to get started.
          </p>
        </div>
      </section>
      <form
        onSubmit={form.onSubmit(handleSubmit)}
        id="login-form"
        className="py-6 flex-col lg:flex-row w-full lg:w-3/6 flex"
        method="post"
      >
        <div className="flex-1">
          <h3 className=" text-xl lg:text-2xl font-bold">My Details</h3>
          <div className="py-3">
            <Select
              {...form.getInputProps("title")}
              withAsterisk
              label="Title"
              placeholder="Pick one"
              searchable
              onSearchChange={onSearchChange}
              searchValue={searchValue}
              nothingFound="No options"
              data={["Dr", "Miss", "Mr", "Mrs", "Ms", "Rev", "Sir"]}
            />
          </div>
          <div class=" py-3">
            <TextInput
              type="text"
              withAsterisk
              label="First Name"
              placeholder="First Name"
              {...form.getInputProps("firstName")}
            />
          </div>
          <div class=" py-3">
            <TextInput
              withAsterisk
              label="Last Name"
              placeholder="Last Name"
              {...form.getInputProps("lastName")}
            />
          </div>
          <div class=" py-3">
            <TextInput
              type="email"
              withAsterisk
              label="Email"
              placeholder="your@email.com"
              {...form.getInputProps("email")}
            />
          </div>
          <div class=" py-3">
            <TextInput
              withAsterisk
              label="Telephone"
              placeholder="Telephone"
              {...form.getInputProps("Telephone")}
            />
          </div>

          <div className="py-4">
            <h1 className="text-xl lg:text-2xl font-bold ">Address Details</h1>

            <p className="text-gray-500  lg:text-lg text-sm py-1">
              Please enter your address details below.
            </p>
            <div className="">
              <div className="">
                <div class=" py-3">
                  <TextInput
                    withAsterisk
                    label="Street Address1"
                    placeholder="StreetAddress1"
                    {...form.getInputProps("StreetAddress1")}
                  />
                </div>
                <div class=" py-3">
                  <TextInput
                    withAsterisk
                    label="Street Address2"
                    placeholder="StreetAddress2"
                    {...form.getInputProps("StreetAddress2")}
                  />
                </div>
                <div class=" py-3">
                  <TextInput
                    label="City"
                    required
                    withAsterisk
                    name="city"
                    {...form.getInputProps("city")}
                    placeholder="Enter a City"
                  />
                </div>
                <CountryCity
                  setSelectedState={setSelectedState}
                  setSelectedCity={setSelectedCity}
                  setSelectedCoutry={setSelectedCoutry}
                  form={form}
                />
                <div class=" py-4">
                  <TextInput
                    withAsterisk
                    label="PostCode"
                    placeholder="Enter a Postcode"
                    {...form.getInputProps("Postcode")}
                  />
                </div>
              </div>
            </div>
          </div>
          <Divider className="" />
          <div className="py-6">
            <h1 className="text-xl lg:text-2xl font-bold ">Payment details</h1>

            <p className="text-gray-500  lg:text-lg text-sm py-1">
              How would you like to get paid?
            </p>
            <div className="">
              <div className="">
                <Radio.Group
                  defaultValue="Paypal"
                  onChange={setPaymentDetails}
                  withAsterisk
                >
                  <Group mt="xs">
                    <label
                      className={` ${PaymentDetails === "BankTransfer"
                        ? "border-2 border-blue-500"
                        : ""
                        } flex items-center gap-4 border rounded-xl px-8 py-7`}
                    >
                      <Radio value="BankTransfer" label="Bank Transfer" />
                    </label>
                    <label
                      className={`${PaymentDetails === "Paypal"
                        ? "border-2 border-blue-500"
                        : ""
                        } flex items-center gap-4 border rounded-xl px-8 py-6`}
                    >
                      <Radio value="Paypal" />
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
                <h1 className="text-xl lg:text-2xl font-bold ">
                  Paypal Email *
                </h1>
                <div class=" py-3">
                  <TextInput
                    type="email"
                    withAsterisk
                    label="Need for revice your payment"
                    placeholder="Paypal Email"
                    {...form.getInputProps("Paypalemail")}
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
                    <label className="w-full flex text-xl lg:text-2xl font-bold mb-2">
                      Account number<span className="text-[#E52D3B]">*</span>
                    </label>
                    <TextInput
                      {...form.getInputProps("accountNumber")}
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
                    <label className="w-full flex text-xl lg:text-2xl font-bold mb-2">
                      Sort code<span className="text-[#E52D3B]">*</span>
                    </label>
                    <div className="flex items-center">
                      <div className=" w-full lg:w-3/12">
                        <TextInput
                          {...form.getInputProps("sortCode1")}
                          type="text"
                          maxLength={2}
                          autoComplete="off"
                          title="Sort code digits 1 & 2"
                          className="h-[67px] rounded-3xl lg:rounded-xl w-full lg:pl-6 pl-1 km_ignore"
                          name="customer_paymentinfo_bank_sort1"
                          id="customer_paymentinfo_bank_sort1"
                          defaultValue=""
                        />
                      </div>
                      <div className="lg:px-4 px-1 -mt-3">-</div>
                      <div className=" w-full lg:w-3/12">
                        <TextInput
                          {...form.getInputProps("sortCode2")}
                          type="text"
                          autoComplete="off"
                          title="Sort code digits 3 & 4"
                          maxLength={2}
                          className="h-[67px]  rounded-3xl lg:rounded-xl w-full lg:pl-6 pl-1 km_ignore"
                          name="customer_paymentinfo_bank_sort2"
                          id="customer_paymentinfo_bank_sort2"
                          defaultValue=""
                        />
                      </div>
                      <div className="lg:px-4 px-1  -mt-3">-</div>
                      <div className=" w-full lg:w-3/12">
                        <TextInput
                          {...form.getInputProps("sortCode3")}
                          type="text"
                          autoComplete="off"
                          title="Sort code digits 5 & 6"
                          maxLength={2}
                          className="h-[67px]  rounded-3xl lg:rounded-xl w-full lg:pl-6 pl-1 km_ignore"
                          name="customer_paymentinfo_bank_sort3"
                          id="customer_paymentinfo_bank_sort3"
                          defaultValue=""
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="rounded-xl bg-[#F8F8FE] p-4 text-sm text-blue-500 text-center mt-4">
                  We'll pay directly to your account the{" "}
                  <strong className="font-bold">same day</strong> we Accept your
                  LEGO®.
                </div>
              </div>
            )}
          </div>

          <div className="">
            <hr class="my-16"></hr>
            <div>
              <h3 className="h3 text-xl lg:text-2xl font-bold mb-6">
                Password
              </h3>
              <p className="mb-6  lg:text-lg text-sm">
                Choose a secure password - a combination of letters, numbers and
                special characters is usually best.
              </p>
              <div className="mb-6">
                <label className="w-full flex font-bold text-sm mb-2">
                  Password<span className="text-[#E52D3B]">*</span>
                </label>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="password"
                  className="py-4 px-6 border rounded-xl w-full"
                  // {...form.getInputProps("password")}
                  type="password"
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
                    Repeat Password Must Be Some
                  </p>
                )}
              </div>
              <PasswordStrengthMeter password={password} />
            </div>
            <hr class="my-16"></hr>
            <div>
              <h3 className="h3 text-xl lg:text-3xl font-bold mb-6">
                Marketing preferences
              </h3>

              <div className="mb-4">
                <label className="flex lg:text-lg text-sm items-center gap-2">
                  <Checkbox
                    onChange={(e) =>
                      setMarketingpreferences(e.currentTarget.checked)
                    }
                  />
                  Please send me exclusive voucher codes and latest news by
                  email
                </label>
              </div>
              <div>
                <label className="flex  lg:text-lg text-sm items-center gap-2">
                  {/* <input type="checkbox" className="mr-3" defaultValue={1} />I */}
                  <Checkbox
                    onChange={(e) => setIsTerm(e.target.checked)}
                  // {...form.getInputProps("TermsCheck")}
                  />
                  agree to the
                  <Link
                    to={"/terms-and-conditions/"}
                    title="Terms and Conditions"
                    target="_blank"
                    className="text-blue-500 font-bold"
                  >
                    {" "}
                    terms and conditions{" "}
                  </Link>
                </label>
              </div>
              <div className="max-w-xl mx-auto text-center mt-14">
                <button
                  disabled={!isTerm || password !== repeatpassword}
                  type="submit"
                  className={`${!isTerm || password !== repeatpassword
                    ? "cursor-not-allowed bg-gray-300"
                    : "bg-blue-500"
                    } text-white  rounded-xl h-[60px] lg:h-[80px] w-full flex items-center justify-center font-bold text-lg`}
                >
                  Register
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SignUpForm;
