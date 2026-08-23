(() => {
  "use strict";

  const root = document.querySelector("[data-lesson-id]");
  if (!root) return;

  const lessonId = root.dataset.lessonId;
  const storageKey = `english-compass-${lessonId}-v1`;
  const cards = [...document.querySelectorAll("[data-practice]")];
  const storyFields = [...document.querySelectorAll("[data-story-field]")];
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
    return {
      time: /\b(yesterday|last\s+(night|week|weekend|monday|tuesday|wednesday|thursday|friday|saturday|sunday)|on\s+(monday|tuesday|wednesday|thursday|friday|saturday|sunday)|\d+\s+days?\s+ago)\b/i.test(story),
      past: /\b(was|were|had|did|went|wanted|planned|prepared|made|took|helped|called|visited|cooked|baked|stopped|started|finished|needed|decided|stayed|played|watched|worked|arrived|left|felt|thought|could|[a-z]+ed)\b/i.test(story),
      connector: /\b(but|so|because|then|in the end|after that)\b/i.test(story)
    };
  }

  function updateStory() {
    storyFields.forEach((field) => {
      state.story[field.dataset.storyField] = field.value;
    });
    const story = getStory();
    const checks = storyChecks(story);
    document.querySelector("[data-check='time']").classList.toggle("is-done", checks.time);
    document.querySelector("[data-check='past']").classList.toggle("is-done", checks.past);
    document.querySelector("[data-check='connector']").classList.toggle("is-done", checks.connector);
    document.querySelector("[data-story-count]").textContent = `${countWords(story)} words`;
    saveState();
    updateProgress();
  }

  function updateProgress() {
    const story = getStory();
    const checks = storyChecks(story);
    const storyReady = countWords(story) >= 25 && Object.values(checks).every(Boolean);
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
    return `English Compass · Lesson 0002 result

Learner: Asel
Lesson: A finished Monday story — past simple
Practice: ${state.completed.length}/${cards.length} completed
Attempts: ${attempts}

My finished story:
${getStory()}

Please review my past-time marker, past-simple verbs, and story order. Record demonstrated learning and choose the next lesson in my zone of proximal development.`;
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
})();
