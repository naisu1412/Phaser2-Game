var instructionState  = {
    preload : function () {
        game.load.image('bgStart' , '././assets/startBG.jpg');      // preloading the player image
        game.load.image('instruction' , '././assets/instruction.png');
           
    },
 
    create : function(){
        var backgroundStart = game.add.sprite(0,0,'bgStart');
        backgroundStart.width = game.world.width;
        backgroundStart.height = game.world.height;


        buttonGame = game.add.button(0,0,'instruction',gameStart,this);
        buttonGame.anchor.setTo(0.5 , 0.5);
        buttonGame.width = 681;
        buttonGame.height = 785;
        buttonGame.x = (game.world.width /2);
        buttonGame.y = (game.world.height /2);
        buttonGame.events.onInputDown.add(gameStart, this);
        buttonGame.alpha = 0;
        game.add.tween(buttonGame).to( { alpha: 1 }, 1500, Phaser.Easing.Linear.None, true, 0, 0, false);

    }
    
}
var buttonGame;

function gameStart(){
    game.state.start('game_Renal');

}