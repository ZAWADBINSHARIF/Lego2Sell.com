import React from "react"
import zxcvbn from "zxcvbn"

const PasswordStrengthMeter = ({ password }) => {
  const testResult = zxcvbn(password)
  const num = (testResult.score * 100) / 4

  const createPassLabel = () => {
    switch (testResult.score) {
      case 0:
        return "Very weak"
      case 1:
        return "Weak"
      case 2:
        return "Fare"
      case 3:
        return "Good"
      case 4:
        return "Very strong password"
      default:
        return ""
    }
  }

  const funcProgressColor = () => {
    switch (testResult.score) {
      case 0:
        return "#828282"
      case 1:
        return "#EA1111"
      case 2:
        return "#FFAD00"
      case 3:
        return "#9bc158"
      case 4:
        return "#00b500"
      default:
        return "none"
    }
  }

  const changePasswordColor = () => ({
    width: `${num}%`,
    background: funcProgressColor(),
    height: "7px",
  })

  return (
    <>
      <div className="progress py-3" style={{ height: "7px" }}>
        <div
          className="progress-bar rounded-full"
          style={changePasswordColor()}
        ></div>
      </div>
      <p style={{ color: funcProgressColor() }}>{createPassLabel()}</p>
    </>
  )
}

export default PasswordStrengthMeter
