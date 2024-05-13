const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
var uniqid = require('uniqid');
const GameService = require('./services/game.service');

// ---------------------------------------------------
// -------- CONSTANTS AND GLOBAL VARIABLES -----------
// ---------------------------------------------------
let games = [];
let queue = [];

// ------------------------------------
// -------- EMITTER METHODS -----------
// ------------------------------------

const updateClientsViewTimers = (game) => {
  game.player1Socket.emit('game.timer', GameService.send.forPlayer.gameTimer('player:1', game.gameState));
  game.player2Socket.emit('game.timer', GameService.send.forPlayer.gameTimer('player:2', game.gameState));
};

const updateClientsViewDecks = (game) => {
  setTimeout(() => {
    game.player1Socket.emit('game.deck.view-state', GameService.send.forPlayer.deckViewState('player:1', game.gameState));
    game.player2Socket.emit('game.deck.view-state', GameService.send.forPlayer.deckViewState('player:2', game.gameState));
  }, 200);
};

const updateClientsViewScore = (game) => {
  game.player1Socket.emit('game.score.update', {
      player: 'player:1',
      score: game.gameState.player1Score
  });
  game.player2Socket.emit('game.score.update', {
      player: 'player:2',
      score: game.gameState.player2Score
  });
};

/*  const updateClientsViewScore = (game) => {
  setTimeout(() => {
    game.player1Socket.emit('game.score.update', GameService.send.forPlayer.updateScore('player:1', game.gameState));
    game.player2Socket.emit('game.score.update', GameService.send.forPlayer.updateScore('player:2', game.gameState));
  }, 200);
};  */

const updateClientsViewChoices = (game) => {
  setTimeout(() => {
    game.player1Socket.emit('game.choices.view-state', GameService.send.forPlayer.choicesViewState('player:1', game.gameState));
    game.player2Socket.emit('game.choices.view-state', GameService.send.forPlayer.choicesViewState('player:2', game.gameState));
  }, 200);
}

const updateClientsViewGrid = (game) => {
  setTimeout(() => {
    game.player1Socket.emit('game.grid.view-state', GameService.send.forPlayer.gridViewState('player:1', game.gameState));
    game.player2Socket.emit('game.grid.view-state', GameService.send.forPlayer.gridViewState('player:2', game.gameState));
  }, 200)
}

// ---------------------------------
// -------- GAME METHODS -----------
// ---------------------------------

const createGame = (player1Socket, player2Socket) => {

  // init objet (game) with this first level of structure:
  // - gameState : { .. evolutive object .. }
  // - idGame : just in case ;)
  // - player1Socket: socket instance key "joueur:1"
  // - player2Socket: socket instance key "joueur:2"
  const newGame = GameService.init.gameState();
  newGame['idGame'] = uniqid();
  newGame['player1Socket'] = player1Socket;
  newGame['player2Socket'] = player2Socket;

  // push game into 'games' global array
  games.push(newGame);

  const gameIndex = GameService.utils.findGameIndexById(games, newGame.idGame);

  // just notifying screens that game is starting
  games[gameIndex].player1Socket.emit('game.start', GameService.send.forPlayer.viewGameState('player:1', games[gameIndex]));
  games[gameIndex].player2Socket.emit('game.start', GameService.send.forPlayer.viewGameState('player:2', games[gameIndex]));

  // we update views
  updateClientsViewTimers(games[gameIndex]);
  updateClientsViewDecks(games[gameIndex]);
  updateClientsViewGrid(games[gameIndex]);

  // timer every second
  const gameInterval = setInterval(() => {

    // timer variable decreased
    games[gameIndex].gameState.timer--;

    // emit timer to both clients every seconds
    updateClientsViewTimers(games[gameIndex]);

    // if timer is down to 0, we end turn
    if (games[gameIndex].gameState.timer === 0) {

      // switch currentTurn variable
      games[gameIndex].gameState.currentTurn = games[gameIndex].gameState.currentTurn === 'player:1' ? 'player:2' : 'player:1';
      
      // reset timer
      games[gameIndex].gameState.timer = GameService.timer.getTurnDuration();

      // reset deck / choices / grid states
      games[gameIndex].gameState.deck = GameService.init.deck();
      games[gameIndex].gameState.choices = GameService.init.choices();
      games[gameIndex].gameState.grid = GameService.grid.resetcanBeCheckedCells(games[gameIndex].gameState.grid);

      // reset views also
      updateClientsViewTimers(games[gameIndex]);
      updateClientsViewDecks(games[gameIndex]);
      updateClientsViewChoices(games[gameIndex]);
      updateClientsViewGrid(games[gameIndex]);
    }

  }, 1000);

  // remove intervals at deconnection
  player1Socket.on('disconnect', () => {
    clearInterval(gameInterval);
  });

  player2Socket.on('disconnect', () => {
    clearInterval(gameInterval);
  });

};

const newPlayerInQueue = (socket) => {

  queue.push(socket);

  // 'queue' management
  if (queue.length >= 2) {
    const player1Socket = queue.shift();
    const player2Socket = queue.shift();
    createGame(player1Socket, player2Socket);
  }
  else {
    socket.emit('queue.added', GameService.send.forPlayer.viewQueueState());
  }
};

// ---------------------------------------
// -------- SOCKETS MANAGEMENT -----------
// ---------------------------------------

io.on('connection', socket => {
  console.log(`[${socket.id}] socket connected`);

  socket.on('queue.join', () => {
    console.log(`[${socket.id}] new player in queue `)
    newPlayerInQueue(socket);
  });

  socket.on('game.dices.roll', () => {

    const gameIndex = GameService.utils.findGameIndexBySocketId(games, socket.id);

    // if not last throw
    if (games[gameIndex].gameState.deck.rollsCounter < games[gameIndex].gameState.deck.rollsMaximum) {

      // dices management
      games[gameIndex].gameState.deck.dices = GameService.dices.roll(games[gameIndex].gameState.deck.dices);
      games[gameIndex].gameState.deck.rollsCounter++;

    }
    // if last throw
    else {

      // dices management 
      games[gameIndex].gameState.deck.dices = GameService.dices.roll(games[gameIndex].gameState.deck.dices);
      games[gameIndex].gameState.deck.rollsCounter++;
      games[gameIndex].gameState.deck.dices = GameService.dices.lockEveryDice(games[gameIndex].gameState.deck.dices);

      // temporary put timer at 5 sec to test turn switching 
      games[gameIndex].gameState.timer = 5;
    }

    // combinations management
    const dices = games[gameIndex].gameState.deck.dices;
    const isDefi = false;
    const isSec = games[gameIndex].gameState.deck.rollsCounter === 2;

    const combinations = GameService.choices.findCombinations(dices, isDefi, isSec);
    games[gameIndex].gameState.choices.availableChoices = combinations;


    // emit to views new state
    updateClientsViewDecks(games[gameIndex]);
    updateClientsViewChoices(games[gameIndex]);
  });

  socket.on('game.dices.lock', (idDice) => {

    const gameIndex = GameService.utils.findGameIndexBySocketId(games, socket.id);
    const indexDice = GameService.utils.findDiceIndexByDiceId(games[gameIndex].gameState.deck.dices, idDice);

    // reverse flag 'locked'
    games[gameIndex].gameState.deck.dices[indexDice].locked = !games[gameIndex].gameState.deck.dices[indexDice].locked;

    updateClientsViewDecks(games[gameIndex]);
  });

  socket.on('game.choices.selected', (data) => {

    // gestion des choix
    const gameIndex = GameService.utils.findGameIndexBySocketId(games, socket.id);
    games[gameIndex].gameState.choices.idSelectedChoice = data.choiceId;

    // gestion de la grid
    games[gameIndex].gameState.grid = GameService.grid.resetcanBeCheckedCells(games[gameIndex].gameState.grid);
    games[gameIndex].gameState.grid = GameService.grid.updateGridAfterSelectingChoice(data.choiceId, games[gameIndex].gameState.grid);
    
    updateClientsViewChoices(games[gameIndex]);
    updateClientsViewGrid(games[gameIndex]);
  });

  socket.on('game.grid.selected', (data) => {

    const gameIndex = GameService.utils.findGameIndexBySocketId(games, socket.id);

    games[gameIndex].gameState.grid = GameService.grid.resetcanBeCheckedCells(games[gameIndex].gameState.grid);
    games[gameIndex].gameState.grid = GameService.grid.selectCell(data.cellId, data.rowIndex, data.cellIndex, games[gameIndex].gameState.currentTurn, games[gameIndex].gameState.grid);

    // Here calcul score
    //-------------------------------------------
    // Calcul du score pour le joueur 1
  const player1Score = GameService.grid.calculateScoreWithAlignments(games[gameIndex].gameState.grid, 'player:1');
  games[gameIndex].gameState.player1Score = player1Score;
  console.log("score1",player1Score)

// Calcul du score pour le joueur 2
  const player2Score = GameService.grid.calculateScoreWithAlignments(games[gameIndex].gameState.grid, 'player:2');
  games[gameIndex].gameState.player2Score = player2Score;
  console.log("score2",player2Score)


    // Envoyer le score mis à jour aux clients
  
      updateClientsViewScore(games[gameIndex])
      // Vérification de la fin de partie (à implémenter)
     /*  const gameEnded =GameService.grid.checkGameEnd(GameService.grid, player1Score,player2Score); // À implémenter
  
      // Si la partie n'est pas terminée, passage au tour suivant
      if (!gameEnded) {
          games[gameIndex].gameState.currentTurn = games[gameIndex].gameState.currentTurn === 'player:1' ? 'player:2' : 'player:1';
          games[gameIndex].gameState.timer = GameService.timer.getTurnDuration();
          games[gameIndex].gameState.deck = GameService.init.deck();
          games[gameIndex].gameState.choices = GameService.init.choices();
  
          games[gameIndex].player1Socket.emit('game.timer', GameService.send.forPlayer.gameTimer('player:1', games[gameIndex].gameState));
          games[gameIndex].player2Socket.emit('game.timer', GameService.send.forPlayer.gameTimer('player:2', games[gameIndex].gameState));
  
          updateClientsViewDecks(games[gameIndex]);
          updateClientsViewChoices(games[gameIndex]);
          updateClientsViewGrid(games[gameIndex]);
      } else {
          // La partie est terminée, faire quelque chose (par exemple, afficher un message de fin de jeu)
          console.log('La partie est terminée !');
      } */
  








    //---------------------------------------------------------------------

    games[gameIndex].gameState.currentTurn = games[gameIndex].gameState.currentTurn === 'player:1' ? 'player:2' : 'player:1';
    games[gameIndex].gameState.timer = GameService.timer.getTurnDuration();

    games[gameIndex].gameState.deck = GameService.init.deck();
    games[gameIndex].gameState.choices = GameService.init.choices();

    games[gameIndex].player1Socket.emit('game.timer', GameService.send.forPlayer.gameTimer('player:1', games[gameIndex].gameState));
    games[gameIndex].player2Socket.emit('game.timer', GameService.send.forPlayer.gameTimer('player:2', games[gameIndex].gameState));

    updateClientsViewDecks(games[gameIndex]);
    updateClientsViewChoices(games[gameIndex]);
    updateClientsViewGrid(games[gameIndex]);
  });
// Du côté client
socket.on('game.score.update', (data) => {
  // Mettre à jour la vue avec les nouveaux scores
  const player = data.player;
  const score = data.score;
  // Mettre à jour l'affichage des scores pour le joueur spécifié
});

  socket.on('disconnect', reason => {
    console.log(`[${socket.id}] socket disconnected - ${reason}`);
  });
});

// -----------------------------------
// -------- SERVER METHODS -----------
// -----------------------------------

app.get('/', (req, res) => res.sendFile('index.html'));

http.listen(3000, function () {
  console.log('listening on *:3000');
});
