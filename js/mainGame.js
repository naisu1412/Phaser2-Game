var game_Renal = {
    
    preload: function (){
        
        game.load.image('player' , './assets/playerPlatform.png');      // preloading the player image
        game.load.image('ball', './assets/player.png');     //preloading the ball image
        game.load.image('button', './assets/buttonStart.png');  //preloading the button start
        game.load.image('germ','./assets/germs.png');
        game.load.image('germ_N','./assets/germs.png');
        game.load.image('superGerm','./assets/superGerm.png');
        game.load.image('background', './assets/background.png');   // this is the kidney
        game.load.image('back_background', './assets/background.jpg');   // this is the kidney
        game.load.image('blockage', './assets/tablet.png');
        game.load.image('dangerousBlockage', './assets/tablet.png');
        game.load.image('info1', './assets/infos/1.png');
        game.load.image('info2', './assets/infos/2.png');
        game.load.image('info3', './assets/infos/3.png');
        game.load.image('info4', './assets/infos/4.png');
        game.load.image('info5', './assets/infos/5.png');
        game.load.image('infoX', './assets/gameOver.png');
        game.load.image('infoWin', './assets/successGame.jpg');
        game.load.image( 'renalog_icon','./assets/logo_renalog.png' );
        game.load.image( 'whiteBG','./assets/whiteBG.png' );
        game.load.physics('physicsData', './json/physicsData.json');

    },
  
    create: function (){
        game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
        counter = maxTime;
        var back_background = game.add.sprite(0,0, 'back_background' );
        var background = game.add.sprite(-50,-50,'background');
        background.width = game.world.width + 90;   //width of the background
        background.height = game.world.height + 100;    //height of the background
    
    
        player = create_player(game.world.width /2,game.world.height - 200);      //creating player
        ball = create_ball(game.world.centerX, player.centerY - player.height - 50  );   //creating the ball the center of the world and and little higher of the player
       
       
        ball_launched = false;  //set ball launch to false on start
        ball_velocity = 400;    //initial velocity  
        /* Adding an event on return key */
        enterKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
        enterKey.onDown.add(restartGame, this);
       
    
        //creating blockage
        blockage = game.add.group();
        create_block();
        blockageFunction();

        // creating dangerous blockage
        dangerousBlockage = game.add.group();
        create_dangerousBlock();
        dangerousBlockageFunction();
        
        
    
      
   
    
         //creating button
        /*
         
         button = game.add.button( game.world.width - 50, 100,'button' ,restartGame, this );
         button.height = 50;
         button.width = 50;



        button = game.add.button( game.world.width - 50, 0,'button' ,fullScreen, this );
        button.height = 50;
        button.width = 50;
        
        */
         //end of creating button
    
           
         /*creating enemies*/
      
         
          germ = game.add.group();
          //creating germs
         
          CreateGroupGermsManual();
    
          //creating white BG
          //top left part
          whiteBG = game.add.sprite(20,20,'whiteBG');
          


          //createGroupOfGerms(8,-10,150 + 70 + 70);
          germFunction(false);  //adding physics to each of every germ
          germ_N = game.add.group();
          //adding timer to the game
          text = game.add.text(35 , whiteBG.height /2 , 'Time: ' + maxTime ,{ 
              font: '30px Arial',
              fill: "#000"
            });

            lifeText = game.add.text( 30,70, 'Life: ' , {
                font:'25px Arial',
                fill: "#000"
        
           });
         
            // info for the game
           info1 = game.add.sprite(game.world.width * 2, game.world.height * 2 ,'info1');
           info1.anchor.setTo(0.5,0.5);
           info1.alpha = 0;
           info1.height = 700;
           info1.width = 700;
           info1.inputEnabled = true;
           info1.events.onInputDown.add(hideInfo, this);
    


           renalog_icon = game.add.sprite(0,0,'renalog_icon');  
           renalog_icon.anchor.setTo(0.5 , 0.5);
           renalog_icon.height = 76;
           renalog_icon.width = 178;
           renalog_icon.y = game.world.height - (renalog_icon.height / 2) - 30;
           renalog_icon.x = renalog_icon.x + (renalog_icon.width / 2) + 10;


           lifeCollection = game.add.group();
          

           createLifeFunction(lifeText.x + lifeText.width + 20,lifeText.y,25);
            launchBall();   //starts the game
    },

    update: function (){
        if(playerLife < 3){
            lifeCollection.remove(lifeCollection.children[playerLife]);
        }


      


        if(counter <= 0 || playerLife <= 0){
            console.log('game over');
           info1.x = game.world.width / 2;
           info1.y = game.world.height / 2;
           info1.alpha = 1;
           game.paused = true;
           info1.loadTexture('infoX');
           playerLife = 0;
    
        }
    
    
    
        if(germ.length == 0 && germ_N.length == 0){
            playerLife = 0;
            console.log( "You won" );
            info1.x = game.world.width / 2;
            info1.y = game.world.height / 2;
    
            info1.width = (game.world.width) - 100 ;
            info1.height = (game.world.height /2) + 50;
    
            info1.alpha = 1;
            game.paused = true;
            info1.loadTexture('infoWin');
        }

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
        //code for bouncing and delete on collision
    
        for(var w = 0; w < germ_N.length; w++){
            if(game.physics.arcade.overlap( germ_N.children[w],ball)){
             //   console.log( "show dialog" );
                game.physics.arcade.collide(germ_N,ball);   //ball will collide with the germ
                germ_N.remove( germ_N.children[w] );  //remove
    
                //hits a score
                //show info
                info1.x = game.world.width / 2;
                info1.y = game.world.height / 2;
                info1.alpha = 1;
                game.paused = true
                playerScore++;
                
    
                var name = 'info'+playerScore;
                info1.loadTexture(name);
    
            }
        
        
        }
    
        for(var i = 0; i < germ.length; i++){
       
           if( game.physics.arcade.overlap( germ.children[i],ball) ){
        //    console.log( germ.children[i].key );
            rot = !rot;     //change rotation
            game.physics.arcade.collide(germ,ball);   //ball will collide with the germ
            game.physics.arcade.collide(superGerm,ball);   //ball will collide with the germ
            
    
            if(germ.children[i].key == 'superGerm'){
                createSingleGerm(germ.children[i].x, germ.children[i].y);
                germ.remove( germ.children[i] ); 
             
                break; 
              
            }
            else{     
                germ.remove( germ.children[i] );  
              
            }
            
           }
       
        }
        //change rotation if the ball hit a blockage or a player
        if( game.physics.arcade.overlap( ball,blockage ) || game.physics.arcade.overlap( ball,player) ){
            rot = !rot;     //change rotation
          
          }



          if( game.physics.arcade.overlap( ball,dangerousBlockage ) ){
            playerLife -= 1;
            console.log( "player life " + playerLife );
          }


    
    
        game.physics.arcade.collide(player,ball);   //ball will collide with the player
        game.physics.arcade.collide(blockage,ball);   //ball will collide with the player
        game.physics.arcade.collide(dangerousBlockage,ball);   //ball will collide with the player
    
    
           // add its functionality
        germFunction(false);
    
    
       if(ball_launched){
           if(rot == true){
    
            ball.angle += 10 ;  
           }else{
            ball.angle -= 10 ;  
    
           }
       }
    }

}


    
    var player; //will contain the paddle
    var enterKey;   //holds the event
    var ball_launched;  // is the ball launched bool
    var ball_velocity;  //will hold the initial speed of the ball
    var germ;
    var blockage;
    var germ_N;
    var maxTime = 90;    //timer of thhe game
    var counter;
    var text = 0;
    var lifeText;
    var gameOver;
    var superGerm;
    var playerLife = 3;
    var dangerousBlockage;
    var renalog_icon;   //renalog icon
    var whiteBG;
    var lifeCollection;
    
    //hide the info 
    function hideInfo(){
        if(info1.key == 'infoX'){
            restartGame();
        }else if(info1.key == 'infoWin'){
            restartGame();
        }
        else{
            info1.alpha  = .5;
            // console.log("hello there");
             info1.y = game.world.height * 2;
             game.paused = false;
        }
    }
    
    
    
    
    function updateCounter() {
        //counter for time
        counter--;
    
        text.setText('Time: ' + counter);
    
    }
    
    
    
    
    
    var rot = true;
    var superGermArrayCounter = 0;  // counter for the superGerm
    var playerScore = 0;
    
    function CreateGroupGermsManual(){
        createGroupOfGerms(4,155,100);
        createGroupOfGerms(6,65,185 + 5);
        createGroupOfGerms(6,20,185 + 90);
    
        console.log( superGermCounter );
        
        if(superGermCounter != 5 ){
            console.log( superGermCounter );
            for(var w = germ.length; w >= 0; w--){
                germ.remove( germ.children[w] );
            }   //clear germ
            superGermCounter = 0;
      
            console.log( 'reloaded' );
            CreateGroupGermsManual();
        }
    }
    
 
    
    function createSingleGerm(x,y){
        
        germ_N.create(x, y, 'germ_N', 0);   
        germFunction(true);
    
    }


    function createLifeFunction(_xpos, _ypos, _spaces){

        for(var i = 0; i < playerLife; i++){
            lifeCollection.create( _xpos + (_spaces * i),_ypos, 'ball', 0 );
            
        }


        for(var z = 0; z<lifeCollection.length;z++){
            lifeCollection.children[z].angle = 90;
            lifeCollection.children[z].width = 30;
            lifeCollection.children[z].height = 15;

        }

    }

    var superGermCounter = 0;
    function createGroupOfGerms( amount, _xpos, _ypos){
    
        for (var i = 0, ypos = _ypos, xpos = _xpos, xposInc = 85, yposInc = 80, origXpos = xpos; i < amount; i++)
        {
                   
            var rand = game.rnd.integerInRange(1, 2); 
            
            if(rand == 1 && superGermCounter < 5){
                germ.create(180 + xpos, 0 + ypos, 'superGerm', 0); 
                superGermCounter += 1;   
            }else{
                germ.create(180 + xpos, 0 + ypos, 'germ', 0);
               
            }
           // console.log(rand);       
            xpos+=xposInc;
        }
      // console.log(superGermCounter);
        
        
        
    
    }
    
    function germFunction(isItN){
        if(isItN == false){
            for(var i= 0; i < germ.length;i++){
                germ.children[i].anchor.setTo(0.5,0.5);
                game.physics.arcade.enable(germ.children[i]);
                germ.children[i].body.collideWorldBounds = true;
                germ.children[i].body.immovable = true; 
                germ.children[i].width = 85;
                germ.children[i].height = 85;
        
          
            }
        }else{
            for(var i= 0; i < germ_N.length;i++){
                germ_N.children[i].anchor.setTo(0.5,0.5);
                game.physics.arcade.enable(germ_N.children[i]);
                germ_N.children[i].body.collideWorldBounds = true;
                germ_N.children[i].body.immovable = true; 
                germ_N.children[i].width = 85;
                germ_N.children[i].height = 85;
            }
        }
       
    }
    
    function createGroupOfBlockage( amount, _xpos, _ypos){
        for (var i = 0, ypos = _ypos, xpos = _xpos, xposInc = 50, yposInc = 80, origXpos = xpos; i < amount; i++)
        {
            blockage.create(xpos, 0 + ypos, 'blockage', 0);           
            xpos+=xposInc;
        }
    
    }

    function createGroupOfDangerousBlockage( amount, _xpos, _ypos){
        for (var i = 0, ypos = _ypos, xpos = _xpos, xposInc = 50, yposInc = 80, origXpos = xpos; i < amount; i++)
        {
            dangerousBlockage.create(xpos, 0 + ypos, 'dangerousBlockage', 0);           
            xpos+=xposInc;
        }
    
    }
    
    function blockageFunction(){
        for(var i= 0; i < blockage.length;i++){
            blockage.children[i].anchor.setTo(0.5,0.5);
            game.physics.arcade.enable( blockage.children[i] );
            blockage.children[i].body.collideWorldBounds = true;
            blockage.children[i].body.immovable = true; 
            blockage.children[i].width = 50;
            blockage.children[i].height = 50;
            blockage.children[i].alpha = 0;
        }
    }

    function dangerousBlockageFunction(){
        for(var i= 0; i < dangerousBlockage.length;i++){
            console.log("test here");
            dangerousBlockage.children[i].anchor.setTo(0.5,0.5);
            game.physics.arcade.enable( dangerousBlockage.children[i] );
            dangerousBlockage.children[i].body.collideWorldBounds = true;
            dangerousBlockage.children[i].body.immovable = true; 
            dangerousBlockage.children[i].width = 50;
            dangerousBlockage.children[i].height = 50;
            dangerousBlockage.children[i].alpha = 0;
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
        ball.height = 25;
        ball.width = 50;
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
        createGroupOfBlockage(2,0,75 + 150);
        createGroupOfBlockage(2,0,75 + 200);
        for(var i = 1; i < 9; i++){
            createGroupOfBlockage(1,0,75 + 200 + (50 *i));
        }
        
        createGroupOfBlockage(2,0,75 + 200 + (50 * 9));
        createGroupOfBlockage(3,0,75 + 200 + (50 *9) + 50);
        createGroupOfBlockage(3,0,75 + 200 + (50 *9) + 100);
        createGroupOfBlockage(4,0,75 + 200 + (50 *9) + 150);
        createGroupOfBlockage(5,0,75 + 200 + (50 *9) + 200);
        

        createGroupOfBlockage(2,game.world.width- 50 * 2,900 + 25);
        createGroupOfBlockage(2,game.world.width- 50 * 2,850 + 25);
        createGroupOfBlockage(2,game.world.width- 50 * 2,800 + 25);
        createGroupOfBlockage(2,game.world.width- 50 * 2,750 + 25);
        createGroupOfBlockage(3,game.world.width- 50 * 2,700 + 25);
        createGroupOfBlockage(4,game.world.width- 50 * 2.5,650 + 25);
        
        createGroupOfBlockage(4,game.world.width- 50 * 3,600 + 25);
        createGroupOfBlockage(3,game.world.width- 50 * 3,550 + 25); 
        createGroupOfBlockage(3,game.world.width- 50 * 3,500 + 25);
        createGroupOfBlockage(3,game.world.width- 50 * 3,450 + 25);
        createGroupOfBlockage(3,game.world.width- 50 * 3,400 + 25);
        createGroupOfBlockage(2,game.world.width- 50 * 2,350 + 25);
        createGroupOfBlockage(1,game.world.width- 50 * 1,300 + 25);
        createGroupOfBlockage(1,game.world.width- 50 * 1,250 + 25);
        createGroupOfBlockage(1,game.world.width- 50 * 1,200 + 25);
        createGroupOfBlockage(1,game.world.width- 50 * 1,150 + 25);
        
        createGroupOfBlockage(1,game.world.width- 50 * 1,100 + 25);
        createGroupOfBlockage(2,game.world.width- 50 * 1,50 + 25);
    }


    function create_dangerousBlock(){
      
        createGroupOfDangerousBlockage(16,0,75 + 200 + (50 *9) + 250);
        
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
            
        if(paddle.x < (paddle.width   / 2 ) +160 ){
            paddle.x = (paddle.width   / 2 ) +160;
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
        if(counter == maxTime ){
            game.time.events.loop(Phaser.Timer.SECOND, updateCounter, this);
            console.log('call me');
        }
        launch_ball();   // set the ball at its starting position and reset the game
     }
     
     function restartGame(){
        playerLife = 3;
        superGermCounter = 0;
        info1.alpha = 0; //hides the info every restart
        game.paused = false;
         counter = maxTime;
         playerScore = 0;;
         this.game.state.restart();  //restarts the game

     }

     function fullScreen(){
       
        if (game.scale.isFullScreen)
        {
            game.scale.stopFullScreen();
        }
        else
        {
            game.scale.startFullScreen(false);
        }
     }
     
    


  
    
    
   
    
    
    
   