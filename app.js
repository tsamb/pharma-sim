var loop, counter, bankAccount, product;

product = 0;
bankAccount = 5000;

var game;
game = new Game;

function Game() {
  this.product = 0;
  this.bankAccount = 5000;
  this.neighborhood = new Neighborhood({game: this});
}

function Neighborhood(args) {
  this.game = args.game || raise("a new Neighborhood must have reference to a game");
  this.houses = args.houses || [new House({budget: 200, frequency: 5, game: this.game}),
                                new House({budget: 300, frequency: 20, game: this.game}),
                                new House({budget: 500, frequency: 30, game: this.game})];
}

function House(args) {
  this.game = args.game;
  this.budget = args.budget;
  this.frequency = args.frequency;
  this.readyToBuy = false;
}

House.prototype.sell = function() {
  if (this.readyToBuy) {
    this.readyToBuy = false;
    return this.budget;
  } else {
    return 0;
  }
}

House.prototype.checkReadiness = function(day) {
  if (day % this.frequency === 0) {
    this.readyToBuy = true;
  }
}

House.prototype.readyText = function() {
  if (this.readyToBuy) {
    return "$$$ Ready to buy $$$";
  } else {
    return "Not ready";
  }
}

var h1 = new House({budget: 200, frequency: 5});
var h2 = new House({budget: 300, frequency: 20});
var h3 = new House({budget: 500, frequency: 30});

document.querySelector("#h1 button").addEventListener("click", function() {
  if (product > 0 && h1.readyToBuy) {
    bankAccount += h1.sell();
    product--;
  }
});

document.querySelector("#h2 button").addEventListener("click", function() {
  if (product > 0 && h2.readyToBuy) {
    bankAccount += h2.sell();
    product--;
  }
});

document.querySelector("#h3 button").addEventListener("click", function() {
  if (product > 0 && h3.readyToBuy) {
    bankAccount += h3.sell();
    product--;
  }
});

document.querySelector("#buy-10").addEventListener("click", function() {
  bankAccount -= 2500;
  product += 10;
});

document.querySelector("#buy-100").addEventListener("click", function() {
  bankAccount -= 20000;
  product += 100;
});

document.querySelector("#buy-500").addEventListener("click", function() {
  bankAccount -= 75000;
  product += 500;
});


var houses = [h1,h2,h3];

loop = window.setInterval(coreLoop, 500);
counter = 0;
initDOM();

function coreLoop() {
  counter++;
  refreshHouses();
}

function refreshHouses() {
  houses.forEach(function(house) { house.checkReadiness(counter) });
  updateDOM();
}

function initDOM() {
  document.querySelector("#day").innerText = counter;
  document.querySelector("#bank-balance").innerText = bankAccount;
  document.querySelector("#h1 .budget").innerText = h1.budget;
  document.querySelector("#h2 .budget").innerText = h2.budget;
  document.querySelector("#h3 .budget").innerText = h3.budget;
  document.querySelector("#h1 .frequency").innerText = h1.frequency;
  document.querySelector("#h2 .frequency").innerText = h2.frequency;
  document.querySelector("#h3 .frequency").innerText = h3.frequency;
  document.querySelector("#h1 .ready").innerText = h1.readyText();
  document.querySelector("#h2 .ready").innerText = h2.readyText();
  document.querySelector("#h3 .ready").innerText = h3.readyText();
}

function updateDOM() {
  document.querySelector("#product").innerText = product;
  document.querySelector("#day").innerText = counter;
  document.querySelector("#bank-balance").innerText = bankAccount;
  document.querySelector("#h1 .ready").innerText = h1.readyText();
  document.querySelector("#h2 .ready").innerText = h2.readyText();
  document.querySelector("#h3 .ready").innerText = h3.readyText();
}


