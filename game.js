(() => {

    const GRAVITY = 0.6;
    const JUMP_VELOCITY = -12;
    const MAX_OBSTACLES_VISIBLE = 10;
    const SPEED = 3;

    const canvas = document.querySelector('canvas');
    const context = canvas.getContext('2d');

    const CANVAS_WIDTH = canvas.width / 2;
    const CANVAS_HEIGHT = canvas.height / 2;

    let time = 0;
    let points = 0;
    let gameover = false;

    let obstacles = [];

    const player = {
        'height': 50,
        'options': {'fillStyle': '#0f0'},
        'velocity': 0,
        'width': 25,
        'x': 50,
        'y': CANVAS_HEIGHT - 50
    };

    const testForCollisions = (player, obstacles) => obstacles.filter(obstacle =>
        player.x + player.width >= obstacle.x && player.x <= obstacle.x + obstacle.width &&
            player.y + player.height >= obstacle.y && player.y <= obstacle.y + obstacle.height
    );

    const draw = () => {

        context.clearRect(0, 0, canvas.width, canvas.height);

        context.save();

        context.scale(2, 2);

        if (gameover) {

            context.fillText('you lose', 200, 200);

        } else {

            obstacles.forEach(obstacle => {

                obstacle.x -= SPEED;

                context.save();

                context.fillStyle = '#f00';

                context.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);

                context.restore();

            });

            if (player.velocity) {

                player.velocity += GRAVITY;

                player.y += player.velocity;

                if (player.y > CANVAS_HEIGHT - player.height) {

                    player.velocity = 0;

                    player.y = CANVAS_HEIGHT - player.height;

                }

            }

            context.save();

            context.fillStyle = player.options.fillStyle;

            context.fillRect(player.x, player.y, player.width, player.height);

            context.restore();

            gameover = Boolean(testForCollisions(player, obstacles).length);

            time += 1;

            requestAnimationFrame(draw);

        }

        context.fillText(points, 0, 10);
        context.fillText(time, 0, 40);

        context.restore();

    };

    requestAnimationFrame(draw);

    const manageObstacles = () => {

        setTimeout(manageObstacles, Math.floor(Math.random() * 500) + 1000);

        if (obstacles.length < MAX_OBSTACLES_VISIBLE) {

            obstacles.push({
                'height': 25,
                'width': 25,
                'x': CANVAS_WIDTH,
                'y': CANVAS_HEIGHT - 25
            });

        }

        const previewLength = obstacles.length;

        obstacles = obstacles.filter(obstacle => obstacle.x > 0);

        points += previewLength - obstacles.length;

    };

    manageObstacles();

    document.addEventListener('keydown', e => {

        if (e.keyCode === 32) {

            if (!gameover && player.velocity === 0) {

                player.velocity = JUMP_VELOCITY;

            } else if (gameover) {

                time = 0;
                points = 0;
                gameover = false;

                obstacles = [];

                requestAnimationFrame(draw);

            }

        }

    });

})();
