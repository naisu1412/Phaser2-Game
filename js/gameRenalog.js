var game = new Phaser.Game(768, 1024, Phaser.AUTO, '',{
    preload : preload,
    create: create,
    update: update
});



function preload(){
    game.load.image('player' , './assets/playerPlatform.png');      // preloading the player image
    game.load.image('ball', './assets/ball.png');     //preloading the ball image
    game.load.image('button', './assets/buttonStart.png');  //preloading the button start
    game.load.image('germ','./assets/germs.png');
    game.load.image('superGerm','./assets/superGerm.png');
    game.load.image('background', './assets/background.png');
    game.load.image('blockage', './assets/tablet.png');
    game.load.physics('physicsData', './json/physicsData.json');
}


var player; //will contain the paddle
var enterKey;   //holds the event
var ball_launched;  // is the ball launched bool
var ball_velocity;  //will hold the initial speed of the ball
var germ;
var blockage;

var superGerm;

function create(){
  

    var background = game.add.sprite(-50,-50,'background');
    background.width = game.world.width + 90;   //width of the background
    background.height = game.world.height + 100;    //height of the background


    player = create_player(game.world.width /2,game.world.height - 200);      //creating player
    ball = create_ball(game.world.centerX, player.centerY - player.height - 50  );   //creating the ball the center of the world and and little higher of the player
   
   
    ball_launched = false;  //set ball launch to false on start
    ball_velocity = 600;    //initial velocity  
    /* Adding an event on return key */
    enterKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
    enterKey.onDown.add(restartGame, this);
   

    //creating blockage
    blockage = game.add.group();
    create_block();
    blockageFunction();



     //creating button
     button = game.add.button(game.world.width - 50, 0,'button' ,launchBall, this);
     button.height = 50;
     button.width = 50;

     button = game.add.button(game.world.width - 50, 100,'button' ,restartGame, this);
     button.height = 50;
     button.width = 50;
     //end of creating button

       
     /*creating enemies*/
 
     
      germ = game.add.group();
      //creating germs
      createGroupOfGerms(5,155,85);
      createGroupOfGerms(7,65,150);
      createGroupOfGerms(8,20,150 + 70);
      createGroupOfGerms(8,-10,150 + 70 + 70);
      germFunction();  //adding physics to each of every germ
      
    

    

      
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
    game.physics.arcade.collide(blockage,ball);   //ball will collide with the player
    
    //code for bouncing and delete on collision
    for(var i = 0; i < germ.length; i++){
       
       if( game.physics.arcade.overlap( germ.children[i],ball)){
    //    console.log( germ.children[i].key );
        game.physics.arcade.collide(germ,ball);   //ball will collide with the germ
        game.physics.arcade.collide(superGerm,ball);   //ball will collide with the germ
        if(germ.children[i].key == 'superGerm'){
            createSingleGerm(germ.children[i].x, germ.children[i].y);
          // console.log( 'germ created' );
            germ.remove(germ.children[i]);  
            break; 
           
        }else{
            germ.remove(germ.children[i]);  
           // console.log( 'germ deleted' ); 
        }
        
       }
   
    }
    germFunction();    
}

function createSingleGerm(x,y){
    germ.create(x, y, 'germ', 0);   
}
function createGroupOfGerms( amount, _xpos, _ypos){
    for (var i = 0, ypos = _ypos, xpos = _xpos, xposInc = 65, yposInc = 80, origXpos = xpos; i < amount; i++)
    {
               
        var rand = game.rnd.integerInRange(1, 2); 
        if(rand == 1){
            germ.create(180 + xpos, 0 + ypos, 'germ', 0);   
        }else{
            germ.create(180 + xpos, 0 + ypos, 'superGerm', 0);   
        }
        console.log(rand);       
        xpos+=xposInc;
    }

}

function germFunction(){
    for(var i= 0; i < germ.length;i++){
        germ.children[i].anchor.setTo(0.5,0.5);
        game.physics.arcade.enable(germ.children[i]);
        germ.children[i].body.collideWorldBounds = true;
        germ.children[i].body.immovable = true; 
        germ.children[i].width = 70;
        germ.children[i].height = 70;

  
    }
}

function createGroupOfBlockage( amount, _xpos, _ypos){
    for (var i = 0, ypos = _ypos, xpos = _xpos, xposInc = 50, yposInc = 80, origXpos = xpos; i < amount; i++)
    {
        blockage.create(xpos, 0 + ypos, 'blockage', 0);           
        xpos+=xposInc;
    }

}

function blockageFunction(){
    for(var i= 0; i < blockage.length;i++){
        blockage.children[i].anchor.setTo(0.5,0.5);
        game.physics.arcade.enable(blockage.children[i]);
        blockage.children[i].body.collideWorldBounds = true;
        blockage.children[i].body.immovable = true; 
        blockage.children[i].width = 50;
        blockage.children[i].height = 50;
        blockage.children[i].alpha = 0;
    }
}


//create objects
function create_player(x,y){

    var player = game.add.sprite( x,y,'player' ); // adding player to the scene
    player.anchor.setTo( 0.5,0.5 );
    game.physics.arcade.enable(player); //enabling the physics on the object
    player.body.collideWorldBounds = true;
    player.body.immovable = true;   //ball is static
    player.height = 30;
    player.width = 150;

    return player;

}


function create_ball( x,y ){
    var ball = game.add.sprite(x,y,'ball');
    ball.height = 40;
    ball.width = 40;
    ball.anchor.setTo(0.5,0.5);
    game.physics.arcade.enable(ball);
    ball.body.collideWorldBounds = true;
    ball.body.bounce.setTo( 1,1 );      //bounce of the ball
    ball.alpha = 1;
    return ball;

}


function create_block(){
    createGroupOfBlockage(20,0,0);
    createGroupOfBlockage(6,0,75);
    createGroupOfBlockage(5,0,75 + 50);
    createGroupOfBlockage(4,0,75 + 100);
    createGroupOfBlockage(3,0,75 + 150);
    createGroupOfBlockage(2,0,75 + 200);
    for(var i = 1; i < 10; i++){
        createGroupOfBlockage(2,0,75 + 200 + (50 *i));
    }

    createGroupOfBlockage(3,0,75 + 200 + (50 *9) + 50);
    createGroupOfBlockage(3,0,75 + 200 + (50 *9) + 100);
    createGroupOfBlockage(4,0,75 + 200 + (50 *9) + 150);
    createGroupOfBlockage(5,0,75 + 200 + (50 *9) + 200);
    createGroupOfBlockage(16,0,75 + 200 + (50 *9) + 250);
    createGroupOfBlockage(2,game.world.width- 50 * 2,900 + 25);
    createGroupOfBlockage(2,game.world.width- 50 * 2,850 + 25);
    createGroupOfBlockage(2,game.world.width- 50 * 2,800 + 25);
    createGroupOfBlockage(2,game.world.width- 50 * 2,750 + 25);
    createGroupOfBlockage(3,game.world.width- 50 * 2,700 + 25);
    createGroupOfBlockage(4,game.world.width- 50 * 2,650 + 25);
    createGroupOfBlockage(4,game.world.width- 50 * 2,600 + 25);
    createGroupOfBlockage(3,game.world.width- 50 * 2,550 + 25);
    createGroupOfBlockage(3,game.world.width- 50 * 3,500 + 25);
    createGroupOfBlockage(3,game.world.width- 50 * 3,450 + 25);
    createGroupOfBlockage(3,game.world.width- 50 * 3,400 + 25);
    createGroupOfBlockage(2,game.world.width- 50 * 2,350 + 25);
    createGroupOfBlockage(1,game.world.width- 50 * 1,300 + 25);
    createGroupOfBlockage(1,game.world.width- 50 * 1,250 + 25);
    createGroupOfBlockage(1,game.world.width- 50 * 1,200 + 25);
    createGroupOfBlockage(1,game.world.width- 50 * 1,150 + 25);
    createGroupOfBlockage(1,game.world.width- 50 * 1,100 + 25);
    createGroupOfBlockage(2,game.world.width- 50 * 2,50 + 25);

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
        
    if(paddle.x < (paddle.width   /2 ) +160 ){
        paddle.x = (paddle.width   /2 ) +160;
    }else if(paddle.x > (game.world.width - paddle.width /2)  -120 ){
        paddle.x = (game.world.width - paddle.width /2)  -120 ;
    }
}

function launch_ball(){
        
    if(ball_launched){
        //resets the location and speed of the ball
        ball.x =   game.world.centerX;
        ball.y = player.centerY - player.height - 50;
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
 



