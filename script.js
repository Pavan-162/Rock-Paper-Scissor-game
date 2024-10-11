let userScore = 0;
let cpuScore = 0;

const choices = ["rock", "paper", "scissors"];
const resultText = document.getElementById("resultText");
const cpuChoiceText = document.getElementById("cpuChoice");
const userScoreText = document.getElementById("userScore");
const cpuScoreText = document.getElementById("cpuScore");

document.querySelectorAll('.choice').forEach(button => {
    button.addEventListener('click', () => {
        const userChoice = button.id;
        const cpuChoice = getCpuChoice();
        const result = getResult(userChoice, cpuChoice);

        cpuChoiceText.textContent = `CPU chose: ${cpuChoice.charAt(0).toUpperCase() + cpuChoice.slice(1)}`;
        resultText.textContent = result;

        updateScore(result);
    });
});

function getCpuChoice() {
    return choices[Math.floor(Math.random() * choices.length)];
}

function getResult(user, cpu) {
    if (user === cpu) {
        return "It's a draw!";
    } else if (
        (user === "rock" && cpu === "scissors") ||
        (user === "paper" && cpu === "rock") ||
        (user === "scissors" && cpu === "paper")
    ) {
        return "You win!";
    } else {
        return "CPU won!";
    }
}

function updateScore(result) {
    if (result === "You win!") {
        userScore++;
    } else if (result === "CPU won!") {
        cpuScore++;
    }
    userScoreText.textContent = `User: ${userScore}`;
    cpuScoreText.textContent = `CPU: ${cpuScore}`;
}
