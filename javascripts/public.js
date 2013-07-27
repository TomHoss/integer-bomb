$(document).ready(function() {
  var body, typeWriter, timesCalled;
  randomizeBody()

  $("body").fadeIn(1000);

  typeWriter = setInterval(randomizeBody, 50)

  setTimeout(function() {
    clearInterval(typeWriter)
    $("#body").empty()
    $("#intro").empty()
    //add work, essays
    //moving fullbleeds of NY
  }, 2000)
})

//replace the body with 7000 random numbers every 50 ms, for 2000 ms
var whiteSpaceProbability = 0;
var randomIntOrSpace = function() {
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

  if (timesCalled > 30) {
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

var finalIntroContentChars = ("ThomasHosford-SoftwareEngineer").split("")
var randomizeIntro = function() {
  var intro_content = $("#intro").html().split("")
  console.log(intro_content)
  var final_intro_content = ("ThomasHosford-SoftwareEngineer")
  //pop off left and right

  //TODO: get exact width
  for (i = 0; i < 200; i++) {
    //populate data on first try
    if (typeof intro_content[i] == "undefined") {
      intro_content[i] = randomIntOrSpace()
    } //leave it alone if it's already a letter character
    else if (intro_content[i].match(/[A-Za-z\-]/)) {
      if (Math.random() < whiteSpaceProbability) {
        intro_content[i] = randomIntOrSpace()
      } else {
        intro_content[i] = randomWordChar(intro_content, i)
      }
    }
  }

  return intro_content.join("")
}

var randomWordChar = function(introContent, currentIndex) {
  var leftNeighborWordChar, rightNeighborWordChar;

  //go left until a word char is found
  for (i = 0; i < currentIndex; i++) {
    if (introContent[i].match(/[A-Za-z\-]/)) {
      leftNeighborWordChar = introContent[i]
    }
  }

  //go right unti a word char is found
  for (i = currentIndex + 1; i < 200; i++) {
    if (introContent[i].match(/[A-Za-z\-]/)) {
      rightNeighborWordChar = introContent[i]
      break;
    }
  }

  left_char_index = finalIntroContentChars.indexOf(leftNeighborWordChar)
  right_char_index = finalIntroContentChars.indexOf(rightNeighborWordChar)

  if ((right_char_index - left_char_index) > 1) {
    //choose a random char in between those two
    index = parseInt((right_char_index - left_char_index) / 2)
    return finalIntroContentChars[index]
  } else {
    return randomIntOrSpace()
  }

}
