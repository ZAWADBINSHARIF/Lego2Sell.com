import React from "react"
import { Link } from "react-router-dom"
import { Helmet } from 'react-helmet'

const Acceptance = () => {
  return (
    <div>
      <Helmet>
        <title>Do you want to sell your LEGO® with us? Follow acceptance guidelines</title>
        <meta
          name="description"
          content="Ready to sell your LEGO® collection? Look no further! Our platform offers a hassle-free experience for selling your LEGO® bricks. Follow our acceptance guidelines"
        />
        
        <meta name="keywords" content="LEGO® Sell, sell lego sets,custom lego sets for sale,best place to sell legos,how to sell legos,sell lego"/>

      </Helmet>
      <div className="w-full px-6 lg:px-44 py-12 lg:py-24">
        <h1 className="text-5xl h1 font-bold mb-8">Acceptance Guidelines</h1>
        <div className="">
          <div>
            <div className="text-base lg:text-lg text-black font-medium">
              <p>
                <img
                  className="rounded-2xl w-full object-cover h-[296px]"
                  src="/Images/Appceptance.jpeg"
                  alt="Acceptance Guidelines | Sell Your New LEGO"
                />
              </p>
              <p className="py-4 mt-6">
                If you’re thinking of <a href="https://www.lego2sell.com/">selling your LEGO<span
                          
                          style={{
                            fontSize: ".6rem",
                            position: 'absolute',
                            // marginLeft: -1
                          
                          }}

                          >
                            ®
                            </span>&nbsp;</a> to us, read our
                acceptance guidelines first. This will help you know what to
                send and what to keep.
              </p>
              <p className="py-4">
                Here’s a breakdown of what we accept, don’t accept, and do with
                your LEGO® when we can’t accept them.
              </p>
              <div className="green-box py-8  text-sm lg:text-lg  bg-green-100 my-12 rounded-3xl px-12">
                <h2 className="text-black py-4 font-bold">
                  LEGO® we <span className="text-green-500">can</span> accept
                </h2>
                <div className="flex py-2">
                  ✅
                  <div className="ml-4">
                    <p>We accept LEGO®, Technic, Bionicle and DUPLO.</p>
                  </div>
                </div>
                <div className="flex py-2">
                  ✅
                  <div className="ml-4">
                    <p>LEGO® that’s a brand new sealed complete set.</p>
                  </div>
                </div>

                <div className="flex py-2">
                  ✅
                  <div className="ml-4">
                    <p>
                      LEGO® that’s new sealed and the box is in mint or very
                      good condition, (
                      <Link
                        to={"/Conditions"}
                        className="text-blue-500 text-sm lg:text-lg font-semibold"
                      >
                        see our condition guide
                      </Link>
                      ).
                    </p>
                  </div>
                </div>
                <div className="flex py-2">
                  ✅
                  <div className="ml-4">
                    <p>LEGO® that is 100% Genuine and found in our search.</p>
                  </div>
                </div>
              </div>
              <div className="red-box py-8 px-12 mb-8 rounded-3xl bg-red-100">
                <h3 className="text-black py-4 font-bold">
                  LEGO® we <span className="text-red-500">can't</span> accept
                </h3>

                <div className="flex py-2">
                  ⛔️
                  <div className="ml-4">
                    <p>LEGO® that is damaged and not new sealed.</p>
                  </div>
                </div>
                <div className="flex py-2">
                  ⛔️
                  <div className="ml-4">
                    <p>We do not accept Mega Blocks, Knex, Kre-O etc.</p>
                  </div>
                </div>
              </div>
              <h3
                className="text-black text-lg py-2 font-bold"
                id="howdoyoucheckmylego"
              >
                How do you check my LEGO®?
              </h3>
              <p className="py-2">
                All LEGO® is checked by our quality control team. And is checked
                that it complies with our condition guidelines, stated above.
              </p>
              <h3
                className="text-black text-lg py-2 font-bold"
                id="whathappensifyoudontacceptmylego"
              >
                What happens if you don’t accept my LEGO®?
              </h3>
              <p className="py-2">
                If we find any LEGO® that doesn’t meet <a href="https://www.bricklink.com/">acceptance guidelines</a> 
                guidelines, we’ll email you to let you know. You can choose
                whether you would like us to dispose of your LEGO® on your
                behalf, or we can send it back to you. However, you will need to
                cover the postage cost for this which will be in the email.
              </p>
              <div className="purple-box bg-purple-100 px-12 py-6 rounded-3xl mt-8">
                <h6 className="text-green-500 py-2">TOP TIP</h6>
                <p className="py-2">
                  If you have any doubts about the condition of your LEGO®, give
                  it a quick check before you send them in to avoid any
                  disappointment. Pack your sets well to stop any damage in
                  transit and minimise the risk of any going missing, as we
                  can’t pay you for missing items. Take a look at our
                  <a
                    className="pl-1 text-green-500"
                    href="/packaging-guidelines"
                  >
                    Packaging Guidelines
                  </a>{" "}
                  for more information on packing your LEGO®.
                </p>
              </div>
              <h3
                className="text-black text-lg py-4 mt-6 font-bold"
                id="stillneedanswers"
              >
                Still need answers?
              </h3>
              <p>
                Head over to our FAQs page to see if we’ve answered any of your
                questions there. Alternatively, get in touch with us by emailing
                <span className=" pl-1 text-blue-500">
                  <Link to={"mailto:support@lego2sell.com"}>
                    support@lego2sell.com.
                  </Link>
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Acceptance
