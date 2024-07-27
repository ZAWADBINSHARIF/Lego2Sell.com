import React, { useState } from "react"
import { Stepper, Button, Group } from "@mantine/core"
import DetailsForm from "../componet/DetailsForm"
import Summary from "../componet/Summary"
import { useLocation } from "react-router-dom"
const Details = () => {
  const [formData, setFormData] = useState([])
  const [active, setActive] = useState(0)
  const storedUserId = localStorage.getItem("userId")
  const data = localStorage.getItem("data")
  // console.log(data)
  const location = useLocation()
  const price = localStorage.getItem("Price")
  const productCondition = location.state?.productCondition
  const SearchValue = localStorage.getItem("SearchValue")
  const condition = localStorage.getItem("condition")
  // console.log("condi", productCondition)
  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current))
  return (
    <div className="py-12 flex  items-center justify-center">
      <div className="w-[80%]">
        <Stepper
          active={active}
          mx={{ display: "flex" }}
          onStepClick={setActive}
          breakpoint="sm"
        >
          <Stepper.Step disabled label="" description="">
            <DetailsForm
              storedUserId={storedUserId}
              formData={formData}
              setFormData={setFormData}
              condition={condition}
              price={price}
              data={data}
              setActive={setActive}
            />
          </Stepper.Step>
          <Stepper.Step disabled label="" description="">
            <Summary
              productCondition={productCondition}
              storedUserId={storedUserId}
              formData={formData}
              prevStep={prevStep}
              condition={condition}
              SearchValue={SearchValue}
              price={price}
              data={data}
            />
          </Stepper.Step>
          <Stepper.Step disabled label="" description="">
            Step 3 content: Get full access
          </Stepper.Step>
          <Stepper.Completed>
            Completed, click back button to get to previous step
          </Stepper.Completed>
        </Stepper>
      </div>
    </div>
  )
}

export default Details
