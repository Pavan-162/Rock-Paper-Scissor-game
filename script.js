const app = {
    // 1. Centralized State
    state: {
        mode: null, // 'pve' or 'pvp'
        p1Choice: null,
        p2Choice: null,
        p1Score: 0,
        p2Score: 0,
        currentPlayer: 1
    },

    // 2. Cached DOM Elements
    ui: {
        viewMenu: document.getElementById('view-menu'),
        viewGame: document.getElementById('view-game'),
        turnStatus: document.getElementById('turn-status'),
        scoreP1: document.getElementById('score-p1'),
        scoreP2: document.getElementById('score-p2'),
        labelP2: document.getElementById('label-p2'),
        revealLabelP2: document.getElementById('reveal-label-p2'),
        phaseSelect: document.getElementById('selection-phase'),
        phaseResolve: document.getElementById('resolution-phase'),
        boxP1: document.getElementById('reveal-p1'),
        boxP2: document.getElementById('reveal-p2'),
        btnAction: document.getElementById('btn-action'), // Fixed missing comma here
        turnPopup: document.getElementById('turn-popup'),
        popupText: document.getElementById('popup-text')
    },

    emojis: { rock: '✊', paper: '🖐️', scissors: '✌️' },

    // 3. Core Methods
    initGame(mode) {
        this.state.mode = mode;
        this.state.p1Score = 0;
        this.state.p2Score = 0;
        
        const opponent = mode === 'pve' ? 'COM' : 'P2';
        this.ui.labelP2.textContent = opponent;
        this.ui.revealLabelP2.textContent = mode === 'pve' ? 'Computer' : 'Player 2';
        
        this.updateScoreBoard();
        this.switchView('view-game');
        this.startRound();
    },

    showTurnPopup(text, duration = 1500) {
        this.ui.popupText.textContent = text;
        this.ui.turnPopup.classList.remove('hidden');
        
        // Reset and trigger the pop-in animation
        this.ui.popupText.classList.remove('pop-out');
        this.ui.popupText.classList.remove('pop-in');
        void this.ui.popupText.offsetWidth; // Force DOM reflow to restart animation
        this.ui.popupText.classList.add('pop-in');

        // Auto-hide after the specified duration
        setTimeout(() => {
            this.ui.popupText.classList.remove('pop-in');
            this.ui.popupText.classList.add('pop-out');
            
            // Wait for pop-out animation to finish before hiding container
            setTimeout(() => {
                this.ui.turnPopup.classList.add('hidden');
            }, 400); 
        }, duration);
    },

    startRound() {
        this.state.p1Choice = null;
        this.state.p2Choice = null;
        this.state.currentPlayer = 1;

        // Reset UI classes
        this.ui.boxP1.className = 'reveal-box';
        this.ui.boxP2.className = 'reveal-box';
        this.ui.boxP1.textContent = '❓';
        this.ui.boxP2.textContent = '❓';
        
        this.ui.phaseSelect.classList.remove('hidden');
        this.ui.phaseResolve.classList.add('hidden');
        this.ui.btnAction.classList.add('hidden');
        
        this.updateStatus("Player 1, make your move.", "var(--text-main)");
        
        // Trigger Player 1 Popup
        this.showTurnPopup("Player 1's Turn");
    },

    handleMove(choice) {
        if (this.state.currentPlayer === 1) {
            this.state.p1Choice = choice;
            
            if (this.state.mode === 'pve') {
                // Fake a thinking delay for the computer
                this.showTurnPopup("Computer is thinking...", 1200);
                
                setTimeout(() => {
                    const options = ['rock', 'paper', 'scissors'];
                    this.state.p2Choice = options[Math.floor(Math.random() * 3)];
                    this.prepareResolution();
                }, 1600); // Wait for popup to clear before moving to resolution
            } else {
                // Pass and Play Mode
                this.state.currentPlayer = 2;
                this.updateStatus("Player 2, your turn", "var(--primary)");
                
                // Hide selection briefly, show popup, then let P2 pick
                this.ui.phaseSelect.classList.add('hidden');
                this.showTurnPopup("Pass to Player 2", 1500);
                
                setTimeout(() => {
                    this.ui.phaseSelect.classList.remove('hidden');
                }, 1900);
            }
        } else {
            this.state.p2Choice = choice;
            this.prepareResolution();
        }
    },

    prepareResolution() {
        this.ui.phaseSelect.classList.add('hidden');
        this.ui.phaseResolve.classList.remove('hidden');
        this.updateStatus("Moves locked in.", "var(--text-muted)");
        
        this.ui.btnAction.textContent = "Reveal Matches";
        this.ui.btnAction.onclick = () => this.resolveRound();
        this.ui.btnAction.classList.remove('hidden');
    },

    resolveRound() {
        this.ui.btnAction.classList.add('hidden');
        
        // Reveal choices
        this.ui.boxP1.textContent = this.emojis[this.state.p1Choice];
        this.ui.boxP2.textContent = this.emojis[this.state.p2Choice];

        // Determine Winner logic
        const p1 = this.state.p1Choice;
        const p2 = this.state.p2Choice;
        let winner = null;

        if (p1 === p2) {
            winner = 'draw';
        } else if (
            (p1 === 'rock' && p2 === 'scissors') ||
            (p1 === 'paper' && p2 === 'rock') ||
            (p1 === 'scissors' && p2 === 'paper')
        ) {
            winner = 'player 1';
        } else {
            winner = 'player 2';
        }

        // Apply visual feedback & state updates
        if (winner === 'player 1') {
            this.state.p1Score++;
            this.ui.boxP1.classList.add('winner');
            this.ui.boxP2.classList.add('loser');
            this.updateStatus("Player 1 Wins!", "var(--success)");
        } else if (winner === 'player 2') {
            this.state.p2Score++;
            this.ui.boxP2.classList.add('winner');
            this.ui.boxP1.classList.add('loser');
            this.updateStatus(this.state.mode === 'pve' ? "Computer Wins!" : "Player 2 Wins!", "var(--danger)");
        } else {
            this.updateStatus("It's a Draw!", "var(--text-main)");
        }

        this.updateScoreBoard();

        // Setup next round button
        setTimeout(() => {
            this.ui.btnAction.textContent = "Next Round";
            this.ui.btnAction.onclick = () => this.startRound();
            this.ui.btnAction.classList.remove('hidden');
        }, 500);
    },

    updateScoreBoard() {
        this.ui.scoreP1.textContent = this.state.p1Score;
        this.ui.scoreP2.textContent = this.state.p2Score;
    },

    updateStatus(message, color) {
        this.ui.turnStatus.textContent = message;
        this.ui.turnStatus.style.color = color;
    },

    switchView(viewId) {
        document.querySelectorAll('.view').forEach(v => v.classList.add('hidden'));
        document.getElementById(viewId).classList.remove('hidden');
    },

    returnToMenu() {
        this.switchView('view-menu');
    }
};
