// Inizializza il contesto di gioco
kaplay();

// Imposta la gravità
setGravity(1200);

// Carica le risorse
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

// Aggiungi una variabile per tenere traccia se il gioco è finito
let gameOver = false;

// Aggiunge il giocatore
const flappy = add([
    sprite("flappy"),
    pos(80, 100),
    area(),
    body(),
    scale(1),
]);

// Controlli del giocatore
onKeyPress("space", () => {
    if (!gameOver) {
        play("salto");
        flappy.jump(400);
    }
});

// Generazione degli ostacoli
function spawnostacolo() {
    if (gameOver) return; // Non generare ostacoli se il gioco è finito

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

// Gestione delle collisioni
function showGameOver() {
    // Cambia lo sprite di Flappy
    flappy.use(sprite("flappy_perso"));

    // Aggiungi un overlay semitrasparente
    add([
        rect(width(), height()), // Rettangolo che copre tutto lo schermo
        pos(0, 0),
        color(0, 0, 0, 0.5), // Nero trasparente
        fixed(),
    ]);

    // Mostra il testo di "Game Over"
    add([
        text("Game Over", { size: 40 }),
        pos(center().x, center().y),
        anchor("center"), // Centra il testo rispetto alla posizione
        fixed(),
    ]);

    // Ferma gli ostacoli esistenti
    get("ostacolo").forEach((o) => {
        o.unuse("move"); // Rimuove il comportamento di movimento
    });

    // Imposta il flag `gameOver` a true per fermare gli ostacoli e i controlli
    gameOver = true;

    // Aspetta che l'utente prema un tasto per ricominciare
    onKeyPress(() => {
        gameOver = false; // Resetta il flag
        go("game"); // Ricarica la scena del gioco
    });
}

// Modifica la gestione delle collisioni per usare il nuovo Game Over
flappy.onCollide("ostacolo", () => {
    if (!gameOver) {
        flappy.use(sprite("flappy_perso")); // Cambia sprite
        wait(0.1, () => showGameOver()); // Mostra il Game Over dopo 0.3 secondi
    }
});

// Avvia il gioco
scene("game", () => {
    go("game");
});
