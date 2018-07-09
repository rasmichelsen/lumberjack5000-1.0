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
        createjs.Tween.get(powerup).wait(200).to({scaleX: 1.3, scaleY: 1.3}, 500).to({scaleX: 1, scaleY: 1}, 500);
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
        createjs.Tween.get(powerup).wait(200).to({scaleX: 1.3, scaleY: 1.3}, 500).to({scaleX: 1, scaleY: 1}, 500);
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
        createjs.Tween.get(powerup).wait(200).to({scaleX: 1.3, scaleY: 1.3}, 500).to({scaleX: 1, scaleY: 1}, 500);
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
        createjs.Tween.get(powerup).wait(200).to({scaleX: 1.3, scaleY: 1.3}, 500).to({scaleX: 1, scaleY: 1}, 500);
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