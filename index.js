const axios = require('axios')
require('dotenv').config()

const API_KEY = process.env.API_KEY

const data = JSON.stringify({
  query: `{
    viewer {
        homes { 
        currentSubscription {
          priceInfo {
            today {
              total
              startsAt
            }
          } 
        }
      }
    }
  }`,
  variables: {}
})

const config = {
  method: 'post',
  url: 'https://api.tibber.com/v1-beta/gql',
  headers: {
    Authorization: 'Bearer ' + API_KEY,
    'Content-Type': 'application/json'
  },
  data: data
}

async function getCurrentPrice () {
  const response = await axios(config)
  let prices = []
  if (response.status < 300) {
    prices = response.data.data.viewer.homes[0].currentSubscription.priceInfo.today
    // console.log(JSON.parse(response.data))
  } else {
    console.log(response)
  }
  const currentTS = new Date()
  for (const price of prices) {
    const ts = new Date(price.startsAt)
    if (ts - currentTS > -3600 * 1000) {
      return price.total
    }
  }
}
(async () => {
  try {
    const price = await getCurrentPrice()
    console.log('Current Price [SEK]: ' + price)
    let garoConf
    if (price < process.env.PRICE_LIMIT) {
      garoConf = {
        method: 'post',
        url: 'http://' + process.env.GARO_IP + ':8080/servlet/rest/chargebox/mode/ALWAYS_ON'
      }
      console.log('Loading possible')
    } else {
      garoConf = {
        method: 'post',
        url: 'http://' + process.env.GARO_IP + ':8080/servlet/rest/chargebox/mode/ALWAYS_OFF'
      }
      console.log('Loading disabled')
    }
    const response = await axios(garoConf)
    if (response.status !== 200) {
      console.log(response.statusText)
    }
  } catch (e) {
    console.log(e)
  }
})()
