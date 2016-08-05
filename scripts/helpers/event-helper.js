define(['helpers/manip'],function(Manip) {
  var EventHelper = {};

  EventHelper.addClickListener = function(id, callback) {
    document.getElementById(id).addEventListener('click', callback);
  }

  EventHelper.addPurchasableSwitch = function(switchId, containerId) {
    document.getElementById(switchId).addEventListener("click", function() {
      Manip.removeClassFrom(document.querySelectorAll(".purchasable"), "active");
      Manip.addClassTo(document.getElementById(containerId), "active")
      Manip.removeClassFrom(document.querySelectorAll(".selectors button"), "active");
      Manip.addClassTo(document.getElementById(switchId), "active")
    });
  }

  return EventHelper;
})
