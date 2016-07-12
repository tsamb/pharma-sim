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
    // houseElement.getElementsByClassName("budget")[0].innerText = "$" + this.object.currentBudget();
    // houseElement.getElementsByClassName("frequency")[0].innerText = this.object.currentFrequency();
    // houseElement.getElementsByClassName("ready")[0].innerText = this.object.readyText();
    if (this.object.willingToBuy && this.object.active) {
      // houseElement.getElementsByTagName("button")[0].disabled = false;
      houseElement.className = "house lights";
    } else {
      // houseElement.getElementsByTagName("button")[0].disabled = true;
      houseElement.className = "house";
    }
    if (!this.object.active) {
      houseElement.className = "house grayscale";
    }
  }

  HousePresenter.prototype.html = function() {
    var wrapper = document.createElement('div');
    var klass;
    if (!this.object.active) {
      klass = "house grayscale";
    } else if (this.object.willingToBuy) {
      klass = "house lights";
    } else {
      klass = "house";
    }
    wrapper.innerHTML = "<div class='" + klass + "' id='" + this.object.id + "'>" +
                        // "  <h3>A House</h3>" +
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
