var game = new Phaser.Game(768, 800, Phaser.AUTO, '',{
    preload : preload,
    create: create,
    update: update
});



function preload(){
    game.load.image('player' , './assets/playerPlatform.png');      // preloading the player image
    game.load.image('ball', './assets/ball.png');     //preloading the ball image
    game.load.image('button', './assets/buttonStart.png');  //preloading the button start
    game.load.image('germ','./assets/germs.png')
}


var player; //will contain the paddle
var enterKey;   //holds the event
var ball_launched;  // is the ball launched bool
var ball_velocity;  //will hold the initial speed of the ball
var germ;

var superGerm;

function create(){

    player = create_player(game.world.width /2,game.world.height);      //creating player
    ball = create_ball(game.world.centerX, player.centerY - player.height  );   //creating the ball the center of the world and and little higher of the player
   
   
    ball_launched = false;  //set ball launch to false on start
    ball_velocity = 400;    //initial velocity  
    /* Adding an event on return key */
    enterKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
    enterKey.onDown.add(restartGame, this);
   


     //creating button
     button = game.add.button(game.world.width - 50, 0,'button' ,launchBall, this);
     button.height = 50;
     button.width = 50;
     //end of creating button

       
     /*creating enemies*/
      /*
     germ = game.add.group();
     for (var i = 0; i < 10; i++)
     {
         germ.create(game.world.randomX, game.world.randomY, 'germ', 0);
         germ.children[i].anchor.setTo(0.5,0.5);
         game.physics.arcade.enable(germ.children[i]);
         germ.children[i].body.collideWorldBounds = true;
         germ.children[i].body.immovable = true; 
     }

     for (var i = 0, len = germ.children.length; i < len; i++) { 
          console.log(germ.children[i]);
       
        }

        */
     
       germ = game.add.group();
       for (var i = 0; i < 10; i++)
       {
           germ.create(game.world.randomX, game.world.randomY, 'germ', 0);
           germ.children[i].anchor.setTo(0.5,0.5);
           game.physics.arcade.enable(germ.children[i]);
           germ.children[i].body.collideWorldBounds = true;
           germ.children[i].body.immovable = true; 
       }
  
    

}



function update(){
    control_paddle(player,game.input.x);
    //control player movement
    if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT))
    {
        control_player(player,-1,20);
    }

    if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
    {
        control_player(player,1,20);
    }
    //end of controlling player movement


    game.physics.arcade.collide(player,ball);   //ball will collide with the player
    game.physics.arcade.collide(germ,ball);   //ball will collide with the player




   
}



//create objects
function create_player(x,y){

    var player = game.add.sprite(x,y,'player'); // adding player to the scene
    player.anchor.setTo(0.5,0.5);
    game.physics.arcade.enable(player); //enabling the physics on the object
    player.body.collideWorldBounds = true;
    player.body.immovable = true;   //ball is static
    
    return player;

}


function create_ball(x,y){
    var ball = game.add.sprite(x,y,'ball');
    ball.anchor.setTo(0.5,0.5);
    game.physics.arcade.enable(ball);
    ball.body.collideWorldBounds = true;
    ball.body.bounce.setTo(1,1  );      //bounce of the ball

    return ball;

}

function create_germs(x,y){
    var germ = game.add.sprite(x,y,'germ');
    germ.anchor.setTo(0.5,0.5);
    game.physics.arcade.enable(germ);
    germ.body.collideWorldBounds = true;
    germ.body.immovable = true;  

    return germ;
}


/* FUNCTIONALS */

//will handle the movement of the paddle
//control_player for PC
function control_player(paddle,state,speed){
    // holds the paddle object, left or rightt(user must input -1 or +1, how fast)
    paddle.x += state * speed ;


    //boundary so that the paddle will not go offscreen
    if(paddle.x < paddle.width / 2){
        paddle.x = paddle.width / 2;
    }else if(paddle.x > game.world.width - paddle.width/2){
        paddle.x = game.world.width - paddle.width / 2;
    }


}


//control player for touch screens
function control_paddle(paddle , x){
    
    paddle.x = x;
        
    if(paddle.x < paddle.width  /2){
        paddle.x = paddle.width /2;
    }else if(paddle.x > game.world.width - paddle.width /2){
        paddle.x = game.world.width - paddle.width / 2;
    }
}

function launch_ball(){
        
    if(ball_launched){
        //resets the location and speed of the ball
        ball.x =   game.world.centerX;
        ball.y = player.centerY - player.height;
        ball.body.velocity.setTo(0,0);
        ball_launched = false;
    }else{
        //adds the initial force
        ball.body.velocity.x =  ball_velocity;
        ball.body.velocity.y = - ball_velocity;
        ball_launched = true;
    }
}

function launchBall(){
    launch_ball();   // set the ball at its starting position and reset the game
 }
 
 function restartGame(){
     this.game.state.restart();  //restarts the game
 }
 



