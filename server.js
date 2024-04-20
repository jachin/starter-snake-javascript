import express from "express";

export default function runServer(handlers) {
  const app = express();
  app.use(express.json());

  app.get("/", (req, res) => {
    res.send({
      apiversion: "1",
      author: "jachin",
      color: "#888888", // Example color
      head: "default", // Example head
      tail: "default", // Example tail
      version: "0.0.1-beta",
      name: "Jachin's Snake", // Set your snake's name here
    });
  });

  app.post("/start", (req, res) => {
    handlers.start(req.body);
    res.send("ok");
  });

  app.post("/move", (req, res) => {
    const gameData = req.body;

    const mySnakeHead = gameData.you.head;
    const food = gameData.board.food;

    // A simple method to calculate the distance between two points.
    const calculateDistance = (point1, point2) => {
      return Math.abs(point1.x - point2.x) + Math.abs(point1.y - point2.y);
    };

    // Find the closest food
    let closestFood = food[0];
    let shortestDistance = calculateDistance(mySnakeHead, closestFood);

    food.forEach((f) => {
      const distance = calculateDistance(mySnakeHead, f);
      if (distance < shortestDistance) {
        shortestDistance = distance;
        closestFood = f;
      }
    });

    // Determine direction to move based on the position of the closest food
    let direction = "up"; // Default direction
    if (mySnakeHead.x < closestFood.x) {
      direction = "right";
    } else if (mySnakeHead.x > closestFood.x) {
      direction = "left";
    } else if (mySnakeHead.y < closestFood.y) {
      direction = "up";
    } else if (mySnakeHead.y > closestFood.y) {
      direction = "down";
    }

    res.send({ move: direction });
  });

  app.post("/end", (req, res) => {
    handlers.end(req.body);
    res.send("ok");
  });

  app.use(function (req, res, next) {
    res.set("Server", "battlesnake/github/starter-snake-javascript");
    next();
  });

  const host = "0.0.0.0";
  const port = process.env.PORT || 8000;

  app.listen(port, host, () => {
    console.log(`Running Battlesnake at http://${host}:${port}...`);
  });
}
