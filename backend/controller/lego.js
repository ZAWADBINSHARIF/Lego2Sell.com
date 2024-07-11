const api = require("bricklink-api")
const Client = api.Client,
  ItemType = api.ItemType,
  PriceGuide = api.PriceGuide,
  Condition = api.Condition

const bricklink = new Client({
  consumer_key: "8903791B4A194504912E042779B62EBB",
  consumer_secret: "404F67D58F0B4F3C8073862A6C5488B8",
  token: "2A16C878341743888F3114FFCEF67198",
  token_secret: "10811F32F0A6493CB7A30CEA45592C89",
})

exports.findLego = async (req, res) => {
  const { itemCode } = req.body

  const code = `${itemCode}-1`

  try {
    await bricklink
      .getCatalogItem(ItemType.Set, code)
      .then((part) => {
        res.json({ message: "SUCCESS", body: part })
      })
      .catch((err) => {
        console.log(err)
        res.json({ message: "ERROR", body: err.message })
      })
  } catch (err) {
    console.log(err.message)
  }
}

function getLowestUnitPrice(priceData) {
  let lowestPrice = Infinity

  for (let i = 0; i < priceData.length; i++) {
    const price = parseFloat(priceData[i].unit_price)
    if (price < lowestPrice) {
      lowestPrice = price
    }
  }

  return lowestPrice
}

exports.calculatePrice = async (req, res) => {
  const { itemCode } = req.body

  const code = `${itemCode}-1`
  try {
    const req = PriceGuide.get(ItemType.Set, code, {
      new_or_used: Condition.New,
      country_code: "UK",
    })
    await bricklink
      .send(req)
      .then((price) => {
        const filteredPrice = price.price_detail

        // Calculate the lowest price
        const lowestPrice = Math.min(
          ...filteredPrice.map((item) => item.unit_price)
        )

        // Calculate the average price
        const averagePrice =
          (lowestPrice + lowestPrice * 0.48 + lowestPrice * 0.38) / 3

        const data = {
          price,
          lowestPrice,
          price52: lowestPrice * 0.48,
          price62: lowestPrice * 0.38,
          averagePrice,
        }

        res.json({ message: "SUCCESS", body: data })
      })
      .catch((err) => {
        console.log(err)
        res.json({ message: "ERROR", body: err.message })
      })
  } catch (err) {
    console.log(err)
  }
}
