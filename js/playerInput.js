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