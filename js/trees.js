//redraw and recolor healthbars depending on their health
function redrawHpbar() {
    //set length of the healthbar according to health
    for (let i = hpbars.length-1; i>=0; i--) {
        //adjust scale
        hpbars[i].scaleX = hpbars[i].hp/100;

        //change the color
        if (hpbars[i].hp < 25) {
            hpbars[i].graphics.instructions[2].style="red";
        }

        if (hpbars[i].hp < 50) {
            hpbars[i].graphics.instructions[2].style="orange";
        }
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
            hpbars.splice(j,1);
        }
    }
}

//check if a chop has hit a healthbar (aka a tree), and reduce its health by the damage of that chop. If the healthbar dies, then remove it
function hitHpBarBg() {
    for (let h = hpbarbgs.length-1; h>=0; h--) {
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

//check if the players chop has hit a tree, and if it has reduce the trees health by the damage of the chop, and if the tree dies then remove it.
function hitTrees() {
    //check all the trees
    for (let i = trees.length-1; i>=0; i--) {
        //test if the tree was hit
        if (hitTest(hero,trees[i])) {
            console.log(trees[i]+" er ramt");
            //reduce the trees health
            trees[i].hp -= damageNumber;

            //make damage number text mmo-style
            let text = new createjs.Text(damageNumber, "32px Russo One", "red");
            text.x = trees[i].x+25;
            text.y = trees[i].y;
            text.textAlign = "center";
            text.alpha = 0;

            //add it to the game
            stage.addChild(text);

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