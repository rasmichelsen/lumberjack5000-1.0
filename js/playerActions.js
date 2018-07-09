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