// Durée d'un tour en secondes
const TURN_DURATION = 30;

const DECK_INIT = {
    dices: [
        { id: 1, value: '', locked: true },
        { id: 2, value: '', locked: true },
        { id: 3, value: '', locked: true },
        { id: 4, value: '', locked: true },
        { id: 5, value: '', locked: true },
    ],
    rollsCounter: 1,
    rollsMaximum: 3
};

const CHOICES_INIT = {
    isDefi: false,
    isSec: false,
    idSelectedChoice: null,
    availableChoices: [],
};

const GRID_INIT = [
    [
        { viewContent: '1', id: 'brelan1', owner: null, canBeChecked: false },
        { viewContent: '3', id: 'brelan3', owner: null, canBeChecked: false },
        { viewContent: 'Défi', id: 'defi', owner: null, canBeChecked: false },
        { viewContent: '4', id: 'brelan4', owner: null, canBeChecked: false },
        { viewContent: '6', id: 'brelan6', owner: null, canBeChecked: false },
    ],
    [
        { viewContent: '2', id: 'brelan2', owner: null, canBeChecked: false },
        { viewContent: 'Carré', id: 'carre', owner: null, canBeChecked: false },
        { viewContent: 'Sec', id: 'sec', owner: null, canBeChecked: false },
        { viewContent: 'Full', id: 'full', owner: null, canBeChecked: false },
        { viewContent: '5', id: 'brelan5', owner: null, canBeChecked: false },
    ],
    [
        { viewContent: '≤8', id: 'moinshuit', owner: null, canBeChecked: false },
        { viewContent: 'Full', id: 'full', owner: null, canBeChecked: false },
        { viewContent: 'Yam', id: 'yam', owner: null, canBeChecked: false },
        { viewContent: 'Défi', id: 'defi', owner: null, canBeChecked: false },
        { viewContent: 'Suite', id: 'suite', owner: null, canBeChecked: false },
    ],
    [
        { viewContent: '6', id: 'brelan6', owner: null, canBeChecked: false },
        { viewContent: 'Sec', id: 'sec', owner: null, canBeChecked: false },
        { viewContent: 'Suite', id: 'suite', owner: null, canBeChecked: false },
        { viewContent: '≤8', id: 'moinshuit', owner: null, canBeChecked: false },
        { viewContent: '1', id: 'brelan1', owner: null, canBeChecked: false },
    ],
    [
        { viewContent: '3', id: 'brelan3', owner: null, canBeChecked: false },
        { viewContent: '2', id: 'brelan2', owner: null, canBeChecked: false },
        { viewContent: 'Carré', id: 'carre', owner: null, canBeChecked: false },
        { viewContent: '5', id: 'brelan5', owner: null, canBeChecked: false },
        { viewContent: '4', id: 'brelan4', owner: null, canBeChecked: false },
    ]
];

const ALL_COMBINATIONS = [
    { value: 'Brelan1', id: 'brelan1' },
    { value: 'Brelan2', id: 'brelan2' },
    { value: 'Brelan3', id: 'brelan3' },
    { value: 'Brelan4', id: 'brelan4' },
    { value: 'Brelan5', id: 'brelan5' },
    { value: 'Brelan6', id: 'brelan6' },
    { value: 'Full', id: 'full' },
    { value: 'Carré', id: 'carre' },
    { value: 'Yam', id: 'yam' },
    { value: 'Suite', id: 'suite' },
    { value: '≤8', id: 'moinshuit' },
    { value: 'Sec', id: 'sec' },
    { value: 'Défi', id: 'defi' }
];

const GAME_INIT = {
    gameState: {
        currentTurn: 'player:1',
        timer: null,
        player1Score: 0,
        player2Score: 0,
        choices: {},
        deck: {}
    }
}

const GameService = {

    init: {
        gameState: () => {
            const game = { ...GAME_INIT };
            game['gameState']['timer'] = TURN_DURATION;
            game['gameState']['deck'] = { ...DECK_INIT };
            game['gameState']['choices'] = { ...CHOICES_INIT };
            game['gameState']['grid'] = [ ...GRID_INIT];
            return game;
        },

        deck: () => {
            return { ...DECK_INIT };
        },

        choices: () => {
            return { ...CHOICES_INIT };
        },

        grid: () => {
            return [ ...GRID_INIT];
        }
    },

    send: {
        forPlayer: {
            viewGameState: (playerKey, game) => {
                return {
                    inQueue: false,
                    inGame: true,
                    idPlayer:
                        (playerKey === 'player:1')
                            ? game.player1Socket.id
                            : game.player2Socket.id,
                    idOpponent:
                        (playerKey === 'player:1')
                            ? game.player2Socket.id
                            : game.player1Socket.id
                };
            },

            viewQueueState: () => {
                return {
                    inQueue: true,
                    inGame: false,
                };
            },

            gameTimer: (playerKey, gameState) => {
                const playerTimer = gameState.currentTurn === playerKey ? gameState.timer : 0;
                const opponentTimer = gameState.currentTurn === playerKey ? 0 : gameState.timer;
                return { playerTimer: playerTimer, opponentTimer: opponentTimer };
            },

            deckViewState: (playerKey, gameState) => {
                const deckViewState = {
                    displayPlayerDeck: gameState.currentTurn === playerKey,
                    displayOpponentDeck: gameState.currentTurn !== playerKey,
                    displayRollButton: gameState.deck.rollsCounter <= gameState.deck.rollsMaximum,
                    rollsCounter: gameState.deck.rollsCounter,
                    rollsMaximum: gameState.deck.rollsMaximum,
                    dices: gameState.deck.dices
                };
                return deckViewState;
            },

            choicesViewState: (playerKey, gameState) => {

                const choicesViewState = {
                    displayChoices: true,
                    canMakeChoice: playerKey === gameState.currentTurn,
                    idSelectedChoice: gameState.choices.idSelectedChoice,
                    availableChoices: gameState.choices.availableChoices
                }

                return choicesViewState;
            },

            gridViewState: (playerKey, gameState) => {

                return {
                    displayGrid: true,
                    canSelectCells: (playerKey === gameState.currentTurn) && (gameState.choices.availableChoices.length > 0),
                    grid: gameState.grid
                };

            },
            scoreViewState: (playerKey, gameState) => {
                const score = gameState.score; // Récupérer le score du gameState
                const scoreView = {
                    playerKey: playerKey,
                    score: score
                    // Vous pouvez ajouter d'autres détails du score ici si nécessaire
                };
                return scoreView
            },
            updateScore: (playerKey, gameState) => {
                console.log("le debut",playerKey)
                console.log("le suivant oubien",gameState.currentTurn)
                const playerScore = gameState.currentTurn === playerKey ? gameState.player1Score : gameState.player2Score;
                const opponentScore = gameState.currentTurn === playerKey ? gameState.player2Score : gameState.player1Score;
                console.log("playerScore:",playerScore, "opponentScore:", opponentScore)
                return { playerScore: playerScore, opponentScore: opponentScore };
            },
            
        }
    },

    

    timer: {  
        getTurnDuration: () => {
            return TURN_DURATION;
        }
    },

    dices: {
        roll: (dicesToRoll) => {
            const rolledDices = dicesToRoll.map(dice => {
                if (dice.value === "") {
                    // Si la valeur du dé est vide, alors on le lance en mettant le flag locked à false
                    const newValue = String(Math.floor(Math.random() * 6) + 1); // Convertir la valeur en chaîne de caractères
                    return {
                        id: dice.id,
                        value: newValue,
                        locked: false
                    };
                } else if (!dice.locked) {
                    // Si le dé n'est pas verrouillé et possède déjà une valeur, alors on le relance
                    const newValue = String(Math.floor(Math.random() * 6) + 1);
                    return {
                        ...dice,
                        value: newValue
                    };
                } else {
                    // Si le dé est verrouillé ou a déjà une valeur mais le flag locked est true, on le laisse tel quel
                    return dice;
                }
            });
            return rolledDices;
        },

        lockEveryDice: (dicesToLock) => {
            const lockedDices = dicesToLock.map(dice => ({
                ...dice,
                locked: true // Verrouille chaque dé
            }));
            return lockedDices;
        }
    },

    choices: {
        findCombinations: (dices, isDefi, isSec) => {
            const availableCombinations = [];
            const allCombinations = ALL_COMBINATIONS;

            const counts = Array(7).fill(0); // Tableau pour compter le nombre de dés de chaque valeur (de 1 à 6)
            let hasPair = false; // Pour vérifier si une paire est présente
            let threeOfAKindValue = null; // Stocker la valeur du brelan
            let hasThreeOfAKind = false; // Pour vérifier si un brelan est présent
            let hasFourOfAKind = false; // Pour vérifier si un carré est présent
            let hasFiveOfAKind = false; // Pour vérifier si un Yam est présent
            let hasStraight = false; // Pour vérifier si une suite est présente
            let sum = 0; // Somme des valeurs des dés

            // Compter le nombre de dés de chaque valeur et calculer la somme
            for (let i = 0; i < dices.length; i++) {
                const diceValue = parseInt(dices[i].value);
                counts[diceValue]++;
                sum += diceValue;
            }

            // Vérifier les combinaisons possibles
            for (let i = 1; i <= 6; i++) {
                if (counts[i] === 2) {
                    hasPair = true;
                } else if (counts[i] === 3) {
                    threeOfAKindValue = i;
                    hasThreeOfAKind = true;
                } else if (counts[i] === 4) {
                    threeOfAKindValue = i;
                    hasThreeOfAKind = true;
                    hasFourOfAKind = true;
                } else if (counts[i] === 5) {
                    threeOfAKindValue = i;
                    hasThreeOfAKind = true;
                    hasFourOfAKind = true;
                    hasFiveOfAKind = true;
                }
            }

            const sortedValues = dices.map(dice => parseInt(dice.value)).sort((a, b) => a - b); // Trie les valeurs de dé

            // Vérifie si les valeurs triées forment une suite
            hasStraight = sortedValues.every((value, index) => index === 0 || value === sortedValues[index - 1] + 1);

            // Vérifier si la somme ne dépasse pas 8
            const isLessThanEqual8 = sum <= 8;

            // Retourner les combinaisons possibles via leur ID
            allCombinations.forEach(combination => {
                if (
                    (combination.id.includes('brelan') && hasThreeOfAKind && parseInt(combination.id.slice(-1)) === threeOfAKindValue) ||
                    (combination.id === 'full' && hasPair && hasThreeOfAKind) ||
                    (combination.id === 'carre' && hasFourOfAKind) ||
                    (combination.id === 'yam' && hasFiveOfAKind) ||
                    (combination.id === 'suite' && hasStraight) ||
                    (combination.id === 'moinshuit' && isLessThanEqual8) ||
                    (combination.id === 'defi' && isDefi)
                ) {
                    availableCombinations.push(combination);
                }
            });


            const notOnlyBrelan = availableCombinations.some(combination => !combination.id.includes('brelan'));

            if (isSec && availableCombinations.length > 0 && notOnlyBrelan) {
                availableCombinations.push(allCombinations.find(combination => combination.id === 'sec'));
            }

            return availableCombinations;
        }
    },

    grid: {

        resetcanBeCheckedCells: (grid) => {
            const updatedGrid = grid.map(row => row.map(cell => {
                return { ...cell, canBeChecked: false };    
            }));

            return updatedGrid;
        },

        updateGridAfterSelectingChoice: (idSelectedChoice, grid) => {

            const updatedGrid = grid.map(row => row.map(cell => {
                if (cell.id === idSelectedChoice && cell.owner === null) {
                    return { ...cell, canBeChecked: true };
                } else {
                    return cell;
                }
            }));

            return updatedGrid;
        },

        selectCell: (idCell, rowIndex, cellIndex, currentTurn, grid) => {
            const updatedGrid = grid.map((row, rowIndexParsing) => row.map((cell, cellIndexParsing) => {
                if ((cell.id === idCell) && (rowIndexParsing === rowIndex) && (cellIndexParsing === cellIndex)) {
                    return { ...cell, owner: currentTurn };
                } else {
                    return cell;
                }
            }));
        
            return updatedGrid;
        },
        calculateScore: (selectedCells, grid) => {
            let score = 0;
            
            // Parcourir les cellules sélectionnées par le joueur
            selectedCells.forEach(selectedCell => {
                // Trouver la cellule correspondante dans la grille
                const row = selectedCell.row;
                const col = selectedCell.col;
                const cell = grid[row][col];
                
                // Vérifier la combinaison de la cellule et attribuer des points en conséquence
                switch(cell.id) {
                    case 'brelan1':
                    case 'brelan2':
                    case 'brelan3':
                    case 'brelan4':
                    case 'brelan5':
                    case 'brelan6':
                        // Brelan - somme des valeurs des dés
                        score += cell.value.reduce((acc, curr) => acc + parseInt(curr), 0);
                        break;
                    case 'carre':
                        // Carré - somme des valeurs des dés
                        score += cell.value.reduce((acc, curr) => acc + parseInt(curr), 0);
                        break;
                    case 'full':
                        // Full - 25 points
                        score += 25;
                        break;
                    case 'yam':
                        // Yam - 50 points
                        score += 50;
                        break;
                    case 'suite':
                        // Suite - 40 points
                        score += 40;
                        break;
                    case 'moinshuit':
                        // ≤8 - somme des valeurs des dés
                        score += cell.value.reduce((acc, curr) => acc + parseInt(curr), 0);
                        break;
                    case 'sec':
                        // Sec - somme des valeurs des dés
                        score += cell.value.reduce((acc, curr) => acc + parseInt(curr), 0);
                        break;
                    case 'defi':
                        // Défi - 30 points
                        score += 30;
                        break;
                    // Ajoutez d'autres cas pour d'autres combinaisons si nécessaire
                }
            });
            
            return score;
        },
        
        checkWinCondition(grid, currentPlayer) {
            // Fonction pour vérifier l'alignement horizontal
            const checkHorizontal = () => {
                for (let row = 0; row < grid.length; row++) {
                    let consecutiveCount = 0;
                    for (let col = 0; col < grid[row].length; col++) {
                        if (grid[row][col].owner !== currentPlayer) {
                            consecutiveCount = 0; // Réinitialiser le compteur s'il y a une interruption
                        } else {
                            consecutiveCount++;
                            if (consecutiveCount === 5) {
                                return true; // Un alignement de cinq pions a été trouvé
                            }
                        }
                    }
                }
                return false; // Aucun alignement de cinq pions trouvé
            };
        
            // Fonction pour vérifier l'alignement vertical
            const checkVertical = () => {
                for (let col = 0; col < grid[0].length; col++) {
                    let consecutiveCount = 0;
                    for (let row = 0; row < grid.length; row++) {
                        if (grid[row][col].owner !== currentPlayer) {
                            consecutiveCount = 0; // Réinitialiser le compteur s'il y a une interruption
                        } else {
                            consecutiveCount++;
                            if (consecutiveCount === 5) {
                                return true; // Un alignement de cinq pions a été trouvé
                            }
                        }
                    }
                }
                return false; // Aucun alignement de cinq pions trouvé
            };
        
            // Fonction pour vérifier l'alignement en diagonale (de gauche à droite)
            const checkDiagonalLR = () => {
                for (let row = 0; row < grid.length - 4; row++) {
                    for (let col = 0; col < grid[row].length - 4; col++) {
                        let consecutiveCount = 0;
                        for (let i = 0; i < 5; i++) {
                            if (grid[row + i][col + i].owner !== currentPlayer) {
                                consecutiveCount = 0; // Réinitialiser le compteur s'il y a une interruption
                            } else {
                                consecutiveCount++;
                                if (consecutiveCount === 5) {
                                    return true; // Un alignement de cinq pions a été trouvé
                                }
                            }
                        }
                    }
                }
                return false; // Aucun alignement de cinq pions trouvé
            };
        
            // Fonction pour vérifier l'alignement en diagonale (de droite à gauche)
            const checkDiagonalRL = () => {
                for (let row = 0; row < grid.length - 4; row++) {
                    for (let col = grid[row].length - 1; col >= 4; col--) {
                        let consecutiveCount = 0;
                        for (let i = 0; i < 5; i++) {
                            if (grid[row + i][col - i].owner !== currentPlayer) {
                                consecutiveCount = 0; // Réinitialiser le compteur s'il y a une interruption
                            } else {
                                consecutiveCount++;
                                if (consecutiveCount === 5) {
                                    return true; // Un alignement de cinq pions a été trouvé
                                }
                            }
                        }
                    }
                }
                return false; // Aucun alignement de cinq pions trouvé
            };
        
            // Appel des fonctions de vérification
            if (checkHorizontal() || checkVertical() || checkDiagonalLR() || checkDiagonalRL()) {
                return true; // Un alignement de cinq pions a été trouvé
            } else {
                return false; // Aucun alignement de cinq pions trouvé
            }
        },
        

        calculateScoreWithAlignments: (grid, player) => {
                let score = 0;
                console.log("palyer ",player)
                // Fonction pour vérifier si un alignement de pions est présent dans une ligne
                const checkAlignmentInRow = (row) => {
                    let count = 0;
                    for (let i = 0; i < row.length; i++) {
                        
                        console.log("owner",row[i].owner)
                        if (row[i].owner === player) {
                            console.log("count",count)
                            count++;
                        } else {
                            count = 0;
                        }
                        if (count >= 3) {
                            score += 1;
                        }
                        if (count === 4) {
                            score += 1;
                        }
                    }
                };
        
                // Fonction pour vérifier si un alignement de pions est présent dans une colonne
                const checkAlignmentInColumn = (columnIndex) => {
                    let count = 0;
                    for (let i = 0; i < grid.length; i++) {
                        if (grid[i][columnIndex].owner === player) {
                            count++;
                        } else {
                            count = 0;
                        }
                        if (count >= 3) {
                            score += 1;
                        }
                        if (count === 4) {
                            score += 1;
                        }
                    }
                };
        
                // Fonction pour vérifier si un alignement de pions est présent dans une diagonale
                const checkAlignmentInDiagonal = (startRowIndex, startColumnIndex, direction) => {
                    let count = 0;
                    let rowIndex = startRowIndex;
                    let columnIndex = startColumnIndex;
                    while (rowIndex >= 0 && rowIndex < grid.length && columnIndex >= 0 && columnIndex < grid[0].length) {
                        if (grid[rowIndex][columnIndex].owner === player) {
                            count++;
                        } else {
                            count = 0;
                        }
                        if (count >= 3) {
                            score += 1;
                        }
                        if (count === 4) {
                            score += 1;
                        }
                        if (direction === 'up-right' || direction === 'down-right') {
                            rowIndex++;
                        } else {
                            rowIndex--;
                        }
                        if (direction === 'up-left' || direction === 'up-right') {
                            columnIndex++;
                        } else {
                            columnIndex--;
                        }
                    }
                };
        
                // Parcours de la grille pour vérifier les alignements
                for (let i = 0; i < grid.length; i++) {
                    checkAlignmentInRow(grid[i]);
                }
                for (let i = 0; i < grid[0].length; i++) {
                    checkAlignmentInColumn(i);
                }
                for (let i = 0; i < grid.length; i++) {
                    checkAlignmentInDiagonal(i, 0, 'up-right');
                    checkAlignmentInDiagonal(i, 0, 'down-right');
                    checkAlignmentInDiagonal(i, grid[0].length - 1, 'up-left');
                    checkAlignmentInDiagonal(i, grid[0].length - 1, 'down-left');
                }
                console.log("ssssssssssssssss",score)
                return score;
        },
        
            
        checkGameEnd: (grid, player1Score, player2Score) => {
                    // Vérifier s'il reste des pions à chaque joueur
                    const player1HasPions = player1Score < 12;
                    const player2HasPions = player2Score < 12;
            
                    // Vérifier si l'un des joueurs a réalisé un alignement de cinq pions
                    const player1Won = checkWinCondition(grid, 'player1');
                    const player2Won = checkWinCondition(grid, 'player2');
            
                    // Vérifier les conditions de fin de partie
                    if (!player1HasPions || !player2HasPions || player1Won || player2Won) {
                        // La partie est terminée
                        let winner = null;
                        if (player1Won) {
                            winner = 'player1';
                        } else if (player2Won) {
                            winner = 'player2';
                        } else if (!player1HasPions && !player2HasPions) {
                            // En cas d'égalité, le joueur avec le score le plus élevé gagne
                            if (player1Score > player2Score) {
                                winner = 'player1';
                            } else if (player2Score > player1Score) {
                                winner = 'player2';
                            }
                        }
                        return {
                            gameEnd: true,
                            winner: winner
                        };
                    } else {
                        // La partie continue
                        return {
                            gameEnd: false,
                            winner: null
                        };
                    }
        },
         
            
            

    },

    utils: {
        // Return game index in global games array by id
        findGameIndexById: (games, idGame) => {
            for (let i = 0; i < games.length; i++) {
                if (games[i].idGame === idGame) {
                    return i; // Retourne l'index du jeu si le socket est trouvé
                }
            }
            return -1;
        },

        findGameIndexBySocketId: (games, socketId) => {
            for (let i = 0; i < games.length; i++) {
                if (games[i].player1Socket.id === socketId || games[i].player2Socket.id === socketId) {
                    return i; // Retourne l'index du jeu si le socket est trouvé
                }
            }
            return -1;
        },

        findDiceIndexByDiceId: (dices, idDice) => {
            for (let i = 0; i < dices.length; i++) {
                if (dices[i].id === idDice) {
                    return i; // Retourne l'index du jeu si le socket est trouvé
                }
            }
            return -1;
        }
    }
}

module.exports = GameService;
