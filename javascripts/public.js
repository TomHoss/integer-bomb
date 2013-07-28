//random integer to string transition/convergence algorithm
//@2013 Thomas Hosford, New York NY

$(document).ready(function() {
  var body, typeWriter, timesCalled;
  randomizeBody()

  $("body").fadeIn(1000);

  typeWriter = setInterval(randomizeBody, 50)

  setTimeout(function() {
    clearInterval(typeWriter)
    $("#body").empty()
    //add work, essays
    //moving fullbleeds of NY
    //audio on/off button
  }, 2000)
})

//higher ws prob for core content

//replace the body with 7000 random numbers every 50 ms, for 2000 ms
var whiteSpaceProbability = 0;
var randomIntOrSpace = function(whiteSpaceProbability) {
    if (Math.random() < whiteSpaceProbability) {
      return " "
    } else {
      return (Math.random() * 10).toFixed()
    }
  }

var timesCalled = 0;
var randomizeBody = function() {
  var randomInt;
  var body_content = "";
  var intro_content;

  timesCalled++

  if (timesCalled > 35) {
    whiteSpaceProbability = .9
  } else if (timesCalled > 30) {
    whiteSpaceProbability = .8
  }
  else if (timesCalled > 20) {
    whiteSpaceProbability = .4
  }
  else if (timesCalled > 10) {
    whiteSpaceProbability = .1
  }

  for (i = 0; i < 7000; i++) {
    body_content += randomIntOrSpace(whiteSpaceProbability)
  }

  intro_content = randomizeIntro(whiteSpaceProbability)

  $("#body").html(body_content)
  $("#intro").html(intro_content)
}

var wordCharProbability = .1;

var finalIntroContentChars = ("ThomasHosford-SoftwareEngineer").split("")
var zoneLength = 180 / finalIntroContentChars.length // works out to 6
var zoneCharShown = []
for (i = 0; i < 30; i++) {
  zoneCharShown.concat(false)
}
var intro_content = []
var randomizeIntro = function() {
  console.log(timesCalled)
  console.log(intro_content)
  var final_intro_content = ("ThomasHosford-SoftwareEngineer")

  //TODO: get exact width
  for (i = 0; i < 180; i++) {
    //populate data on first try
    if (typeof intro_content[i] == "undefined") {
      intro_content[i] = randomIntOrSpace()
    } //leave the char alone if it's already a letter character
    else if (intro_content[i].match(/[A-Za-z\-]/) === null) {
      currentZone = parseInt(i/zoneLength)

      if ((Math.random() > wordCharProbability) || (zoneCharShown[currentZone])) { //Don't put another letter in if the zone has been filled
        intro_content[i] = randomIntOrSpace(whiteSpaceProbability + .1)
      } else {
        intro_content[i] = finalIntroContentChars[currentZone]
        zoneCharShown[currentZone] = true
        console.log("introducing " + intro_content[i])
      }
    }
  }

  return intro_content.join("")
}
