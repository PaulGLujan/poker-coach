// const DEBUG = true;

// Timer to ensure the host page is complete before we jam our shiz
const readyStateCheckInterval = setInterval(function () {
  if (document.readyState === "complete") {
    clearInterval(readyStateCheckInterval);

    if (DEBUG) {
      console.log("Beginning inject.js...");
    }

    setTimeout(function () {
      doSetup();
    }, 1000);
  }
}, 10);

// Setup, build output UI, and attach DOM observers
const doSetup = function () {
  // inject pot odds UI box

  // Sample DOM container
  const cardOne =
    "<div class='app-container'>" +
    "<p>Card 1:&nbsp;<span class='card-one'>&mdash;</span></p>" +
    "<p>Card 2:&nbsp;<span class='card-two'>&mdash;</span></p>" +
    "</div>";

  jQuery(".table").prepend(jQuery(cardOne));

  // Initiate observers
  const targetNode = jQuery(".table")[0];

  // Options for the observer (which mutations to observe)
  const config = {
    characterData: true,
    attributes: true,
    childList: true,
    subtree: true,
  };

  // Callback function to execute when mutations are observed
  var callback = function (mutationsList, observer) {
    for (var mutation of mutationsList) {
      // Skip non-element nodes
      if (
        !mutation.target.getAttribute ||
        !mutation.target.getAttribute("class")
      ) {
        continue;
      }

      var c = mutation.target.getAttribute("class");

      // Update when these classes pop up
      if (c.match(/decision\-current|flipped/)) {
        updatePotOdds();
      }
    }
  };

  // Create an observer instance linked to the callback function
  var observer = new MutationObserver(callback);

  // Start observing the target node for configured mutations
  observer.observe(targetNode, config);

  if (DEBUG) {
    console.log("...setup done.");
  }
};

// Do the main thing
var updatePotOdds = function () {
  const card1Val = jQuery(
    ".you-player .card-container:nth-child(1) .value"
  ).text();

  const card1Suit = jQuery(
    ".you-player .card-container:nth-child(1) .suit.sub-suit"
  ).text();
  jQuery(".card-one").text(card1Val + card1Suit);

  const card2Val = jQuery(
    ".you-player .card-container:nth-child(2) .value"
  ).text();

  const card2Suit = jQuery(
    ".you-player .card-container:nth-child(2) .suit.sub-suit"
  ).text();
  jQuery(".card-two").text(card2Val + card2Suit);
};
