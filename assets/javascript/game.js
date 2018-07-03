// Global variables for html objects
var enemyLineDiv = $("#enemy-line");
var challengerLineDiv = $("#challenger-line");
var defenderLineDiv = $("#defender-line")
var topLineDiv = $("#top-line")
var resetButton = $("#bb-reset")

var currentBattleInProgress = false; // If True, a battle is in progress and enemy line clicks are ignored.

var batmanCharacters = {

    init: function () {
        this.batmansInfo = [];
        this.batmanChallenger = [];
        this.batmanDefender = [];
        this.remainingBatmen = 0;
        this.loadBatmans();
    },

    // Takes in the name, moves that batman to batmanChallenger and pops it from the array.
    setChallenger: function (batmanName) {
        for (var i = 0; i < this.remainingBatmen; i++) {
            if (batmanName === this.batmansInfo[i].name) {
                this.batmanChallenger[0] = this.batmansInfo[i];
                this.batmansInfo.splice(i, 1);
                this.remainingBatmen = this.batmansInfo.length;
                return;
            }
        }
    },

    // Takes in the name, moves that batman to batmanDefender and pops it from the array.
    setDefender: function (batmanName) {
        for (var i = 0; i < this.remainingBatmen; i++) {

            if (batmanName === this.batmansInfo[i].name) {
                this.batmanDefender[0] = this.batmansInfo[i];
                this.batmansInfo.splice(i, 1);
                this.remainingBatmen = this.batmansInfo.length;
                return;
            }
        }

    },

    loadBatmans: function () {
        this.batmansInfo = [
            { name: "West", healthPoints: 100, attackPoints: 10, counterAttackPoints: 15, imageFile: "assets/images/west.jpg", isAlive: true },
            { name: "Keaton", healthPoints: 100, attackPoints: 10, counterAttackPoints: 20, imageFile: "assets/images/Keaton.jpeg", isAlive: true },
            { name: "Kilmer", healthPoints: 80, attackPoints: 9, counterAttackPoints: 25, imageFile: "assets/images/kilmer.jpg", isAlive: true },
            { name: "Bale", healthPoints: 150, attackPoints: 30, counterAttackPoints: 10, imageFile: "assets/images/bale.jpg", isAlive: true }];
            this.remainingBatmen = this.batmansInfo.length;
    }

}

// Can load any character box with batman object and html elements as strings.
function loadCharBox(batmanIndex, blockName, blockIMG, blockHP) {
    var nameBlock = $(blockName);
    var blockIMG = $(blockIMG);
    var blockHP = $(blockHP);
    nameBlock.attr("class", "characterName")
    nameBlock.text(batmanCharacters.batmansInfo[batmanIndex].name);
    blockIMG.attr("alt", batmanCharacters.batmansInfo[batmanIndex].name);
    blockIMG.attr("src", batmanCharacters.batmansInfo[batmanIndex].imageFile);
    blockHP.text(batmanCharacters.batmansInfo[batmanIndex].healthPoints);
}

function loadChallengerBox() {
    var nameBlock = $("#challenger-h4");
    var blockIMG = $("#challenger-image");
    var blockHP = $("#challenger-health");
    nameBlock.attr("class", batmanCharacters.batmanChallenger[0].name);
    nameBlock.text(batmanCharacters.batmanChallenger[0].name);
    blockIMG.attr("alt", batmanCharacters.batmanChallenger[0].name);
    blockIMG.attr("src", batmanCharacters.batmanChallenger[0].imageFile);
    blockHP.text(batmanCharacters.batmanChallenger[0].healthPoints);
}

function loadDefenderBox() {
    var nameBlock = $("#defender-h4");
    var blockIMG = $("#defender-image");
    var blockHP = $("#defender-health");
    nameBlock.attr("class", batmanCharacters.batmanDefender[0].name);
    nameBlock.text(batmanCharacters.batmanDefender[0].name);
    blockIMG.attr("alt", batmanCharacters.batmanDefender[0].name);
    blockIMG.attr("src", batmanCharacters.batmanDefender[0].imageFile);
    blockHP.text(batmanCharacters.batmanDefender[0].healthPoints);
}

function attack() {
    // Update Health Points
    batmanCharacters.batmanChallenger[0].healthPoints-= batmanCharacters.batmanDefender[0].counterAttackPoints;
    batmanCharacters.batmanDefender[0].healthPoints-= batmanCharacters.batmanChallenger[0].attackPoints;
    // Double Challenger attack points
    batmanCharacters.batmanChallenger[0].attackPoints = batmanCharacters.batmanChallenger[0].attackPoints * 2;
    // Check to see if the challenger is still dead, kill the game if not.
    if(batmanCharacters.batmanChallenger[0].healthPoints <=0){
        $("#challenger-health").text("Dead");
        alert("Challenger Dead");
        resetButton.show();
    }
    // Check to see if defender is still alive, if no more enemies remain, stop the game.
    else if (batmanCharacters.batmanDefender[0].healthPoints <=0 && batmanCharacters.remainingBatmen ===0 ) {
        alert("You have won");
        currentBattleInProgress = false;
        $("#lu-defender").hide();
        $("#bb-attack").hide();
        $("#challenger-health").text(batmanCharacters.batmanChallenger[0].healthPoints);
        //Show the reset button
        resetButton.show();
    }
    // Check to see if defender is still alive, let player select new defender if he is
    else if (batmanCharacters.batmanDefender[0].healthPoints <=0 ) {
        alert("Select your next opponent.");
        currentBattleInProgress = false;
        defenderLineDiv.hide();
        $("#challenger-health").text(batmanCharacters.batmanChallenger[0].healthPoints);
    }
    else {
        $("#challenger-health").text(batmanCharacters.batmanChallenger[0].healthPoints);
        $("#defender-health").text(batmanCharacters.batmanDefender[0].healthPoints);
    }
}

// Initial Page Load function;
function initialLineupLoad() {
    var countOfBatmans = batmanCharacters.remainingBatmen;
    for (var i = 1; i <= countOfBatmans; i++) {
        loadCharBox(i - 1, "#char-" + i + "-h4", "#char-" + i + "-image", "#char-" + i + "-health");
    }
}

// Create and Initialize the Game.
var batmanCharacters = Object.create(batmanCharacters);
batmanCharacters.init();

enemyLineDiv.hide();
challengerLineDiv.hide();
defenderLineDiv.hide();
resetButton.hide();

initialLineupLoad();

// Listener
$(document).ready(function () {
    // Look for the click on the line-up to pick a challenger
    $(".lineup").on("click", function (e) {
        // Set the challenger and load the applicable HTML
        batmanCharacters.setChallenger($(this).children("h4.characterName").text());
        loadChallengerBox();
        // Load the Enemies
        var countOfBatmans = batmanCharacters.remainingBatmen;
        for (var i = 1; i <= countOfBatmans; i++) {
            loadCharBox(i - 1, "#enemy-" + i + "-h4", "#enemy-" + i + "-image", "#enemy-" + i + "-health");
        }
        topLineDiv.hide();
        enemyLineDiv.show();
        challengerLineDiv.show();
    }),
        $(".enemies").on("click", function (e) {
            if (currentBattleInProgress === false) {
                batmanCharacters.setDefender($(this).children("h4.characterName").text());
                loadDefenderBox();
                $(this).hide();
                defenderLineDiv.show();
                currentBattleInProgress = true;
                // Hide the Enemy Line if no Enemeies are left
                if(batmanCharacters.remainingBatmen <1)
                {
                    enemyLineDiv.hide();
                }
            }
        }),
        $("#bb-attack").on("click", function (e) {
            attack();       
        })
        $("#bb-reset").on("click", function (e) {
            // Rehide everything on the screen
            // Start things over.
            topLineDiv.show();
            $("#lu-enemyone").show();
            $("#lu-enemytwo").show();
            $("#lu-enemythree").show();
            $("#lu-defender").show();
            enemyLineDiv.hide();
            challengerLineDiv.hide();
            defenderLineDiv.hide();
            resetButton.hide();
            $("#bb-attack").show();
            
      //      delete batmanCharacters;
       //     var batmanCharacters = Object.create(batmanCharacters);
            batmanCharacters.init();
            
            initialLineupLoad();
            
        })
});
