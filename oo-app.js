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

var errors = new GlobalErrors

function SupplyOffer(args) {
  this.amount = args.amount;
  this.price = args.price;
  this.id = this.constructor.name.toLowerCase() + "-" + Date.now();
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

ResourceManager.prototype.sellProduct = function(amount, cash) {
  if (this.productIsAvailable()) {
    this.product -= amount;
    this.bankAccount += cash;
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

ResourceManagerPresenter.refresh = function() {
  document.getElementById('bank-balance').innerText = this.object.bankAccount;
  document.getElementById('product').innerText = this.object.product;
}

ResourceManagerPresenter.prototype.html = function() {
  var wrapper = document.createElement('div');
  wrapper.innerHTML = "<table>" +
                      "<tr><td>Bank balance:</td><td id='bank-balance'>" +  + "</td></tr>" +
                      "<tr><td>Product on hand:</td><td><span id='product'></span> ounces.</td></tr>" +
                      "</table>";
  return wrapper;
}

function House(args) {
  this.budget = args.budget;
  this.frequency = args.frequency;
  this.readyToBuy = true;
  this.id = this.constructor.name.toLowerCase() + "-" + Date.now();
}

House.prototype.ready = function() {
  if (this.readyToBuy) {
    return true;
  } else {
    errors.add("house is not ready to make a purchase");
  }
}

function HousePresenter() {

}

function Controller() {
  this.resourceManager = new ResourceManager;
  this.houses = [ new House({budget: 200, frequency: 5}),
                  new House({budget: 300, frequency: 20}),
                  new House({budget: 500, frequency: 30})];
  this.supplyOffers = [ new SupplyOffer({amount: 10, price: 2500}),
                        new SupplyOffer({amount: 100, price: 20000}),
                        new SupplyOffer({amount: 500, price: 75000}),
                        new SupplyOffer({amount: 1000, price: 120000})];
}

Controller.prototype.sellToHouse = function(houseId) {
  var house = this.houses.find(function(house) { return house.id === houseId });
  if (house && house.ready() && this.resourceManager.productIsAvailable()) {
    this.resourceManager.sellProduct(1, house.budget);
  }
}

ctrl = new Controller
hid = ctrl.houses[0].id
rm = ctrl.resourceManager
ctrl.sellToHouse(hid)
