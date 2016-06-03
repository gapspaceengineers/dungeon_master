var game = new Phaser.Game(600, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload()
{
    game.load.spritesheet('tiles','src/sprites/tiles.png');
    game.load.tilemap('mapData', 'src/map/testMap.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.json('version', 'src/map/testMap.json');

    game.load.spritesheet('cleric', 'src/sprites/cleric.png', 64, 64);
    game.load.spritesheet('orc', 'src/sprites/orc.png', 64, 64);
    game.load.spritesheet('orc', 'src/sprites/orc.png', 64, 64);
    game.load.spritesheet('orcThief', 'src/sprites/orcThief.png', 64, 64);

    game.add.plugin(Phaser.Plugin.Debug);
    game.add.plugin(Phaser.Plugin.Inspector);

    //TODO: This:
    // Graphics: Add a drop shadow.
}

var mapData;
var background_layer;
var floor_layer;
var floor_decor;
var wall_layer;
var wall_decor;
var roof_layer;

var cursors;
var upKey;
var downKey;
var leftKey;
var rightKey;

var player_entity;
var pex;
var pey;
var orc;
var ratx;
var raty;

var enemyDirection;
var nextPointX;
var nextPointY;

var text = '';
var flip = false;
var flipEnemy = false;
var group1;

var stopPathFinder = false;

function create() {

    /*
     TODO:
     Carpets: Include a dark fog sprite to mix with the carpet sprites to decorate the dungeon.
     TODO:
     The chest that you touch and the barrel that you bash and the bag that opens at any angle.
     TODO:
     Take the top beam of the door into the roof layer, darken the screen upon collision, play openDoor.mp3
     load a new map, then brighten the screen.
     //Distant future: Combat system. Skill trees. Classes. Menus. Sound. Projectiles. Magic. A story.
     Lighting. Stats on items.
     */
    game.physics.startSystem(Phaser.Physics.P2JS);

/////// MapData
    mapData = game.add.tilemap('mapData');
    mapData.addTilesetImage('tiles');

    background_layer = mapData.createLayer('background');
    background_layer.resizeWorld();
    background_layer.debug = false;
    floor_layer = mapData.createLayer('floor');
    floor_layer.resizeWorld();
    floor_layer.debug = false;
    floor_decor = mapData.createLayer('floor_decor');
    floor_decor.resizeWorld();
    floor_decor.debug = false;
    wall_layer = mapData.createLayer('wall');
    wall_layer.resizeWorld();
    wall_layer.debug = false;
    wall_decor = mapData.createLayer('wall_decor');
    wall_decor.resizeWorld();
    wall_decor.debug = false;
    roof_layer = mapData.createLayer('roof');
    roof_layer.resizeWorld();
    roof_layer.debug = false;
    mapData.setCollisionBetween(1,2000,true,'wall');
    game.physics.p2.convertTilemap(mapData, wall_layer);

/////// Depth Sort
    group1 = game.add.group();

/////// Controls
    cursors = game.input.keyboard.createCursorKeys();
    upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
    downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
    leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);

////// Player
    player_entity = group1.create(333,333, 'cleric');
    game.physics.p2.enable(player_entity, true);
    player_entity.body.setRectangle(32,35);
    player_entity.body.fixedRotation = true;
    player_entity.anchor.setTo(0.5,0.75);
    var spd = 20;
    player_entity.animations.add('idle',   [0,1,2,3,4,5,6,7,8,9],               5, false);
    player_entity.animations.add('cast',   [10,11,12,13,14,15,16,17,18,19],   spd, false);
    player_entity.animations.add('walk',   [20,21,22,23,24,25,26,27,28,29],   spd, false);
    player_entity.animations.add('attack', [30,31,32,33,34,35,36,37,38,39],   spd, false);
    player_entity.animations.add('die',    [40,41,42,43,44,45,46,47,48,49],   spd, false);

/////// Enemies: Note: Expand on available enemy physics:
    orc = group1.create(433,333,'orc');
    game.physics.p2.enable(orc,true);
    orc.body.setCircle(16);
    orc.body.fixedRotation = true;
    orc.anchor.setTo(0.5,0.75);
    orc.animations.add('idle',   [0,1,2,3,4,5,6,7,8,9],               5, false);
    orc.animations.add('cast',  [10,11,12,13,14,15,16,17,18,19],   spd, false);
    orc.animations.add('walk',    [20,21,22,23,24,25,26,27,28,29],   spd, false);
    orc.animations.add('attack', [30,31,32,33,34,35,36,37,38,39],   spd, false);
    orc.animations.add('die',    [40,41,42,43,44,45,46,47,48,49],   spd, false);


/////// EasyStar
    var phaserJSON = game.cache.getJSON('version');
    var data = phaserJSON.layers[3].data; //grab the wall layer
    var preArray = [];
    var postArray = [];
    var level =[];

    for (var i=0; i<data.length; i++) {
        preArray.push(data[i]);
    }

    var dcv = Math.sqrt(data.length);
    var dataLength = data.length;

    for (var x = 0; x < dataLength; x += dcv) {
        postArray = preArray.slice(0,dcv);
        level.push(postArray);
        preArray.splice(0,dcv);
    }

    var easystar = new EasyStar.js();
    easystar.setGrid(level);
    easystar.setAcceptableTiles([0]);
    //easystar.enableDiagonals();

    /* use enableDiagonals on small enemies, make their collision radius smaller, and
    /  allow them to slow or halt the player
    /  allow for large enemies to have trouble moving around the map
    */

    setInterval(function(){

        easystar.findPath(ratx, raty, pex, pey, function( path ) {

            if (path) {
                nextPointX = path[1].x;
                nextPointY = path[1].y;
            }

            if (path === null || stopPathFinder == true) {
                console.log("Pathfinder: DORMANT");
            }

            else {
                console.log('Pathfinder: ON');
                for (var i = 0; i < path.length; i++) {
                    console.log("X: " + path[i].x + " Y: " + path[i].y + " Rx: " + ratx + " Ry: " + raty);

                    if (nextPointX < ratx && nextPointY < raty)
                    {
                        enemyDirection = "NW";
                    }
                    else if (nextPointX == ratx && nextPointY < raty)
                    {
                        enemyDirection = "N";
                    }
                    else if (nextPointX > ratx && nextPointY < raty)
                    {
                        enemyDirection = "NE";
                    }
                    else if (nextPointX < ratx && nextPointY == raty)
                    {
                        enemyDirection = "W";
                    }
                    else if (nextPointX > ratx && nextPointY == raty)
                    {
                        enemyDirection = "E";
                    }
                    else if (nextPointX > ratx && nextPointY > raty)
                    {
                        enemyDirection = "SE";
                    }
                    else if (nextPointX == ratx && nextPointY > raty)
                    {
                        enemyDirection = "S";
                    }
                    else if (nextPointX < ratx && nextPointY > raty)
                    {
                        enemyDirection = "SW";
                    }
                    else
                    {
                        enemyDirection = "STOP";
                    }
                    moveEnemy();
                }
            }
        });
        easystar.calculate();

    }, 80);

/////// Misc
    roof_layer.bringToTop();
    player_entity.body.onBeginContact.add(blockHit, this);
}

function blockHit (body, bodyB, shapeA, shapeB, equation) {

    if (body == null)
    {
        text = 'You bumped into the world bounds :)';
    }
    else if (body.sprite == null)
    {
        text = 'You bumped into the wall :)';
    }
    else if (body)
    {
        text = 'You last hit: ' + body.sprite.key;
    }
    else
    {
        text = 'You hit a un-identified object';
    }

}

function direction(){

    player_entity.body.setZeroVelocity();
    var speed = 150;

    if (upKey.isDown == true)
    {
        player_entity.body.moveUp(speed);
    }
    else if (downKey.isDown == true)
    {
        player_entity.body.moveDown(speed);
    }
    if (leftKey.isDown == true)
    {
        player_entity.body.moveLeft(speed);
    }
    else if (rightKey.isDown == true)
    {
        player_entity.body.moveRight(speed);
    }

    if (upKey.isDown == true)
    {
        player_entity.animations.play('walk');
    }
    else if (downKey.isDown == true)
    {
        player_entity.animations.play('walk');
    }
    else if (leftKey.isDown == true)
    {
        player_entity.animations.play('walk');
    }
    else if (rightKey.isDown == true)
    {
        player_entity.animations.play('walk');
        if (flip == true){
            player_entity.scale.x *=-1;
            flip = false;
        }
    }
    else
    {
        player_entity.animations.play('idle');
    }

    if (leftKey.isDown){
        if (flip == false){
            player_entity.scale.x *=-1;
            flip = true;
        }
    }
}

function moveEnemy(){

    orc.animations.play('walk');
    orc.body.setZeroVelocity();
    var enemySpeed = 151;

    if (enemyDirection == "N") {
        orc.body.moveUp(enemySpeed);
    }
    else if (enemyDirection == "S")
    {
        orc.body.moveDown(enemySpeed);
    }
    else if (enemyDirection == "E") {
        orc.body.moveRight(enemySpeed);
        if (flipEnemy == true){
            orc.scale.x *=-1;
            flipEnemy = false;
        }
    }
    else if (enemyDirection == "W")
    {
        orc.body.moveLeft(enemySpeed);
        if (flipEnemy == false){
            orc.scale.x *=-1;
            flipEnemy = true;
        }
    }
    else if (enemyDirection == "SE")
    {
        orc.body.moveDown(enemySpeed);
        orc.body.moveRight(enemySpeed);
    }
    else if (enemyDirection == "NW")
    {
        orc.body.moveUp(enemySpeed);
        orc.body.moveLeft(enemySpeed);
    }
    else if (enemyDirection == "SW")
    {
        orc.body.moveDown(enemySpeed);
        orc.body.moveLeft(enemySpeed);
    }
    else if (enemyDirection == "NE")
    {
        orc.body.moveUp(enemySpeed);
        orc.body.moveRight(enemySpeed);
    }
    else if (enemyDirection == "STOP")
    {
        orc.body.setZeroVelocity()
        orc.animations.play('idle');
    }
    else
    {
        orc.body.setZeroVelocity()
        orc.animations.play('idle');
    }
}

function update()
{
    group1.sort('y', Phaser.Group.SORT_ASCENDING);
    game.camera.follow(player_entity);
    direction();
}

function render(){

    //Snap from the pixel co-ordinate to the grid co-ordinate.
    pex = this.math.snapToFloor(Math.floor(player_entity.position.x), 32) / 32;
    pey = this.math.snapToFloor(Math.floor(player_entity.position.y), 32) / 32;
    ratx = this.math.snapToFloor(Math.floor(orc.position.x), 32) / 32;
    raty = this.math.snapToFloor(Math.floor(orc.position.y), 32) / 32;

    game.debug.text('Enemy Direction: ' + enemyDirection, 32, 32);
    game.debug.text('Player X: ' + pex, 32, 62);
    game.debug.text('Player Y: ' + pey  , 32, 92);
    game.debug.text('DEBUG: ' + text  , 32, 122);
}