define(function() {
  function HousePresenter(object) {
    this.parentContainer = document.getElementById("houses");
    this.object = object;
    this.init();
  }

  HousePresenter.prototype.init = function() {
    this.parentContainer.appendChild(this.html());
  }

  HousePresenter.prototype.refresh = function() {
    var houseElement = document.getElementById(this.object.id);
    houseElement.getElementsByClassName("budget")[0].innerText = this.object.budget;
    houseElement.getElementsByClassName("frequency")[0].innerText = this.object.frequency;
    houseElement.getElementsByClassName("ready")[0].innerText = this.object.readyText();
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

  return HousePresenter;
});