document.addEventListener('DOMContentLoaded', function () {
    const roll1 = document.getElementById('roll1');
    const roll2 = document.getElementById('roll2');
    const startMatch = document.getElementById('startMatch');
    const matchDetails = document.getElementById('matchDetails');
    const winnerDisplay = document.getElementById('winner');
    const imagesFolderPath = 'images/';

    let score1 = 0;
    let score2 = 0;
    let end = false;
    let gameOver = false;
    let phase = "group"; 

    let players = {
        groupA: [
            { name: 'Pakistan', score: 0 },
            { name: 'Germany', score: 0 },
            { name: 'India', score: 0 },
            { name: 'England', score: 0 }
        ],
        groupB: [
            { name: 'Spain', score: 0 },
            { name: 'Australia', score: 0 },
            { name: 'Portugal', score: 0 },
            { name: 'Turkey', score: 0 }
        ]
    };

    let currentMatch = { player1: null, player2: null, group: null };
    let matchSchedule = [];
    let semiFinals = [];
    let finalMatch = null;

    function createMatchSchedule() {
        matchSchedule = [];
        for (let i = 0; i < players.groupA.length; i++) {
            for (let j = i + 1; j < players.groupA.length; j++) {
                matchSchedule.push({ player1: players.groupA[i], player2: players.groupA[j], group: 'groupA' });
            }
        }
        for (let i = 0; i < players.groupB.length; i++) {
            for (let j = i + 1; j < players.groupB.length; j++) {
                matchSchedule.push({ player1: players.groupB[i], player2: players.groupB[j], group: 'groupB' });
            }
        }
    }

    function startNewMatch() {
        if (phase === "group") {
            if (matchSchedule.length === 0) {
                startSemiFinals();
            } else {
                currentMatch = matchSchedule.shift();
                matchDetails.textContent = `${currentMatch.player1.name} vs ${currentMatch.player2.name}`;
            }
        } else if (phase === "semifinals") {
            if (semiFinals.length > 0) {
                currentMatch = semiFinals.shift();
                matchDetails.textContent = `${currentMatch.player1.name} vs ${currentMatch.player2.name}`;
            } else {
                startFinal();
            }
        } else if (phase === "final") {
            currentMatch = finalMatch;
            matchDetails.textContent = `${currentMatch.player1.name} vs ${currentMatch.player2.name}`;
        }


        score1 = 0;
        score2 = 0;
        end = false;
        gameOver = false;
        winnerDisplay.textContent = '';
    }

    function rollDice(player) {
        if (!gameOver) {
            let diceRoll = Math.ceil(Math.random() * 6);
            let diceImage = `${imagesFolderPath}dice${diceRoll}.jpg`;
            let diceImageElement = document.createElement('img');
            diceImageElement.src = diceImage;

            if (player === 1) {
                document.getElementById('diceImage1').innerHTML = '';
                document.getElementById('diceImage1').appendChild(diceImageElement);
                if (diceRoll === 1) {
                    end = true;
                    winnerDisplay.textContent = 'Second player\'s turn';
                } else {
                    score1 += diceRoll;
                }
            } else if (player === 2) {
                document.getElementById('diceImage2').innerHTML = '';
                document.getElementById('diceImage2').appendChild(diceImageElement);
                if (diceRoll === 1) {
                    gameOver = true;
                    determineWinner();
                } else {
                    score2 += diceRoll;
                }
            }
        }
    }

    function determineWinner() {
        if (score1 > score2) {
            currentMatch.player1.score++;
            winnerDisplay.textContent = `${currentMatch.player1.name} wins!`;
        } else {
            currentMatch.player2.score++;
            winnerDisplay.textContent = `${currentMatch.player2.name} wins!`;
        }

        updateScoreDisplay();

        if (phase === "final") {
            let champion = currentMatch.player1.score > currentMatch.player2.score ? currentMatch.player1.name : currentMatch.player2.name;
            winnerDisplay.textContent += ` ${champion} is the champion!`;
        }
    }

    function startSemiFinals() {
        phase = "semifinals";
        let top2A = players.groupA.sort((a, b) => b.score - a.score).slice(0, 2);
        let top2B = players.groupB.sort((a, b) => b.score - a.score).slice(0, 2);

        semiFinals.push({ player1: top2A[0], player2: top2B[1] });
        semiFinals.push({ player1: top2B[0], player2: top2A[1] });

        startNewMatch();
    }

    function startFinal() {
        phase = "final";
        let finalist1 = semiFinals[0].player1.score > semiFinals[0].player2.score ? semiFinals[0].player1 : semiFinals[0].player2;
        let finalist2 = semiFinals[1].player1.score > semiFinals[1].player2.score ? semiFinals[1].player1 : semiFinals[1].player2;
        finalMatch = { player1: finalist1, player2: finalist2 };

        startNewMatch();
    }

    roll1.addEventListener('click', function () {
        if (!gameOver && !end) {
            rollDice(1);
        }
    });

    roll2.addEventListener('click', function () {
        if (!gameOver && end) {
            rollDice(2);
        }
    });

    startMatch.addEventListener('click', startNewMatch);
    createMatchSchedule();

    function updateScoreDisplay() {
        players.groupA.forEach(player => {
            document.getElementById(player.name.toLowerCase()).textContent = player.score;
        });
        players.groupB.forEach(player => {
            document.getElementById(player.name.toLowerCase()).textContent = player.score;
        });
    }
});