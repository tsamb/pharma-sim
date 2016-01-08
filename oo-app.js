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

function Supplier(args) {
  this["10"] = 2500;
  this["100"] = 20000;
  this["500"] = 75000;
}

function SupplierPresenter() {

}

function ResourceManager() {
  this.product = 10;
  this.bankAccount = 5000;
}

ResourceManager.prototype.productIsAvailable = function() {
  if (this.product > 0) {
    return true;
  } else {
    errors.add("insufficient product available")
    return false;
  }
}

ResourceManager.prototype.sellProduct = function(amount, cash) {
  if (this.productIsAvailable()) {
    this.product -= amount;
    this.bankAccount += cash;
  }
}

function ResourceManagerPresenter() {

}

function House(args) {
  this.id = this.constructor.name.toLowerCase() + "-" + Date.now();
  this.budget = args.budget;
  this.frequency = args.frequency;
  this.readyToBuy = true;
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
