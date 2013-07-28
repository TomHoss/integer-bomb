/*
AMDG

Random Integer to String Transition/Convergence Algorithm
Copyright © 2013 Thomas Hosford, New York, NY.
*/

$(document).ready(function() {
  var body, typeWriter, timesCalled;
  randomizeBody()

  $("body").fadeIn(1000);

  randomizer = setInterval(randomizeBody, 50)

  setTimeout(function() {
    clearInterval(randomizer)
    $("#backdrop").empty()
    //add work, essays
    //moving fullbleeds of NY
    //audio on/off button
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
  console.log(whiteSpaceProbability)
  console.log(test)

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
var finalIntroContentChars = ("ThomasHosford-SoftwareEngineer").split("")
var zoneLength = 180 / finalIntroContentChars.length // works out to 6
var zoneCharShown = []
for (i = 0; i < 30; i++) {
  zoneCharShown.concat(false)
}

var introContent = []
var randomizeIntro = function() {
  var wordCharProbability = .1;

  console.log(timesCalled)
  console.log(introContent)
  var finalIntroContent = ("ThomasHosford-SoftwareEngineer")

  //TODO: get exact width
  for (i = 0; i < 180; i++) {
    //populate data on first try
    if (typeof introContent[i] == "undefined") {
      introContent[i] = randomIntOrSpace(whiteSpaceProbability)
    //leave the char alone if it's already a letter character
    } else if (introContent[i].match(/[A-Za-z\-]/) === null) {
      currentZone = parseInt(i / zoneLength)

      //Never add a letter if the zone already has a letter in it
      if ((zoneCharShown[currentZone]) || (Math.random() > wordCharProbability)) {
        introContent[i] = randomIntOrSpace(whiteSpaceProbability + .1)
      } else {
        introContent[i] = finalIntroContentChars[currentZone]
        zoneCharShown[currentZone] = true
        console.log("introducing " + introContent[i])
      }
    }
  }

  $("#intro").html(introContent.join(""))
}
