define(['models/house'], function(House) {
  function Neighborhood() {
    this.houses = [];
  }

  Neighborhood.prototype.addHouse = function(args) {
    var house = new House(args);
    this.houses.push(house);
    return house.id;
  }

  Neighborhood.prototype.updateHouseReadiness = function(day) {
    this.houses.forEach(function(house) {
      house.updateReadiness(day);
    });
  }

  Neighborhood.prototype.findHouse = function(houseId) {
    return this.houses.find(function(house) { return house.id === houseId });
  }

  Neighborhood.prototype.updateHype = function(hypeLevel) {
    this.houses.forEach(function(house) {
      if (!house.active) {
        house.updateHype(hypeLevel);
      }
    });
  }

  return Neighborhood;
})
