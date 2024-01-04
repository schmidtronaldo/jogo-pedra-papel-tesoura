const state = {
    score: {
        playerScore: 0,
        computerScore: 0,
        scoreBox: document.getElementById("score_points")
    },
    cardSprites: {
        avatar: document.getElementById("card_image"),
        name: document.getElementById("card_name"),
        type: document.getElementById("card_type"),
    },
    fieldCards: {
        player: document.getElementById("player_field_card"),
        computer: document.getElementById("computer_field_card"),
    },
    playerSides: {
        cardPlayer: "player_field_card",
        cardComputer: "computer_field_card",
        playerBox: document.querySelector("#player_cards"),
        computerBox: document.querySelector("#computer_cards"),
        player: "player_cards",
        computer: "computer_cards"
    },
    actions: {
        button: document.getElementById("next_duel")
    },
}

const cardData = [
    {
        id: 0,
        name: "Blue Eyes White Dragon",
        type: "Paper",
        img: "./src/assets/icons/dragon.png",
        winOf: [1],
        loseOf: [2]
    },
    {
        id: 1,
        name: "Dark Magician",
        type: "Rock",
        img: "./src/assets/icons/magician.png",
        winOf: [2],
        loseOf: [0]
    },
    {
        id: 2,
        name: "Exodia",
        type: "Scissors",
        img: "./src/assets/icons/exodia.png",
        winOf: [0],
        loseOf: [1]
    }
]

async function removeAllCardsImages() {
    let { playerBox, computerBox } = state.playerSides;
    let imgElements = computerBox.querySelectorAll("img");
    imgElements.forEach((img) => img.remove());
    imgElements = playerBox.querySelectorAll("img");
    imgElements.forEach((img) => img.remove());
}

async function checkDueResults(playerCardId, computerCardId) {

    const playerCard = cardData[playerCardId];
    if (playerCard.winOf.includes(computerCardId)) {
        state.score.playerScore++;
        await playAudio("win");
        return "WIN";
    } else if (playerCard.loseOf.includes(computerCardId)) {
        state.score.computerScore++;
        await playAudio("lose");
        return "LOSE";
    }
    return "DRAW";
}

async function setCardsField(cardId) {
    await removeAllCardsImages();
    let computerCardId = await getRandomCardId();

    state.fieldCards.player.style.display = "block";
    state.fieldCards.computer.style.display = "block";

    state.fieldCards.player.src = cardData[cardId].img;
    state.fieldCards.computer.src = cardData[computerCardId].img;

    let duelResults = await checkDueResults(cardId, computerCardId);

    await updateScore();
    await drawButton(duelResults);
}

async function updateScore() {
    state.score.scoreBox.innerText = `Win: ${state.score.playerScore} | Lose: ${state.score.computerScore}`;
}

async function resetDuel() {
    state.cardSprites.avatar.src = "";
    state.actions.button.style.display = "none";
    state.fieldCards.computer.style.display = "none";
    state.fieldCards.player.style.display = "none";
    init();
}

async function drawButton(text) {
    state.actions.button.innerText = text;
    state.actions.button.style.display = "block";
}

async function drawSelectCard(index) {
    state.cardSprites.avatar.src = cardData[index].img;
    state.cardSprites.name.innerText = cardData[index].name;
    state.cardSprites.type.innerText = "Attibute: " + cardData[index].type;
}

async function creatCardImage(IdCard, fieldSide) {
    const cardImage = document.createElement("img");
    cardImage.setAttribute("height", "100px");
    cardImage.setAttribute("src", "./src/assets/icons/card-back.png");
    cardImage.setAttribute("data-id", IdCard);
    cardImage.classList.add("card");

    if (fieldSide === state.playerSides.player) {
        cardImage.addEventListener("click", () => {
            setCardsField(cardImage.getAttribute("data-id"))
        })
        cardImage.addEventListener("mouseover", () => {
            drawSelectCard(IdCard)
        })

    }
    return cardImage;
}

async function getRandomCardId() {
    const randomIndex = Math.floor(Math.random() * cardData.length);
    return cardData[randomIndex].id;
}

async function drawCards(quantity, fieldSide) {
    for (let i = 0; i < quantity; i++) {
        const randomIdCard = await getRandomCardId();
        const cardImage = await creatCardImage(randomIdCard, fieldSide);

        document.getElementById(fieldSide).appendChild(cardImage)
    }
}

async function playAudio(status) {
    const audio = new Audio(`./src/assets/audios/${status}.wav`);
    audio.play();
}

function init() {
    drawCards(5, state.playerSides.player);
    drawCards(5, state.playerSides.computer);

    const bgm = document.getElementById("bgm");

    bgm.play();
}

init();