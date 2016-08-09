define(function() {
  return {
    generate: function() {
      var hypeToActivateList = [1,1,1,1,2,2,3,3,4,4,4,5,5,6,6];
      var levelsCount = 6;
      var budgetRange = {low: 80, high: 440};
      var frequencyRange = {low: 5, high: 45};
      var budgetMultiplier = Math.floor((budgetRange.high - budgetRange.low) / levelsCount);

      return hypeToActivateList.map(function(level) {
        var maxBudgetPoints = level * budgetMultiplier;
        var budgetPoints = Math.ceil(Math.random() * maxBudgetPoints);
        var frequency = frequencyRange.low + Math.ceil(Math.random() * (frequencyRange.high - frequencyRange.low - (level * 3) + 3));
        var budget = Math.floor((1 + (frequency / frequencyRange.high)) * (budgetPoints + budgetRange.low));

        return {budget: budget, frequency: frequency, hypeToActivate: level};
      });
    }
  };
})
