
kaplay();

setGravity(1200);

loadSprite("flappy", "https://play.kaplayjs.com/sprites/egg.png");
loadSprite("flappy_perso", "https://play.kaplayjs.com/sprites/egg_crack.png");
loadSprite("ostacolo", "https://play.kaplayjs.com/sprites/cloud.png");
loadSprite("background", "https://i.imgur.com/mmrRkMe.jpeg");
loadSound("salto", "assets/colpo.mp4");

add([
    sprite("background"), 
    pos(-40, -200),              
    fixed()              
]);

let gameOver = false;

const flappy = add([
    sprite("flappy"),
    pos(80, 100),
    area(),
    body(),
    scale(1),
]);

onKeyPress("space", () => {
    if (!gameOver) {
        play("salto");
        flappy.jump(400);
    }
});

function spawnostacolo() {
    if (gameOver) return;

    const y = rand(100, 300);
    add([
        sprite("ostacolo"),
        scale(1.5),
        pos(width(), y),
        area(),
        move(LEFT, 200),
        "ostacolo"
    ]);
    wait(2, spawnostacolo);
}
spawnostacolo();

function showGameOver() {
    flappy.use(sprite("flappy_perso"));

    add([
        rect(width(), height()), // Rettangolo che copre tutto lo schermo
        pos(0, 0),
        color(0, 0, 0, 0.5), // Nero trasparente
        fixed(),
    ]);

    add([
        text("Game Over", { size: 40 }),
        pos(center().x, center().y),
        anchor("center"), 
        fixed(),
    ]);

    get("ostacolo").forEach((o) => {
        o.unuse("move"); 
    });
    gameOver = true;

    onKeyPress(() => {
        gameOver = false; 
        go("game");
    });
}

flappy.onCollide("ostacolo", () => {
    if (!gameOver) {
        flappy.use(sprite("flappy_perso")); // Cambia sprite
        wait(0.1, () => showGameOver());
    }
});

scene("game", () => {
    go("game");
});
