(() => {
  "use strict";

  const lessonId = document.body.dataset.lessonId || "lesson";
  const storeKey = `akmaral-deutschreise-${lessonId}-v1`;
  const normalize = (value) => value.trim().toLocaleLowerCase("de-DE").replace(/[.!?]+$/g, "").replace(/\s+/g, " ");
  const words = (value) => value.trim() ? value.trim().split(/\s+/).length : 0;

  const lessonConfigs = {
    "lesson-0002": {
      number: "2",
      title: "Ich habe einen Termin",
      focus: "masculine accusative in study and work schedules",
      messageMinimum: 3,
      messageChecks(value) {
        const text = normalize(value);
        return {
          length: words(value) >= 25 && words(value) <= 55,
          object: /\beinen\s+(termin|kurs|test|bericht|laptop|job|arzttermin|arzt)\b/i.test(text),
          schedule: /\b(am\s+(montag|dienstag|mittwoch|donnerstag|freitag|samstag|sonntag)|heute|morgen|um\s+\d{1,2})\b/i.test(text),
          next: /\?/.test(value) || /\b(können|kannst|passt|treffen|zeit)\b/i.test(text)
        };
      },
      messageLabels: {
        length: "25–55 words",
        object: "einen + masculine study/work noun",
        schedule: "day/time phrase",
        next: "next step or question"
      },
      exitSuccess: "the einen pattern appeared in most of the independent checks",
      exitReview: "the first choices are saved; use the revealed corrections for tomorrow’s review",
      ready(checks, score) {
        return score >= 3 && checks.length && checks.object;
      },
      readyCopy: "You produced einen in an original message and completed the exit ticket. Your first answers—not corrected retries—are the evidence.",
      reviewCopy: "Your result is saved exactly as answered. Use the marked corrections for a short review; you do not need to replace them to finish.",
      followUp: "Was hast du diese Woche in der Uni oder bei der Arbeit?",
      teacherPrompt: "Please review whether she can produce der → einen without a visible model. If yes, update the learning record and choose between time/listening practice and spoken Perfekt for Lesson 3."
    },
    "lesson-0003": {
      number: "3",
      title: "Achtung, Gleis neun!",
      focus: "times, platforms, and changed travel announcements",
      messageMinimum: 4,
      messageChecks(value) {
        const text = normalize(value);
        return {
          length: words(value) >= 20 && words(value) <= 50,
          time: /\b(um\s+)?\d{1,2}[:.]\d{2}\b|\b(zehn|elf|zwölf|dreizehn|vierzehn|fünfzehn|sechzehn|siebzehn|achtzehn)\s+uhr\b/i.test(text),
          route: /\b(einen\s+zug|zug|gleis|raum|bus|bahn)\b/i.test(text),
          response: /\b(kann|komme|nehme|passt|leider|ja|erreiche)\b/i.test(text),
          question: /\?/.test(value)
        };
      },
      messageLabels: {
        length: "20–50 words",
        time: "precise time",
        route: "train/platform/room detail",
        response: "clear response",
        question: "one question"
      },
      exitSuccess: "the key time and platform details were understood",
      exitReview: "the first choices are saved; replay the marked announcement tomorrow",
      ready(checks, score) {
        return score >= 3 && checks.length && checks.time && checks.route;
      },
      readyCopy: "You understood the main travel details and used a precise time in your own message. Your first answers are preserved as evidence.",
      reviewCopy: "Your result is saved exactly as answered. Replay the marked announcement once tomorrow; no corrected retry is required today.",
      followUp: "Wann beginnt dein nächster Kurs oder Arbeitstag?",
      teacherPrompt: "Please review whether Akmaral can understand and reuse precise times and changed platform information. If the evidence is stable, update the learning record and move to spoken Perfekt for Lesson 4."
    },
    "lesson-0004": {
      number: "4",
      title: "Was hast du gestern gemacht?",
      focus: "spoken Perfekt with haben/sein, participles, and the German sentence bracket",
      messageMinimum: 4,
      messageChecks(value) {
        const text = normalize(value);
        const participles = text.match(/\b(gelernt|gearbeitet|gemacht|gebucht|gekauft|geschrieben|gelesen|gefahren|gekommen|angekommen|abgefahren|studiert|telefoniert|vorbereitet)\b/gi) || [];
        return {
          length: words(value) >= 30 && words(value) <= 60,
          time: /\b(gestern|vorgestern|letzte\w*\s+woche|am\s+(montag|dienstag|mittwoch|donnerstag|freitag|samstag|sonntag)|heute\s+morgen|um\s+\d{1,2}[:.]\d{2})\b/i.test(text),
          perfect: /\b(habe|hast|hat|haben|habt|bin|bist|ist|sind|seid)\b/i.test(text) && participles.length > 0,
          actions: new Set(participles.map((item) => item.toLocaleLowerCase("de-DE"))).size >= 2,
          question: /\?/.test(value)
        };
      },
      messageLabels: {
        length: "30–60 слов",
        time: "указание времени",
        perfect: "haben/sein + Partizip II",
        actions: "два действия в Perfekt",
        question: "один вопрос"
      },
      exitSuccess: "форма Perfekt и рамочная конструкция распознаны",
      exitReview: "первые ответы сохранены; повтори отмеченные формы завтра",
      ready(checks, score) {
        return score >= 3 && checks.length && checks.perfect && checks.actions;
      },
      readyCopy: "Ты построила два действия в Perfekt и завершила итоговую проверку. Первые ответы сохранены как учебное свидетельство.",
      reviewCopy: "Результат сохранён без исправленных повторов. Завтра вернись только к отмеченным формам на две минуты.",
      followUp: "Was hast du gestern nach dem Kurs oder nach der Arbeit gemacht?",
      teacherPrompt: "Please review whether Akmaral can independently choose haben/sein, form a useful participle, and keep the participle at the end. If stable, update the learning record and choose between weil word order and a second Perfekt retrieval lesson."
    },
    "lesson-0005": {
      number: "5",
      title: "Gestern unterwegs: haben oder sein?",
      focus: "second Perfekt retrieval with haben/sein, useful participles, and the sentence bracket",
      messageMinimum: 5,
      messageChecks(value) {
        const text = normalize(value);
        const participles = text.match(/\b(gespielt|gelernt|gearbeitet|gemacht|gekauft|gekocht|gefahren|gegangen|gekommen|angekommen|telefoniert)\b/gi) || [];
        return {
          length: words(value) >= 35 && words(value) <= 65,
          time: /\b(gestern|vorgestern|am\s+(montag|dienstag|mittwoch|donnerstag|freitag|samstag|sonntag)|am\s+abend|am\s+morgen|um\s+\d{1,2}[:.]?\d{0,2})\b/i.test(text),
          haben: /\b(habe|hast|hat|haben|habt)\b[^.!?]{0,100}\b(gespielt|gelernt|gearbeitet|gemacht|gekauft|gekocht|telefoniert)\b/i.test(text),
          sein: /\b(bin|bist|ist|sind|seid)\b[^.!?]{0,100}\b(gefahren|gegangen|gekommen|angekommen)\b/i.test(text),
          actions: new Set(participles.map((item) => item.toLocaleLowerCase("de-DE"))).size >= 3,
          question: /\?/.test(value)
        };
      },
      messageLabels: {
        length: "35–65 слов",
        time: "когда это было",
        haben: "одно действие с haben",
        sein: "одно перемещение с sein",
        actions: "три действия в Perfekt",
        question: "вопрос собеседнику"
      },
      exitSuccess: "выбор haben/sein и порядок слов стали увереннее",
      exitReview: "первые ответы учтены; завтра повтори только отмеченные конструкции",
      ready(checks, score) {
        return score >= 3 && checks.length && checks.haben && checks.sein && checks.actions;
      },
      readyCopy: "Ты использовала в своём сообщении и haben, и sein, а затем прошла итоговую проверку. Первые ответы учтены без пересдачи.",
      reviewCopy: "Урок завершён. Первые ответы сохранены, а правильные варианты показаны рядом — исправлять их повторно не нужно.",
      followUp: "Was hast du gestern gemacht, und wie bist du nach Hause gekommen?",
      teacherPrompt: "Please review whether Akmaral now independently keeps haben with ordinary actions, sein with movement from A to B, and the participle at the end. Advance to weil word order only if this is stable in her original message; otherwise choose one more short mixed Perfekt retrieval task."
    },
    "lesson-0006": {
      number: "6",
      title: "Perfekt-Kurzcheck: gemacht oder gelaufen?",
      focus: "short mixed Perfekt retrieval with machen, laufen, erreichen, and fahren",
      messageMinimum: 4,
      messageChecks(value) {
        const text = normalize(value);
        const participles = text.match(/\b(gemacht|gelernt|gearbeitet|erreicht|gelaufen|gefahren|gegangen|gekommen)\b/gi) || [];
        return {
          length: words(value) >= 25 && words(value) <= 50,
          time: /\b(gestern|vorgestern|am\s+(montag|dienstag|mittwoch|donnerstag|freitag|samstag|sonntag)|am\s+abend|am\s+morgen|um\s+\d{1,2}[:.]?\d{0,2})\b/i.test(text),
          haben: /\b(habe|hast|hat|haben|habt)\b[^.!?]{0,100}\b(gemacht|gelernt|gearbeitet|erreicht)\b/i.test(text),
          sein: /\b(bin|bist|ist|sind|seid)\b[^.!?]{0,100}\b(gelaufen|gefahren|gegangen|gekommen)\b/i.test(text),
          actions: new Set(participles.map((item) => item.toLocaleLowerCase("de-DE"))).size >= 3,
          question: /\?/.test(value)
        };
      },
      messageLabels: {
        length: "25–50 слов",
        time: "когда это было",
        haben: "действие с haben",
        sein: "перемещение с sein",
        actions: "три действия в Perfekt",
        question: "вопрос собеседнику"
      },
      exitSuccess: "четыре смешанные конструкции Perfekt извлечены увереннее",
      exitReview: "первые ответы учтены; повтори только отмеченные конструкции",
      ready(checks, score) {
        return score >= 3 && checks.length && checks.haben && checks.sein && checks.actions;
      },
      readyCopy: "Ты снова использовала haben и sein в новом сообщении и закончила короткую проверку. Первые ответы сохранены как свидетельство.",
      reviewCopy: "Короткая проверка завершена. Первые ответы сохранены, а нужные исправления показаны рядом.",
      followUp: "Was hast du gestern gemacht, und wie bist du nach Hause gekommen?",
      teacherPrompt: "Please review only the new original message. Advance to weil word order if ordinary actions keep haben, movement keeps sein, and the participle remains at the end; otherwise recycle Perfekt briefly inside a new real-life topic rather than adding another full Perfekt lesson."
    }
  };

  const config = lessonConfigs[lessonId] || lessonConfigs["lesson-0002"];
  const isRussian = document.documentElement.lang.toLocaleLowerCase().startsWith("ru");
  const ui = isRussian ? {
    stations: "этапов",
    stationSaved: "Готово ✓",
    savedContinue: "Готово. Можно идти дальше.",
    correct: "Правильный ответ:",
    chooseEvery: "Сначала выбери ответ в каждой строке.",
    writeEvery: "Сначала заполни все поля.",
    answersSaved: "Ответы приняты ✓",
    firstSaved: "первые ответы учтены",
    correctionsShown: "первые ответы учтены; правильные варианты показаны рядом",
    retrieved: "готово — первые ответы учтены",
    retrievedWithHelp: "готово — первые ответы учтены, правильные варианты показаны рядом",
    audioUnavailable: "В этом браузере не удалось включить немецкую озвучку.",
    words: "слов",
    answerAll: (count) => `Сначала ответь на все вопросы (${count}).`,
    resultSaved: "Результат готов ✓",
    targetReached: "Отлично, цель урока достигнута.",
    lessonFinished: "Урок завершён. Посмотри правильные варианты.",
    copied: "Результат скопирован. Отправь его преподавателю."
  } : {
    stations: "stations",
    stationSaved: "Station saved ✓",
    savedContinue: "Saved. Keep moving when you’re ready.",
    correct: "Correct:",
    chooseEvery: "Choose one answer on every line first.",
    writeEvery: "Write one answer on every line first.",
    answersSaved: "Answers saved ✓",
    firstSaved: "first choices saved",
    correctionsShown: "first choices saved; corrections are shown beside the missed lines",
    retrieved: "retrieved — first answers saved",
    retrievedWithHelp: "retrieved — first answers saved and corrections revealed",
    audioUnavailable: "German audio is unavailable in this browser.",
    words: "words",
    answerAll: (count) => `Answer all ${count} tickets first.`,
    resultSaved: "Result saved ✓",
    targetReached: "Target reached — result saved.",
    lessonFinished: "Lesson finished — review marked.",
    copied: "Lesson result copied for your teacher."
  };
  const state = {
    completed: {},
    flips: [],
    attempts: {},
    answers: {},
    scores: {},
    submitted: {},
    mistakes: [],
    message: "",
    speaking: false,
    exitAnswers: {},
    exitScore: null
  };

  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem(storeKey));
      if (!saved) return;
      Object.assign(state, saved);
      state.completed = state.completed || {};
      state.flips = Array.isArray(state.flips) ? state.flips : [];
      state.attempts = state.attempts || {};
      state.answers = state.answers || {};
      state.scores = state.scores || {};
      state.submitted = state.submitted || {};
      state.mistakes = Array.isArray(state.mistakes) ? state.mistakes : [];
      state.exitAnswers = state.exitAnswers || {};
      if (state.exitScore !== null && Object.keys(state.exitAnswers).length) state.submitted.exit = true;
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

  function addMistake(key) {
    if (!state.mistakes.includes(key)) state.mistakes.push(key);
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
    if (label) label.textContent = `${complete}/${steps.length} ${ui.stations}`;
    if (track) track.setAttribute("aria-valuenow", String(percent));
    steps.forEach((section) => section.classList.toggle("is-complete", Boolean(state.completed[section.dataset.lessonStep])));
  }

  function setupManualSteps() {
    document.querySelectorAll("[data-mark-step]").forEach((button) => {
      const step = button.closest("[data-lesson-step]")?.dataset.lessonStep;
      if (state.completed[step]) button.textContent = ui.stationSaved;
      button.addEventListener("click", () => {
        markStep(step);
        button.textContent = ui.stationSaved;
        showToast(ui.savedContinue);
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
    if (cards.length && state.flips.length === cards.length) markStep(cards[0].closest("[data-lesson-step]")?.dataset.lessonStep);
  }

  function renderChoice(quiz, quizKey) {
    const buttons = [...quiz.querySelectorAll("button[data-correct]")];
    const feedback = quiz.querySelector("[data-feedback]");
    const savedIndex = state.answers[quizKey];
    const selected = Number.isInteger(savedIndex) ? buttons[savedIndex] : null;
    const correctButton = buttons.find((button) => button.dataset.correct === "true");
    const correct = selected?.dataset.correct === "true";
    buttons.forEach((button) => {
      button.disabled = true;
      button.classList.remove("is-right", "is-wrong");
    });
    correctButton?.classList.add("is-right");
    if (selected && !correct) selected.classList.add("is-wrong");
    feedback.textContent = correct
      ? (quiz.dataset.correctMessage || "Richtig.")
      : `${(quiz.dataset.tryMessage || "Not quite.").replace(/try again\.?\s*/i, "")} ${ui.correct} ${correctButton?.textContent.trim()}`;
    feedback.className = `lesson-feedback ${correct ? "is-good" : "needs-work"}`;
  }

  function setupChoiceQuizzes() {
    document.querySelectorAll("[data-choice-quiz]").forEach((quiz, quizIndex) => {
      const step = quiz.closest("[data-lesson-step]")?.dataset.lessonStep;
      const quizKey = `choice-${quizIndex}`;
      const buttons = [...quiz.querySelectorAll("button[data-correct]")];
      if (state.submitted[quizKey]) renderChoice(quiz, quizKey);
      buttons.forEach((button, buttonIndex) => {
        button.addEventListener("click", () => {
          if (state.submitted[quizKey]) return;
          const correct = button.dataset.correct === "true";
          state.attempts[quizKey] = 1;
          state.answers[quizKey] = buttonIndex;
          state.scores[quizKey] = { score: correct ? 1 : 0, total: 1 };
          state.submitted[quizKey] = true;
          if (!correct) addMistake(quizKey);
          renderChoice(quiz, quizKey);
          const sectionQuizzes = [...quiz.closest("[data-lesson-step]").querySelectorAll("[data-choice-quiz]")];
          const sectionReady = sectionQuizzes.every((item) => state.submitted[`choice-${[...document.querySelectorAll("[data-choice-quiz]")].indexOf(item)}`]);
          if (sectionReady) markStep(step);
          saveState();
        });
      });
    });
  }

  function renderSelectDrill(drill, drillKey) {
    const rows = [...drill.querySelectorAll("select[data-answer]")];
    const saved = state.answers[drillKey] || [];
    rows.forEach((select, rowIndex) => {
      select.value = saved[rowIndex] || "";
      select.disabled = true;
      const correct = normalize(select.value) === normalize(select.dataset.answer);
      const row = select.closest(".practice-row");
      row.classList.toggle("is-right", correct);
      row.classList.toggle("is-wrong", !correct);
      let correction = row.querySelector("[data-correction]");
      if (!correction) {
        correction = document.createElement("small");
        correction.dataset.correction = "";
        row.appendChild(correction);
      }
      correction.textContent = correct ? "✓" : `${ui.correct} ${select.dataset.answer}`;
    });
    const result = state.scores[drillKey];
    const feedback = drill.querySelector("[data-feedback]");
    feedback.textContent = result.score === result.total
      ? `${result.score}/${result.total} — ${isRussian ? "отлично!" : "sauber!"} ${ui.firstSaved}.`
      : `${result.score}/${result.total} — ${ui.correctionsShown}.`;
    feedback.className = `lesson-feedback ${result.score === result.total ? "is-good" : "needs-work"}`;
    const button = drill.querySelector("[data-check-drill]");
    button.disabled = true;
    button.textContent = ui.answersSaved;
  }

  function setupSelectDrills() {
    document.querySelectorAll("[data-select-drill]").forEach((drill, drillIndex) => {
      const drillKey = `drill-${drillIndex}`;
      const button = drill.querySelector("[data-check-drill]");
      const feedback = drill.querySelector("[data-feedback]");
      const rows = [...drill.querySelectorAll("select[data-answer]")];
      if (state.submitted[drillKey]) renderSelectDrill(drill, drillKey);
      button.addEventListener("click", () => {
        if (state.submitted[drillKey]) return;
        if (rows.some((select) => !select.value)) {
          feedback.textContent = ui.chooseEvery;
          feedback.className = "lesson-feedback needs-work";
          return;
        }
        const answers = rows.map((select) => select.value);
        const score = rows.filter((select) => normalize(select.value) === normalize(select.dataset.answer)).length;
        state.attempts[drillKey] = 1;
        state.answers[drillKey] = answers;
        state.scores[drillKey] = { score, total: rows.length };
        state.submitted[drillKey] = true;
        rows.forEach((select, rowIndex) => {
          if (normalize(select.value) !== normalize(select.dataset.answer)) addMistake(`${drillKey}-${rowIndex}`);
        });
        renderSelectDrill(drill, drillKey);
        markStep(drill.closest("[data-lesson-step]")?.dataset.lessonStep);
        saveState();
      });
    });
  }

  function renderRecall(set, recallKey) {
    const inputs = [...set.querySelectorAll("input[data-answer]")];
    const saved = state.answers[recallKey] || [];
    inputs.forEach((input, inputIndex) => {
      input.value = saved[inputIndex] || "";
      input.disabled = true;
      const accepted = input.dataset.answer.split("|").map(normalize);
      const correct = accepted.includes(normalize(input.value));
      const row = input.closest(".recall-row");
      row.classList.toggle("is-right", correct);
      row.classList.toggle("is-wrong", !correct);
      row.querySelector("[data-note]").textContent = correct ? "✓" : `${ui.correct} ${input.dataset.answer.split("|")[0]}`;
    });
    const result = state.scores[recallKey];
    const feedback = set.querySelector("[data-feedback]");
    feedback.textContent = result.score === result.total
      ? `${result.score}/${result.total} ${ui.retrieved}.`
      : `${result.score}/${result.total} ${ui.retrievedWithHelp}.`;
    feedback.className = `lesson-feedback ${result.score === result.total ? "is-good" : "needs-work"}`;
    const button = set.querySelector("[data-check-recall]");
    button.disabled = true;
    button.textContent = ui.answersSaved;
  }

  function setupRecall() {
    document.querySelectorAll("[data-recall-set]").forEach((set, setIndex) => {
      const recallKey = `recall-${setIndex}`;
      const inputs = [...set.querySelectorAll("input[data-answer]")];
      const feedback = set.querySelector("[data-feedback]");
      if (state.submitted[recallKey]) renderRecall(set, recallKey);
      set.querySelector("[data-check-recall]").addEventListener("click", () => {
        if (state.submitted[recallKey]) return;
        if (inputs.some((input) => !input.value.trim())) {
          feedback.textContent = ui.writeEvery;
          feedback.className = "lesson-feedback needs-work";
          return;
        }
        const answers = inputs.map((input) => input.value);
        const score = inputs.filter((input) => input.dataset.answer.split("|").map(normalize).includes(normalize(input.value))).length;
        state.attempts[recallKey] = 1;
        state.answers[recallKey] = answers;
        state.scores[recallKey] = { score, total: inputs.length };
        state.submitted[recallKey] = true;
        inputs.forEach((input, inputIndex) => {
          if (!input.dataset.answer.split("|").map(normalize).includes(normalize(input.value))) addMistake(`${recallKey}-${inputIndex}`);
        });
        renderRecall(set, recallKey);
        markStep(set.closest("[data-lesson-step]")?.dataset.lessonStep);
        saveState();
      });
    });
  }

  function playGerman(button) {
    const text = button.dataset.speak;
    if (!("speechSynthesis" in window) || !text) {
      showToast(ui.audioUnavailable);
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "de-DE";
    utterance.rate = Number(button.dataset.rate || 0.78);
    window.speechSynthesis.speak(utterance);
  }

  function setupAudio() {
    document.querySelectorAll("button[data-speak]").forEach((button) => button.addEventListener("click", () => playGerman(button)));
  }

  function messageChecks(value) {
    return config.messageChecks(value);
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
      count.textContent = `${words(state.message)} ${ui.words}`;
      coach.querySelectorAll("[data-message-check]").forEach((item) => item.classList.toggle("is-pass", Boolean(checks[item.dataset.messageCheck])));
      if (Object.values(checks).filter(Boolean).length >= config.messageMinimum) markStep(step);
      saveState();
    };
    textarea.addEventListener("input", update);
    update();

    const speaking = coach.querySelector("[data-speaking]");
    if (!speaking) return;
    speaking.checked = state.speaking;
    speaking.addEventListener("change", () => {
      state.speaking = speaking.checked;
      saveState();
    });
  }

  function renderExit(exit) {
    const groups = [...exit.querySelectorAll("[data-exit-group]")];
    groups.forEach((group, groupIndex) => {
      const savedValue = state.exitAnswers[groupIndex];
      const radios = [...group.querySelectorAll("input[type='radio']")];
      const selected = radios.find((radio) => radio.value === savedValue);
      if (selected) selected.checked = true;
      const correct = selected?.dataset.correct === "true";
      group.classList.toggle("is-right", Boolean(correct));
      group.classList.toggle("is-wrong", Boolean(selected) && !correct);
      radios.forEach((radio) => {
        radio.disabled = true;
        radio.closest("label")?.classList.remove("is-correction");
      });
      if (selected && !correct) group.querySelector("input[data-correct='true']")?.closest("label")?.classList.add("is-correction");
    });
    const score = state.exitScore ?? 0;
    const feedback = exit.querySelector("[data-feedback]");
    feedback.textContent = score >= Math.ceil(groups.length * 0.75)
      ? `${score}/${groups.length} — ${config.exitSuccess}.`
      : `${score}/${groups.length} — ${config.exitReview}.`;
    feedback.className = `lesson-feedback ${score >= Math.ceil(groups.length * 0.75) ? "is-good" : "needs-work"}`;
    const button = exit.querySelector("[data-check-exit]");
    button.disabled = true;
    button.textContent = ui.resultSaved;
  }

  function setupExitQuiz() {
    const exit = document.querySelector("[data-exit-quiz]");
    if (!exit) return;
    const feedback = exit.querySelector("[data-feedback]");
    const groups = [...exit.querySelectorAll("[data-exit-group]")];
    if (state.submitted.exit) renderExit(exit);
    exit.querySelector("[data-check-exit]").addEventListener("click", () => {
      if (state.submitted.exit) return;
      if (groups.some((group) => !group.querySelector("input:checked"))) {
        feedback.textContent = ui.answerAll(groups.length);
        feedback.className = "lesson-feedback needs-work";
        return;
      }
      let score = 0;
      groups.forEach((group, groupIndex) => {
        const selected = group.querySelector("input:checked");
        const correct = selected.dataset.correct === "true";
        state.exitAnswers[groupIndex] = selected.value;
        if (correct) score += 1;
        else addMistake(`exit-${groupIndex}`);
      });
      state.attempts.exit = 1;
      state.exitScore = score;
      state.scores.exit = { score, total: groups.length };
      state.submitted.exit = true;
      markStep(exit.closest("[data-lesson-step]")?.dataset.lessonStep);
      renderExit(exit);
      renderCompletion(true);
      saveState();
    });
  }

  function scoreSummary(prefix) {
    const results = Object.entries(state.scores).filter(([key]) => key.startsWith(prefix)).map(([, value]) => value);
    if (!results.length) return "not completed";
    const score = results.reduce((sum, item) => sum + item.score, 0);
    const total = results.reduce((sum, item) => sum + item.total, 0);
    return `${score}/${total}`;
  }

  function buildReport() {
    const checks = messageChecks(state.message);
    const interactions = Object.values(state.attempts).reduce((sum, count) => sum + Number(count || 0), 0);
    const checkLines = Object.entries(config.messageLabels).map(([key, label]) => `- ${label}: ${checks[key] ? "yes" : "not yet"}`).join("\n");
    return `Akmaral’s Deutschreise — Lesson ${config.number} result

Lesson: ${config.title}
Focus: ${config.focus}

First-answer evidence:
- First-choice checks: ${scoreSummary("choice-")}
- Controlled practice: ${scoreSummary("drill-")}
- Typed recall: ${scoreSummary("recall-")}
- Exit ticket: ${state.exitScore ?? "not completed"}/${state.scores.exit?.total || document.querySelectorAll("[data-exit-group]").length || 4}
- Corrections revealed: ${state.mistakes.length}
- Practice interactions recorded: ${interactions}
- Speaking mission attempted: ${state.speaking ? "yes" : "no"}

Message support checks:
${checkLines}

Original message (${words(state.message)} words):
${state.message || "No message submitted."}

Ask Akmaral: „${config.followUp}“

${config.teacherPrompt}`;
  }

  function renderCompletion(shouldScroll = false) {
    const card = document.querySelector("[data-completion]");
    if (!card || state.exitScore === null) return;
    card.classList.remove("is-hidden");
    const checks = messageChecks(state.message);
    const ready = config.ready(checks, state.exitScore);
    card.querySelector("[data-completion-title]").textContent = ready ? ui.targetReached : ui.lessonFinished;
    card.querySelector("[data-completion-copy]").textContent = ready ? config.readyCopy : config.reviewCopy;
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
        showToast(ui.copied);
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
