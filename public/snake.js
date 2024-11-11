const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const boxSize = 20;
let snake = [{ x: 8 * boxSize, y: 8 * boxSize }];
let direction = "RIGHT";
let food = {
  x: Math.floor((Math.random() * canvas.width) / boxSize) * boxSize,
  y: Math.floor((Math.random() * canvas.height) / boxSize) * boxSize,
};
let score = 0;

document.addEventListener("keydown", changeDirection);

function changeDirection(event) {
  if (event.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  if (event.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
  if (event.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  if (event.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
}

function draw() {
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw the snake
  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i === 0 ? "lightgreen" : "green";
    ctx.fillRect(snake[i].x, snake[i].y, boxSize, boxSize);
    ctx.strokeStyle = "#000";
    ctx.strokeRect(snake[i].x, snake[i].y, boxSize, boxSize);
  }

  // Draw the food
  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, boxSize, boxSize);

  // Move the snake
  let snakeX = snake[0].x;
  let snakeY = snake[0].y;

  if (direction === "UP") snakeY -= boxSize;
  if (direction === "DOWN") snakeY += boxSize;
  if (direction === "LEFT") snakeX -= boxSize;
  if (direction === "RIGHT") snakeX += boxSize;

  // Check for collision with the walls
  if (
    snakeX < 0 ||
    snakeY < 0 ||
    snakeX >= canvas.width ||
    snakeY >= canvas.height
  ) {
    gameOver();
  }

  // Check if snake collides with itself
  for (let i = 1; i < snake.length; i++) {
    if (snakeX === snake[i].x && snakeY === snake[i].y) {
      gameOver();
    }
  }

  // If the snake eats the food
  if (snakeX === food.x && snakeY === food.y) {
    score++;
    food = {
      x: Math.floor((Math.random() * canvas.width) / boxSize) * boxSize,
      y: Math.floor((Math.random() * canvas.height) / boxSize) * boxSize,
    };
  } else {
    snake.pop(); // Remove the last part of the snake to keep it moving
  }

  // Add new head position
  snake.unshift({ x: snakeX, y: snakeY });
}

function gameOver() {
  alert("Game Over! Your Score: " + score);
  saveScore("Player1", score); // Replace "Player1" with dynamic player input if desired
  document.location.reload();
}

async function saveScore(player, score) {
  try {
    const response = await fetch("/api/scores", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ player, score }),
    });

    if (!response.ok) {
      console.error("Failed to save score");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

setInterval(draw, 100);
