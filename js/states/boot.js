    var bootState = {
        preload: function (){
            game.load.image('playButton' , '././assets/play button.png');      // preloading the player image
            game.load.image('bgStart' , '././assets/startBG.jpg');      // preloading the player image
            game.load.image('wasteCrusherLogo' , '././assets/wasteCrusherLogo.png');      // preloading the player image
      
         
        },

        create: function(){
            var backgroundStart = game.add.sprite(0,0,'bgStart');
            backgroundStart.width = game.world.width;
            backgroundStart.height = game.world.height;
            button = game.add.button( 0, 0,'playButton' ,func, this );
            button.height = 80;
            button.width = 206;
            button.x = (game.world.width - button.width/2) - 20;
            button.y = (game.world.height - button.height/2) -20;
            button.anchor.setTo(0.5,0.5);
                        
            var wasteCrusherLogo = game.add.sprite(0,0,'wasteCrusherLogo');
            wasteCrusherLogo.height = 500;
            wasteCrusherLogo.width = 591;
            wasteCrusherLogo.anchor.setTo(0.5,0.5);
            wasteCrusherLogo.x = (game.world.width /2);
            wasteCrusherLogo.y = (game.world.height /2);
            wasteCrusherLogo.alpha = 0;
            game.add.tween(wasteCrusherLogo).to( { alpha: 1 }, 1500, Phaser.Easing.Linear.None, true, 0, 0, false);

        }
    }
    
    function func(){
       game.state.start('instructionState');
    }

    function change(){}
    