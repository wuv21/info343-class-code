/* script file for the Canvas demo */

document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    var canvas = document.getElementById('game-canvas');
    var ctx = canvas.getContext('2d');

    // current game state
    var gameState;

    // create a new game state object
    function newGameState() {
        return {
            ball: {
                left: Math.random() * canvas.width,
                top: Math.random() * canvas.height,
                width: 30,
                height: 30,
                vectorX: 1,
                vectorY: 1,
                velocity: 10
            },
            paddle: {
                left: 20,
                top: 0,
                width: 10,
                height: canvas.height / 6
            },
            lastTimestamp: performance.now()
        };
    } //newgameState()


    // render current game state to canvas element
    function render() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        var ball = gameState.ball;
        ctx.beginPath();
        ctx.arc(ball.left + ball.width / 2,
                ball.top + ball.height / 2,
                ball.width / 2, 0, 2*Math.PI);
        ctx.fill();

        var paddle = gameState.paddle;
        ctx.fillRect(paddle.left, paddle.top, paddle.width, paddle.height);

    }

    // advance animation by one step
    function step() {
        var ball = gameState.ball;
        var paddle = gameState.paddle;
        ball.left += ball.vectorX * ball.velocity;
        ball.top += ball.vectorY * ball.velocity;

        if (ball.left + ball.width >= canvas.width) {
            ball.vectorX = -ball.vectorX;
        }

        if (ball.top <= 0 || ball.top + ball.height >= canvas.height) {
            ball.vectorY = -ball.vectorY;
        }

        if (ball.left <= paddle.left + paddle.width) {
            if (ball.top + ball.height >= paddle.top && ball.top <= paddle.top + paddle.height) {
                ball.vectorX = -ball.vectorX;
            }
            else {
                return false;
            }
        }
        return true;
    }

    // advance the animations and redraw
    function animate(timestamp) {
        var keepGoing = true;
        render();
        if (timestamp - gameState.lastTimestamp > 16) {
            keepGoing = step();
            gameState.lastTimeStamp = timestamp;
        }

        if (keepGoing) {
            requestAnimationFrame(animate);
        } else {
            var msg = 'game over';
            ctx.font = '30px Sans-serif';
            var metrics = ctx.measureText(msg);

            ctx.fillText(msg, (canvas.width-metrics.width) / 2, (canvas.height-20)/2);
        }
    }

    document.addEventListener('mousemove', function(evt) {
        var canvasY = evt.clientY - canvas.offsetTop;
        var paddle = gameState.paddle;
        paddle.top = canvasY - paddle.height / 2;
    });

    gameState = newGameState();

    requestAnimationFrame(animate);
});
