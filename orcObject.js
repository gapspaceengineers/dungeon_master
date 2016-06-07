orcObject = function (game){

    this.game = game;

    var x = 333;
    var y = 295;

    var value = 10; // <<< get this value here

    var enemyOrc = sortDepthGroup.create(x,y,'orc');

    game.physics.p2.enable(enemyOrc,true);
    enemyOrc.body.setCircle(16);
    enemyOrc.body.fixedRotation = true;
    enemyOrc.anchor.setTo(0.5,0.75);
}

orcObject.getValue= function(){//<<<< note no .prototype. here<<<
    //we need to find a way to get a response out of this object so we can experiment with the easyStarObject.js file.
    //perhaps we could rename it to the 'pathfinderService' or some thing gay like that...
    return 'Implement me!';
    //it might be worth just taking the code from the TANKS example to see if it works.
    //we could also just use a global variable in game.js as a response for now.
}