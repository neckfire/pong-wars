// Source palette: https://twitter.com/AlexCristache/status/1738610343499157872
    const colorPalette = {
      ArcticPowder: "#F1F6F4",
      MysticMint: "#D9E8E3",
      Forsythia: "#FFC801",
      DeepSaffron: "#FF9932",
      NocturnalExpedition: "#114C5A",
      OceanicNoir: "#172B36",
    };

    // Idea for Pong wars: https://twitter.com/nicolasdnl/status/1749715070928433161

    const canvas = document.getElementById("pongCanvas");
    const ctx = canvas.getContext("2d");
    const scoreElement = document.getElementById("score");

    const TEAM1 = colorPalette.MysticMint;
    const TEAM1_BALL = colorPalette.NocturnalExpedition;

    const TEAM2 = colorPalette.NocturnalExpedition;
    const TEAM2_BALL = colorPalette.MysticMint;

    const squareSize = 25;
    const numSquaresX = canvas.width / squareSize;
    const numSquaresY = canvas.height / squareSize;
    let squares = [];

    for (let i = 0; i < numSquaresX; i++) {
      squares[i] = [];
      for (let j = 0; j < numSquaresY; j++) {
        squares[i][j] = i < numSquaresX / 2 ? TEAM1 : TEAM2;
      }
    }

    let x1 = canvas.width / 4;
    let y1 = canvas.height / 2;
    let dx1 = 16;
    let dy1 = 16;

    let x2 = (canvas.width / 4) * 3;
    let y2 = canvas.height / 2;
    let dx2 = -16;
    let dy2 = -16;

    function drawBall(x, y, color) {
      ctx.beginPath();
      ctx.arc(x, y, squareSize / 2, 0, Math.PI * 2, false);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.closePath();
    }


document.addEventListener('DOMContentLoaded', function () {
    const rangeInput = document.getElementById('rangeInput');
    const selectedValue = document.getElementById('selectedValue');

    // Initial display of selected value
    selectedValue.textContent = rangeInput.value;

    // Update selected value when the slider is moved
    rangeInput.addEventListener('input', function () {
        selectedValue.textContent = rangeInput.value;

        // Mettez à jour les vitesses des balles avec les nouvelles valeurs du slider
        dx1 = parseFloat(rangeInput.value);
        dy1 = parseFloat(rangeInput.value);
        dx2 = -parseFloat(rangeInput.value);
        dy2 = -parseFloat(rangeInput.value);
    });
});

// Reste du code...


    function drawSquares() {
      for (let i = 0; i < numSquaresX; i++) {
        for (let j = 0; j < numSquaresY; j++) {
          ctx.fillStyle = squares[i][j];
          ctx.fillRect(i * squareSize, j * squareSize, squareSize, squareSize);
        }
      }
    }

    function randomNum(min, max) {
      return Math.random() * (max - min) + min;
    }

    function updateSquareAndBounce(x, y, dx, dy, color) {
      let updatedDx = dx;
      let updatedDy = dy;

      // Check multiple points around the ball's circumference
      for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 4) {
        let checkX = x + Math.cos(angle) * (squareSize / 2);
        let checkY = y + Math.sin(angle) * (squareSize / 2);

        let i = Math.floor(checkX / squareSize);
        let j = Math.floor(checkY / squareSize);

        if (i >= 0 && i < numSquaresX && j >= 0 && j < numSquaresY) {
          if (squares[i][j] !== color) {
            squares[i][j] = color;

            // Determine bounce direction based on the angle
            if (Math.abs(Math.cos(angle)) > Math.abs(Math.sin(angle))) {
              updatedDx = -updatedDx;
            } else {
              updatedDy = -updatedDy;
            }

            updatedDx += randomNum(-0.15, 0.15);
            updatedDy += randomNum(-0.15, 0.15);
          }
        }
      }

      return { dx: updatedDx, dy: updatedDy };
    }

    function updateScoreElement() {
      let team1Score = 0;
      let team2Score = 0;
      for (let i = 0; i < numSquaresX; i++) {
        for (let j = 0; j < numSquaresY; j++) {
          if (squares[i][j] === TEAM1) {
            team1Score++;
          } else if (squares[i][j] === TEAM2) {
            team2Score++;
          }
        }
      }

      scoreElement.textContent = `day ${team1Score} | night ${team2Score}`;
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawSquares();

      drawBall(x1, y1, TEAM1_BALL);
      let bounce1 = updateSquareAndBounce(x1, y1, dx1, dy1, TEAM1);
      dx1 = bounce1.dx;
      dy1 = bounce1.dy;

      drawBall(x2, y2, TEAM2_BALL);
      let bounce2 = updateSquareAndBounce(x2, y2, dx2, dy2, TEAM2);
      dx2 = bounce2.dx;
      dy2 = bounce2.dy;

      updateScoreElement();

      if (
        x1 + dx1 > canvas.width - squareSize / 2 ||
        x1 + dx1 < squareSize / 2
      ) {
        dx1 = -dx1;
      }
      if (
        y1 + dy1 > canvas.height - squareSize / 2 ||
        y1 + dy1 < squareSize / 2
      ) {
        dy1 = -dy1;
      }

      if (
        x2 + dx2 > canvas.width - squareSize / 2 ||
        x2 + dx2 < squareSize / 2
      ) {
        dx2 = -dx2;
      }
      if (
        y2 + dy2 > canvas.height - squareSize / 2 ||
        y2 + dy2 < squareSize / 2
      ) {
        dy2 = -dy2;
      }

      x1 += dx1;
      y1 += dy1;
      x2 += dx2;
      y2 += dy2;

      requestAnimationFrame(draw);
    }

    requestAnimationFrame(draw);