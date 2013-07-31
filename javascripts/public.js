/*
AMDG

Random Integer to String Transition/Convergence Algorithm
Copyright © 2013 Thomas Hosford, New York, NY.
*/

//TODO:
  //add work, essays
  //moving fullbleeds of NY (black and white) (pulled in popular photos from flickR)
  //audio on/off button
  //japanese metal gear solideque sounds when hovering on menu - subtle lightups of letters
  //numeric transitions
  //keyboard noise and clamp noise
  //accommodate variable width
  //mobile view
  //make sure the middle row stays aligned with other rows

$(document).ready(function() {
  var body, typeWriter, timesCalled;
  randomizeBody()

  $("body").fadeIn(1000);

  randomizer = setInterval(randomizeBody, 50)

  setTimeout(function() {
    clearInterval(randomizer)
    $("#backdrop").empty()
  }, 2000)
})

var randomIntOrSpace = function(whiteSpaceProbability) {
    if (Math.random() < whiteSpaceProbability) {
      return " "
    } else {
      return (Math.random() * 10).toFixed()
    }
  }

//Increase whitespace probability over time
var whiteSpaceProbability = 0;
var test = null;
//TODO: Find out why this breaks if I remove the breaks
var updateWhiteSpaceProbability = function() {
  switch(timesCalled)
  {
    case 35:
      whiteSpaceProbability = .9
      break
    case 30:
      whiteSpaceProbability = .8
      break
    case 20:
      whiteSpaceProbability = .4
      break
    case 10:
      whiteSpaceProbability = .1
      break
  }
}

var zoneCollapseProbability = 0
var updateZoneCollapseProbability = function() {
  switch(timesCalled)
  {
    case 30:
      zoneCollapseProbability = 1
      break
    case 20:
      zoneCollapseProbability = .9
      break
    case 10:
      zoneCollapseProbability = .6
      break
  }
}

var timesCalled = 0; //will be called 40 times total
var randomizeBody = function() {
  timesCalled++

  updateWhiteSpaceProbability()
  updateZoneCollapseProbability()

  randomizeIntro()
  randomizeBackdrop()
}

//Backdrop randomization
var randomizeBackdrop = function() {
  var backdropContent = ""
  for (i = 0; i < 7000; i++) {
    backdropContent += randomIntOrSpace(whiteSpaceProbability)
  }
  $("#backdrop").html(backdropContent)
}

//Intro randomization
var finalIntroContentChars = ("ThomasHosford-SiptwulyEngjvxcq").split("")
var numZones = finalIntroContentChars.length
var zoneLength = 120 / numZones // works out to 6
var zoneCharShown = []
var zoneCollapsed = []
for (i = 0; i < 30; i++) {
  zoneCharShown.concat(false)
  zoneCollapsed.concat(false)
}

var introContent = []
var randomizeIntro = function() {
  var wordCharProbability = .1; //accelerate - lower to .01

  //console.log(timesCalled)
  //console.log(introContent)

  //TODO: get exact width
  for (i = 0; i < 120; i++) {
    currentZone = parseInt(i / zoneLength)

    //populate data on first try
    if (typeof introContent[i] == "undefined") {
      introContent[i] = randomIntOrSpace(whiteSpaceProbability)
    //leave the char alone if it's already a letter character
    } else if (introContent[i].match(/[A-Za-z\-]/) === null) {
      //Never add a letter if the zone already has a letter in it
      if ((zoneCharShown[currentZone]) || (Math.random() > wordCharProbability)) {
        introContent[i] = randomIntOrSpace(whiteSpaceProbability + .5)
      } else {
        introContent[i] = finalIntroContentChars[currentZone]
        zoneCharShown[currentZone] = true
      }
    } else if (collapsable(currentZone) && (Math.random() < zoneCollapseProbability)) {
        collapseZone(currentZone, i)  //only word chars can cause collapse
    }

  }

  $("#intro").html(introContent.join(""))
}

//Zone collapsing

var collapsable = function(currentZone) {
  //Only collapse a zone which has had it's neighbor wordChar shown
  var offset;

  if (currentZone < (numZones/2)) {
    offset = 1
  } else {
    offset = -1
  }

  if ((currentZone == 14) || (currentZone == 15)) {
    return !zoneCollapsed[currentZone]
  } else {
    return (!zoneCollapsed[currentZone] &&
             zoneCollapsed[currentZone + offset] &&
             zoneCharShown[currentZone + offset])
  }
}

//FIXME: They're only all gonna converge at the center.  Never stick together otherwise.  It's now more like a really strong magnet

var collapseZone = function(currentZone, currentIndex) {
  var newIndex, neighborChar, neighborCharIndex

  var moveLetters = function() {
    introContent[newIndex] = introContent[currentIndex]
    introContent[currentIndex] = randomIntOrSpace(whiteSpaceProbability)
  }
  //FIXME: should work for dup'd letters

  var findLeftNeighborCharIndex = function() {
    neighborChar = finalIntroContentChars[currentZone - 1]
    return introContent.indexOf(neighborChar)
  }

  var findRightNeighborCharIndex = function() {
    neighborChar = finalIntroContentChars[currentZone + 1]
    return introContent.indexOf(neighborChar, currentIndex)
  }

  if (currentZone == 14) {
    //fixed pos for left center zone.  everyone else will bump against them.
    newIndex = 59
    if (currentIndex != 59) { moveLetters() }
  } else if (currentZone == 15) {
    //fixed pos for right center zone.  everyone else will bump against them.
    newIndex = 60
    if (currentIndex != 60) { moveLetters() }
  } else if (currentZone < (numZones/2)) {
    //snap against the word character in the next zone
    neighborCharIndex = findRightNeighborCharIndex()
    newIndex = neighborCharIndex - 1

    moveLetters()
  } else {
    //snap against the word character in the previous zone
    neighborCharIndex = findLeftNeighborCharIndex()
    newIndex = neighborCharIndex + 1

    moveLetters()
  }

  zoneCollapsed[currentZone] = true
}
