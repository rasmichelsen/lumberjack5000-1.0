"use strict";

let stage, hero, damageNumber, levelText, pointsText, timer, timerText, preloadText, q, logoImg, howtoplayImg, chainsawTimer, speedTimer;
let trees = [];
let hpbarbgs = [];
let hpbars = [];
let level = 1;
let points = 0;
let framesSinceLastHit = 0;
//TODO add durability, and repair mechanics, maybe add a "helper" to the nearest tree after some time has happened.
//TODO high score list perhaps

let keys = {
    up: false,
    down: false,
    left: false,
    right: false,
    space: false
};

//game settings.
let settings = {
    speed: 4,
    facing: "left",
    currentDirection: "neutral",
    attackSpeed: 10,
    enemyHP: 10,
    alive: false,
    weapon: "axe"
};

window.addEventListener("load", startPreloader);

function startPreloader() {
    stage = new createjs.Stage("gameCanvas");
    createPreloader();
}

function createPreloader() {
    /*
    const logo = document.createElement("img");
    logo.src = 'graphics/title.png';
    logo.id = "ab";
    logo.style.height = "500px";
    logo.style.width = "600px";
    logo.style.position = "absolute";
    logo.style.top = 0;
    logo.style.left = 0;

    document.body.appendChild(logo);

    var gg = new createjs.DOMElement(logo);
    gg.x = 20;
    gg.y = 20;

    const howtoplay = document.createElement("img");
    howtoplay.src = 'graphics/howtoplay.png';

    stage.addChild(gg);
    stage.addChild(howtoplay);*/

    //add logo and howtoplay guide that the player can watch while the preloader loads.
    logoImg = new createjs.Bitmap("graphics/title.png");
    howtoplayImg = new createjs.Bitmap("graphics/howtoplay.png");

    stage.addChild(logoImg);
    stage.addChild(howtoplayImg);

    //preload text
    preloadText = new createjs.Text("Loading"; "30px Russo One", "white");
    preloadText.textBaseline = "middle";
    preloadText.textAlign = "center";
    preloadText.y = stage.canvas.width/2;
    preloadText.x = stage.canvas.height/2+150;
    stage.addChild(preloadText);

    //the preloader
    q = new createjs.LoadQueue(true);
    q.installPlugin(createjs.Sound);
    //load assets
    q.loadManifest([
        {id: "heroSS", src: "graphics/sprites/lumberjack.json", type: "spritesheet"},¨
        {id: "treepng", src: "graphics/tree2.png"},
        {id: "chainsawpng", src:"graphics/chainsaw.png"},
        {id: "hourglasspng", src:"graphics/hourglass.png"},
        {id: "logpng", src:"graphics/log.png"},
        {id: "bootspng", src:"graphics/boots.png"},
        {id: "titelpng", src: "graphics/title.png"},
        {id: "howtoplaypng", src: "graphics/howtoplay.png"},
        {id: "chopsound", src:"audio/chop.mp3"},
        {id: "chainsawsound", src:"audio/chainsaw.mp3"},
        {id: "pointssound", src:"audio/points.mp3"},
        {id: "backgroundmusic", src:"audio/johnnycashloop.mp3"}
    ]);
    q.addEventListener("progress", progress);
    q.addEventListener("complete", resourcesLoaded);
}

function progress(e) {
    //calculate the preload percent
    let percent = Math.round(e.progress*100);
    //update the percent text
    preloadText.text = "loading: "+percent+"%";

    stage.update();
}

function resourcesLoaded() {
    //when everything is loaded, remove the preloader text
    stage.removeChild(preloadText);

    //add a start button
    let button = new createjs.Shape();
    button.graphics.beginFill("darkred").drawRect(0,0,140,45);
    button.x = 240;
    button.y = 375;

    //button text
    let startText = new createjs.Text("START", "30px Russo One", "white");
    startText.x = button.x+20;
    startText.y = button.y+5;

    stage.addChild(button);
    stage.addChild(startText);

    stage.update();

    //make the button start the game
    button.addEventListener("click", function(e){
        //start the music! :D
        createjs.Sound.play("backgroundmusic");
        //clean up the screen
        stage.removeChild(e.target);
        stage.removeChild(startText);

        //start the game setup
        setup();
    });
}

function setup() {
    //add the "player" character from the spritesheet
    hero = new createjs.Sprite(q.getResult("heroSS"), settings.currentDirection);
    hero.width = 44;
    hero.height = 44;
    //spawn the hero in the center
    hero.x = stage.canvas.height/2;
    hero.y = stage.canvas.width/2;

    //make the game respond to keypresses
    window.addEventListener("keyup", fingerLifted);
    window.addEventListener("keydown", fingerDown);

    stage.addChild(hero);

    //start the first level and spawn 1 tree
    newLevel(1);

    //add level, points and time left text
    levelText = new createjs.Text("points: "+ points, "25px Russo One", "#35eaf");
    levelText.y = 20;
    levelText.x = 20;

    pointsText = new createjs.Text("Level: "+level, "25px Russo One", "#35eaf");
    pointsText.x = 200;
    pointsText.y = 20;

    timerText = new createjs.Text("Timer: "+timer, "25px Russo One", "#35eaf");
    timerText.x = 400;
    timerText.y = 20;

    stage.addChild(levelText);
    stage.addChild(pointsText);
    stage.addChild(timerText);

    //start the "game engine" or the frames per second that runs the game
    createjs.Ticker.framerate = 60;
    createjs.Ticker.addEventListener("tick", gameEngine);
}

//handle player movement
function movePlayer() {
    //left arrow key
    if (keys.left) {
        hero.x -= settings.speed;
        if (settings.currentDirection != "left") {
            settings.facing = "left";
            hero.gotoAndPlay("left");
            console.log(settings.facing);
            settings.currentDirection = "left";
        }
    }

    //right arrow key
    if (keys.right) {
        hero.x += settings.speed;
        if (settings.currentDirection != "right") {
            settings.facing = "right";
            hero.gotoAndPlay("right");
            console.log(settings.facing);
            settings.currentDirection = "right";
        }
    }

    //up arrow key
    if (keys.up) {
        hero.y -= settings.speed;
        if (settings.currentDirection != "up") {
            hero.gotoAndPlay("up");
            settings.currentDirection = "down";
        }
    }

    //down arrow key
    if (keys.down) {
        hero.y += settings.speed;
        if (settings.currentDirection != "down") {
            hero.gotoAndPlay("down");
            settings.currentDirection = "down";
        }
    }

    // space
    if (keys.space) {
        console.log("chopping");
        if (settings.currentDirection != "chopping" && settings.facing == "left" && settings.weapon == "axe") {
            hero.gotoAndPlay("choppingLeft");
            settings.currentDirection = "chopping";
        }

        if (settings.currentDirection != "chopping" && settings.facing == "right" && settings.weapon == "axe") {
            hero.gotoAndPlay("choppingRight");
            settings.currentDirection = "chopping";
        }

        if (settings.currentDirection != "chopping" && settings.facing == "left" && settings.weapon == "chainsaw") {
            hero.gotoAndPlay("chainsawLeft");
            settings.currentDirection = "chopping";
        }

        if (settings.currentDirection != "chopping" && settings.facing == "right" && settings.weapon =="chainsaw") {
            hero.gotoAndPlay("chainsawRight"); 
            settings.currentDirection = "chopping";
        }
    }

    //when nothing is pressed return to neutral sprite position
    if (!keys.up && !keys.down && !keys.left && !keys.right && !keys.space) {
        hero.gotoAndPlay("neutral");
        settings.currentDirection = "neutral";
    }
}

//new level. Add amount of trees equal to the level
function newLevel(amount) {
    //set alive to true so the game can start
    settings.alive = true;

    //remove logo and "howtoplay" with animation/tween
    createjs.Tween.get(logoImg).to({ y: -1000 },1500);
    createjs.Tween.get(howtoplayImg).to({ y: +1000},1500);

    //set timer to 60 sec
    timer = 60;

    //make a tree for each level
    for (let i=0; i<amount; i++;) {
        let tree = new createjs.Bitmap(q.getResult("treepng"));
        tree.width = tree.height = 55;
        tree.hp = settings.enemyHP;
        tree.x = math.random()*stage.canvas.width;
        tree.y = math.random()*stage.canvas.height;

        //move tree into the map if it spawns outside of it. 500x600 is the dimensions
        if (tree.x < 600-tree.width) {
            tree.x -= tree.width;
        }

        if (tree.x < 0+tree.width) {
            tree.x += tree.width;
        }

        if (tree.y > 500-tree.width) {
            tree.y -= tree.width;
        }

        if (tree.y < 0+tree.width) {
            tree.y += tree.width;
        }

        // make a healthbar (background)
        let hpbarbg = new createjs.Shape();
        hpbarbg.graphics.beginFill("black").drawRect(0,0,50,10);
        hpbarbg.width = 70;
        hpbarbg.height = 70;
        hpbarbg.x = tree.x+5;
        hpbarbg.y = tree.y+20;
        hpbarbg.hp = settings.enemyHP;
        hpbarbg.hitX = tree.x;
        hpbarbg.hitY = tree.y;

        //make healthbar
        let hpbar = new createjs.Shape();
        hpbar.graphics.beginFill("green").drawRect(0,0,50,10);
        hpbar.width = 70;
        hpbar.height = 70;
        hpbar.x = tree.x+5;
        hpbar.y = tree.y+20;
        hpbar.hp = settings.enemyHP;
        hpbar.hitX = tree.x;
        hpbar.hitY = tree.y;

        //add trees and healthbars to their respective arrays, so I can keep track of them.
        trees.push(tree);
        hpbarbgs.push(hpbarbg);
        hpbars.push(hpbar);

        //add the things to the game
        stage.addChild(tree);
        stage.addChild(hpbarbg);
        stage.addChild(hpbar);
    }

}

//if the player press space, and the player is allowed to chop, due to enough time having passed since last chop, then this checks for hits
function performChop() {

}

//check if the level is completed (by chopping every tree on the playing field)
function didIWin() {

}

//the game engine / frames per second
function gameEngine(e){
    //only do things if the game is running
    if (settings.alive) {
        //increase the time that has happened since last chop
        framesSinceLastHit++;

        //decrease the gameclock and update the text to reflect the change
        if (timer>0) {
            timer -=1/60;
            //set the timer to 0 decimals
            timerText.text = "Time left: " + timer.toFixed(0);
        }

        //perform a chop if enough time has passed since the last chop, as governed by the attackspeed
        if (keys.space == true && framesSinceLastHit > settings.attackSpeed) {
            //roll how much "damage" each chop to the tree will do.
            damageNumber = (Math.random()*10+1).toFixed(0);
            console.log(damageNumber);

            //check if the chop hit anything
            performChop();
        }

        //update level and points text
        levelText.text = "Level: "+level;
        pointsText.text = "Points: "+points;

        //check if the player has hit a powerup
        hitPowerup();
        //check if powerup is active
        checkPowerup();
        //check if the level is completed
        didIWin();
        //update healthbars
        redrawHpbar();
        //move the hero
        movePlayer();
        //check if the game is lost
        youLose();
    }
    //update the game 60 times per second
    stage.update(e);
}

//check if the player has run out of time, and stop the game if that is the case
function youLose() {

}

//recolor the healthbars, depending on how low the health is, also reducing the "size".
function redrawHpbar() {

}

//when the player lifts a key
function fingerLifted(e) {

}

//when the player press a key
function fingerDown(e) {

}

//check if a chop has hit a healthbar (aka a tree), and reduce its health by the damage of that chop. If the healthbar dies, then remove it
function hitHpBar() {

}

//check if a chop has hit a healthbar (aka a tree), and reduce its health by the damage of that chop. If the healthbar dies, then remove it
function hitHpBarBg() {

}

//create a power-up that boost the player
function spawnPowerup() {

}

//check if the player hits a power-up
function hitPowerup() {

}

//check if the players chop has hit a tree, and if it has reduce the trees health by the damage of the chop, and if the tree dies then remove it.
function hitTrees() {

}

//check whether 2 objects are touching eachother
function hitTest(object1,object2) {
    if (object1.x >= object2.x + object2.width
    || object1.x + object1.width <= object2.x
    || object1.y >= object2.y + object2.height
    || object1.y + object1.height <= object2.y)
    {
        return false;
    }
    return true;
}

//check whether 2 objects are touching eachother (fix for a bug with healthbars)
function hitTestHPBAR(object1,object2) {
    if (object1.x >= object2.hitX + object2.width
        || object1.x + object1.width <= object2.hitX
        || object1.y >= object2.hitY + object2.height
        || object1.y + object1.height <= object2.hitY)
        {
            return false;
        }
        return true;
}