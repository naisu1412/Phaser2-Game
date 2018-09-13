var game = new Phaser.Game(768, 1024, Phaser.CANVAS, 'gameDiv');


game.state.add('boot', bootState);
game.state.add('game_Renal', game_Renal);
game.state.add('instructionState', instructionState);

game.state.start('boot');