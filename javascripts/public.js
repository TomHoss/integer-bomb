/*
AMDG

Random Integer to String Transition/Convergence Algorithm
Copyright © 2013 Thomas Hosford, New York, NY.

Constraints:
Input must have even number of characters
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
  //hovers down - work, essays, photography

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

//Increase zone collapse probability over time
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

//Non-code row randomization
var randomizeBackdrop = function() {
  var backdropContent = ""
  for (i = 0; i < 7000; i++) {
    backdropContent += randomIntOrSpace(whiteSpaceProbability)
  }
  $("#backdrop").html(backdropContent)
}

//Core row randomization
//All spaces are inputted as ampersands
var finalIntroContentChars = ("Thoma&Hosford:Softwar&Engineer").split("")
var rowLength = 120
var numZones = finalIntroContentChars.length //30
var zoneLength = rowLength / numZones //4
var zoneCharShown = []
var zoneCollapsed = []
var leftCenterZoneIndex = (numZones / 2) - 1
var rightCenterZoneIndex = (numZones / 2) 
var leftCenterCharIndex = (rowLength / 2) - 1
var rightCenterCharIndex = (rowLength / 2) 

var introContent = []
var randomizeIntro = function() {
  var wordCharProbability = .07;

  //TODO: get exact width
  for (i = 0; i < rowLength; i++) {
    currentZone = parseInt(i / zoneLength)

    //populate row on first iteration
    if (typeof introContent[i] === "undefined") {
      introContent[i] = randomIntOrSpace(whiteSpaceProbability)
    //leave the char alone if it's already a letter character
    } else if (introContent[i].match(/[A-Za-z\:&]/) === null) {
      //randomly add int/whitespace or the zone's character
      //never add a letter if the zone already has a letter in it
      if (zoneCharShown[currentZone] || (Math.random() > wordCharProbability)) {
        introContent[i] = randomIntOrSpace(whiteSpaceProbability + .5)
      } else {
        introContent[i] = finalIntroContentChars[currentZone]
        zoneCharShown[currentZone] = true
      }
    //otherwise randomly collapse the zones if it's doable
    } else if (collapsable(currentZone) && (Math.random() < zoneCollapseProbability)) {
        collapseZone(currentZone, i)  //only word chars can cause collapse
    }

  }

  $("#intro").html(introContent.join("").replace(/&/g, " "))
}

//Zone collapsing

var collapsable = function(currentZoneIndex) {
  //Only collapse a zone if it's had it's neighbor wordChar shown
  var offset;

  offset = (currentZoneIndex < (numZones/2)) ? 1 : -1

  if ((currentZone === leftCenterZoneIndex) || (currentZone === rightCenterZoneIndex)) {
    return !zoneCollapsed[currentZoneIndex]
  } else {
    //normal zones need their neighbor to be collapsed
    return (!zoneCollapsed[currentZoneIndex] &&
             zoneCollapsed[currentZoneIndex + offset])
  }
}

//FIXME: They're only all gonna converge at the center.  Never stick together otherwise.  It's now more like a really strong magnet

var collapseZone = function(currentZone, currentIndex) {
  var newIndex, neighborChar, neighborCharIndex

  var moveLetters = function() {
    introContent[newIndex] = introContent[currentIndex]
    introContent[currentIndex] = randomIntOrSpace(whiteSpaceProbability)
  }

  var findLeftNeighborCharIndex = function() {
    neighborChar = finalIntroContentChars[currentZone - 1]
    //find first match less than current index
    return introContent.reverseIndexOf(neighborChar, currentIndex)
  }

  var findRightNeighborCharIndex = function() {
    neighborChar = finalIntroContentChars[currentZone + 1]
    return introContent.indexOf(neighborChar, currentIndex)
  }

  if (currentZone === leftCenterZoneIndex) {
    //fixed pos for left center zone.  everyone else will bump against them.
    if (currentIndex !== leftCenterCharIndex) { 
      newIndex = leftCenterCharIndex
      moveLetters() 
    }
  } else if (currentZone === rightCenterZoneIndex) {
    //fixed pos for right center zone.  everyone else will bump against them.
    //handle case where char is already in the right position
    if (currentIndex !== rightCenterCharIndex) {
      newIndex = rightCenterCharIndex
      moveLetters() 
    }
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

Array.prototype.reverseIndexOf = function(char, index) {
  for (var i = index - 1; i >= 0 ; i--) {
    if (this[i] === char) { return i }
  }
}
