var game = new Phaser.Game(1024,768, Phaser.AUTO,'',{
    preload : preload,
    create: create,
    update: update
    });

    var paddle1;
    var paddle2;

    var ball_launched;
    var ball_velocity;
    var ball;


    var collideBG;
    var button;

    function preload(){
        game.load.image('paddle', './assets/paddle.png');
        game.load.image('ball', './assets/ball.png');
        game.load.image('collideBG', './assets/germs.png');
        game.load.image('button', './assets/buttonStart.png');
    }

    function create(){
        ball_launched = false;
        ball_velocity = 400;
        //create germs
        collideBG = create_collideBG(800,300);

        
        //end of creating germs
        paddle1 = create_paddle(0, game.world.centerY);
        paddle2 = create_paddle(game.world.width - 16, game.world.centerY);

         ball = create_ball(game.world.centerX, game.world.centerY);

        


         //creating button
         button = game.add.button(game.world.centerX, 0,'button' ,actionOnClick, this);
         button.height = 200;
         button.width = 200;
    }

    function actionOnClick(){
        game.input.onDown.add( launch_ball,this );
    }

    function update(){
        control_paddle(paddle1,game.input.y);


        if( game.physics.arcade.overlap(collideBG,ball)){
            console.log('destroy happens');
            game.physics.arcade.collide(collideBG,ball);
            collideBG.destroy();
        }

        game.physics.arcade.collide(paddle1,ball);
        game.physics.arcade.collide(paddle2,ball);
        game.physics.arcade.collide(collideBG,ball);

     
        if(ball.body.blocked.left){
            console.log('Player 2 Scores');
        }else if(ball.body.blocked.right){
            console.log('Player 1 Scores');
        }




    }


    function create_paddle(x,y){
        
        var paddle = game.add.sprite(x,y,'paddle');
        paddle.anchor.setTo(0.5,0.5);
        game.physics.arcade.enable(paddle);
        paddle.body.collideWorldBounds = true;
        paddle.body.immovable = true;
        
        return paddle;

    }

    function create_collideBG(x,y){
          
        var collideBG = game.add.sprite(x,y,'collideBG');
        collideBG.anchor.setTo(0.5,0.5);
        game.physics.arcade.enable(collideBG);
        collideBG.body.collideWorldBounds = true;
        collideBG.body.immovable = true;


        return collideBG;
    }


    function create_ball(x,y){
        var ball = game.add.sprite(x,y,'ball');
        ball.anchor.setTo(0.5,0.5);
        game.physics.arcade.enable(ball);
        ball.body.collideWorldBounds = true;
        ball.body.bounce.setTo(1,1  );      //bounce of the ball


        return ball;
    }


    function launch_ball(){
        if(ball_launched){
            ball.x = game.world.centerX;
            ball.y = game.world.centerY;
            ball.body.velocity.setTo(0,0);
            ball_launched = false;
        }else{
            ball.body.velocity.x = - ball_velocity;
            ball.body.velocity.y =  ball_velocity;
            ball_launched = true;
        }
    }

  
    function control_paddle(paddle,y){
        paddle.y = y;
        
        if(paddle.y < paddle.height  /2){
            paddle.y = paddle.height /2;
        }else if(paddle.y > game.world.height - paddle.height/2){
            paddle.y = game.world.height - paddle.height / 2;
        }
        




    }