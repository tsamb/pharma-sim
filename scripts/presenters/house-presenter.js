define(function() {
  function HousePresenter(object) {
    this.parentContainer = document.getElementById("neighborhood-view");
    this.object = object;
    this.init();
  }

  HousePresenter.prototype.init = function() {
    this.parentContainer.appendChild(this.html());
  }

  HousePresenter.prototype.refresh = function() {
    var houseElement = document.getElementById(this.object.id);
    var budgetElement = houseElement.getElementsByClassName("budget")[0]
    // houseElement.getElementsByClassName("frequency")[0].innerText = this.object.currentFrequency();
    if (!this.object.active) {
      houseElement.className = "house grayscale";
      budgetElement.innerHTML = "";
    } else if (this.object.willingToBuy) {
      houseElement.className = "house lights";
      if (budgetElement.innerHTML.length < 1) {
        budgetElement.innerHTML = "<div class='text-spin'>$</div>" + this.object.currentBudget();
      }
    } else {
      houseElement.className = "house";
      budgetElement.innerHTML = "";
    }
    
  }

  HousePresenter.prototype.html = function() {
    var wrapper = document.createElement('div');
    var klass, budget;
    if (!this.object.active) {
      klass = "house grayscale";
    } else if (this.object.willingToBuy) {
      klass = "house lights";
      budget = "<div class='text-spin'>$</div>" + this.object.currentBudget();
    } else {
      klass = "house";
    }
    wrapper.innerHTML = "<div class='" + klass + "' id='" + this.object.id + "'>" +
                        "  <h4 class='budget'>" + (budget ? budget : "") + "</h4>" +
                        // "  <table>" +
                        // "    <tr>" +
                        // "      <td>Budget:</td>" +
                        // "      <td class='budget'>$" + this.object.currentBudget() + "</td>" +
                        // "    </tr>" +
                        // "    <tr>" +
                        // "      <td>Will buy every:</td>" +
                        // "      <td><span class='frequency'>" + this.object.currentFrequency() + "</span> days</td>" +
                        // "    </tr>" +
                        // "    <tr>" +
                        // "      <td>Ready to buy:</td>" +
                        // "      <td class='ready'>" + this.object.readyText() + "</td>" +
                        // "    </tr>" +
                        // "  </table>" +
                        // "  <button disabled>Sell to this house</button>" +
                        "</div>";
    return wrapper.firstChild;
  }

  return HousePresenter;
});
