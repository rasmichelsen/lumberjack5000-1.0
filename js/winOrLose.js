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

            for (let o = powerups.length-1; o>=0; o--) {
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

//check if the level is completed 
function didIWin() {
    //if the trees array is empty that means every tree has been chopped, and the level is completed
    if (trees.length == 0) {
        //increase level
        level++;

        //add centered text displaying level
        let text = new createjs.Text("Level " + level, "32px Russo One", "#35eaf");
        text.x = stage.canvas.width/2;
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