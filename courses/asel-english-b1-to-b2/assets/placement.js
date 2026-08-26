(() => {
  "use strict";

  const questions = [
    {
      level: "A2",
      world: "The Everyday Garden",
      category: "Grammar",
      topic: "actions happening now",
      prompt: "Look—the children ___ a tiny snowman in the garden.",
      options: ["are building", "were building", "have built", "will build"],
      answer: 0,
      tip: "Use the present continuous for an action happening now: are building."
    },
    {
      level: "A2",
      world: "The Everyday Garden",
      category: "Grammar",
      topic: "finished past events",
      prompt: "We ___ the museum yesterday afternoon.",
      options: ["visited together", "visit together", "have visited", "are visiting"],
      answer: 0,
      tip: "A finished time such as yesterday normally takes the past simple: visited."
    },
    {
      level: "A2",
      world: "The Everyday Garden",
      category: "Grammar",
      topic: "countable and uncountable nouns",
      prompt: "There isn't ___ for breakfast, so I'll go shopping.",
      options: ["much milk", "many milk", "few milk", "several milk"],
      answer: 0,
      tip: "Milk is uncountable, so much milk is the natural form in a negative sentence."
    },
    {
      level: "A2",
      world: "The Everyday Garden",
      category: "Vocabulary",
      topic: "everyday requests",
      prompt: "At dinner, which phrase completes the request? “Could you ___, please?”",
      options: ["pass the salt", "borrow the salt", "invite the salt", "arrive the salt"],
      answer: 0,
      tip: "Pass the salt is a common everyday chunk for giving something across a table."
    },
    {
      level: "A2",
      world: "The Everyday Garden",
      category: "Grammar",
      topic: "time prepositions",
      prompt: "My English class starts ___ nine o'clock.",
      options: ["at exactly", "on exactly", "in exactly", "by exactly"],
      answer: 0,
      tip: "Use at with clock times: at nine o'clock."
    },
    {
      level: "A2",
      world: "The Everyday Garden",
      category: "Grammar",
      topic: "comparatives",
      prompt: "This story is ___ than the last one.",
      options: ["more interesting", "most interesting", "very interesting", "much interest"],
      answer: 0,
      tip: "For a comparison with than, use the comparative form: more interesting."
    },
    {
      level: "A2",
      world: "The Everyday Garden",
      category: "Comprehension",
      topic: "following simple directions",
      prompt: "Listen once or twice. Where is the pharmacy?",
      audio: "The pharmacy is opposite the bank, beside the bakery.",
      options: ["Beside the bakery", "Behind the bakery", "Inside the bank", "Beyond the station"],
      answer: 0,
      tip: "The speaker says the pharmacy is beside the bakery and opposite the bank."
    },
    {
      level: "B1",
      world: "The Conversation City",
      category: "Grammar",
      topic: "present perfect with since",
      prompt: "I ___ in this neighbourhood since 2022.",
      options: ["have lived", "lived already", "am living", "was living"],
      answer: 0,
      tip: "Since gives a starting point for a situation continuing now: have lived."
    },
    {
      level: "B1",
      world: "The Conversation City",
      category: "Grammar",
      topic: "first conditional",
      prompt: "If it rains tomorrow, we ___ at home.",
      options: ["will stay", "would stay", "stayed quietly", "stay always"],
      answer: 0,
      tip: "A real future possibility uses if + present, then will + verb: will stay."
    },
    {
      level: "B1",
      world: "The Conversation City",
      category: "Grammar",
      topic: "past habits with used to",
      prompt: "I ___ coffee, but now I love it.",
      options: ["used to dislike", "have always disliked", "was always disliking", "would still dislike"],
      answer: 0,
      tip: "Used to + verb describes a past state or habit that is no longer true."
    },
    {
      level: "B1",
      world: "The Conversation City",
      category: "Grammar",
      topic: "relative clauses",
      prompt: "The woman ___ helped us spoke three languages.",
      options: ["who kindly", "which kindly", "where kindly", "whose kindly"],
      answer: 0,
      tip: "Use who for a person who performs the action: the woman who helped us."
    },
    {
      level: "B1",
      world: "The Conversation City",
      category: "Vocabulary",
      topic: "verb–noun collocations",
      prompt: "After thinking carefully, I need to ___.",
      options: ["make a decision", "do a decision", "build a decision", "create a decision"],
      answer: 0,
      tip: "English uses the fixed collocation make a decision."
    },
    {
      level: "B1",
      world: "The Conversation City",
      category: "Vocabulary",
      topic: "phrasal verbs",
      prompt: "We had to ___ the meeting until Friday.",
      options: ["put off", "put on", "put out", "put up"],
      answer: 0,
      tip: "Put off means postpone or move something to a later time."
    },
    {
      level: "B1",
      world: "The Conversation City",
      category: "Comprehension",
      topic: "understanding a short narrative",
      context: "Maya planned to take the train. Because of a strike, she left early and caught a bus instead. She arrived ten minutes late, but her manager thanked her for making the effort.",
      prompt: "What is the main point of Maya's story?",
      options: ["She adapted to a problem", "She completely missed her meeting", "She forgot about the strike", "She travelled without any delay"],
      answer: 0,
      tip: "Maya changed her plan when a problem appeared, which shows that she adapted."
    },
    {
      level: "B2",
      world: "The Ideas Observatory",
      category: "Grammar",
      topic: "third conditional",
      prompt: "If I had known about the change, I ___ earlier.",
      options: ["would have called", "will have called", "had called already", "would call earlier"],
      answer: 0,
      tip: "An unreal past result uses would have + past participle: would have called."
    },
    {
      level: "B2",
      world: "The Ideas Observatory",
      category: "Grammar",
      topic: "future passive",
      prompt: "By next month, the new bridge ___.",
      options: ["will be completed", "has been completed", "was being completed", "would complete itself"],
      answer: 0,
      tip: "A future result in the passive uses will be + past participle."
    },
    {
      level: "B2",
      world: "The Ideas Observatory",
      category: "Grammar",
      topic: "reported speech",
      prompt: "“I'll send it tonight,” Alex said. Alex said he ___ it that night.",
      options: ["would send", "will send", "had sent", "was sending"],
      answer: 0,
      tip: "In past reporting, will commonly shifts back to would."
    },
    {
      level: "B2",
      world: "The Ideas Observatory",
      category: "Grammar",
      topic: "modals of deduction",
      prompt: "The lights are off and nobody answers. They ___ home.",
      options: ["can't be", "must be", "might have", "should get"],
      answer: 0,
      tip: "Can't be expresses a strong logical conclusion that they are not at home."
    },
    {
      level: "B2",
      world: "The Ideas Observatory",
      category: "Vocabulary",
      topic: "precise academic and work verbs",
      prompt: "The new policy could seriously ___ many small businesses.",
      options: ["affect", "effect", "result", "occur"],
      answer: 0,
      tip: "Affect is usually the verb meaning influence something."
    },
    {
      level: "B2",
      world: "The Ideas Observatory",
      category: "Grammar",
      topic: "linking contrasting ideas",
      prompt: "The plan is expensive. ___, it may save money in the long term.",
      options: ["Nevertheless", "Therefore", "Similarly", "Otherwise"],
      answer: 0,
      tip: "Nevertheless introduces a contrast: it is expensive, but it may save money."
    },
    {
      level: "B2",
      world: "The Ideas Observatory",
      category: "Vocabulary",
      topic: "describing clear communication",
      prompt: "Her explanation was ___ for everyone to understand the process.",
      options: ["clear enough", "vague enough", "rare enough", "slight enough"],
      answer: 0,
      tip: "Clear describes communication that is easy to understand."
    }
  ];

  // Keep option lengths comparable without making the correct position predictable.
  const answerPositions = [2, 0, 3, 1, 2, 0, 1, 3, 0, 2, 1, 3, 0, 2, 1, 3, 2, 0, 3, 1, 2];
  questions.forEach((question, index) => {
    const correctOption = question.options[question.answer];
    const remaining = question.options.filter((_, optionIndex) => optionIndex !== question.answer);
    const target = answerPositions[index];
    remaining.splice(target, 0, correctOption);
    question.options = remaining;
    question.answer = target;
  });

  const storeKey = "english-compass-placement-v1";
  const state = {
    current: 0,
    answers: Array(questions.length).fill(null),
    name: "",
    goal: "",
    writing: ""
  };

  const screens = {
    hero: document.querySelector("#hero-screen"),
    profile: document.querySelector("#profile-screen"),
    quiz: document.querySelector("#quiz-screen"),
    writing: document.querySelector("#writing-screen"),
    results: document.querySelector("#results-screen")
  };

  const byId = (id) => document.getElementById(id);

  function showScreen(name) {
    Object.entries(screens).forEach(([key, element]) => {
      element.classList.toggle("is-hidden", key !== name);
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
    const heading = screens[name].querySelector("h1, h2");
    if (heading) {
      heading.setAttribute("tabindex", "-1");
      heading.focus({ preventScroll: true });
    }
  }

  function saveState() {
    localStorage.setItem(storeKey, JSON.stringify(state));
  }

  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem(storeKey));
      if (!saved || !Array.isArray(saved.answers) || saved.answers.length !== questions.length) return false;
      state.current = Math.min(Math.max(Number(saved.current) || 0, 0), questions.length - 1);
      state.answers = saved.answers;
      state.name = saved.name || "";
      state.goal = saved.goal || "";
      state.writing = saved.writing || "";
      return state.answers.some((answer) => answer !== null) || Boolean(state.name || state.goal || state.writing);
    } catch {
      return false;
    }
  }

  function showToast(message) {
    const toast = byId("toast");
    toast.textContent = message;
    toast.classList.add("is-visible");
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => toast.classList.remove("is-visible"), 2400);
  }

  function renderQuestion() {
    const question = questions[state.current];
    const progress = Math.round((state.current / (questions.length + 1)) * 100);
    byId("progress-bar").style.width = `${progress}%`;
    byId("progress-bar").parentElement.setAttribute("aria-valuenow", progress);
    byId("progress-step").textContent = question.world;
    byId("question-count").textContent = `${state.current + 1} / ${questions.length}`;
    byId("world-label").textContent = `${question.level} · ${question.category}`;
    byId("question-prompt").textContent = question.prompt;

    const context = byId("question-context");
    context.textContent = question.context || "Choose the answer that sounds most natural and accurate.";
    context.classList.toggle("is-hidden", !question.context);

    const audioButton = byId("audio-prompt");
    audioButton.classList.toggle("is-hidden", !question.audio);
    audioButton.dataset.text = question.audio || "";

    const answerGrid = byId("answer-grid");
    answerGrid.replaceChildren();
    question.options.forEach((option, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "answer-option";
      button.dataset.index = index;
      button.setAttribute("aria-pressed", state.answers[state.current] === index ? "true" : "false");
      if (state.answers[state.current] === index) button.classList.add("is-selected");

      const key = document.createElement("span");
      key.className = "answer-key";
      key.textContent = index + 1;
      key.setAttribute("aria-hidden", "true");

      const label = document.createElement("span");
      label.textContent = option;
      button.append(key, label);
      button.addEventListener("click", () => chooseAnswer(index));
      answerGrid.appendChild(button);
    });

    byId("next-question").disabled = state.answers[state.current] === null;
    byId("previous-question").disabled = state.current === 0;
    byId("next-question").textContent = state.current === questions.length - 1 ? "Add my writing →" : "Lock answer →";
    saveState();
  }

  function chooseAnswer(index) {
    state.answers[state.current] = index;
    document.querySelectorAll(".answer-option").forEach((button, buttonIndex) => {
      const selected = buttonIndex === index;
      button.classList.toggle("is-selected", selected);
      button.setAttribute("aria-pressed", selected ? "true" : "false");
    });
    byId("next-question").disabled = false;
    saveState();
  }

  function goNext() {
    if (state.answers[state.current] === null) return;
    if (state.current < questions.length - 1) {
      state.current += 1;
      renderQuestion();
      byId("question-prompt").focus();
    } else {
      renderWriting();
      showScreen("writing");
    }
  }

  function goBack() {
    if (state.current === 0) {
      showScreen("profile");
      return;
    }
    state.current -= 1;
    renderQuestion();
  }

  function beginProfile() {
    byId("learner-name").value = state.name;
    const selectedGoal = document.querySelector(`input[name="goal"][value="${CSS.escape(state.goal)}"]`);
    if (selectedGoal) selectedGoal.checked = true;
    showScreen("profile");
  }

  function beginQuiz(event) {
    event.preventDefault();
    const goal = document.querySelector('input[name="goal"]:checked');
    if (!goal) {
      showToast("Choose one destination first.");
      return;
    }
    state.name = byId("learner-name").value.trim();
    state.goal = goal.value;
    saveState();
    renderQuestion();
    showScreen("quiz");
  }

  function renderWriting() {
    byId("writing-answer").value = state.writing;
    updateWordCount();
    byId("writing-progress-bar").style.width = "96%";
  }

  function wordCount(text) {
    const cleaned = text.trim();
    return cleaned ? cleaned.split(/\s+/).length : 0;
  }

  function updateWordCount() {
    state.writing = byId("writing-answer").value;
    const count = wordCount(state.writing);
    byId("word-count").textContent = `${count} word${count === 1 ? "" : "s"}`;
    byId("finish-assessment").disabled = count < 35;
    saveState();
  }

  function getScores() {
    const scores = {
      total: 0,
      byLevel: { A2: [0, 0], B1: [0, 0], B2: [0, 0] },
      byCategory: { Grammar: [0, 0], Vocabulary: [0, 0], Comprehension: [0, 0] }
    };
    questions.forEach((question, index) => {
      const correct = state.answers[index] === question.answer;
      scores.byLevel[question.level][1] += 1;
      scores.byCategory[question.category][1] += 1;
      if (correct) {
        scores.total += 1;
        scores.byLevel[question.level][0] += 1;
        scores.byCategory[question.category][0] += 1;
      }
    });
    return scores;
  }

  function estimateLevel(scores) {
    const [a2] = scores.byLevel.A2;
    const [b1] = scores.byLevel.B1;
    const [b2] = scores.byLevel.B2;
    if (a2 < 4) return { label: "A2", title: "Let’s strengthen the foundations", summary: "Some essential A2 patterns need a calmer second look before we build upward." };
    if (a2 >= 5 && b1 < 4) return { label: "A2+", title: "Your bridge to B1 is ready", summary: "Everyday English is taking shape. The next step is connecting ideas and using past, present, and future forms more flexibly." };
    if (b1 >= 4 && b2 < 3) return { label: "B1", title: "You’re entering independent English", summary: "You can handle many familiar situations. We’ll now widen your vocabulary and make longer ideas feel natural." };
    if (b1 >= 5 && b2 >= 3 && b2 < 5) return { label: "B1+", title: "B2 is visible from here", summary: "Your core grammar is strong enough for nuance. We’ll focus on precision, range, and fluent retrieval." };
    if (b1 >= 5 && b2 >= 5) return { label: "B2", title: "You already show B2 knowledge", summary: "The priority is turning this knowledge into spontaneous speaking and confident writing." };
    return { label: "B1", title: "A strong, interesting mixed profile", summary: "Some harder patterns are already present, while a few earlier foundations need targeted review." };
  }

  function getPriorities() {
    const missed = questions
      .filter((question, index) => state.answers[index] !== question.answer)
      .map((question) => ({ topic: question.topic, tip: question.tip, level: question.level }));
    const unique = [];
    missed.forEach((item) => {
      if (!unique.some((existing) => existing.topic === item.topic)) unique.push(item);
    });
    if (unique.length >= 3) return unique.slice(0, 3);
    const stretch = [
      { topic: "connected everyday stories", tip: "Link events with clear time markers and reasons.", level: "B1" },
      { topic: "useful vocabulary chunks", tip: "Retrieve whole phrases, not isolated translations.", level: "B1" },
      { topic: "expressing opinions with nuance", tip: "Give an opinion, a reason, and a contrast.", level: "B2" }
    ];
    stretch.forEach((item) => {
      if (unique.length < 3 && !unique.some((existing) => existing.topic === item.topic)) unique.push(item);
    });
    return unique.slice(0, 3);
  }

  function renderResults() {
    const scores = getScores();
    const estimate = estimateLevel(scores);
    const priorities = getPriorities();
    const firstName = state.name || "Explorer";

    byId("result-eyebrow").textContent = `${firstName}'s learning estimate`;
    byId("result-title").textContent = estimate.title;
    byId("result-summary").textContent = estimate.summary;
    byId("level-stamp").textContent = estimate.label;
    byId("result-score").textContent = `${scores.total}/${questions.length} knowledge checks`;

    const bars = byId("skill-bars");
    bars.replaceChildren();
    Object.entries(scores.byCategory).forEach(([category, [correct, total]]) => {
      const percent = Math.round((correct / total) * 100);
      const row = document.createElement("div");
      row.className = "skill-bar-row";
      row.innerHTML = `<span>${category}</span><span class="skill-track"><span class="skill-fill" style="width:${percent}%"></span></span><span>${percent}%</span>`;
      bars.appendChild(row);
    });

    const route = byId("next-route");
    route.replaceChildren();
    priorities.forEach((priority, index) => {
      const item = document.createElement("li");
      item.innerHTML = `<span class="route-number">${index + 1}</span><div><strong>${priority.topic}</strong><span>${priority.level} · ${priority.tip}</span></div>`;
      route.appendChild(item);
    });

    const count = wordCount(state.writing);
    byId("writing-note").textContent = `Your ${count}-word writing sample is included in the teacher message. A teacher should review it before your learning record is updated.`;
    byId("progress-bar").style.width = "100%";
    saveState();
  }

  function finishAssessment() {
    state.writing = byId("writing-answer").value.trim();
    if (wordCount(state.writing) < 35) {
      showToast("Write at least 35 words so the sample is useful.");
      return;
    }
    renderResults();
    showScreen("results");
  }

  function buildTeacherMessage() {
    const scores = getScores();
    const estimate = estimateLevel(scores);
    const priorities = getPriorities();
    const levelLines = Object.entries(scores.byLevel)
      .map(([level, [correct, total]]) => `- ${level}: ${correct}/${total}`)
      .join("\n");
    const categoryLines = Object.entries(scores.byCategory)
      .map(([category, [correct, total]]) => `- ${category}: ${correct}/${total}`)
      .join("\n");
    const missedLines = questions
      .map((question, index) => ({ question, index }))
      .filter(({ question, index }) => state.answers[index] !== question.answer)
      .map(({ question }) => `- ${question.level} · ${question.topic}`)
      .join("\n") || "- None in the objective check";

    return `English Compass placement result

Learner: ${state.name || "Not provided"}
Primary goal: ${state.goal}
Learning estimate: ${estimate.label} (not a formal CEFR certification)
Objective score: ${scores.total}/${questions.length}

By level:
${levelLines}

By area:
${categoryLines}

Suggested first priorities:
${priorities.map((item) => `- ${item.topic}`).join("\n")}

Knowledge-check topics to revisit:
${missedLines}

Writing prompt: Describe a recent day that did not go as planned. Explain what happened, what you did, and what you would do differently next time.

Writing sample (${wordCount(state.writing)} words):
${state.writing}

Please review the writing, confirm the real-world mission with the learner, create the first evidence-based learning record, and design the next short lesson in her zone of proximal development.`;
  }

  async function copyResults() {
    const message = buildTeacherMessage();
    try {
      await navigator.clipboard.writeText(message);
      showToast("Result copied—paste it into your next chat with the teacher.");
    } catch {
      const area = document.createElement("textarea");
      area.value = message;
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      document.execCommand("copy");
      area.remove();
      showToast("Result copied—paste it into your next chat with the teacher.");
    }
  }

  function resetAssessment() {
    const confirmed = window.confirm("Start over and erase the saved answers on this device?");
    if (!confirmed) return;
    localStorage.removeItem(storeKey);
    state.current = 0;
    state.answers = Array(questions.length).fill(null);
    state.name = "";
    state.goal = "";
    state.writing = "";
    document.querySelectorAll('input[name="goal"]').forEach((input) => { input.checked = false; });
    showScreen("hero");
    showToast("Fresh compass, fresh start.");
  }

  function playAudio() {
    const text = byId("audio-prompt").dataset.text;
    if (!("speechSynthesis" in window) || !text) {
      showToast("Audio is unavailable in this browser.");
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-GB";
    utterance.rate = 0.88;
    window.speechSynthesis.speak(utterance);
  }

  byId("start-adventure").addEventListener("click", beginProfile);
  byId("profile-form").addEventListener("submit", beginQuiz);
  byId("previous-question").addEventListener("click", goBack);
  byId("next-question").addEventListener("click", goNext);
  byId("audio-prompt").addEventListener("click", playAudio);
  byId("writing-answer").addEventListener("input", updateWordCount);
  byId("writing-back").addEventListener("click", () => {
    state.current = questions.length - 1;
    renderQuestion();
    showScreen("quiz");
  });
  byId("finish-assessment").addEventListener("click", finishAssessment);
  byId("copy-results").addEventListener("click", copyResults);
  document.querySelectorAll("[data-reset]").forEach((button) => button.addEventListener("click", resetAssessment));

  document.addEventListener("keydown", (event) => {
    if (screens.quiz.classList.contains("is-hidden")) return;
    const number = Number(event.key);
    if (number >= 1 && number <= 4) chooseAnswer(number - 1);
    if (event.key === "Enter" && state.answers[state.current] !== null) goNext();
  });

  const hasSavedProgress = loadState();
  const resumeButton = byId("resume-adventure");
  resumeButton.classList.toggle("is-hidden", !hasSavedProgress);
  resumeButton.addEventListener("click", () => {
    byId("learner-name").value = state.name;
    const allAnswered = state.answers.every((answer) => answer !== null);
    if (allAnswered && state.writing) {
      renderResults();
      showScreen("results");
    } else if (allAnswered) {
      renderWriting();
      showScreen("writing");
    } else if (state.answers.some((answer) => answer !== null)) {
      renderQuestion();
      showScreen("quiz");
    } else {
      beginProfile();
    }
  });
})();
