    function enemyObject(index, sprite, x, y, game) {

        this.game = game;

        this.x = x
        this.y = y
        var animateSpeed = 20;
        this.id = index.toString();
        console.log('Object ID: ' + this.id);

        this.enemy = game.add.sprite(x, y, sprite);
        this.enemy.animations.add('idle', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], animateSpeed / 4, false);
        this.enemy.animations.add('cast', [10, 11, 12, 13, 14, 15, 16, 17, 18, 19], animateSpeed, false);
        this.enemy.animations.add('walk', [20, 21, 22, 23, 24, 25, 26, 27, 28, 29], animateSpeed, false);
        this.enemy.animations.add('attack', [30, 31, 32, 33, 34, 35, 36, 37, 38, 39], animateSpeed, false);
        this.enemy.animations.add('die', [40, 41, 42, 43, 44, 45, 46, 47, 48, 49], animateSpeed, false);
        game.physics.p2.enable(this.enemy, debugging);
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
        this.flip = false;

        this.nextX = '';
        this.nextY = '';

        this.pathfinderON = false;
        this.myDirection = '';

        this.enemy.body.onBeginContact.add(attackOn, this);
        this.enemy.body.onEndContact.add(attackOff, this);

        /////TODO: Pathfinder.
        new pathfinder(1, 1, 5, 5);

    }
    
    function attackOn(body) {
        if (body == null) {
        }
        else if (body.sprite == null) {
        }
        else if (body.sprite.key == 'cleric') {
            this.attack = 'attack on';
            console.log('Enemy ' + this.id + '= attack on');
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

    function animateEnemy(x) {
        if (this.attack == 'attack on') {
            this.enemy.animations.play('attack', 20, true);
        }
        if (this.attack == 'attack off') {
            if (x == 'walk') {
                this.enemy.animations.play('walk');
            }
            if (x == 'die') {
                this.enemy.animations.play('die');
            }
            if (x == 'cast') {
                this.enemy.animations.play('cast');
            }
            if (x == 'idle') {
                this.enemy.animations.play('idle');
            }
        }
    }

    function moveEnemyObj() {

        this.enemy.animations.play('walk');
        this.enemy.body.setZeroVelocity();
        var enemySpeed = 151;

        if (this.attack == 'attack on') {
            this.enemy.body.setZeroVelocity();
        }
        else {
            if (this.myDirection == "N") {
                this.enemy.body.moveUp(enemySpeed);
            }
            else if (this.myDirection == "S") {
                this.enemy.body.moveDown(enemySpeed);
            }
            else if (this.myDirection == "E") {
                this.enemy.body.moveRight(enemySpeed);
                if (this.flip == true) {
                    this.enemy.scale.x *= -1;
                    this.flip = false;
                }
            }
            else if (this.myDirection == "W") {
                this.enemy.body.moveLeft(enemySpeed);
                if (this.flip == false) {
                    this.enemy.scale.x *= -1;
                    this.flip = true;
                }
            }
            else if (this.myDirection == "SE") {
                this.enemy.body.moveDown(enemySpeed);
                this.enemy.body.moveRight(enemySpeed);
            }
            else if (this.myDirection == "NW") {
                this.enemy.body.moveUp(enemySpeed);
                this.enemy.body.moveLeft(enemySpeed);
            }
            else if (this.myDirection == "SW") {
                this.enemy.body.moveDown(enemySpeed);
                this.enemy.body.moveLeft(enemySpeed);
            }
            else if (this.myDirection == "NE") {
                this.enemy.body.moveUp(enemySpeed);
                this.enemy.body.moveRight(enemySpeed);
            }
            else if (this.myDirection == "STOP") {
                this.enemy.body.setZeroVelocity();
                this.enemy.animations.play('idle');
            }
            else {
                this.enemy.body.setZeroVelocity();
                this.enemy.animations.play('idle');
            }
        }
    }

    enemyObject.prototype.update = function(){

        this.enemyRadius.position.x = this.enemy.x;
        this.enemyRadius.position.y = this.enemy.y;

        //game.math.snapToFloor(Math.floor(this.enemy.position.x), 32) / 32;
        //game.math.snapToFloor(Math.floor(this.enemy.position.y), 32) / 32;

        if (checkOverlap(playerRadius, this.enemyRadius)) {
            //console.log('Overlapping with ' + this.id + ': True');
            //this.pathfinderON = true;
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