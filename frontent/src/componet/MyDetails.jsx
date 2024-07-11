import { Divider, Group, Modal, Radio, Select, TextInput } from "@mantine/core"
import { useForm } from "@mantine/form"
import { useDisclosure } from "@mantine/hooks"
import axios from "axios"
import React, { useEffect, useState } from "react"
import Editdetails from "./Editdetails"
import baseUrl from "../context/baseUrl"

const MyDetails = ({ setSidebarActive }) => {
  const [searchValue, onSearchChange] = useState("")
  const [PaymentDetails, setPaymentDetails] = useState(null)
  const [data, setData] = useState()
  const storedUserId = localStorage.getItem("userId")
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}/Mydetails/${storedUserId}`
        )
        setData(response.data.Mydetails[0])
      } catch (error) {
        console.error("An error occurred:", error)
        // Handle the error as needed
      }
    }

    fetchData()
  }, [])

  const [firstName, setFirstName] = useState()
  const form = useForm({
    initialValues: {
      email: data?.email,
      paymentMethod: PaymentDetails,
      firstName: data?.firstName,
      lastName: data?.lastName,
      Telephone: data?.Telephone,
      title: data?.title,
      StreetAddress1: data?.StreetAddress1,
      termsOfService: false,
      StreetAddress2: data?.StreetAddress2,
      city: data?.city,
      Country: data?.Country,
      Paypalemail: data?.Paypalemail,
      accountNumber: data?.accountNumber,
      sortCode1: data?.sortCode1,
      sortCode2: data?.sortCode2,
      sortCode3: data?.sortCode3,
      Postcode: data?.Postcode,
    },

    validate: {},
  })

  const [cityData, setCityData] = useState([])

  const country = [...new Set(cityData.map((items) => items.country))]

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://pkgstore.datahub.io/core/world-cities/world-cities_json/data/5b3dd46ad10990bca47b04b4739a02ba/world-cities_json.json"
        )
        const data = await response.json()
        setCityData(data)
      } catch (error) {
        console.error("Error fetching city data:", error)
      }
    }
    setPaymentDetails(data?.paymentMethod)
    fetchData()
  }, [storedUserId, data?.paymentMethod])
  // console.log("demo", firstName)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://pkgstore.datahub.io/core/world-cities/world-cities_json/data/5b3dd46ad10990bca47b04b4739a02ba/world-cities_json.json"
        )
        const data = await response.json()
        setCityData(data)
      } catch (error) {
        console.error("Error fetching city data:", error)
      }
    }

    fetchData()
  }, [])

  // console.log("demo3847837483748", data)
  // const [editmydeails, setEditmydeails] = useState()
  const [opened, { open, close }] = useDisclosure(false)
  return (
    <div className="">
      <div className="py-8 w-full">
        <button
          className="bg-blue-500 text-white rounded-xl h-[55px] lg:h-[80px] px-16 mx-auto  inline-flex items-center justify-center font-bold text-lg "
          onClick={open}
        >
          Edit Details
        </button>
      </div>
      <form>
        <div className="mt-12">
          <h3 className="text-2xl font-bold">My Details</h3>
          <div className="py-3">
            <Select
              autoSave="save"
              value={data?.title}
              defaultValue={data?.title}
              // {...form.getInputProps("title")}
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
              onChange={setFirstName}
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
            <h1 className="text-2xl font-bold ">Address Details</h1>

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
                    defaultValue={data?.city}
                    value={data?.city}
                    withAsterisk
                    label="Town / city"
                    placeholder=" Pick Town / city "
                    searchable
                    data={["demo", "demo"]}
                  />
                </div>
                <div className="py-3">
                  <Select
                    defaultValue={data?.Country}
                    value={data?.Country}
                    withAsterisk
                    label="Country"
                    placeholder="Pick Country"
                    name="Country"
                    searchable
                    searchValue={data?.Country}
                    data={["demo", "demo"]}
                    // data={CountryCitits.map((items) => items.country_name)}
                    // {...form.getInputProps("Country")}
                  />
                </div>

                <TextInput
                  defaultValue={data?.Postcode}
                  value={data?.Postcode}
                  withAsterisk
                  label="Postcode"
                  placeholder="Enter a Postcode"
                  // {...form.getInputProps("Postcode")}
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
                  value={PaymentDetails}
                  defaultValue={PaymentDetails}
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
                    <label className="w-full flex text-2xl font-bold mb-2">
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
                  <strong className="font-bold">same day</strong> we Accept your
                  LEGO®.
                </div>
              </div>
            )}
          </div>
        </div>
      </form>
      <Editdetails
        setSidebarActive={setSidebarActive}
        data={data}
        opened={opened}
        close={close}
      />
    </div>
  )
}

export default MyDetails
