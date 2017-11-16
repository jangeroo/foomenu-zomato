const app = require('express')()
const backend = require('./mock-backend.js')
// const backend = require('./firebase-backend.js')

app.set('port', (process.env.PORT || 5000));

app.listen(app.get('port'), function () {
    console.log('fOOmenu-zomato listening on port', app.get('port'))
})

app.get('/', (req, res) => {
  res.send('Welcome to fOOmato, a stripped-down Zomato API clone.')
})


// ZOMATO RESTAURANT DATA MODEL
// let resto = {
//   "id": "16774318",
//   "name": "Otto Enoteca & Pizzeria",
//   "location": {
//     "latitude": "40.732013",
//     "longitude": "-73.996155"
//   },
//   "cuisines": "Cafe"
// }
app.get('/restaurant', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  let restaurants = backend.getRestaurants()
  let response = []

  if (req.query.res_id) {
    if (!restaurants[req.query.res_id]) {
      response = {
        "code": 404,
        "status": "Not Found",
        "message": "Not Found"
      }
    }
    else {
      response.push(restaurants[req.query.res_id])
    }
  }
  else {
    for (let restoID in restaurants) {
      response.push({
        id: restoID,
        name: restaurants[restoID].name,
        location: restaurants[restoID].location
      })
    }
  }
  res.json(response)
})

app.post('/restaurant', (req, res) => {
  if (!req.body.name || !req.body.latitude || !req.body.longitude) {
    res.json({
      "code": 404,
      "status": "Failed",
      "message": "Missing name, latitude or longitude"
    })
  }
  else {
    let restoID = backend.createRestaurant(req.body.name, req.body.latitude, req.body.longitude)
    let restaurants = backend.getRestaurants()
    res.json(restaurants[restoID])
  }
})

// ZOMATO DAILY MENU DATA MODEL
// {
//   "daily_menu": [
//     {
//       "dishes": [
//         {
//           "dish_id": "104089345",
//           "name": "Tatarák ze sumce s toustem",
//           "price": "149 Kč"
//         }
//       ]
//     }
//   ]
// }
app.get('/dailymenu', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')

  if (!req.query.res_id) res.json({"code": 404, "status": "Failed", "message": "Missing res_id"})
  else {
    let mockMenu = {
      "daily_menu": [
        { "dishes": [] }
      ]
    }

    let numDishes = Math.floor(Math.random() * 3) + 1
    for (let i = 0; i < numDishes; i++) {
      let dish_id = `menuItem_${backend.genUID()}`
      let dish = {
        dish_id,
        name: `burgerName_${dish_id}`,
        price: Math.floor(Math.random() * 1000) / 100
      }
      mockMenu.daily_menu[0].dishes.push(dish)
    }

    res.json(mockMenu)
  }
})