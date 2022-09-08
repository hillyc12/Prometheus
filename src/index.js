const express = require("express");
const app = express();
const port = "3030";
const client = require("prom-client");

let register = new client.Registry();
let rndNum = 9;
let rndHotel = Math.floor(Math.random() * 10);
let rndDestination = Math.floor(Math.random() * 10);

const attemptCounter = new client.Counter({
  name: "attempt_count",
  help: "Number of Attemtps",
  labelNames: ["Hotel", "Destinations"],
});

const successCounter = new client.Counter({
  name: "success_count",
  help: "Number of Successes",
  labelNames: ["Hotel", "Destinations"],
});

register.registerMetric(attemptCounter);
register.registerMetric(successCounter);
register.setDefaultLabels({
  app: "travel-api",
});

client.collectDefaultMetrics({ register });
const hotel = [
  "Best Western",
  "Quality Inn",
  "Ramada",
  "Hilton",
  "Marriot",
  "Economy Inn",
  "Budget Inn",
  "Howard Johnson",
  "Red Roof Inn",
  "Holiday Inn",
];

const destinations = [
  "Mount Rushmore",
  "Boston",
  "Washington DC",
  "Kennedy Space Center",
  "Chicago",
  "New Orleans",
  "Orlando",
  "Los Angeles",
  "Las Vegas",
  "Niagara Falls",
];

setInterval(() => {
  rndNum = Math.floor(Math.random() * 4) + 1;
  setTimeout(() => {}, rndNum * 10000);

  console.log(`${hotel[rndHotel]}  -- ${destinations[rndDestination]}`);
  rndHotel = Math.floor(Math.random() * 10);
  rndDestination = Math.floor(Math.random() * 10);
  attemptCounter.inc({
    Hotel: hotel[rndHotel],
    Destinations: destinations[rndDestination],
  });
  if (rndNum < 3) {
    console.log("Success");
    successCounter.inc({
      Hotel: hotel[rndHotel],
      Destinations: destinations[rndDestination],
    });
  }
  console.log(rndNum);
}, 9 * 1000);

app.get("/metrics", async (req, res) => {
  //   console.log(JSON.stringify(await register.getMetricsAsJSON(), null, 2));
  res.setHeader("Content-type", register.contentType);
  res.end(await register.metrics());
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
