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

var timesCalled = 0; //will be called 40 times total
var randomizeBody = function() {
  timesCalled++

  updateWhiteSpaceProbability()

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
var finalIntroContentChars = ("ThomasHkzferd-SiptwulyEngjnxcq").split("")
var numZones = finalIntroContentChars.length
var zoneLength = 180 / numZones // works out to 6
var zoneCharShown = []
var zoneCollapsed = []
for (i = 0; i < 30; i++) {
  zoneCharShown.concat(false)
  zoneCollapsed.concat(false)
}

var introContent = []
var randomizeIntro = function() {
  var wordCharProbability = .5; //accelerate - lower to .01
  var zoneCollapseProbability = .3;

  //console.log(timesCalled)
  //console.log(introContent)

  //TODO: get exact width
  for (i = 0; i < 180; i++) {
    currentZone = parseInt(i / zoneLength)

    //populate data on first try
    if (typeof introContent[i] == "undefined") {
      introContent[i] = randomIntOrSpace(whiteSpaceProbability)
    //leave the char alone if it's already a letter character
    } else if (introContent[i].match(/[A-Za-z\-]/) === null) {
      //Never add a letter if the zone already has a letter in it
      if ((zoneCharShown[currentZone]) || (Math.random() > wordCharProbability)) {
        introContent[i] = randomIntOrSpace(whiteSpaceProbability + .1)
      } else {
        introContent[i] = finalIntroContentChars[currentZone]
        zoneCharShown[currentZone] = true
        console.log("introducing: " + introContent[i])
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
             zoneCharShown[currentZone + offset])
  }
}

var collapseZone = function(currentZone, currentIndex) {
  var newIndex, neighborChar, neighborCharIndex
  console.log("collapsing zone: " + currentZone)
  console.log("collapsing: " + finalIntroContentChars[currentZone])
  //console.log("to: " + finalIntroContentChars[currentZone + 1])

  //FIXME: should work for dup'd letters

  //fixed pos for two center zones.  everyone else will bump against them.
  if (currentZone == 14) {
    introContent[currentIndex] = randomIntOrSpace(whiteSpaceProbability)
    introContent[89] = "S"
  } else if (currentZone == 15) {
    newIndex = 90
    introContent[currentIndex] = randomIntOrSpace(whiteSpaceProbability)
    introContent[90] = "i"
  }
  //} else if (currentZone < (numZones/2)) {
    ////snap against the word character in the next zone
    //neighborChar = finalIntroContentChars[currentZone + 1]
    //neighborCharIndex = introContent.indexOf(neighborChar)
    //newIndex = neighborCharIndex - 1
  //} else {
    ////snap against the word character in the previous zone
    //neighborChar = finalIntroContentChars[currentZone - 1]
    //neighborCharIndex = introContent.indexOf(neighborChar)
    //newIndex = neighborCharIndex + 1
  //}

  console.log(currentIndex)
  console.log(newIndex)
  //introContent[newIndex] = introContent[currentIndex]
  //introContent[currentIndex] = randomIntOrSpace(whiteSpaceProbability)
  zoneCollapsed[currentZone] = true
}
