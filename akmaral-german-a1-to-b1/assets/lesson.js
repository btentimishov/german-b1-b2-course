(() => {
  "use strict";

  const lessonId = document.body.dataset.lessonId || "lesson";
  const storeKey = `akmaral-deutschreise-${lessonId}-v1`;
  const state = {
    completed: {},
    flips: [],
    attempts: {},
    message: "",
    speaking: false,
    exitAnswers: {},
    exitScore: null
  };

  const normalize = (value) => value.trim().toLocaleLowerCase("de-DE").replace(/[.!?]+$/g, "").replace(/\s+/g, " ");
  const words = (value) => value.trim() ? value.trim().split(/\s+/).length : 0;

  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem(storeKey));
      if (!saved) return;
      Object.assign(state, saved);
    } catch {
      // The lesson still works without storage.
    }
  }

  function saveState() {
    try {
      localStorage.setItem(storeKey, JSON.stringify(state));
    } catch {
      // The lesson still works without storage.
    }
  }

  function showToast(message) {
    const toast = document.querySelector("#lesson-toast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("is-visible");
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => toast.classList.remove("is-visible"), 2400);
  }

  function markStep(step, complete = true) {
    if (!step) return;
    state.completed[step] = complete;
    saveState();
    renderProgress();
  }

  function renderProgress() {
    const steps = [...document.querySelectorAll("[data-lesson-step]")];
    const complete = steps.filter((section) => state.completed[section.dataset.lessonStep]).length;
    const percent = steps.length ? Math.round((complete / steps.length) * 100) : 0;
    const fill = document.querySelector("[data-lesson-progress-fill]");
    const label = document.querySelector("[data-lesson-progress-label]");
    const track = fill?.parentElement;
    if (fill) fill.style.width = `${percent}%`;
    if (label) label.textContent = `${complete}/${steps.length} stations`;
    if (track) track.setAttribute("aria-valuenow", String(percent));
    steps.forEach((section) => section.classList.toggle("is-complete", Boolean(state.completed[section.dataset.lessonStep])));
  }

  function setupManualSteps() {
    document.querySelectorAll("[data-mark-step]").forEach((button) => {
      const step = button.closest("[data-lesson-step]")?.dataset.lessonStep;
      if (state.completed[step]) button.textContent = "Station saved ✓";
      button.addEventListener("click", () => {
        markStep(step);
        button.textContent = "Station saved ✓";
        showToast("Saved. Keep moving when you’re ready.");
      });
    });
  }

  function setupFlipCards() {
    const cards = [...document.querySelectorAll("[data-flip-card]")];
    cards.forEach((card, index) => {
      if (state.flips.includes(index)) card.classList.add("is-revealed");
      card.addEventListener("click", () => {
        card.classList.toggle("is-revealed");
        if (card.classList.contains("is-revealed") && !state.flips.includes(index)) state.flips.push(index);
        if (state.flips.length === cards.length) markStep(card.closest("[data-lesson-step]")?.dataset.lessonStep);
        saveState();
      });
    });
    if (cards.length && state.flips.length === cards.length) {
      markStep(cards[0].closest("[data-lesson-step]")?.dataset.lessonStep);
    }
  }

  function setupChoiceQuizzes() {
    document.querySelectorAll("[data-choice-quiz]").forEach((quiz, quizIndex) => {
      const feedback = quiz.querySelector("[data-feedback]");
      const step = quiz.closest("[data-lesson-step]")?.dataset.lessonStep;
      const quizKey = `choice-${quizIndex}`;
      quiz.querySelectorAll("button[data-correct]").forEach((button) => {
        button.addEventListener("click", () => {
          state.attempts[quizKey] = (state.attempts[quizKey] || 0) + 1;
          const correct = button.dataset.correct === "true";
          quiz.querySelectorAll("button[data-correct]").forEach((option) => option.classList.remove("is-right", "is-wrong"));
          button.classList.add(correct ? "is-right" : "is-wrong");
          if (correct) {
            quiz.dataset.solved = "true";
            feedback.textContent = quiz.dataset.correctMessage || "Richtig — the noun passport changed to einen.";
            feedback.className = "lesson-feedback is-good";
          } else {
            feedback.textContent = quiz.dataset.tryMessage || "Not yet. Find the masculine object: der changes to einen.";
            feedback.className = "lesson-feedback needs-work";
          }
          const sectionQuizzes = [...quiz.closest("[data-lesson-step]").querySelectorAll("[data-choice-quiz]")];
          if (sectionQuizzes.every((item) => item.dataset.solved === "true")) markStep(step);
          saveState();
        });
      });
    });
  }

  function setupSelectDrills() {
    document.querySelectorAll("[data-select-drill]").forEach((drill, drillIndex) => {
      const button = drill.querySelector("[data-check-drill]");
      const feedback = drill.querySelector("[data-feedback]");
      const rows = [...drill.querySelectorAll("[data-answer]")];
      button.addEventListener("click", () => {
        let score = 0;
        rows.forEach((select) => {
          const correct = normalize(select.value) === normalize(select.dataset.answer);
          const row = select.closest(".practice-row");
          row.classList.toggle("is-right", correct);
          row.classList.toggle("is-wrong", !correct);
          if (correct) score += 1;
        });
        state.attempts[`drill-${drillIndex}`] = (state.attempts[`drill-${drillIndex}`] || 0) + 1;
        feedback.textContent = score === rows.length
          ? `${score}/${rows.length} — sauber! Say the six phrases aloud once.`
          : `${score}/${rows.length} — check noun gender first, then ask whether it is the action target.`;
        feedback.className = `lesson-feedback ${score === rows.length ? "is-good" : "needs-work"}`;
        if (score === rows.length) markStep(drill.closest("[data-lesson-step]")?.dataset.lessonStep);
        saveState();
      });
    });
  }

  function setupRecall() {
    document.querySelectorAll("[data-recall-set]").forEach((set, setIndex) => {
      const inputs = [...set.querySelectorAll("input[data-answer]")];
      const feedback = set.querySelector("[data-feedback]");
      set.querySelector("[data-check-recall]").addEventListener("click", () => {
        let score = 0;
        inputs.forEach((input, inputIndex) => {
          const key = `recall-${setIndex}-${inputIndex}`;
          const answers = input.dataset.answer.split("|").map(normalize);
          const correct = answers.includes(normalize(input.value));
          const row = input.closest(".recall-row");
          row.classList.toggle("is-right", correct);
          row.classList.toggle("is-wrong", !correct);
          if (correct) {
            score += 1;
            row.querySelector("[data-note]").textContent = "✓";
          } else {
            state.attempts[key] = (state.attempts[key] || 0) + 1;
            row.querySelector("[data-note]").textContent = state.attempts[key] >= 2
              ? `Answer: ${input.dataset.answer.split("|")[0]}`
              : "Try again: masculine object → einen …";
          }
        });
        feedback.textContent = score === inputs.length
          ? "All three recalled without a visible model — strong storage practice."
          : `${score}/${inputs.length} retrieved. Wait ten seconds, then try the missed line again.`;
        feedback.className = `lesson-feedback ${score === inputs.length ? "is-good" : "needs-work"}`;
        if (score === inputs.length) markStep(set.closest("[data-lesson-step]")?.dataset.lessonStep);
        saveState();
      });
    });
  }

  function playGerman(button) {
    const text = button.dataset.speak;
    if (!("speechSynthesis" in window) || !text) {
      showToast("German audio is unavailable in this browser.");
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "de-DE";
    utterance.rate = 0.78;
    window.speechSynthesis.speak(utterance);
  }

  function setupAudio() {
    document.querySelectorAll("button[data-speak]").forEach((button) => button.addEventListener("click", () => playGerman(button)));
  }

  function messageChecks(value) {
    const text = normalize(value);
    return {
      length: words(value) >= 25 && words(value) <= 55,
      object: /\beinen\s+(termin|kurs|test|bericht|laptop|job)\b/i.test(text),
      schedule: /\b(am\s+(montag|dienstag|mittwoch|donnerstag|freitag|samstag|sonntag)|heute|morgen|um\s+\d{1,2})\b/i.test(text),
      next: /\?/.test(value) || /\b(können|kannst|passt|treffen|zeit)\b/i.test(text)
    };
  }

  function setupMessageCoach() {
    const coach = document.querySelector("[data-message-coach]");
    if (!coach) return;
    const textarea = coach.querySelector("textarea");
    const count = coach.querySelector("[data-word-count]");
    const step = coach.closest("[data-lesson-step]")?.dataset.lessonStep;
    textarea.value = state.message || "";
    const update = () => {
      state.message = textarea.value;
      const checks = messageChecks(state.message);
      count.textContent = `${words(state.message)} words`;
      coach.querySelectorAll("[data-message-check]").forEach((item) => item.classList.toggle("is-pass", checks[item.dataset.messageCheck]));
      if (Object.values(checks).filter(Boolean).length >= 3) markStep(step);
      saveState();
    };
    textarea.addEventListener("input", update);
    update();

    const speaking = coach.querySelector("[data-speaking]");
    speaking.checked = state.speaking;
    speaking.addEventListener("change", () => {
      state.speaking = speaking.checked;
      saveState();
    });
  }

  function setupExitQuiz() {
    const exit = document.querySelector("[data-exit-quiz]");
    if (!exit) return;
    const feedback = exit.querySelector("[data-feedback]");
    exit.querySelector("[data-check-exit]").addEventListener("click", () => {
      const groups = [...exit.querySelectorAll("[data-exit-group]")];
      if (groups.some((group) => !group.querySelector("input:checked"))) {
        feedback.textContent = "Answer all four tickets first.";
        feedback.className = "lesson-feedback needs-work";
        return;
      }
      let score = 0;
      groups.forEach((group, groupIndex) => {
        const selected = group.querySelector("input:checked");
        const correct = selected.dataset.correct === "true";
        state.exitAnswers[groupIndex] = selected.value;
        group.classList.toggle("is-right", correct);
        group.classList.toggle("is-wrong", !correct);
        if (correct) score += 1;
      });
      state.exitScore = score;
      feedback.textContent = score >= 3
        ? `${score}/4 — the einen pattern is ready for a real message.`
        : `${score}/4 — reopen the noun passports, then retrieve the four answers once more.`;
      feedback.className = `lesson-feedback ${score >= 3 ? "is-good" : "needs-work"}`;
      if (score >= 3) markStep(exit.closest("[data-lesson-step]")?.dataset.lessonStep);
      renderCompletion(true);
      saveState();
    });
  }

  function buildReport() {
    const checks = messageChecks(state.message);
    const attempts = Object.values(state.attempts).reduce((sum, count) => sum + count, 0);
    return `Akmaral’s Deutschreise — Lesson 2 result

Lesson: Ich habe einen Termin
Focus: masculine accusative in study and work schedules
Exit ticket: ${state.exitScore ?? "not completed"}/4
Practice attempts recorded: ${attempts}
Speaking mission attempted: ${state.speaking ? "yes" : "no"}

Message support checks:
- 25–55 words: ${checks.length ? "yes" : "not yet"}
- einen + masculine study/work noun: ${checks.object ? "yes" : "not yet"}
- day/time phrase: ${checks.schedule ? "yes" : "not yet"}
- next step or question: ${checks.next ? "yes" : "not yet"}

Original message (${words(state.message)} words):
${state.message || "No message submitted."}

Ask Akmaral: „Was hast du diese Woche in der Uni oder bei der Arbeit?“

Please review whether she can produce der → einen without a visible model. If yes, update the learning record and choose between time/listening practice and spoken Perfekt for Lesson 3.`;
  }

  function renderCompletion(shouldScroll = false) {
    const card = document.querySelector("[data-completion]");
    if (!card || state.exitScore === null) return;
    card.classList.remove("is-hidden");
    const checks = messageChecks(state.message);
    const ready = state.exitScore >= 3 && checks.length && checks.object;
    card.querySelector("[data-completion-title]").textContent = ready ? "Station complete." : "One more short loop.";
    card.querySelector("[data-completion-copy]").textContent = ready
      ? "You used the masculine object pattern in retrieval and your own study/work message. Copy the result for your teacher."
      : "Review the noun passports, improve the message, and try the exit ticket again. Mistakes stay useful.";
    if (shouldScroll) card.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function setupCopy() {
    document.querySelectorAll("[data-copy-report]").forEach((button) => {
      button.addEventListener("click", async () => {
        const report = buildReport();
        try {
          await navigator.clipboard.writeText(report);
        } catch {
          const area = document.createElement("textarea");
          area.value = report;
          area.style.position = "fixed";
          area.style.opacity = "0";
          document.body.appendChild(area);
          area.select();
          document.execCommand("copy");
          area.remove();
        }
        showToast("Lesson result copied for your teacher.");
      });
    });
  }

  loadState();
  setupManualSteps();
  setupFlipCards();
  setupChoiceQuizzes();
  setupSelectDrills();
  setupRecall();
  setupAudio();
  setupMessageCoach();
  setupExitQuiz();
  setupCopy();
  renderProgress();
  renderCompletion();
})();
