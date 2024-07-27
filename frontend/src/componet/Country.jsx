import { City, Country, State } from "country-state-city"
import React, { useEffect, useState } from "react"
import Selector from "./Selector.jsx"

const CountryCity = ({
  form,
  setSelectedCoutry,
  setSelectedCity,
  setSelectedState,
}) => {
  let countryData = Country.getAllCountries()
  const [stateData, setStateData] = useState()
  const [cityData, setCityData] = useState()

  const [country, setCountry] = useState(countryData[231])
  const [state, setState] = useState()
  const [city, setCity] = useState()
  // console.log(state?.name)
  useEffect(() => {
    setStateData(State.getStatesOfCountry(country?.isoCode))
    setSelectedCoutry(country?.name)

    setSelectedCity(city?.name)
  }, [country])

  useEffect(() => {
    setCityData(City.getCitiesOfState(country?.isoCode, state?.isoCode))
    // setSelectedState(state)
  }, [state])

  useEffect(() => {
    stateData && setState(stateData[0])
  }, [stateData])

  useEffect(() => {
    cityData && setCity(cityData[0])
  }, [cityData])

  return (
    <section className="w-full">
      <div className="w-full">
        <div className="flex w-full flex-col gap-6 rounded-lg">
          <div>
            <p className="font-semibold">Country*</p>
            <Selector
              form={form}
              data={countryData}
              selected={country}
              setSelected={setCountry}
            />
          </div>

          {/* {city && (
            <div>
              <p className=" font-semibold">City*</p>
              <Selector data={cityData} selected={city} setSelected={setCity} />
            </div>
          )} */}
        </div>
      </div>
    </section>
  )
}

export default CountryCity
