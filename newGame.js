var game = new Phaser.Game(1200, 600, Phaser.AUTO, 'phaser-example', {preload: preload,create: create, update: update,render: render});
var map1 = 'src/map/map1.json';
var mapData;
var entityCollection = [[],[]];
var textCollection = [];

function preload()
{
    game.load.spritesheet('tiles', 'src/sprites/tiles.png');
    game.load.spritesheet('cleric', 'src/sprites/cleric.png', 64, 64);
    game.load.tilemap('mapData', map1, null, Phaser.Tilemap.TILED_JSON);
    game.load.json('version', map1);
}

function create()
{
    game.physics.startSystem(Phaser.Physics.P2JS);
    runMapData();

    player = new Player('cleric', 300, 300, game);
}

function update()
{

}

function render()
{
    debug();
    movePlayer();
}