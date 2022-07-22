// Gets all the forms from the website
let forms = document.getElementsByTagName("form");

// Initially, just get the first form
const form = forms[0];

// Due to different browsers, give alternative constants which might work on some browsers
var SpeechRecognition = window.SpeechRecognition || webkitSpeechRecognition;

// get all the labels from the form
var labels = form.getElementsByTagName("label");

// get all the inputs from the form
var inputs = form.getElementsByTagName("input");

// create a button for user to click and activate the automation
const btn = document.createElement("button");
btn.classList.add("startButton");
btn.innerHTML = "Start Automation";
btn.style.margin = "20px";
btn.style.width = "100%";

// Append the button to html
document.body.prepend(btn);

// Triggers when the button is clicked
btn.addEventListener("click", () => {
  run();
});

// Asynchronous function which has couple of lines of code which has to await
async function run() {
  var keys = Object.keys(labels),
    len = keys.length,
    i = 0;

  while (i < len) {
    let key = keys[i];
    let label = labels[key];

    let labelForValue = label.getAttribute("for");
    console.log("label name: " + labelForValue);

    let input = document.getElementById(labelForValue);
    console.log(input);

    // Speaks the label
    await textToSpeech("Please speak " + label.innerText);

    // Waits for user to speak and gets the result
    let userSpoke = await speechToText();

    userSpoke = userSpoke.split(" ");
    let lastCommand = userSpoke[userSpoke.length - 1].toLowerCase();
    let message = userSpoke.slice(0, -1).join(" ");

    // The last word is the command and it works accordingly
    switch (lastCommand) {
      case "next":
        i++;
        input.value = message;
        continue;
      case "previous":
        i--;
        input.value = message;
        continue;
      case "end":
        return;
      default:
        input.value = message;
        continue;
    }
  }
}

// Converts given text to speech
const textToSpeech = async (text) => {
  var tts = new SpeechSynthesisUtterance(text);
  speechSynthesis.speak(tts);

  return new Promise((resolve) => {
    tts.onend = resolve;
  });
};

// Converts speech to Text
const speechToText = () => {
  // Returns a resolved promise so the the callback can wait until the promise is resolved
  return new Promise((resolved) => {
    var recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;

    recognition.start();
    console.log("recognition started...");

    recognition.onspeechend = () => {
      recognition.stop();

      console.log("recognition ended...");
    };

    recognition.onresult = function (event) {
      let result = event.results[0][0].transcript;
      console.log("You spoke: " + result);
      resolved(result);
    };
  });
};
