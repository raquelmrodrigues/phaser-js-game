var config = 
{
    type: Phaser.AUTO,
    width: 1000,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: 
    {
        preload: preload,
        create: create,
        update: update,
    }
};

var game = new Phaser.Game(config);

var win;
var demo;
var cursors;
var player;
var stars;
var bombs;
var platforms;
var cursors;
var score = 0;
var lives = 3;
var gameOver = false;
var scoreText;
var cloudsWhite;
var cloudsWhiteSmall;

function preload ()
{
    this.load.image("clouds-white", "assets/clouds-white.png");
    this.load.image("clouds-white-small", "assets/clouds-white-small.png");
    this.load.image('sky', 'assets/sky.png');
    this.load.image('ground', 'assets/platform.png');
    this.load.image('star', 'assets/star.png');
    this.load.image('bomb', 'assets/bomb.png');
    this.load.spritesheet('player', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
}

function create ()
{
    // SKY
    this.add.image(400, 300, 'sky');
    this.add.image(800, 300, 'sky');

    // CLOUDS
    cloudsWhite = this.add.tileSprite(640, 200, 1280, 400, "clouds-white");
    cloudsWhiteSmall = this.add.tileSprite(640, 200, 1280, 400, "clouds-white-small");

    platforms = this.physics.add.staticGroup();

    // GROUND
    platforms.create(400, 568, 'ground').setScale(2).refreshBody();
    platforms.create(1200, 620, 'ground').setScale(2).refreshBody();

    //  PLATFORMS
    platforms.create(600, 400, 'ground');
    platforms.create(50, 250, 'ground');
    platforms.create(750, 220, 'ground');

    // PLAYER
    player = this.physics.add.sprite(100, 450, 'player');

    //  PLAYER PHYSICS
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    //  PLAYER ANIMATIONS
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [ { key: 'player', frame: 4 } ],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('player', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

    //  INPUT EVENTS
    cursors = this.input.keyboard.createCursorKeys();

    // CAMERA
    // this.cameras.main.setBounds(0, 0, 729 * 2, 176);
    // this.cameras.main.startFollow(this.player, true);
    // this.cameras.main.setZoom(2);

    //  STARS
    stars = this.physics.add.group({
        key: 'star',
        repeat: 11,
        setXY: { x: 12, y: 0, stepX: 70 }
    });

    stars.children.iterate(function (child) 
    {
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });

    // BOMBS
    bombs = this.physics.add.group();

    //  SCORE
    scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

    // LIVES
    this.data.set('lives', 3);
    livesText = this.add.text(16, 40, 'Lives: 3', { fontSize: '32px', fill: '#000'});

    // COLLIDER
    this.physics.add.collider(player, platforms);
    this.physics.add.collider(stars, platforms);
    this.physics.add.collider(bombs, platforms);

    this.physics.add.overlap(player, stars, collectStar, null, this);

    this.physics.add.collider(player, bombs, hitBomb, null, this);
}

function update () 
{ 

    
    {
        cloudsWhite.tilePositionX += 0.5;
        cloudsWhiteSmall.tilePositionX += 0.25;
    }

    if (gameOver)
    {
        return;
    }
    if (cursors.left.isDown)
    {
        player.setVelocityX(-160);
        player.anims.play('left', true);
    }
    else if (cursors.right.isDown)
    {
        player.setVelocityX(160);
        player.anims.play('right', true);
    }
    else
    {
        player.setVelocityX(0);
        player.anims.play('turn');
    }

    if (cursors.up.isDown && player.body.touching.down)
    {
        player.setVelocityY(-330);
    }
}

function collectStar (player, star)
{
    star.disableBody(true, true);

    score += 10;
    scoreText.setText('Score: ' + score);

    if (stars.countActive(true) === 0)
    {

        stars.children.iterate(function (child) {

            child.enableBody(true, child.x, 0, true, true);

        });

        var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

        var bomb = bombs.create(x, 16, 'bomb');
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
        bomb.allowGravity = false;

    }
}

function hitBomb (player, bomb)
{
    this.physics.pause();
    lives -= 1;
    livesText.setText('Lives: ' + lives);
}

function gameOver (player, lives)
{
    if (lives == 0 || lives < 0)
    {
        this.physics.pause();

        player.setTint(0xff0000);

        player.anims.play('turn');
    }
}


// function createWindow ()
// {
//     var x = Phaser.Math.Between(1000, 600);
//     var y = Phaser.Math.Between(64, 128);

//     var handle = 'window' + this.count++;

//     var win = this.add.zone(x, y, func.WHIDTH, func.HEIGHT).setInteractive().setOrigin(0);

//     var demo = new func(handle, win);

//     this.input.setDraggable(win);

//     win.on('drag', function(pointer, dragX, dragY)
//     {
//         this.x = dragX;
//         this.Y = dragY;

//         demo.refresh();
//     });

//     this.scene.add(handle, demo, true);
// }

// this.createWindow(Juggler);