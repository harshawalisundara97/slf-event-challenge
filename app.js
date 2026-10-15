/* QuickQuest — configure DATA_ENDPOINT after deploying the Google Apps Script. */
const DATA_ENDPOINT = "https://script.google.com/macros/s/AKfycbwKrhZn3ZOZ08nAsSOAeeQHUV5O0OFYhtX612oPlNWuAn4q7Iyo3450ikE1WF_zgCVf/exec"; // Google Apps Script Web App URL.

const questions = [
  { round: "ROUND 1 OF 3", title: "Tech check", category: "💻 TECHNOLOGY", prompt: "What is the safest thing to do if you receive an unexpected email asking you to click a link and enter your password?", answers: ["Click the link quickly", "Forward it to all your friends", "Check the sender and report or delete it", "Reply with your password"], correct: 2 },
  { round: "ROUND 1 OF 3", title: "Tech check", category: "💻 TECHNOLOGY", prompt: "What does a QR code usually help you do?", answers: ["Open linked information by scanning it", "Charge your phone faster", "Make your internet unlimited", "Increase your phone's storage"], correct: 0 },
  { round: "ROUND 1 OF 3", title: "Tech check", category: "💻 TECHNOLOGY", prompt: "Which tool is most suitable for a live online group meeting?", answers: ["Calculator", "Video-conferencing app", "Photo gallery", "File cleaner"], correct: 1 },
  { round: "ROUND 2 OF 3", title: "General knowledge", category: "🧠 GENERAL KNOWLEDGE", prompt: "What is the administrative capital of Sri Lanka?", answers: ["Kandy", "Sri Jayawardenepura Kotte", "Galle", "Jaffna"], correct: 1 },
  { round: "ROUND 2 OF 3", title: "General knowledge", category: "🧠 GENERAL KNOWLEDGE", prompt: "Which planet is known as the Red Planet?", answers: ["Venus", "Jupiter", "Mars", "Mercury"], correct: 2 },
  { round: "ROUND 2 OF 3", title: "General knowledge", category: "🧠 GENERAL KNOWLEDGE", prompt: "How many colours are traditionally listed in a rainbow?", answers: ["Five", "Six", "Seven", "Eight"], correct: 2 }
];
const agendaCorrect = ["Registration & guest arrival", "Welcome and opening", "Guest speech", "Main activity", "Vote of thanks", "Closing" ];
const agendaInitial = ["Main activity", "Registration & guest arrival", "Vote of thanks", "Guest speech", "Closing", "Welcome and opening"];
const maxScore = 90;
let questionIndex = 0, quizScore = 0, selectedAnswer = null, answered = false, agendaItems = [...agendaInitial], agendaScore = 0, totalScore = 0, agendaChecked = false;
const $ = (id) => document.getElementById(id);
const screens = ["welcome-screen", "quiz-screen", "agenda-screen", "result-screen", "thankyou-screen"];
function showScreen(id) { screens.forEach(s => $(s).classList.toggle("active", s === id)); window.scrollTo({ top: 0, behavior: "smooth" }); }
function renderQuestion() {
  const q = questions[questionIndex]; selectedAnswer = null; answered = false;
  $("round-kicker").textContent = q.round; $("round-title").textContent = q.title; $("question-category").textContent = q.category; $("question-text").textContent = q.prompt;
  $("progress-number").textContent = `${questionIndex + 1} / ${questions.length + 1}`;
  $("progress-fill").style.width = `${((questionIndex + 1) / (questions.length + 1)) * 100}%`;
  $("question-count").textContent = `QUESTION ${questionIndex + 1} OF ${questions.length}`;
  $("next-button").disabled = true; $("next-button").innerHTML = questionIndex === questions.length - 1 ? 'Event puzzle <span>→</span>' : 'Continue <span>→</span>';
  const list = $("answer-list"); list.innerHTML = "";
  q.answers.forEach((answer, i) => {
    const button = document.createElement("button"); button.type = "button"; button.className = "answer-option";
    const letter = document.createElement("span"); letter.className = "answer-letter"; letter.textContent = String.fromCharCode(65 + i);
    const text = document.createElement("span"); text.textContent = answer; button.append(letter, text);
    button.addEventListener("click", () => chooseAnswer(i)); list.appendChild(button);
  });
}
function chooseAnswer(index) {
  if (answered) return; answered = true; selectedAnswer = index;
  const q = questions[questionIndex]; const buttons = [...$("answer-list").querySelectorAll("button")];
  buttons.forEach((b, i) => { b.disabled = true; if (i === q.correct) b.classList.add("correct"); if (i === index && index !== q.correct) b.classList.add("incorrect"); if (i === index) b.classList.add("selected"); });
  if (index === q.correct) quizScore += 10;
  $("next-button").disabled = false;
}
function renderAgenda() {
  const list = $("agenda-list"); list.innerHTML = "";
  agendaItems.forEach((item, index) => {
    const li = document.createElement("li"); li.className = "agenda-item"; li.dataset.item = item;
    const number = document.createElement("span"); number.className = "agenda-number"; number.textContent = index + 1;
    const label = document.createElement("span"); label.className = "agenda-label"; label.textContent = item;
    const controls = document.createElement("div"); controls.className = "move-buttons";
    const up = document.createElement("button"); up.type = "button"; up.className = "move-button"; up.textContent = "↑"; up.setAttribute("aria-label", `Move ${item} up`); up.disabled = index === 0; up.addEventListener("click", () => moveAgenda(index, -1));
    const down = document.createElement("button"); down.type = "button"; down.className = "move-button"; down.textContent = "↓"; down.setAttribute("aria-label", `Move ${item} down`); down.disabled = index === agendaItems.length - 1; down.addEventListener("click", () => moveAgenda(index, 1));
    controls.append(up, down); li.append(number, label, controls); list.appendChild(li);
  });
}
function moveAgenda(index, direction) { const target = index + direction; if (target < 0 || target >= agendaItems.length) return; [agendaItems[index], agendaItems[target]] = [agendaItems[target], agendaItems[index]]; renderAgenda(); }
function finishChallenge() {
  agendaScore = agendaItems.reduce((sum, item, i) => sum + (item === agendaCorrect[i] ? 5 : 0), 0);
  totalScore = quizScore + agendaScore;
  $("final-score").textContent = totalScore;
  $("score-detail").textContent = `Technology & general knowledge: ${quizScore}/60 · Agenda puzzle: ${agendaScore}/30`;
  if (totalScore >= 70) { $("result-icon").textContent = "🏆"; $("result-heading").textContent = "Brilliant effort!"; $("result-description").textContent = "You showed curiosity, knowledge, and planning skills."; }
  else if (totalScore >= 40) { $("result-icon").textContent = "✨"; $("result-heading").textContent = "Nice work!"; $("result-description").textContent = "You made it through every round. Keep learning and exploring."; }
  else { $("result-icon").textContent = "🚀"; $("result-heading").textContent = "Challenge complete!"; $("result-description").textContent = "Every challenge is a chance to learn something new."; }
  showScreen("result-screen");
}
function resetApp() { questionIndex = 0; quizScore = 0; selectedAnswer = null; answered = false; agendaItems = [...agendaInitial]; agendaScore = 0; totalScore = 0; agendaChecked = false; const cab = $("check-agenda-button"); cab.disabled = false; cab.innerHTML = 'Check order <span>&rarr;</span>'; $("interest-form").reset(); $("submit-button").disabled = false; $("submit-button").innerHTML = 'Submit my details <span>&rarr;</span>'; renderQuestion(); renderAgenda(); showScreen("welcome-screen"); }
$("start-button").addEventListener("click", () => { renderQuestion(); showScreen("quiz-screen"); });
$("next-button").addEventListener("click", () => { if (!answered) return; if (questionIndex < questions.length - 1) { questionIndex++; renderQuestion(); } else { renderAgenda(); showScreen("agenda-screen"); } });
$("check-agenda-button").addEventListener("click", () => {
  if (!agendaChecked) {
    agendaChecked = true;
    [...$("agenda-list").children].forEach((li, i) => li.classList.add(agendaItems[i] === agendaCorrect[i] ? "correct-position" : "wrong-position"));
    $("agenda-list").querySelectorAll(".move-button").forEach(b => b.disabled = true);
    $("check-agenda-button").innerHTML = 'See my score <span>&rarr;</span>';
  } else {
    finishChallenge();
  }
});
$("interest-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const name = $("participant-name").value.trim(); const phone = $("participant-phone").value.trim();
  const interest = document.querySelector('input[name="interest"]:checked')?.value;
  if (!name || !phone || !interest || !$("data-consent").checked) return;
  const record = { name, phone, interest, score: totalScore, techGeneralScore: quizScore, agendaScore, submittedAt: new Date().toISOString(), consent: "yes" };
  const button = $("submit-button"); button.disabled = true; button.textContent = "Submitting…";
  try {
    if (DATA_ENDPOINT.trim()) {
      await fetch(DATA_ENDPOINT, { method: "POST", mode: "no-cors", headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" }, body: new URLSearchParams(record).toString() });
      showThanks("Your details have been submitted. Thanks for taking part!");
    } else {
      console.warn("No DATA_ENDPOINT configured. Form data was not saved.", record);
      showThanks("Thanks for taking part! The form isn't connected to the response sheet yet, so your details were not saved.");
    }
  } catch (error) {
    console.error(error); button.disabled = false; button.innerHTML = 'Try submitting again <span>↻</span>';
    alert("We couldn't submit your details. Please check your internet connection and try again, or skip the form.");
  }
});
function showThanks(message) { $("thankyou-heading").textContent = "Thanks for taking part!"; $("thankyou-copy").textContent = message; $("thankyou-score").textContent = `${totalScore} / ${maxScore}`; showScreen("thankyou-screen"); }
$("skip-form-button").addEventListener("click", () => showThanks("We hope you enjoyed the challenge. Keep being curious and keep creating."));
$("play-again-button").addEventListener("click", resetApp);
renderQuestion(); renderAgenda();
