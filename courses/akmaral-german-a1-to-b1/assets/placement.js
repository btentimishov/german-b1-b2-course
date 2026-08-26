(() => {
  "use strict";

  const questions = [
    {
      level: "A1",
      world: "Ankommen",
      category: "Everyday words",
      topic: "introducing yourself",
      prompt: "Jemand fragt: „Wie heißt du?“ Was passt?",
      options: ["Ich heiße Akmaral.", "Ich wohne Akmaral.", "Ich komme Akmaral.", "Ich lerne Akmaral."],
      answer: 0,
      hint: "Someone asks for your name. Choose the natural reply.",
      tip: "Use „Ich heiße …“ to say your name."
    },
    {
      level: "A1",
      world: "Ankommen",
      category: "Sentence building",
      topic: "present-tense verb endings",
      prompt: "Ich ___ aus Kasachstan.",
      options: ["komme", "kommst", "kommt", "kommen"],
      answer: 0,
      hint: "The subject is ich. Which form of kommen matches it?",
      tip: "With ich, the verb normally ends in -e: „ich komme“."
    },
    {
      level: "A1",
      world: "Ankommen",
      category: "Sentence building",
      topic: "verb in position two",
      prompt: "Heute ___ ich Deutsch.",
      options: ["lerne", "lernen", "lernst", "lernt"],
      answer: 0,
      hint: "Heute is first, so the conjugated verb comes next.",
      tip: "A German statement keeps the conjugated verb in position two: „Heute lerne ich …“"
    },
    {
      level: "A1",
      world: "Ankommen",
      category: "Sentence building",
      topic: "accusative masculine articles",
      prompt: "Im Café: Ich nehme ___ Tee.",
      options: ["einen", "einem", "einer", "eines"],
      answer: 0,
      hint: "Tee is masculine and is the thing being ordered.",
      tip: "A masculine direct object takes „einen“: „Ich nehme einen Tee.“"
    },
    {
      level: "A1",
      world: "Ankommen",
      category: "Listening",
      topic: "times and platform announcements",
      prompt: "Hör zu: Wann fährt der Zug?",
      audio: "Der Zug nach Bonn fährt um zehn Uhr fünfzehn.",
      options: ["um 10:15 Uhr", "um 10:50 Uhr", "um 11:15 Uhr", "um 11:50 Uhr"],
      answer: 0,
      hint: "Listen for the hour and minutes in the announcement.",
      tip: "„zehn Uhr fünfzehn“ means 10:15."
    },
    {
      level: "A2",
      world: "Unterwegs",
      category: "Sentence building",
      topic: "modal-verb word order",
      prompt: "Welche Satzstellung ist richtig?",
      options: ["Morgen muss ich früh arbeiten.", "Morgen ich muss früh arbeiten.", "Morgen muss früh ich arbeiten.", "Morgen arbeiten muss ich früh."],
      answer: 0,
      hint: "In a statement, the modal is in position two and the action goes to the end.",
      tip: "Use the bracket: „Morgen muss … arbeiten.“"
    },
    {
      level: "A2",
      world: "Unterwegs",
      category: "Sentence building",
      topic: "dative after mit",
      prompt: "Ich fahre mit ___ Bus zur Uni.",
      options: ["dem", "den", "der", "des"],
      answer: 0,
      hint: "The preposition mit always takes dative; Bus is masculine.",
      tip: "„mit“ takes dative: „mit dem Bus“."
    },
    {
      level: "A2",
      world: "Unterwegs",
      category: "Sentence building",
      topic: "spoken past with Perfekt",
      prompt: "Gestern habe ich ___.",
      options: ["Pizza gekocht", "Pizza kochen", "Pizza kochte", "Pizza kochend"],
      answer: 0,
      hint: "The helping verb habe needs the past participle at the end.",
      tip: "The Perfekt form is „habe … gekocht“."
    },
    {
      level: "A2",
      world: "Unterwegs",
      category: "Sentence building",
      topic: "separable verbs",
      prompt: "Der Deutschkurs ___ um neun Uhr ___.",
      options: ["fängt / an", "anfängt / —", "fangt / an", "fing / an"],
      answer: 0,
      hint: "In the present tense, anfangen separates around the rest of the sentence.",
      tip: "A separable verb forms a bracket: „Der Kurs fängt … an.“"
    },
    {
      level: "A2",
      world: "Unterwegs",
      category: "Reading",
      topic: "understanding a practical message",
      context: "Hallo Akmaral, ich bin noch beim Arzt. Bitte warte nicht im Café. Treffen wir uns um 18 Uhr direkt vor dem Kino? Liebe Grüße, Mia",
      prompt: "Was soll Akmaral tun?",
      options: ["Vor dem Kino warten.", "In dem Café warten.", "Beim Arzt Mia treffen.", "Um achtzehn Uhr anrufen."],
      answer: 0,
      hint: "Find the new meeting place in Mia’s message.",
      tip: "Mia changes the meeting point to „direkt vor dem Kino“."
    },
    {
      level: "A2+",
      world: "Verbinden",
      category: "Sentence building",
      topic: "verb-final clauses with weil",
      prompt: "Ich bleibe heute zu Hause, weil ___.",
      options: ["ich arbeiten muss", "ich muss arbeiten", "muss ich arbeiten", "arbeiten ich muss"],
      answer: 0,
      hint: "After weil, the conjugated verb moves to the end.",
      tip: "A weil-clause ends with the conjugated verb: „weil ich arbeiten muss“."
    },
    {
      level: "A2+",
      world: "Verbinden",
      category: "Sentence building",
      topic: "past forms of sein",
      prompt: "Als Kind ___ ich jeden Sommer bei meiner Oma.",
      options: ["war", "bin", "wäre", "sei"],
      answer: 0,
      hint: "Als Kind describes a past period. Choose the past of sein.",
      tip: "The Präteritum of sein with ich is „war“."
    },
    {
      level: "A2+",
      world: "Verbinden",
      category: "Everyday words",
      topic: "fixed verb-preposition chunks",
      prompt: "Ich interessiere mich ___ Fotografie.",
      options: ["für", "mit", "nach", "über"],
      answer: 0,
      hint: "The fixed phrase is sich interessieren + one preposition.",
      tip: "Learn the whole chunk: „sich für etwas interessieren“."
    },
    {
      level: "A2+",
      world: "Verbinden",
      category: "Listening",
      topic: "following everyday directions",
      prompt: "Hör zu: Wo ist die Apotheke?",
      audio: "Gehen Sie bis zur Ampel und dann nach links. Die Apotheke ist gleich neben der Bäckerei.",
      options: ["Neben der Bäckerei.", "Hinter der Bäckerei.", "Gegenüber der Ampel.", "Zwischen zwei Ampeln."],
      answer: 0,
      hint: "Listen for the final landmark after the turn.",
      tip: "The speaker says „gleich neben der Bäckerei“."
    },
    {
      level: "A2+",
      world: "Verbinden",
      category: "Reading",
      topic: "understanding reasons and changed plans",
      context: "Jonas wollte am Wochenende wandern. Am Samstag hat es stark geregnet. Deshalb ist er zu Hause geblieben und hat für seine Freunde gekocht. Am Abend kamen alle vorbei.",
      prompt: "Warum hat Jonas nicht gewandert?",
      options: ["Wegen des Regens.", "Wegen seiner Freunde.", "Wegen des Kochens.", "Wegen des Abends."],
      answer: 0,
      hint: "Which event caused Jonas to change his original plan?",
      tip: "The strong rain changed the plan: „Wegen des Regens.“"
    },
    {
      level: "B1",
      world: "Mitreden",
      category: "Sentence building",
      topic: "relative clauses",
      prompt: "Das ist die Frau, ___ mir gestern geholfen hat.",
      options: ["die", "der", "den", "dem"],
      answer: 0,
      hint: "The woman is the subject doing the helping inside the relative clause.",
      tip: "For a feminine subject in a relative clause, use „die“."
    },
    {
      level: "B1",
      world: "Mitreden",
      category: "Everyday words",
      topic: "linking contrasting ideas",
      prompt: "___ es geregnet hat, sind wir spazieren gegangen.",
      options: ["Obwohl", "Deshalb", "Damit", "Während"],
      answer: 0,
      hint: "Choose the connector meaning although.",
      tip: "„Obwohl“ introduces an unexpected contrast and sends the verb to the end."
    },
    {
      level: "B1",
      world: "Mitreden",
      category: "Reading",
      topic: "identifying a writer’s main point",
      context: "Leyla fährt seit einem Monat mit dem Fahrrad zur Arbeit. Am Anfang fand sie den Weg anstrengend. Inzwischen kennt sie ruhigere Straßen, kommt wacher im Büro an und spart Geld. Nur bei starkem Regen nimmt sie noch den Bus.",
      prompt: "Was ist Leylas wichtigste Erfahrung?",
      options: ["Radfahren wurde für sie besser.", "Busfahren wurde für sie billiger.", "Arbeiten wurde für sie kürzer.", "Regen wurde für sie seltener."],
      answer: 0,
      hint: "Look for the overall change from the beginning to now.",
      tip: "The text shows several ways cycling has become better for Leyla."
    },
    {
      level: "B1",
      world: "Mitreden",
      category: "Sentence building",
      topic: "polite wishes with würde",
      prompt: "Im Hotel: Ich ___ gern ein ruhiges Zimmer.",
      options: ["würde", "werde", "wurde", "worden"],
      answer: 0,
      hint: "Choose the polite conditional form used for a wish.",
      tip: "„Ich würde gern …“ is a polite way to express a wish."
    },
    {
      level: "B1",
      world: "Mitreden",
      category: "Sentence building",
      topic: "indirect questions",
      prompt: "Können Sie mir sagen, wann der Zug ___?",
      options: ["ankommt", "kommt an", "ankommen", "an kam"],
      answer: 0,
      hint: "An indirect question is a subordinate clause; the verb goes to the end.",
      tip: "In the indirect question, the full verb closes the clause: „wann der Zug ankommt“."
    }
  ];

  const answerPositions = [1, 3, 0, 2, 1, 3, 0, 2, 1, 3, 2, 0, 3, 1, 2, 0, 3, 1, 2, 0];
  questions.forEach((question, index) => {
    const correct = question.options[question.answer];
    const other = question.options.filter((_, optionIndex) => optionIndex !== question.answer);
    const target = answerPositions[index];
    other.splice(target, 0, correct);
    question.options = other;
    question.answer = target;
  });

  const storeKey = "akmaral-deutschreise-placement-v1";
  const state = {
    current: 0,
    answers: Array(questions.length).fill(null),
    hints: Array(questions.length).fill(false),
    name: "Akmaral",
    goal: "",
    writing: "",
    speaking: false
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
    Object.entries(screens).forEach(([key, element]) => element.classList.toggle("is-hidden", key !== name));
    window.scrollTo({ top: 0, behavior: "smooth" });
    const heading = screens[name].querySelector("h1, h2");
    if (heading) {
      heading.setAttribute("tabindex", "-1");
      heading.focus({ preventScroll: true });
    }
  }

  function saveState() {
    try {
      localStorage.setItem(storeKey, JSON.stringify(state));
    } catch {
      // The assessment still works if browser storage is unavailable.
    }
  }

  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem(storeKey));
      if (!saved || !Array.isArray(saved.answers) || saved.answers.length !== questions.length) return false;
      state.current = Math.min(Math.max(Number(saved.current) || 0, 0), questions.length - 1);
      state.answers = saved.answers;
      state.hints = Array.isArray(saved.hints) && saved.hints.length === questions.length ? saved.hints : state.hints;
      state.name = saved.name || "Akmaral";
      state.goal = saved.goal || "";
      state.writing = saved.writing || "";
      state.speaking = Boolean(saved.speaking);
      return state.answers.some((answer) => answer !== null) || Boolean(state.goal || state.writing);
    } catch {
      return false;
    }
  }

  function showToast(message) {
    const toast = byId("toast");
    toast.textContent = message;
    toast.classList.add("is-visible");
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => toast.classList.remove("is-visible"), 2600);
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
    context.classList.toggle("is-context", Boolean(question.context));

    const audioButton = byId("audio-prompt");
    audioButton.classList.toggle("is-hidden", !question.audio);
    audioButton.dataset.text = question.audio || "";

    const hintButton = byId("hint-toggle");
    hintButton.classList.toggle("is-hidden", !question.hint);
    hintButton.setAttribute("aria-expanded", state.hints[state.current] ? "true" : "false");
    byId("hint-text").textContent = question.hint || "";
    byId("hint-text").classList.toggle("is-hidden", !state.hints[state.current]);

    const answerGrid = byId("answer-grid");
    answerGrid.replaceChildren();
    question.options.forEach((option, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "answer-option";
      button.dataset.index = index;
      const selected = state.answers[state.current] === index;
      button.setAttribute("aria-pressed", selected ? "true" : "false");
      if (selected) button.classList.add("is-selected");

      const key = document.createElement("span");
      key.className = "answer-key";
      key.textContent = String(index + 1);
      key.setAttribute("aria-hidden", "true");
      const label = document.createElement("span");
      label.textContent = option;
      button.append(key, label);
      button.addEventListener("click", () => chooseAnswer(index));
      answerGrid.appendChild(button);
    });

    byId("next-question").disabled = state.answers[state.current] === null;
    byId("previous-question").disabled = state.current === 0;
    byId("next-question").textContent = state.current === questions.length - 1 ? "Write my message →" : "Stamp answer →";
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

  function toggleHint() {
    state.hints[state.current] = !state.hints[state.current];
    byId("hint-toggle").setAttribute("aria-expanded", state.hints[state.current] ? "true" : "false");
    byId("hint-text").classList.toggle("is-hidden", !state.hints[state.current]);
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
    byId("learner-name").value = state.name || "Akmaral";
    document.querySelectorAll('input[name="goal"]').forEach((input) => { input.checked = input.value === state.goal; });
    showScreen("profile");
  }

  function beginQuiz(event) {
    event.preventDefault();
    const goal = document.querySelector('input[name="goal"]:checked');
    if (!goal) {
      showToast("Choose one destination first.");
      return;
    }
    state.name = byId("learner-name").value.trim() || "Akmaral";
    state.goal = goal.value;
    saveState();
    renderQuestion();
    showScreen("quiz");
  }

  function wordCount(text) {
    const cleaned = text.trim();
    return cleaned ? cleaned.split(/\s+/).length : 0;
  }

  function writingChecks(text) {
    const value = text.trim().toLowerCase();
    return {
      length: wordCount(value) >= 25,
      reason: /\b(weil|denn)\b/.test(value),
      plan: /\b(sonntag|montag|dienstag|mittwoch|donnerstag|freitag|nächste[nmrs]?|morgen|abend|woche|können|möchten|treffen|machen|gehen)\b/.test(value),
      question: value.includes("?")
    };
  }

  function updateWriting() {
    state.writing = byId("writing-answer").value;
    const count = wordCount(state.writing);
    byId("word-count").textContent = `${count} word${count === 1 ? "" : "s"}`;
    const checks = writingChecks(state.writing);
    document.querySelectorAll("[data-writing-check]").forEach((item) => item.classList.toggle("is-pass", checks[item.dataset.writingCheck]));
    byId("finish-assessment").disabled = count < 25;
    saveState();
  }

  function renderWriting() {
    byId("writing-answer").value = state.writing;
    byId("speaking-done").checked = state.speaking;
    updateWriting();
  }

  function getScores() {
    const scores = {
      total: 0,
      byLevel: { A1: [0, 0], A2: [0, 0], "A2+": [0, 0], B1: [0, 0] },
      byCategory: { "Everyday words": [0, 0], "Sentence building": [0, 0], Reading: [0, 0], Listening: [0, 0] }
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
    const a1 = scores.byLevel.A1[0];
    const a2 = scores.byLevel.A2[0];
    const a2plus = scores.byLevel["A2+"][0];
    const b1 = scores.byLevel.B1[0];
    if (a1 < 3) return { label: "A1", title: "Let’s make the first stations dependable.", summary: "A calmer pass through introductions, core word order, everyday nouns, and time language will make everything after it easier." };
    if (a1 >= 3 && (a1 < 4 || a2 < 3)) return { label: "A1+", title: "Your A2 train is approaching.", summary: "You already recognize useful German. Next we’ll make everyday sentences more automatic and close a few foundation gaps." };
    if (a1 >= 4 && a2 >= 3 && a2plus < 3) return { label: "A2", title: "Everyday German is taking shape.", summary: "The next bridge is connecting reasons, past experiences, and plans without losing German word order." };
    if (a2 >= 4 && a2plus >= 3 && b1 < 3) return { label: "A2+", title: "The B1 bridge is open.", summary: "You can handle many familiar moments. Now we’ll grow connected speech, flexible sentence patterns, and confident independent messages." };
    if (a2plus >= 4 && b1 >= 3) return { label: "B1-ready", title: "You already show strong B1 readiness.", summary: "Your knowledge can support independent communication. The priority is reliable spontaneous use across speaking, writing, listening, and reading." };
    return { label: "A2", title: "You have an interesting mixed route.", summary: "Some stretch patterns are already strong while an earlier station needs targeted practice. We’ll repair the shortest section first." };
  }

  function getPriorities() {
    const missed = questions
      .filter((question, index) => state.answers[index] !== question.answer)
      .map((question) => ({ topic: question.topic, tip: question.tip, level: question.level }));
    const priorities = [];
    missed.forEach((item) => {
      if (!priorities.some((existing) => existing.topic === item.topic)) priorities.push(item);
    });
    const stretch = [
      { topic: "connected everyday messages", tip: "Join a situation, reason, new plan, and question.", level: "A2→B1" },
      { topic: "past experiences in conversation", tip: "Use time markers and Perfekt to tell what happened.", level: "A2" },
      { topic: "opinions and friendly disagreement", tip: "Give a view, a reason, and a contrasting point.", level: "B1" }
    ];
    stretch.forEach((item) => {
      if (priorities.length < 3 && !priorities.some((existing) => existing.topic === item.topic)) priorities.push(item);
    });
    return priorities.slice(0, 3);
  }

  function renderSkillBars(scores) {
    const bars = byId("skill-bars");
    bars.replaceChildren();
    Object.entries(scores.byCategory).forEach(([category, [correct, total]]) => {
      const percent = total ? Math.round((correct / total) * 100) : 0;
      const row = document.createElement("div");
      row.className = "skill-bar-row";
      const label = document.createElement("span");
      label.textContent = category;
      const track = document.createElement("span");
      track.className = "skill-track";
      const fill = document.createElement("span");
      fill.className = "skill-fill";
      fill.style.width = `${percent}%`;
      track.appendChild(fill);
      const score = document.createElement("span");
      score.textContent = `${correct}/${total}`;
      row.append(label, track, score);
      bars.appendChild(row);
    });
  }

  function renderReview() {
    const review = byId("answer-review");
    review.replaceChildren();
    questions.forEach((question, index) => {
      const correct = state.answers[index] === question.answer;
      const item = document.createElement("article");
      item.className = `review-item ${correct ? "is-correct" : "is-missed"}`;
      const marker = document.createElement("span");
      marker.className = "review-marker";
      marker.textContent = correct ? "✓" : "↗";
      const copy = document.createElement("div");
      const title = document.createElement("strong");
      title.textContent = `${question.level} · ${question.topic}`;
      const note = document.createElement("p");
      note.textContent = correct ? `Secure here: ${question.tip}` : question.tip;
      copy.append(title, note);
      item.append(marker, copy);
      review.appendChild(item);
    });
  }

  function renderResults() {
    const scores = getScores();
    const estimate = estimateLevel(scores);
    const priorities = getPriorities();
    const firstName = state.name || "Akmaral";
    byId("result-eyebrow").textContent = `${firstName}’s route estimate`;
    byId("result-title").textContent = estimate.title;
    byId("result-summary").textContent = estimate.summary;
    byId("level-stamp").querySelector("strong").textContent = estimate.label;
    byId("result-score").textContent = `${scores.total}/${questions.length} knowledge checks · ${state.hints.filter(Boolean).length} English hint${state.hints.filter(Boolean).length === 1 ? "" : "s"} opened`;
    renderSkillBars(scores);

    const route = byId("next-route");
    route.replaceChildren();
    priorities.forEach((priority, index) => {
      const item = document.createElement("li");
      const number = document.createElement("span");
      number.className = "route-number";
      number.textContent = String(index + 1).padStart(2, "0");
      const copy = document.createElement("div");
      const title = document.createElement("strong");
      title.textContent = priority.topic;
      const note = document.createElement("span");
      note.textContent = `${priority.level} · ${priority.tip}`;
      copy.append(title, note);
      item.append(number, copy);
      route.appendChild(item);
    });

    const writingCount = wordCount(state.writing);
    const passed = Object.values(writingChecks(state.writing)).filter(Boolean).length;
    byId("writing-note").textContent = `Your ${writingCount}-word message met ${passed}/4 support checks${state.speaking ? " and you tried the speaking mission" : ""}. A teacher should review the actual language before recording your level.`;
    renderReview();
    saveState();
  }

  function finishAssessment() {
    state.writing = byId("writing-answer").value.trim();
    state.speaking = byId("speaking-done").checked;
    if (wordCount(state.writing) < 25) {
      showToast("Write at least 25 words so the sample is useful.");
      return;
    }
    renderResults();
    showScreen("results");
  }

  function buildTeacherMessage() {
    const scores = getScores();
    const estimate = estimateLevel(scores);
    const priorities = getPriorities();
    const levelLines = Object.entries(scores.byLevel).map(([level, [correct, total]]) => `- ${level}: ${correct}/${total}`).join("\n");
    const categoryLines = Object.entries(scores.byCategory).map(([category, [correct, total]]) => `- ${category}: ${correct}/${total}`).join("\n");
    const missedLines = questions
      .map((question, index) => ({ question, index }))
      .filter(({ question, index }) => state.answers[index] !== question.answer)
      .map(({ question }) => `- ${question.level} · ${question.topic}`)
      .join("\n") || "- None in the objective check";
    const checkResults = writingChecks(state.writing);
    const writingLines = Object.entries(checkResults).map(([check, passed]) => `- ${check}: ${passed ? "yes" : "not detected"}`).join("\n");

    return `Akmaral’s Deutschreise — placement result

Learner: ${state.name || "Akmaral"}
Primary goal: ${state.goal}
Learning estimate: ${estimate.label} (not a formal CEFR certification)
Objective score: ${scores.total}/${questions.length}
English hints opened: ${state.hints.filter(Boolean).length}/${questions.length}

By level:
${levelLines}

By area:
${categoryLines}

Suggested first priorities:
${priorities.map((item) => `- ${item.topic}`).join("\n")}

Knowledge-check topics to revisit:
${missedLines}

Writing prompt: Lea invited the learner to a Saturday picnic. Decline, give a reason, suggest a new plan, and ask a question.
Writing support checks:
${writingLines}
Optional speaking mission attempted: ${state.speaking ? "yes" : "no"}

Writing sample (${wordCount(state.writing)} words):
${state.writing}

Please review the original writing, ask Akmaral one short follow-up speaking question, confirm her real-world mission, create the first evidence-based learning record, and design the next short lesson in her zone of proximal development.`;
  }

  async function copyResults() {
    const message = buildTeacherMessage();
    try {
      await navigator.clipboard.writeText(message);
      showToast("Result copied—paste it into the next teacher chat.");
    } catch {
      const area = document.createElement("textarea");
      area.value = message;
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      document.execCommand("copy");
      area.remove();
      showToast("Result copied—paste it into the next teacher chat.");
    }
  }

  function resetAssessment() {
    const confirmed = window.confirm("Start over and erase the saved answers on this device?");
    if (!confirmed) return;
    try { localStorage.removeItem(storeKey); } catch { /* no-op */ }
    state.current = 0;
    state.answers = Array(questions.length).fill(null);
    state.hints = Array(questions.length).fill(false);
    state.name = "Akmaral";
    state.goal = "";
    state.writing = "";
    state.speaking = false;
    document.querySelectorAll('input[name="goal"]').forEach((input) => { input.checked = false; });
    showScreen("hero");
    showToast("Fresh ticket, fresh start.");
  }

  function playAudio() {
    const text = byId("audio-prompt").dataset.text;
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

  byId("start-adventure").addEventListener("click", beginProfile);
  byId("profile-form").addEventListener("submit", beginQuiz);
  byId("previous-question").addEventListener("click", goBack);
  byId("next-question").addEventListener("click", goNext);
  byId("audio-prompt").addEventListener("click", playAudio);
  byId("hint-toggle").addEventListener("click", toggleHint);
  byId("writing-answer").addEventListener("input", updateWriting);
  byId("speaking-done").addEventListener("change", () => {
    state.speaking = byId("speaking-done").checked;
    saveState();
  });
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
