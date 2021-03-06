    function enemyObject(index, sprite, x, y, game) {

        this.game = game;

        this.myX = x
        this.myY = y;

        this.animateSpeed = 20;
        this.id = index.toString();
        console.log('Object ID: ' + this.id);

        this.enemy = game.add.sprite(x, y, sprite);
        this.enemy = sortDepthGroup.add(this.enemy);
        game.physics.p2.enable(this.enemy, debugging);
        this.enemy.animations.add('idle', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], this.animateSpeed / 4, false);
        this.enemy.animations.add('cast', [10, 11, 12, 13, 14, 15, 16, 17, 18, 19], this.animateSpeed, false);
        this.enemy.animations.add('walk', [20, 21, 22, 23, 24, 25, 26, 27, 28, 29], this.animateSpeed, false);
        this.enemy.animations.add('attack', [30, 31, 32, 33, 34, 35, 36, 37, 38, 39], this.animateSpeed, false);
        this.enemy.animations.add('die', [40, 41, 42, 43, 44, 45, 46, 47, 48, 49], this.animateSpeed, false);
        this.enemy.body.setCircle(12);
        this.enemy.body.fixedRotation = true;

        this.enemyRadius;
        this.enemyRadius = game.add.sprite(x, y, sprite);
        this.enemyRadius.height = 128;
        this.enemyRadius.width = 128;
        this.enemyRadius.anchor.setTo(0.5, 0.5);
        this.enemyRadius.alpha = 0.2;

        this.alive = true;
        this.attack = 'attack off';
        this.direction = '';
        this.speed = 200;

        //this.enemy.body.onBeginContact.add(attackOn, this);
        //this.enemy.body.onEndContact.add(attackOff, this);

        //this.state = ['idle','wander','attack','alarm','search'];

        this.easystar;
        this.easystar = new EasyStar.js();
        this.easystar.setGrid(LEVEL);
        this.easystar.setAcceptableTiles([0]);

    } //so in theory, anything below this line or outside this class isnt part of the object unless it's dcalred a thisObject.prototype...?

    function overlap(){
        if (checkOverlap(playerRadius, this.enemyRadius)) {
            //
        }
        else {
            //
        }
        function checkOverlap(spriteA, spriteB) {
            var boundsA = spriteA.getBounds();
            var boundsB = spriteB.getBounds();
            return Phaser.Rectangle.intersects(boundsA, boundsB);
        }
    }

    function attackOn(body) {
        if (body == null) {
        }
        else if (body.sprite == null) {
        }
        else if (body.sprite.key == 'cleric') {
            this.attack = 'attack on';
            this.enemy.animations.play('attack');
        }
        else {
        }
    }

    function attackOff(body) {
        if (body == null) {
        }
        else if (body.sprite == null) {
        }
        else if (body.sprite.key == 'cleric') {
            this.attack = 'attack off';
            console.log('Enemy ' + this.id + '= attack off');
        }
        else {
        }
    }

    enemyObject.prototype.update = function(){

        this.enemyRadius.position.x = this.enemy.x;
        this.enemyRadius.position.y = this.enemy.y;

        this.myX = game.math.snapToFloor(Math.floor(this.enemy.x), 32) / 32;
        this.myY = game.math.snapToFloor(Math.floor(this.enemy.y), 32) / 32;

        //overlap();
    }
