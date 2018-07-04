"use strict";

let stage, hero, damageNumber, levelText, pointsText, timer, timerText, preloadText, q, logoImg, howtoplayImg, chainsawTimer, speedTimer;
let trees = [];
let hpbarbgs = [];
let hpbars = [];
let level = 1;
let points = 0;
let framesSinceLastHit = 0;
//TODO add durability, and repair mechanics, maybe add a "helper" to the nearest tree after some time has happened.
//TODO make it possible to mute sound
// improve the healthbars so its not objects in itself
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
    preloadText = new createjs.Text("Loading", "30px Russo One", "white");
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
        {id: "heroSS", src: "graphics/sprites/lumberjack.json", type: "spritesheet"},
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
    for (let i=0; i<amount; i++) {
        let tree = new createjs.Bitmap(q.getResult("treepng"));
        tree.width = tree.height = 55;
        tree.hp = settings.enemyHP;
        tree.x = math.random()*stage.canvas.width;
        tree.y = math.random()*stage.canvas.height;

        //move tree into the map if it spawns outside of it. 500x600 is the dimensions
        reSpawnIfOutsideMap(tree);

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

//check if the player hits(chops any trees) anything when space is pressed.
function performChop() {
    //make axe or chainsaw sound
    if (settings.weapon == "axe") {
        createjs.Sound.play("chopsound");
    }

    if (settings.weapon == "chainsaw") {
        createjs.Sound.play("chainsawsound");
    }

     //reset "attackspeed" counter
     framesSinceLastHit = 0;

     //check if anything was hit
     hitTrees();
     hitHpBarBg();
     hitHpBar();
}

//check if the level is completed 
function didIWin() {
    //if the trees array is empty that means every tree has been chopped, and the level is completed
    if (trees.length == 0) {
        //increase level
        level++;

        //add centered text displaying level
        let text = new createjs.Text("Level " + level, "32px Russo One", "#35eaf");
        text.y = stage.canvas.width/2;
        text.y = stage.canvas.height/2;
        text.textAlign = "center";
        text.alpha = 0;

        //add the text to the game
        stage.addChild(text);

        //animate the text so it fades in and out
        createjs.Tween.get(text).to({alpha:1}, 1000).wait(1000).to({alpha:0}, 800).call(function() {
            stage.removeChild(text);
        });

        //start the next level
        newLevel(level);
    }
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

//check if time has run out, and stop the game in that case
function youLose() {
    //timer = 0 = lose
    if (timer < 0) {
        //kill the player
        settings.alive = false;

        // make "death" background (dark screen)
        let loseBG = new createjs.Shape();
        loseBG.graphics.beginFill("black").drawRect(0,0,600,600);
        stage.addChild(loseBG);
        loseBG.alpha = 0.5;

        //make text that tell how many points 
        let youLoseText = new createjs.Text("YOU LOST", "30px Russo One", "white");
        youLoseText.x = youLoseText.y = 100;
        youLoseText.text = "You lost!, You got " + points + " points.";
        stage.addChild(youLoseText);

        //make reset game button + text on it
        let button = new createjs.Shape();
        button.graphics.beginFill("darkred").drawRect(0,0,250,100);
        button.x = 180;
        button.y = 220;
        let startText = new createjs.Text("TRY AGAIN!", "40px Russo One", "white");
        startText.x = 185;
        startText.y = 250;

        //add the button to the game
        stage.addChild(button);
        stage.addChild(startText);

        //click on the start again button
        button.addEventListener("click", function(e) {
            //reset background music
            createjs.Sound.stop("backgroundmusic");
            createjs.Sound.play("backgroundmusic");

            //clean up screen from "lose" objects
            stage.removeChild(e.target);
            stage.removeChild(startText);
            stage.removeChild(youLoseText);
            stage.removeChild(loseBG);

            //remove all trees, healthbars and power-ups from the game, and clean their arrays.
            for (let r = trees.length-1; r>=0; r--) {
                stage.removeChild(trees[r]);
                trees.splice(r,1);
            }

            for (let t = hpbarbgs.length-1; t>=0; t--) {
                stage.removeChild(hpbarbgs[t]);
                hpbarbgs.splice(t,1);
            }

            for (let u = hpbars.length-1; u>=0; u--) {
                stage.removeChild(hpbars[u]);
                hpbars.splice(u,1);
            }

            for (let o = powerups.length-1; o>=0; 0--) {
                stage.removeChild(powerups[o]);
                powerups.splice(o,1);
            }

            //reset the gamesettings and start new game
            settings.speed = 4;
            settings.facing = "left";
            settings.currentDirection = "netral";
            settings.attackSpeed = 10;
            settings.weapon = "axe";
            level = 1;
            points = 0;
            framesSinceLastHit = 0;
            newLevel(1);
        });
    }
}

//redraw and recolor healthbars depending on their health
function redrawHpbar() {
    //set length of the healthbar according to health
    for (let i = hpbars.length-1; i>=0; i--) {
        //adjust scale
        hpbars[i].scaleX = hpbars[i].hp/100;

        //change the color
        if (hpbars[i].hp < 25) {
            hphars[i].graphics.instructions[2].style="red";
        }

        if (hpbars[i].hp < 50) {
            hpbars[i].graphics.instructions[2].style="orange";
        }
    }
}

//when the player lifts a key
function fingerLifted(e) {
    switch(e.key) {
        case "ArrowLeft":
            keys.left = false;
            break;
        case "ArrowRight":
            keys.right = false;
            break;
        case "ArrowUp":
            keys.up = false;
            break;
        case "ArrowDown": 
            keys.down = false;
            break;
        case " ":
            keys.space = false;
            break;
        
    }
}

//when the player press a key
function fingerDown(e) {
    switch(e.key){
        case "ArrowLeft":
            keys.left = true;
            break;
        case "ArrowRight":
            keys.right = true;
            break;
        case "ArrowUp":
            keys.up = true;
            break;
        case "ArrowDown":
            keys.down = true;
            break;
        case " ":
            keys.space = true;
            break;
    }
}

//check if a chop has hit a healthbar (aka a tree), and reduce its health by the damage of that chop. If the healthbar dies, then remove it
function hitHpBar() {
    for (let j = hpbars.length-1; j>=0; j--) {
        if (hitTestHPBAR(hero,hpbars[j])) {
            hpbars[j].hp -= damageNumber;
        }

        //remove if health<0
        if (hpbars[j].hp <= 0) {
            stage.removeChild(hpbars[j]);
            hpbars.splace(j,1);
        }
    }
}

//check if a chop has hit a healthbar (aka a tree), and reduce its health by the damage of that chop. If the healthbar dies, then remove it
function hitHpBarBg() {
    for (h = hpbarbgs.length-1; h>=0; h--) {
        if (hitTestHPBAR(hero,hpbarbgs[h])) {
            hpbarbgs[h].hp -= damageNumber;
        }

        //remove if health<0
        if (hpbarbgs[h].hp <= 0) {
            stage.removeChild(hpbarbgs[h]);
            hpbarbgs.splice(h,1);
        }
    }
}

//create a power-up that boost the player
function spawnPowerup() {
    //roll to find out which powerup the player get
    let randomNumber = Math.floor(Math.random()*6)+1;
    console.log(randomNumber);

    //create the different powerups depending on the roll

    //chainsaw
    if (randomNumber == 1) {
        let powerup = new createjs.Bitmap(q.getResult("chainsawpng"));
        powerup.x = Math.random() * stage.canvas.width;
        powerup.y = Math.random() * stage.canvas.height;
        powerup.height = 50;
        powerup.width = 50;

        //make sure the powerup cant spawn outside of the map.
        reSpawnIfOutsideMap(powerup);

        //set powerup type
        powerup.type = "chainsaw";

        //add to array and game
        powerups.push(powerup);
        console.log("I just made " + powerup.type);
        stage.addChild(powerup);

        //powerup jump animation to alert the player
        createjs.Tween.get(powerup).wait(200).to({scaleX: 1.3, scaleY: 1.3}, 500).to({scakeX: 1, scaleY: 1}, 500);
    }

    //hourglass
    if (randomNumber == 2) {
        let powerup = new createjs.Bitmap(q.getResult("hourglasspng"));
        powerup.x = Math.random() * stage.canvas.width;
        powerup.y = Math.random() * stage.canvas.height;
        powerup.height = 50;
        powerup.width = 50;

        //make sure the powerup cant spawn outside of the map.
        reSpawnIfOutsideMap(powerup);

        //set powerup type
        powerup.type = "hourglass";

        //add to array and game
        powerups.push(powerup);
        console.log("I just made " + powerup.type);
        stage.addChild(powerup);

        //powerup jump animation to alert the player
        createjs.Tween.get(powerup).wait(200).to({scaleX: 1.3, scaleY: 1.3}, 500).to({scakeX: 1, scaleY: 1}, 500);
    }

    //tree log
    if (randomNumber == 3) {
        let powerup = new createjs.Bitmap(q.getResult("logpng"));
        powerup.x = Math.random() * stage.canvas.width;
        powerup.y = Math.random() * stage.canvas.height;
        powerup.height = 50;
        powerup.width = 50;

        //make sure the powerup cant spawn outside of the map.
        reSpawnIfOutsideMap(powerup);

        //set powerup type
        powerup.type = "log";

        //add to array and game
        powerups.push(powerup);
        console.log("I just made " + powerup.type);
        stage.addChild(powerup);

        //powerup jump animation to alert the player
        createjs.Tween.get(powerup).wait(200).to({scaleX: 1.3, scaleY: 1.3}, 500).to({scakeX: 1, scaleY: 1}, 500);
    }

    //Boots
    if (randomNumber == 2) {
        let powerup = new createjs.Bitmap(q.getResult("bootspng"));
        powerup.x = Math.random() * stage.canvas.width;
        powerup.y = Math.random() * stage.canvas.height;
        powerup.height = 50;
        powerup.width = 50;

        //make sure the powerup cant spawn outside of the map.
        reSpawnIfOutsideMap(powerup);

        //set powerup type
        powerup.type = "boots";

        //add to array and game
        powerups.push(powerup);
        console.log("I just made " + powerup.type);
        stage.addChild(powerup);

        //powerup jump animation to alert the player
        createjs.Tween.get(powerup).wait(200).to({scaleX: 1.3, scaleY: 1.3}, 500).to({scakeX: 1, scaleY: 1}, 500);
    }
}

//check if power-up is active (fix from > to >=?)
function checkPowerup() {
    //if the player has chainsaw
    if (chainsawTimer > 0) {
        settings.weapon = "chainsaw";
        settings.attackSpeed = 5;
        chainsawTimer -= 1/60; 
    }
    else {
        settings.weapon = "axe";
        settings.attackSpeed = 10;
    }

    //if the player has boots
    if (speedTimer > 0) {
        settings.speed = 7;
        speedTimer -= 1/60;
    } else {
        settings.speed = 4;
    }
}

//check if the player hits a power-up
function hitPowerup() {
    //check all the powerups if there is a hit
    for (let k = powerups.length-1; k>=0; k--) {
        //hittest
        if (hitTest(hero,powerups[k])) {
            //points sound
            createjs.Sound.play("pointssound");
            console.log(powerups[k].type + " er ramt");

            //chainsaw powerup
            if (powerups[k].type == "chainsaw") {
                chainsawTimer = 10;

                //text and animation
                let text = new createjs.Text("Chainsaw Acquired!", "20px Russo One", "black");
                text.x = powerups[k].x+25;
                text.y = powerups[k].y;
                text.textAlign = "center";
                text.alpha = 0;

                stage.addChild(text);

                createjs.Tween.get(text).to({alpha:1}, 100).to({y: text.y-50}, 1000).wait(200).to({alpha: 0}, 100).call(function() {
                    stage.removeChild(text);
                });
            }

            //boot powerup
            if (powerups[k].type == "boots") {
                speedTimer = 10;

                //text and animation
                let text = new createjs.Text("Increased Speed!", "20px Russo One", "black");
                text.x = powerups[k].x+25;
                text.y = powerups[k].y;
                text.textAlign = "center";
                text.alpha = 0;

                stage.addChild(text);

                createjs.Tween.get(text).to({alpha:1}, 100).to({y: text.y-50}, 1000).wait(200).to({alpha: 0}, 100).call(function() {
                    stage.removeChild(text);
                });
            }

            //log powerup/bonus points
            if (powerups[k].type == "log") {
                points+=10;

                //text and animation
                let text = new createjs.Text("10 points!", "20px Russo One", "black");
                text.x = powerups[k].x+25;
                text.y = powerups[k].y;
                text.textAlign = "center";
                text.alpha = 0;

                stage.addChild(text);

                createjs.Tween.get(text).to({alpha:1}, 100).to({y: text.y-50}, 1000).wait(200).to({alpha: 0}, 100).call(function() {
                    stage.removeChild(text);
                });
            }

            //remove the powerup, which was hit
            stage.removeChild(powerups[k]);
            powerups.splice(k,1);
        }
    }
}

//check if the players chop has hit a tree, and if it has reduce the trees health by the damage of the chop, and if the tree dies then remove it.
function hitTrees() {
    //check all the trees
    for (let i = trees.length-1; i>=0; i--) {
        //test if the tree was hit
        if (hitTest(hero,trees[i])) {
            console.log(trees[i] + " er ramt");
            //reduce the trees health
            trees[i].hp -= damageNumber;

            //make damage number text mmo-style
            let text = new createjs.Text(damageNumber, "32px Russo One", "red");
            text.x = trees[i].x+25;
            text.y = trees[i].y;
            text.textAlign = "center";
            text.alpha = 0;

            //add it to the game
            stage.addCHild(text);

            //animate the damage number
            createjs.Tween.get(text).to({alpha:1}, 100).to({y:text.y-50},200).wait(200).to({alpha:0},100).call(function() {
                stage.removeChild(text);
            });

            //if the tree is dead, remove it and check if we get a powerup from it
            if (trees[i].hp <= 0) {
                points++;
                stage.removeChild(trees[i]);
                trees.splice(i,1);
                spawnPowerup();
            }
        }
    }
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

//if something spawns outside the map
function reSpawnIfOutsideMap(object) {
    if (object.x < 600-object.width) {
        object.x -= object.width;
    }

    if (object.x < 0+object.width) {
        object.x += object.width;
    }

    if (object.y > 500-object.width) {
        object.y -= object.width;
    }

    if (object.y < 0+object.width) {
        object.y += object.width;
    }
}