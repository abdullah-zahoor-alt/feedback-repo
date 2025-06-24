let inputSketch = function(p) {
  let prefix = "Dear Teacher, ";
  let userInput = "";
  let cursorVisible = true;

  p.setup = function() {
    if (typeof page === "undefined" || page !== 'input') return;

    p.createCanvas(p.windowWidth, p.windowHeight);
    p.textSize(20);
    p.textFont("Arial");
    p.fill(0);
    p.frameRate(2);
  };

  p.draw = function() {
    if (typeof page === "undefined" || page !== 'input') return;

    p.background(255);
    let x = 60;
    let y = p.height / 2;

    p.text(prefix, x, y);
    let prefixWidth = p.textWidth(prefix);
    p.text(userInput, x + prefixWidth, y);

    if (cursorVisible) {
      let cursorX = x + prefixWidth + p.textWidth(userInput);
      p.line(cursorX, y - 30, cursorX, y + 10);
    }

    cursorVisible = !cursorVisible;
  };

  p.keyTyped = function() {
    if (typeof page === "undefined" || page !== 'input') return;
    if (p.key !== '\n' && p.key !== '\r') {
      userInput += p.key;
    }
  };

  p.keyPressed = function() {
    if (typeof page === "undefined" || page !== 'input') return;

    if (p.keyCode === p.BACKSPACE) {
      userInput = userInput.slice(0, -1);
    }

    if (p.keyCode === p.ENTER && userInput.trim().length > 0) {
      let fullSentence = prefix + userInput;

      fetch("/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sentence: fullSentence })
      }).then(() => {
        userInput = "";

        const channel = new BroadcastChannel("feedback_channel");
        channel.postMessage("new-feedback");
        channel.close();
      });
    }
  };
};

new p5(inputSketch);
