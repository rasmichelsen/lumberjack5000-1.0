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
    if(object.x > 600-object.width){
        object.x-=object.width;
    }
    if (object.x < 0+object.width) {
        object.x+=object.width;
    }
    if (object.y > 500-object.width) {
        object.y-=object.width;
    }
    if (object.y < 0+object.width) {
        object.y += object.width;
    }
}