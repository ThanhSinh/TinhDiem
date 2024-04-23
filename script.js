
var players = {};
var historyVisible = false;

document.getElementById("addPlayerBtn").addEventListener("click", function() {
    createForm();
});

document.getElementById("calculateTotalBtn").addEventListener("click", function() {
    calculateTotal();
});

document.getElementById("viewHistoryBtn").addEventListener("click", function() {
    toggleHistory();
});

document.getElementById("clearHistoryBtn").addEventListener("click", function() {
    clearHistory();
});

function createForm() {
    var formsContainer = document.getElementById("formsContainer");
    var form = document.createElement("form");
    form.classList.add("form-container");
    form.innerHTML = `
        <label for="playerName">Tên người chơi:</label>
        <input type="text" class="playerName" required><br>
        <label for="betAmount">Nhập điểm cược: </label><br>
        <input type="number" class="betAmount" required><br>
        <label for="result">Chọn kết quả:</label>
        <select class="result" required>
            <option value="win">Thắng</option>
            <option value="lose">Thua</option>
            <option value="draw">Hòa</option>
        </select><br>
    `;
    formsContainer.appendChild(form);
}

function calculateTotal() {
    var forms = document.querySelectorAll(".form-container");
    forms.forEach(function(form) {
        var playerName = form.querySelector(".playerName").value;
        var betAmount = parseFloat(form.querySelector(".betAmount").value);
        var result = form.querySelector(".result").value;

        if (!players[playerName]) {
            players[playerName] = { total: 0, bets: [] };
        }
        if (result === "win") {
            players[playerName].total += betAmount;
        } else if (result === "lose") {
            players[playerName].total -= betAmount;
        }
        players[playerName].bets.push({ amount: betAmount, result: result });
    });

    updatePlayers();
    localStorage.setItem('betHistory', JSON.stringify(players));
    updateHistory();
}

function updatePlayers() {
    var playersElement = document.getElementById("players");
    playersElement.innerHTML = "";
    Object.keys(players).forEach(function(player) {
        var playerInfo = "<div class='player-info'>";
        playerInfo += "<p>" + player + " - Tổng điểm cược: " + players[player].total + "</p>";
        playerInfo += "</div>";
        playersElement.innerHTML += playerInfo;
    });
}

function updateHistory() {
    var historyElement = document.getElementById("history");
    historyElement.innerHTML = "";
    var betHistory = JSON.parse(localStorage.getItem('betHistory')) || {};
    if (Object.keys(betHistory).length === 0) {
        historyElement.innerHTML = "<p>Chưa có lịch sử cược.</p>";
        return;
    }
    historyElement.innerHTML += "<h3>Lịch sử cược:</h3>";
    Object.keys(betHistory).forEach(function(player) {
        var playerInfo = "<div class='player-info'>";
        playerInfo += "<p>" + player + " - Tổng điểm cược: " + betHistory[player].total + "</p>";
        playerInfo += "<ul>";
        betHistory[player].bets.forEach(function(bet, index) {
            var betResult;
            if (bet.result === "win") {
                betResult = "Thắng";
            } else if (bet.result === "lose") {
                betResult = "Thua";
            } else {
                betResult = "Hòa";
            }
            playerInfo += "<li>Ván " + (index + 1) + ": " + bet.amount + " điểm - Kết quả: " + betResult + "</li>";
        });
        playerInfo += "</ul></div>";
        historyElement.innerHTML += playerInfo;
    });
    if (historyVisible) {
        historyElement.style.display = "block";
    } else {
        historyElement.style.display = "none";
    }
}

function toggleHistory() {
    historyVisible = !historyVisible;
    updateHistory();
}

function clearHistory() {
    localStorage.removeItem('betHistory');
    updateHistory();
}

window.onload = function() {
    updatePlayers();
    updateHistory();
};
