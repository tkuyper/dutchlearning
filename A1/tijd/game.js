function getRandomInt(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
}

class TimeGame {
	constructor() {
  	this.hours = ['twaalf', 'een', 'twee', 'drie', 'vier', 'vijf', 'zes', 'zeven', 'acht', 'negen', 'tien', 'elf'];
  	this.pickTime();
    this.positions = [
    	() => {
        const modMin = this.minute % 30;
        if (modMin == 0) return null;
        if (modMin == 15) return 'kwart';
        if (modMin % 10 == 0) return 'tien';
        return 'vijf';
      },
      () => {
        if (this.minute % 30 == 0) return null;
        let over = 1;
        if (Math.abs(30 - this.minute) < 15) over = -1;
        if (this.minute > 30) over = -over;
        if (over == 1) return 'over';
        return 'voor';
      },
      () => {
        if (Math.abs(30 - this.minute) < 15) return 'half';
        return null;
      },
      () => {
        if (this.minute <= 15) return this.wordForHour(this.hour);
        return this.wordForHour(this.hour + 1);
      },
      () => {
        if (this.minute == 0) return 'uur';
        return null;
      }
    ]
  }
  
  timeString() {
  	return `${String(this.hour).padStart(2, '0')}.${String(this.minute).padStart(2, '0')}`
  }
  
  pickTime() {
  	this.hour = getRandomInt(1, 24);
    this.minute = getRandomInt(0, 12) * 5;
    console.log(`Time picked ${this.timeString()}`);
  }
  
  checkAnswer(givenAnswer) {
    const answer = this.positions
    	.map((fn) => fn())
      .filter((word) => word !== null)
      .join(' ');
    console.log(`Given answer is  '${givenAnswer}'`);
    console.log(`Actual answer is '${answer}'`);
  	if (answer === givenAnswer) return true;
    return false;
  }

  wordForHour(hour) {
    const modHour = hour % 12;
    return this.hours[modHour];
  }
}

class StreakCounter {
	constructor(streakNode) {
  	this.node = streakNode;
    this.resetStreak();
  }
  
  incrementStreak() {
  	this.streak++;
    this.node.innerText = this.streak;
  }
  
  resetStreak() {
  	this.streak = 0;
    this.node.innerText = this.streak;
  }
}

const game = new TimeGame();
const checkButton = document.getElementById("check-answer");
const antwoord = document.getElementById("antwoord");
const displayedTime = document.getElementById("displayed-time");
const streakCounter = document.getElementById("streak-counter");
const streak = new StreakCounter(streakCounter);

displayedTime.innerText = game.timeString();

checkButton.addEventListener("click", function() {
	if(game.checkAnswer(antwoord.value)) {
    console.log("Correct!");
    displayedTime.innerText = "Correct!";
    displayedTime.classList.add("success");
    checkButton.disabled = true;
    streak.incrementStreak();
  	game.pickTime();
    setTimeout(() => {
    	antwoord.value = '';
    	displayedTime.innerText = game.timeString();
    	displayedTime.classList.remove("success");
    	checkButton.disabled = false;
    }, 1000);
  } else {
    console.log("Wrong!");
    displayedTime.innerText = "Wrong";
    displayedTime.classList.add("failure");
    checkButton.disabled = true;
    streak.resetStreak();
    setTimeout(() => {
    	displayedTime.innerText = game.timeString();
    	displayedTime.classList.remove("failure");
    	checkButton.disabled = false;
    }, 1000);
  }
}, false);

antwoord.addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.keyCode === 13) {
        checkButton.click();
    }
});