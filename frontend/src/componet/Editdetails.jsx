import {
  Checkbox,
  Divider,
  Group,
  Modal,
  Radio,
  Select,
  TextInput,
} from "@mantine/core"
import { useForm } from "@mantine/form"
import axios from "axios"
import React, { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import CountryCity from "./Country"
import baseUrl from "../context/baseUrl"

const Editdetails = ({ close, setSidebarActive, opened, data }) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [repeatpassword, setRepeatpassword] = useState()
  const navigation = useNavigate()
  const location = useLocation()
  const [PaymentDetails, setPaymentDetails] = useState("Paypal")
  const [searchValue, onSearchChange] = useState("")
  const [selectedCoutry, setSelectedCoutry] = useState("")
  const [selectedCity, setSelectedCity] = useState("")
  const [selectedState, setSelectedState] = useState("")
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
      State: selectedState,
      Country: selectedCoutry,
      Paypalemail: "",
      accountNumber: "",
      sortCode1: "",
      sortCode2: "",
      sortCode3: "",
      TermsCheck: "",
      Marketingpreferences: "",
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
  })

  const storedUserId = localStorage.getItem("userId")
  const handleSubmit = async (values) => {
    try {
      const token = localStorage.getItem("token");

      const response3 = await axios.put(
        `${baseUrl}/update-email/${storedUserId}`,
        {
          newEmail: form.values.email,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      // console.log("New Email", response3)
      const newToken = response3?.data?.token
      localStorage.setItem("token", newToken)
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
        State: selectedState,
        Country: selectedCoutry,
        Paypalemail: form.values.Paypalemail,
        accountNumber: form.values.accountNumber,
        sortCode1: form.values.sortCode1,
        sortCode2: form.values.sortCode2,
        sortCode3: form.values.sortCode3,
        TermsCheck: form.values.TermsCheck,
        Marketingpreferences: form.values.TermsCheck,
        Postcode: form.values.Postcode,
      }

      const response1 = await axios.post(
        `${baseUrl}/MyDetails/${storedUserId}`,
        payload, {
          headers: { Authorization: `Bearer ${newToken}` },
        }
      )
      // console.log("sdsds", response1.data)
      // Navigate to another route
    } catch (error) {
      console.error("An error occurred:", error)
      // Handle the error as needed
    }
    // window.location.reload()
    setSidebarActive(2)
    // setFormData(values)
    window.scrollTo({ top: 0, behavior: "smooth" })
    // nextStep()
  }

  return (
    <Modal size={"xl"} opened={opened} onClose={close} title="Edit MyDetails">
      <form method="post" onSubmit={form.onSubmit(handleSubmit)}>
        <div className="mt-24 px-6 lg:px-12">
          <h3 className="text-2xl font-bold">My Details</h3>
          <div className="py-3">
            <Select
              {...form.getInputProps("title")}
              withAsterisk
              label="Title"
              placeholder="Pick one"
              searchable
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
              // onChange={(e) => setEmail(e.target.value)}
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
            <h1 className="text-2xl font-bold ">Address Details</h1>

            <p className="text-gray-500 py-1">
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
                <div className="py-3">
                  <CountryCity
                    setSelectedState={setSelectedState}
                    setSelectedCity={setSelectedCity}
                    setSelectedCoutry={setSelectedCoutry}
                    form={form}
                  />
                </div>
                <TextInput
                  defaultValue={data?.Postcode}
                  value={data?.Postcode}
                  withAsterisk
                  label=" postcode"
                  placeholder="Enter a Postcode"
                  {...form.getInputProps("Postcode")}
                />
              </div>
            </div>
          </div>
          <Divider className="" />
          <div className="py-6">
            <h1 className="text-2xl font-bold ">Payment details</h1>

            <p className="text-gray-500 py-1">
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
                      className={` ${
                        PaymentDetails === "BankTransfer"
                          ? "border-2 border-blue-500"
                          : ""
                      } flex items-center gap-4 border rounded-xl px-8 py-7`}
                    >
                      <Radio value="BankTransfer" label="Bank Transfer" />
                    </label>
                    <label
                      className={`${
                        PaymentDetails === "Paypal"
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
                <h1 className="text-2xl font-bold ">Paypal Email *</h1>
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
                  <div className="w-full md:w-1/2 mb-4 md:mb-0">
                    <label className="w-full flex text-2xl font-bold mb-2">
                      Account number
                      <span className="text-[#E52D3B]">*</span>
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
                    <label className="w-full flex text-2xl font-bold mb-2">
                      Sort code<span className="text-[#E52D3B]">*</span>
                    </label>
                    <div className="flex items-center">
                      <div className=" w-full">
                        <TextInput
                          {...form.getInputProps("sortCode1")}
                          type="text"
                          maxLength={2}
                          autoComplete="off"
                          title="Sort code digits 1 & 2"
                          className="h-[67px] rounded-3xl lg:rounded-xl w-full lg:pl-6 pl-1 km_ignore"
                          name="customer_paymentinfo_bank_sort1"
                          id="customer_paymentinfo_bank_sort1"
                        />
                      </div>
                      <div className=" px-1 -mt-3">-</div>
                      <div className=" w-full">
                        <TextInput
                          {...form.getInputProps("sortCode2")}
                          type="text"
                          autoComplete="off"
                          title="Sort code digits 3 & 4"
                          maxLength={2}
                          className="h-[67px]  rounded-3xl lg:rounded-xl w-full lg:pl-6 pl-1 km_ignore"
                          name="customer_paymentinfo_bank_sort2"
                          id="customer_paymentinfo_bank_sort2"
                        />
                      </div>
                      <div className=" px-1  -mt-3">-</div>
                      <div className=" w-full">
                        <TextInput
                          {...form.getInputProps("sortCode3")}
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
                  <strong className="font-bold">same day</strong> we Accept your
                  LEGO®.
                </div>
              </div>
            )}
          </div>
        </div>
        <div class="flex w-full">
          <button
            type="submit"
            className="bg-blue-500 text-white rounded-xl h-[80px] px-16 mx-auto my-8 inline-flex items-center justify-center font-bold text-lg "
          >
            Confirm
          </button>
        </div>
      </form>
    </Modal>
  )
}
export default Editdetails
