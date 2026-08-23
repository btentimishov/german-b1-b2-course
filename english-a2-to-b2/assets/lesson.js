(() => {
  "use strict";

  const root = document.querySelector("[data-lesson-id]");
  if (!root) return;

  const lessonId = root.dataset.lessonId;
  const storageKey = `english-compass-${lessonId}-v1`;
  const cards = [...document.querySelectorAll("[data-practice]")];
  const storyFields = [...document.querySelectorAll("[data-story-field]")];
  const checkItems = [...document.querySelectorAll("[data-check]")];
  const minimumStoryWords = Number(root.dataset.storyMin || 25);
  const state = {
    completed: [],
    attempts: {},
    story: {}
  };

  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey));
      if (!saved) return;
      state.completed = Array.isArray(saved.completed) ? saved.completed : [];
      state.attempts = saved.attempts || {};
      state.story = saved.story || {};
    } catch {
      // A broken saved value should never block the lesson.
    }
  }

  function saveState() {
    localStorage.setItem(storageKey, JSON.stringify(state));
  }

  function countWords(text) {
    const clean = text.trim();
    return clean ? clean.split(/\s+/).length : 0;
  }

  function getStory() {
    return storyFields.map((field) => field.value.trim()).filter(Boolean).join(" ");
  }

  function storyChecks(story) {
    return checkItems.map((item) => {
      try {
        return new RegExp(item.dataset.pattern, item.dataset.flags || "i").test(story);
      } catch {
        return false;
      }
    });
  }

  function updateStory() {
    storyFields.forEach((field) => {
      state.story[field.dataset.storyField] = field.value;
    });
    const story = getStory();
    const checks = storyChecks(story);
    checkItems.forEach((item, index) => item.classList.toggle("is-done", checks[index]));
    document.querySelector("[data-story-count]").textContent = `${countWords(story)} words`;
    saveState();
    updateProgress();
  }

  function updateProgress() {
    const story = getStory();
    const checks = storyChecks(story);
    const storyReady = countWords(story) >= minimumStoryWords && checks.every(Boolean);
    const completedCount = state.completed.length + (storyReady ? 1 : 0);
    const total = cards.length + 1;
    const percent = Math.round((completedCount / total) * 100);
    const bar = document.querySelector("[data-lesson-progress]");
    bar.style.width = `${percent}%`;
    bar.parentElement.setAttribute("aria-valuenow", percent);
    document.querySelector("[data-progress-text]").textContent = `${completedCount}/${total} steps`;
    document.querySelector("[data-finish-lesson]").disabled = !(state.completed.length === cards.length && storyReady);
  }

  function completeCard(card, choice) {
    const id = card.dataset.practice;
    if (!state.completed.includes(id)) state.completed.push(id);
    card.classList.add("is-complete");
    card.querySelectorAll(".lesson-choice").forEach((button) => {
      button.disabled = true;
      if (button === choice) button.classList.add("is-correct");
    });
    const feedback = card.querySelector(".practice-feedback");
    feedback.textContent = card.dataset.success;
    feedback.className = "practice-feedback is-success";
    saveState();
    updateProgress();
  }

  function answerCard(card, choice) {
    const id = card.dataset.practice;
    if (state.completed.includes(id)) return;
    state.attempts[id] = (state.attempts[id] || 0) + 1;
    if (choice.dataset.correct === "true") {
      completeCard(card, choice);
    } else {
      choice.classList.add("is-wrong");
      choice.disabled = true;
      const feedback = card.querySelector(".practice-feedback");
      feedback.textContent = card.dataset.retry;
      feedback.className = "practice-feedback is-try-again";
      saveState();
    }
  }

  function restoreView() {
    cards.forEach((card) => {
      const id = card.dataset.practice;
      card.querySelectorAll(".lesson-choice").forEach((choice) => {
        choice.addEventListener("click", () => answerCard(card, choice));
      });
      if (state.completed.includes(id)) {
        const correct = card.querySelector("[data-correct='true']");
        completeCard(card, correct);
      }
    });
    storyFields.forEach((field) => {
      field.value = state.story[field.dataset.storyField] || "";
      field.addEventListener("input", updateStory);
    });
    updateStory();
  }

  function buildReport() {
    const attempts = Object.values(state.attempts).reduce((sum, value) => sum + value, 0);
    const lessonNumber = root.dataset.lessonNumber || lessonId.replace(/\D/g, "");
    const learner = root.dataset.learner || "Learner";
    const lessonTitle = root.dataset.lessonTitle || document.title;
    const reportPrompt = root.dataset.reportPrompt || "Please review my work, record demonstrated learning, and choose the next lesson in my zone of proximal development.";
    return `English Compass · Lesson ${lessonNumber} result

Learner: ${learner}
Lesson: ${lessonTitle}
Practice: ${state.completed.length}/${cards.length} completed
Attempts: ${attempts}

My story:
${getStory()}

${reportPrompt}`;
  }

  async function finishLesson() {
    const report = buildReport();
    try {
      await navigator.clipboard.writeText(report);
    } catch {
      const fallback = document.createElement("textarea");
      fallback.value = report;
      fallback.style.position = "fixed";
      fallback.style.opacity = "0";
      document.body.appendChild(fallback);
      fallback.select();
      document.execCommand("copy");
      fallback.remove();
    }
    document.querySelector("[data-completion]").classList.add("is-visible");
    document.querySelector("[data-completion]").scrollIntoView({ behavior: "smooth", block: "center" });
  }

  loadState();
  restoreView();
  document.querySelector("[data-finish-lesson]").addEventListener("click", finishLesson);
  document.querySelectorAll("[data-speak]").forEach((button) => {
    button.addEventListener("click", () => {
      if (!("speechSynthesis" in window)) return;
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(button.dataset.speak);
      utterance.lang = "en-GB";
      utterance.rate = 0.86;
      window.speechSynthesis.speak(utterance);
    });
  });
})();
