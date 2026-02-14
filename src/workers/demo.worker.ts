let isRunning = true;
let counter = 0;

function generateText() {
  const texts = ["[A] Animation", "[R] Working", "[I] Progress", "[M] Modify"];
  return texts[counter % texts.length] + " (" + counter + ")";
}

self.onmessage = function (e) {
  const { action } = e.data;

  if (action === "start") {
    const interval = setInterval(() => {
      if (!isRunning) {
        clearInterval(interval);
        return;
      }
      counter++;
      const text = generateText();
      self.postMessage({ type: "text", content: text });
    }, 500);

    self.intervalId = interval;
  }

  if (action === "stop") {
    isRunning = false;
    if (self.intervalId) {
      clearInterval(self.intervalId);
    }
  }
};
