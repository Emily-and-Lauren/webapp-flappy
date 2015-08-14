// the Game object used by the phaser.io library
var stateActions = {preload: preload, create: create, update: update};

// Phaser parameters:
// - game width
// - game height
// - renderer (go for Phaser.AUTO)
// - element where the game will be drawn ('game')
// - actions on the game state (or null for nothing)
var game = new Phaser.Game(750, 400, Phaser.AUTO, 'game', stateActions);
var score = -1;
var labelScore;
var player;
var pipes = [];
var powerup = [];
var powerdown = [];
/*
 * Loads all resources for the game and gives them names.
 */
jQuery("#greeting-form").on("submit", function (event_details) {
    var greeting = "Your score is";
    var name = jQuery("#fullName").val();
    var email = jQuery("#email").val();
    var score = jQuery("#score").val();
    var greeting_message = greeting + score;
    $("#greeting-form").hide();
    jQuery("#greeting").append("<p>" + greeting_message + "</p>");

});

function preload() {
    game.load.image("playerImg", "../assets/Mike.png");
    game.load.audio("score", "../assets/point.ogg");
    game.load.image("pipe", "../assets/speaker.png");
    game.load.image("sprite", "../assets/5sos.png");
    game.load.image("backgroundImg", "../assets/Stage.png");
    game.load.image("powerup", "../assets/pizza.png");
    game.load.image("powerdown", "../assets/weight.png");
}

/*
 * Initialises the game. This function is only called once.
 */
function playerJump() {
    player.body.velocity.y = -255;

}
function create() {
    game.add.image(0, 0, "backgroundImg");
    game.add.text(20, 20, "#Jumping5sos", {font: "20px Arial", fill: "#ffffff"});
    game.add.sprite(610, 350, "sprite");
    game.input
        .keyboard.addKey(Phaser.Keyboard.SPACEBAR)
        .onDown.add(spaceHandler);
    labelScore = game.add.text(20, 350, "0");
    player = game.add.sprite(400, 200, "playerImg");
    player.anchor.setTo(0.5, 0.5);
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.physics.arcade.enable(player);
    player.body.gravity.y = 600;
    game.input.keyboard
        .addKey(Phaser.Keyboard.SPACEBAR)
        .onDown.add(playerJump);
    pipeInterval = 1.25;
    game.time.events
        .loop(pipeInterval * Phaser.Timer.SECOND, generate);

}

function spaceHandler() {
    game.sound.play("score");
}

function changeScore() {
    score = score + 1;
    labelScore.setText(score.toString());
}

function generatePipe() {
    for (var count = 0; count < 8; count++) {
        var gapStart = game.rnd.integerInRange(1, 6);
        for (var count = 0; count < 8; count = count + 1)
            if (count != gapStart && count != gapStart + 1 && count != gapStart + 2) {
                addPipeBlock(790, count * 50);
            }
        changeScore();

    }

}

function update() {
    game.physics.arcade
        .overlap(player, pipes, gameOver);
    if (player.y > 500) {
        gameOver();
    }
    player.rotation = Math.atan(player.body.velocity.y / 2000);
    game.physics.arcade
        .overlap(player,powerdown,gameOver);

}

function gameOver() {
    game.destroy();
    // game.state.restart();
    $("#score").val(score.toString());
    // $("#greeting").hide();
    $("#greeting").show();
    gameGravity = 200;
}


$.get("/score", function (scores) {
    scores.sort(function (scoreA, scoreB) {
        var difference = scoreB.score - scoreA.score;
        return difference;
    })
    for (var i = 0; i < scores.length; i++) {
        $("#scoreBoard").append(
            "<li>" +
            scores[i].name + ": " + scores[i].score +
            "</li>");
    }
});
function changeGravity(g) {
    gameGravity += g;
    player.body.gravity.y = gameGravity;
}
function generatepowerup() {
    var bonus = game.add.sprite(700, 400, "powerup");
    powerup.push(bonus);
    game.physics.arcade.enable(bonus);
    bonus.body.velocity.x = -200;
    bonus.body.velocity.y = -game.rnd.integerInRange(60, 100);
}
function generatepowerdown() {
    var bonus = game.add.sprite(0, 0, "powerdown");
    powerdown.push(bonus);
    game.physics.arcade.enable(bonus);
    bonus.body.velocity.x = 200;
    bonus.body.velocity.y = game.rnd.integerInRange(60, 100);
}

function addPipeBlock(x, y) {
    var pipeBlock = game.add.sprite(x, y, "pipe");
    pipes.push(pipeBlock);
    game.physics.arcade.enable(pipeBlock);
    pipeBlock.body.velocity.x = -200;

}


function generate() {
    var diceRoll = game.rnd.integerInRange(1, 10);
    if (diceRoll == 1) {
        generatepowerup();
    } else if (diceRoll == 2) {
        generatepowerdown();
    } else {
        generatePipe();
    }
}


