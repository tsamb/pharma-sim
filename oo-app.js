function GlobalErrors() {
  this.errorList = [];
}

GlobalErrors.prototype.printLatestError = function() {
  console.error(this.errorList[this.errorList.length - 1]);
}

GlobalErrors.prototype.add = function(error) {
  this.errorList.push(error);
  this.printLatestError();
}

var errors = new GlobalErrors;

function SupplyOffer(args) {
  SupplyOffer.numInstances = (SupplyOffer.numInstances || 0) + 1;
  this.amount = args.amount;
  this.price = args.price;
  this.id = this.constructor.name.toLowerCase() + "-" + SupplyOffer.numInstances;
  this.presenter = new SupplyOfferPresenter(this);
}

function SupplyOfferPresenter(object) {
  this.parentContainer = document.getElementById("supplyoffers");
  this.object = object;
  this.init();
}

SupplyOfferPresenter.prototype.init = function() {
  this.parentContainer.appendChild(this.html());
}

SupplyOfferPresenter.prototype.refresh = function() {
  document.getElementById(this.object.id).innerHTML = "Purchase <span class='amount'>" + this.object.amount + "</span> ounces for $<span class='price'>" + this.object.price + "</span>";
}

SupplyOfferPresenter.prototype.html = function() {
  var wrapper = document.createElement('div');
  wrapper.innerHTML = "<button id='" + this.object.id + "'>Purchase <span class='amount'>" + this.object.amount + "</span> ounces for $<span class='price'>" + this.object.price + "</span></button>";
  return wrapper.firstChild;
}

function ResourceManager() {
  this.product = 10;
  this.bankAccount = 5000;
  this.presenter = new ResourceManagerPresenter(this);
}

ResourceManager.prototype.productIsAvailable = function() {
  if (this.product > 0) {
    return true;
  } else {
    errors.add("insufficient product available");
    return false;
  }
}

ResourceManager.prototype.cashIsAvailable = function(amountNeeded) {
  if (this.cash > amountNeeded) {
    return true;
  } else {
    errors.add("insufficient cash available");
    return false;
  }
}

ResourceManager.prototype.sellProduct = function(amount, cash) {
  if (this.productIsAvailable()) {
    this.product -= amount;
    this.bankAccount += cash;
    this.presenter.refresh();
  }
}

ResourceManager.prototype.buyProduct = function(amount, cash) {
  if (this.cashIsAvailable(cash)) {
    this.product += amount;
    this.bankAccount -= cash;
    this.presenter.refresh();
  }
}

function ResourceManagerPresenter(object) {
  this.parentContainer = document.getElementById("resources");
  this.object = object;
  this.init();
}

ResourceManagerPresenter.prototype.init = function() {
  this.parentContainer.appendChild(this.html());
}

ResourceManagerPresenter.prototype.refresh = function() {
  document.getElementById('bank-balance').innerText = this.object.bankAccount;
  document.getElementById('product').innerText = this.object.product;
}

ResourceManagerPresenter.prototype.html = function() {
  var wrapper = document.createElement('div');
  wrapper.innerHTML = "<table>" +
                      "<tr><td>Bank balance:</td><td id='bank-balance'>" + this.object.bankAccount + "</td></tr>" +
                      "<tr><td>Product on hand:</td><td><span id='product'>" + this.object.product + "</span> ounces.</td></tr>" +
                      "</table>";
  return wrapper;
}

function House(args) {
  House.numInstances = (House.numInstances || 0) + 1;
  this.budget = args.budget;
  this.frequency = args.frequency;
  this.willingToBuy = true;
  this.id = this.constructor.name.toLowerCase() + "-" + House.numInstances;
  this.presenter = new HousePresenter(this);
}

House.prototype.sell = function() {
  if (this.willingToBuy) {
    this.willingToBuy = false;
    this.presenter.refresh();
    return this.budget;
  } else {
    return 0;
  }
}

House.prototype.checkReadiness = function(day) {
  if (day % this.frequency === 0) {
    this.willingToBuy = true;
    this.presenter.refresh();
  }
}

House.prototype.ready = function() {
  if (this.willingToBuy) {
    return true;
  } else {
    errors.add("house is not ready to make a purchase");
  }
}

House.prototype.readyText = function() {
  if (this.willingToBuy) {
    return "$$$ Ready to buy $$$";
  } else {
    return "Not ready";
  }
}

function HousePresenter(object) {
  this.parentContainer = document.getElementById("houses");
  this.object = object;
  this.init();
}

HousePresenter.prototype.init = function() {
  this.parentContainer.appendChild(this.html());
}

HousePresenter.prototype.refresh = function() {
  document.getElementById(this.object.id).innerHTML = "Purchase <span class='amount'>" + this.object.amount + "</span> ounces for $<span class='price'>" + this.object.price + "</span>";
}

HousePresenter.prototype.html = function() {
  var wrapper = document.createElement('div');
  wrapper.innerHTML = "<div id='" + this.object.id + "'>" +
                      "  <h3>A House</h3>" +
                      "  <table>" +
                      "    <tr>" +
                      "      <td>Budget:</td>" +
                      "      <td class='budget'>" + this.object.budget + "</td>" +
                      "    </tr>" +
                      "    <tr>" +
                      "      <td>Will buy every:</td>" +
                      "      <td><span class='frequency'>" + this.object.frequency + "</span> days</td>" +
                      "    </tr>" +
                      "    <tr>" +
                      "      <td>Ready to buy:</td>" +
                      "      <td class='ready'>" + this.object.readyText() + "</td>" +
                      "    </tr>" +
                      "  </table>" +
                      "  <button>Sell to this house</button>" +
                      "</div>";
  return wrapper.firstChild;
}

function Controller() {
  this.resourceManager = new ResourceManager;
  this.houses = [];
  this.supplyOffers = [ new SupplyOffer({amount: 10, price: 2500}),
                        new SupplyOffer({amount: 100, price: 20000}),
                        new SupplyOffer({amount: 500, price: 75000}),
                        new SupplyOffer({amount: 1000, price: 120000})];
  this.init();
}

Controller.prototype.init = function() {
  this.addHouse({budget: 200, frequency: 5});
  this.addHouse({budget: 300, frequency: 20});
  this.addHouse({budget: 500, frequency: 30});
}

Controller.prototype.sellToHouse = function(houseId) {
  var house = this.houses.find(function(house) { return house.id === houseId });
  if (house && house.ready() && this.resourceManager.productIsAvailable()) {
    this.resourceManager.sellProduct(1, house.budget);
  }
}

Controller.prototype.addHouse = function(args) {
  var house = new House(args);
  document.querySelector("#" + house.id + " button").addEventListener('click', function() {
    this.sellToHouse(house.id);
  }.bind(this));
  this.houses.push(house);
  return this.houses;
}

Controller.prototype.addSupplyOffer = function() {

}

ctrl = new Controller
hid = ctrl.houses[0].id
rm = ctrl.resourceManager
ctrl.sellToHouse(hid)
