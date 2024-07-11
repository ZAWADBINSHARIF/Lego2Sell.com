import React from "react"

const Footer = ({rounded, width}) => {
  return (
      rounded ? (
        <div className="flex mt-auto w-full items-end justify-center" style={{
          // background: "red",
          height: "100px",
          backgroundImage: "url(/Images/footerBorder.png)",
          backgroundRepeat: "no-repeat",
          backgroundSize: "initial",
          backgroundPosition: "bottom",
          
        }}>
          <div className="text-[10px] lg:text-[12px] text-white lg:text-start text-center  px-6"
          style={{
            // textWrap: "nowrap",
          }}
          >
            LEGO® is a trademark of the LEGO® Group of companies which does not
            sponsor, authorize or endorse this site
          </div>
        </div>
      ) : (

        <div className="flex mt-auto w-full items-end justify-center" style={{
          background: "#4AB6FF",
        }}>
        <div className="py-2 text-[10px] lg:text-[12px] text-white lg:text-start text-center  px-6">
        LEGO® is a trademark of the LEGO® Group of companies which does not
        sponsor, authorize or endorse this site
        </div>
        </div>
      )
      )
}

export default Footer
