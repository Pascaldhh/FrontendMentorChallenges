const adNumber = document.getElementById("advice-number");
const adQuote = document.getElementById("advice-quote");
const adButton = document.getElementById("advice-btn");
const adWarning = document.getElementById("advice-warning");

async function getQuote() {
  const response = await fetch("https://api.adviceslip.com/advice");
  const json = await response.json();
  return json?.slip;
}

function setQuote(nr, quote) {
  if(adNumber.textContent == nr && !adWarning.classList.contains("warning")) {
    adWarning.classList.add("warning");
    setTimeout(()=>adWarning.classList.remove("warning"), 1000);
  }
  adNumber.textContent = nr;
  adQuote.textContent = quote;
}

adButton.addEventListener("click", async e => setQuote(...Object.values(await getQuote())));
