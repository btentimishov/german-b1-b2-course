const COURSE_STORAGE_KEY = "deutschImEchtenLeben.v1";
const REVIEW_INTERVALS_DAYS = [1, 3, 7, 14, 30];
const COURSE_LESSONS = [
  ["0001", "Im Meeting beitragen", "lessons/0001-make-a-clear-meeting-contribution.html"],
  ["0002", "Smalltalk weiterführen", "lessons/0002-keep-smalltalk-going.html"],
  ["0003", "Konkrete Rückfragen", "lessons/0003-ask-specific-follow-up-questions.html"],
  ["0004", "Artikel im echten Leben", "lessons/0004-artikel-im-echten-leben.html"],
  ["0005", "Genus-Detektiv", "lessons/0005-der-die-das-detektiv.html"],
  ["0006", "Ein oder das?", "lessons/0006-ein-oder-das.html"],
  ["0007", "Wem schickst du was?", "lessons/0007-wem-schickst-du-was.html"],
  ["0008", "Ein oder einen?", "lessons/0008-ein-oder-einen.html"],
  ["0009", "Der Nomen-Pass", "lessons/0009-der-nomen-pass.html"],
  ["0010", "Wem–was im Rhythmus", "lessons/0010-wem-was-im-rhythmus.html"]
].map(([id, title, href]) => ({ id, title, href }));

function readCourseState() {
  try {
    return JSON.parse(localStorage.getItem(COURSE_STORAGE_KEY)) || { lessons: {}, mistakes: {}, activity: [] };
  } catch {
    return { lessons: {}, mistakes: {}, activity: [] };
  }
}

function writeCourseState(state) {
  try {
    localStorage.setItem(COURSE_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // The lesson still works when private browsing blocks local storage.
  }
}

function currentLessonId() {
  return location.pathname.match(/\/lessons\/(\d{4})-/)?.[1] || null;
}

function localDay(timestamp = Date.now()) {
  const date = new Date(timestamp);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function recordActivity(state, timestamp = Date.now()) {
  state.activity ||= [];
  const day = localDay(timestamp);
  if (!state.activity.includes(day)) state.activity.push(day);
  state.activity = state.activity.slice(-90);
}

function savePracticeAttempt(lessonId, score, total, mistakes) {
  if (!lessonId) return;
  const state = readCourseState();
  state.lessons ||= {};
  state.mistakes ||= {};
  const lesson = state.lessons[lessonId] || {};
  lesson.bestScore = Math.max(lesson.bestScore || 0, score);
  lesson.total = Math.max(lesson.total || 0, total);
  lesson.lastPracticedAt = Date.now();
  state.lessons[lessonId] = lesson;
  mistakes.forEach(({ prompt, answer, selected }) => {
    const key = `${lessonId}:${prompt}`;
    state.mistakes[key] = {
      lessonId,
      prompt,
      answer,
      selected,
      lastWrongAt: Date.now(),
      nextReviewAt: Date.now() + 86400000
    };
  });
  recordActivity(state);
  writeCourseState(state);
}

function completeLesson(lessonId) {
  if (!lessonId) return null;
  const state = readCourseState();
  state.lessons ||= {};
  const now = Date.now();
  const lesson = state.lessons[lessonId] || {};
  const isDueReview = lesson.completedAt && (!lesson.nextReviewAt || lesson.nextReviewAt <= now);
  const reviewStage = isDueReview
    ? Math.min((lesson.reviewStage || 0) + 1, REVIEW_INTERVALS_DAYS.length - 1)
    : lesson.reviewStage || 0;
  lesson.completedAt ||= now;
  lesson.lastCompletedAt = now;
  lesson.reviewStage = reviewStage;
  lesson.nextReviewAt = now + REVIEW_INTERVALS_DAYS[reviewStage] * 86400000;
  state.lessons[lessonId] = lesson;
  recordActivity(state, now);
  writeCourseState(state);
  window.dispatchEvent(new CustomEvent("course-progress-updated", { detail: { lessonId } }));
  return lesson;
}

function formatReviewDate(timestamp) {
  return new Intl.DateTimeFormat("de-DE", { weekday: "short", day: "2-digit", month: "2-digit" }).format(timestamp);
}

function answerReason(select) {
  const prompt = select.dataset.prompt || select.closest(".quiz-row")?.querySelector("label")?.textContent || "";
  if (select.dataset.explanation) return select.dataset.explanation;
  if (/\bmit\b/i.test(prompt)) return "„mit“ verlangt den Dativ.";
  if (/f(?:ü|ue)r/i.test(prompt)) return "„für“ verlangt den Akkusativ.";
  if (/Wem\?/i.test(prompt)) return "„Wem?“ markiert hier den Dativ-Empfänger.";
  if (/Was\?/i.test(prompt)) return "„Was?“ markiert hier die Akkusativ-Sache.";
  if (/Grundform/i.test(prompt)) return "Der Grundartikel gehört fest zum Nomenpaket.";
  if (/bekannt/i.test(prompt)) return "Schon genannt: Verwende den bestimmten Artikel.";
  if (/neu/i.test(prompt)) return "Zum ersten Mal genannt: Verwende den unbestimmten Artikel.";
  if (/(heit|keit|schaft|ung)\b/i.test(prompt)) return "Diese Endung ist ein zuverlässiges Signal für „die“.";
  if (/(chen|lein)\b/i.test(prompt)) return "Diese Endung ist ein zuverlässiges Signal für „das“.";
  return "Sprich Artikel und Nomen jetzt einmal als Paket laut.";
}

function practiceStreak(activity = []) {
  const days = new Set(activity);
  const cursor = new Date();
  if (!days.has(localDay(cursor.getTime()))) cursor.setDate(cursor.getDate() - 1);
  let streak = 0;
  while (days.has(localDay(cursor.getTime()))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

function renderCourseDashboard() {
  const dashboard = document.querySelector("[data-course-dashboard]");
  if (!dashboard) return;
  const state = readCourseState();
  const completed = COURSE_LESSONS.filter(({ id }) => state.lessons?.[id]?.completedAt);
  const due = COURSE_LESSONS.filter(({ id }) => {
    const lesson = state.lessons?.[id];
    return lesson?.completedAt && lesson.nextReviewAt <= Date.now();
  });
  const next = COURSE_LESSONS.find(({ id }) => !state.lessons?.[id]?.completedAt) || due[0] || COURSE_LESSONS.at(-1);
  const percent = Math.round((completed.length / COURSE_LESSONS.length) * 100);
  const progressText = dashboard.querySelector("[data-course-progress-text]");
  const progressFill = dashboard.querySelector("[data-course-progress-fill]");
  const streak = dashboard.querySelector("[data-course-streak]");
  const dailyGoal = dashboard.querySelector("[data-daily-goal]");
  const reviewList = dashboard.querySelector("[data-review-list]");
  const mistakes = Object.values(state.mistakes || {}).sort((a, b) => b.lastWrongAt - a.lastWrongAt);
  const dueMistakes = mistakes.filter((mistake) => mistake.nextReviewAt <= Date.now());
  if (progressText) progressText.textContent = `${completed.length}/${COURSE_LESSONS.length} Lektionen`;
  if (progressFill) progressFill.style.width = `${percent}%`;
  if (streak) {
    const days = practiceStreak(state.activity);
    streak.textContent = `${days} ${days === 1 ? "Tag" : "Tage"}`;
  }
  if (dailyGoal) dailyGoal.textContent = state.activity?.includes(localDay()) ? "geschafft ✓" : "1 kurze Einheit";
  if (reviewList) {
    reviewList.innerHTML = "";
    if (due.length) {
      due.slice(0, 3).forEach((lesson) => {
        const item = document.createElement("li");
        item.innerHTML = `<a href="${lesson.href}">Lektion ${Number(lesson.id)} · ${lesson.title}</a>`;
        reviewList.append(item);
      });
    } else if (dueMistakes.length) {
      const mistake = dueMistakes[0];
      const lesson = COURSE_LESSONS.find(({ id }) => id === mistake.lessonId);
      const item = document.createElement("li");
      item.innerHTML = `<a href="${lesson?.href || "#"}">Fehler noch einmal abrufen: ${mistake.prompt}</a>`;
      reviewList.append(item);
    } else if (mistakes.length) {
      reviewList.innerHTML = `<li>Ein Fehler-Abruf ist ab ${formatReviewDate(mistakes[0].nextReviewAt)} geplant.</li>`;
    } else {
      reviewList.innerHTML = "<li>Noch nichts fällig — beginne mit einer kurzen Lektion.</li>";
    }
  }
  document.querySelectorAll("[data-lesson-card]").forEach((card) => {
    const lesson = state.lessons?.[card.dataset.lessonCard];
    card.classList.toggle("is-complete", Boolean(lesson?.completedAt));
    let badge = card.querySelector(".lesson-status");
    if (!badge) {
      badge = document.createElement("span");
      badge.className = "lesson-status";
      card.prepend(badge);
    }
    badge.textContent = lesson?.completedAt ? "✓ Gelernt" : "Offen";
  });
  const nextCard = document.querySelector("[data-next-card]");
  if (nextCard && next) {
    nextCard.querySelector("[data-next-eyebrow]").textContent = due.includes(next) ? "Jetzt wiederholen" : "Hier weitermachen";
    nextCard.querySelector("[data-next-title]").textContent = `Lektion ${Number(next.id)} · ${next.title}`;
    nextCard.querySelector("[data-next-link]").href = next.href;
    nextCard.querySelector("[data-next-link]").textContent = due.includes(next) ? "Wiederholen →" : "Lektion starten →";
  }
}

function addLessonCompletion() {
  const lessonId = currentLessonId();
  const main = document.querySelector("main");
  if (!lessonId || !main) return;
  const nav = main.querySelector("nav");
  const section = document.createElement("section");
  section.className = "card completion-card";
  section.innerHTML = `<p class="eyebrow">Lernschritt sichern</p><h2>Heute geschafft?</h2><p data-completion-status>Speichere die Lektion auf diesem Gerät. Danach planen wir eine kurze Wiederholung.</p><button type="button" data-complete-lesson>Lektion abschließen</button>`;
  main.insertBefore(section, nav || null);
  const status = section.querySelector("[data-completion-status]");
  const button = section.querySelector("[data-complete-lesson]");
  const refresh = () => {
    const lesson = readCourseState().lessons?.[lessonId];
    if (!lesson?.completedAt) return;
    const due = lesson.nextReviewAt <= Date.now();
    status.textContent = due
      ? "Die Wiederholung ist fällig. Rufe die Formen ohne Hilfe ab und speichere danach erneut."
      : `Gespeichert ✓ Nächste kurze Wiederholung: ${formatReviewDate(lesson.nextReviewAt)}`;
    button.textContent = due ? "Wiederholung abschließen" : "Erneut speichern";
  };
  button.addEventListener("click", () => {
    completeLesson(lessonId);
    refresh();
  });
  window.addEventListener("course-progress-updated", refresh);
  refresh();
}

renderCourseDashboard();
addLessonCompletion();

document.querySelectorAll("[data-quiz]").forEach((quiz) => {
  const button = quiz.querySelector("button");
  const feedback = quiz.querySelector(".feedback");

  button?.addEventListener("click", () => {
    const selected = quiz.querySelector("input:checked");
    if (!selected) {
      feedback.textContent = "Wähle zuerst eine Antwort.";
      feedback.className = "feedback try";
      return;
    }

    const correct = selected.dataset.correct === "true";
    feedback.textContent = correct
      ? quiz.dataset.correctMessage || "Richtig — diese Formulierung passt."
      : quiz.dataset.wrongMessage || "Noch nicht. Probiere eine andere Antwort.";
    feedback.className = `feedback ${correct ? "good" : "try"}`;
  });
});

document.querySelectorAll("[data-smalltalk-checker]").forEach((checker) => {
  const input = checker.querySelector("textarea");
  const button = checker.querySelector("button");
  const feedback = checker.querySelector(".feedback");
  const checks = [...checker.querySelectorAll("[data-check]")];

  button?.addEventListener("click", () => {
    const text = input.value.trim();
    const parts = text.split(/[.!?]+/).map((part) => part.trim()).filter(Boolean);
    const firstWords = parts[0]?.split(/\s+/).filter(Boolean).length || 0;
    const totalWords = text.split(/\s+/).filter(Boolean).length;
    const results = {
      answer: firstWords >= 2,
      detail: parts.length >= 3 && totalWords >= 10,
      question: text.includes("?")
    };

    let passed = 0;
    checks.forEach((item) => {
      const ok = results[item.dataset.check];
      item.classList.toggle("pass", ok);
      if (ok) passed += 1;
    });

    if (!text) {
      feedback.textContent = "Schreibe zuerst deine drei Sätze.";
      feedback.className = "feedback try";
    } else if (passed === 3) {
      feedback.textContent = "3/3 Bausteine erkannt — jetzt einmal laut sprechen.";
      feedback.className = "feedback good";
    } else {
      feedback.textContent = `${passed}/3 Bausteine erkannt — ergänze Antwort, Detail oder Rückfrage.`;
      feedback.className = "feedback try";
    }
  });
});

document.querySelectorAll("[data-followup-checker]").forEach((checker) => {
  const input = checker.querySelector("textarea");
  const button = checker.querySelector("button");
  const feedback = checker.querySelector(".feedback");
  const checks = [...checker.querySelectorAll("[data-check]")];

  button?.addEventListener("click", () => {
    const text = input.value.trim().toLowerCase();
    const questionCount = (text.match(/\?/g) || []).length;
    const results = {
      two: questionCount >= 2,
      open: /(^|[.!?]\s*)(wer|wo|wie|was|wann|welch)/i.test(text),
      detail: /geburtstag|geburtstagsfeier|feier|hamburg|dort|gefeiert/.test(text)
    };

    let passed = 0;
    checks.forEach((item) => {
      const ok = results[item.dataset.check];
      item.classList.toggle("pass", ok);
      if (ok) passed += 1;
    });

    if (!text) {
      feedback.textContent = "Schreibe zuerst zwei Fragen.";
      feedback.className = "feedback try";
    } else if (passed === 3) {
      feedback.textContent = "3/3 Bausteine erkannt — deine Fragen greifen das Detail auf.";
      feedback.className = "feedback good";
    } else {
      feedback.textContent = `${passed}/3 Bausteine erkannt — nutze zwei W-Fragen zum Geburtstag oder zu Hamburg.`;
      feedback.className = "feedback try";
    }
  });
});

document.querySelectorAll("[data-response-checker]").forEach((checker) => {
  const input = checker.querySelector("textarea");
  const button = checker.querySelector("button");
  const feedback = checker.querySelector(".feedback");
  const checks = [...checker.querySelectorAll("[data-check]")];

  button?.addEventListener("click", () => {
    const text = input.value.trim().toLowerCase();
    const patterns = {
      link: /anknüpfen|ähnlich|ergänzen|punkt/,
      view: /aus meiner sicht|ich denke|meiner meinung nach|ich sehe/,
      reason: /weil|denn|grund|deshalb/,
      next: /ich schlage vor|schlage ich vor|mein vorschlag|wir könnten|nächste[rns]? schritt/
    };

    let passed = 0;
    checks.forEach((item) => {
      const ok = patterns[item.dataset.check].test(text);
      item.classList.toggle("pass", ok);
      if (ok) passed += 1;
    });

    if (!text) {
      feedback.textContent = "Schreibe zuerst deinen Beitrag.";
      feedback.className = "feedback try";
    } else if (passed >= 3) {
      feedback.textContent = `${passed}/4 Bausteine erkannt — bereit zum lauten Sprechen.`;
      feedback.className = "feedback good";
    } else {
      feedback.textContent = `${passed}/4 Bausteine erkannt — ergänze noch einen klaren Grund oder nächsten Schritt.`;
      feedback.className = "feedback try";
    }
  });
});

document.querySelectorAll("[data-word-card]").forEach((card) => {
  card.addEventListener("click", () => card.classList.toggle("revealed"));
});

document.querySelectorAll("[data-article-lab], [data-genus-lab], [data-context-lab], [data-case-lab], [data-ending-lab], [data-automaticity-lab]").forEach((lab) => {
  const selects = [...lab.querySelectorAll("[data-answer]")];
  const button = lab.querySelector("[data-check-articles]");
  const feedback = lab.querySelector(".feedback");
  const fill = lab.querySelector(".progress-fill");

  button?.addEventListener("click", () => {
    let score = 0;
    const mistakes = [];
    selects.forEach((select) => {
      const correct = select.value.trim().toLocaleLowerCase("de-DE") === select.dataset.answer.trim().toLocaleLowerCase("de-DE");
      select.setAttribute("aria-invalid", String(!correct));
      select.style.borderColor = correct ? "var(--green)" : "var(--accent)";
      if (correct) score += 1;
      if (!correct) mistakes.push({
        prompt: select.dataset.prompt || select.closest(".quiz-row")?.querySelector("label")?.textContent || "Aufgabe",
        answer: select.dataset.answer,
        selected: select.value || "—"
      });
      const row = select.closest(".quiz-row");
      let note = row?.querySelector(".answer-note");
      if (!note && row) {
        note = document.createElement("span");
        note.className = "answer-note";
        row.append(note);
      }
      if (note) {
        note.textContent = correct
          ? `✓ Richtig. ${answerReason(select)}`
          : `Richtig: ${select.dataset.answer}. ${answerReason(select)}`;
        note.classList.toggle("good", correct);
      }
    });
    savePracticeAttempt(currentLessonId(), score, selects.length, mistakes);
    lab.dataset.score = `${score}/${selects.length}`;
    fill.style.width = `${(score / selects.length) * 100}%`;
    feedback.textContent = score === selects.length
      ? lab.dataset.successMessage || `${score}/${selects.length} — stark! Alle Artikel sitzen.`
      : lab.dataset.retryMessage || `${score}/${selects.length} — die roten Felder brauchen noch einen Versuch.`;
    feedback.className = `feedback ${score === selects.length ? "good" : "try"}`;
  });
});

document.querySelectorAll("[data-article-production]").forEach((checker) => {
  const input = checker.querySelector("textarea");
  const button = checker.querySelector("[data-check-production]");
  const feedback = checker.querySelector(".feedback");
  const checks = [...checker.querySelectorAll("[data-check]")];

  button?.addEventListener("click", () => {
    const text = input.value.trim();
    const results = {
      mit: /mit\s+(dem|der|den)\b/i.test(text),
      fuer: /f(?:ü|ue)r\s+(den|die|das)\b/i.test(text),
      useful: /Termin|Kolleg|Team|Kunde|Besprechung|Frühstück|Kaffee|Brötchen/i.test(text),
      length: text.split(/\s+/).filter(Boolean).length >= 12
    };
    const passed = checks.reduce((count, item) => {
      const ok = results[item.dataset.check];
      item.classList.toggle("pass", ok);
      return count + Number(ok);
    }, 0);
    checker.dataset.score = `${passed}/${checks.length}`;
    feedback.textContent = passed === checks.length
      ? "4/4 — deine Nachricht ist bereit zum Kopieren."
      : `${passed}/4 — ergänze die fehlenden Bausteine.`;
    feedback.className = `feedback ${passed === checks.length ? "good" : "try"}`;
  });
});

document.querySelectorAll("[data-genus-production]").forEach((checker) => {
  const input = checker.querySelector("textarea");
  const button = checker.querySelector("[data-check-production]");
  const feedback = checker.querySelector(".feedback");
  const checks = [...checker.querySelectorAll("[data-check]")];

  button?.addEventListener("click", () => {
    const text = input.value.trim();
    const targetNouns = text.match(/\b(Einladung|Besprechung|Möglichkeit|Sicherheit|Freundschaft|Brötchen|Essen|Treffen)\b/g) || [];
    const results = {
      die: /\b(?:die|Die)\s+(Einladung|Besprechung|Möglichkeit|Sicherheit|Freundschaft)\b/.test(text),
      das: /\b(?:das|Das)\s+(Brötchen|Essen|Treffen)\b/.test(text),
      words: new Set(targetNouns.map((word) => word.toLowerCase())).size >= 3,
      length: text.split(/\s+/).filter(Boolean).length >= 14
    };
    const passed = checks.reduce((count, item) => {
      const ok = results[item.dataset.check];
      item.classList.toggle("pass", ok);
      return count + Number(ok);
    }, 0);
    checker.dataset.score = `${passed}/${checks.length}`;
    feedback.textContent = passed === checks.length
      ? "4/4 — deine Einladung enthält beide Genus-Signale."
      : `${passed}/4 — nutze die Satzstarter und ergänze die fehlenden Signale.`;
    feedback.className = `feedback ${passed === checks.length ? "good" : "try"}`;
  });
});

document.querySelectorAll("[data-context-production]").forEach((checker) => {
  const input = checker.querySelector("textarea");
  const button = checker.querySelector("[data-check-production]");
  const feedback = checker.querySelector(".feedback");
  const checks = [...checker.querySelectorAll("[data-check]")];

  button?.addEventListener("click", () => {
    const text = input.value.trim();
    const pairs = [
      [/\b(?:ein|einen)\s+Kuchen\b/i, /\b(?:der|den)\s+Kuchen\b/i],
      [/\beine\s+Idee\b/i, /\bdie\s+Idee\b/i],
      [/\bein\s+Getränk\b/i, /\bdas\s+Getränk\b/i],
      [/\beine\s+Nachricht\b/i, /\bdie\s+Nachricht\b/i],
      [/\b(?:ein|einen)\s+Link\b/i, /\b(?:der|den)\s+Link\b/i],
      [/\bein\s+Brötchen\b/i, /\bdas\s+Brötchen\b/i]
    ];
    const hasPair = pairs.some(([first, known]) => first.test(text) && known.test(text));
    const results = {
      first: /\b(ein|eine|einen)\s+(Kuchen|Idee|Getränk|Nachricht|Link|Brötchen)\b/i.test(text),
      known: hasPair,
      essen: /\bzum\s+Essen\b/.test(text),
      length: text.split(/\s+/).filter(Boolean).length >= 16
    };
    const passed = checks.reduce((count, item) => {
      const ok = results[item.dataset.check];
      item.classList.toggle("pass", ok);
      return count + Number(ok);
    }, 0);
    checker.dataset.score = `${passed}/${checks.length}`;
    feedback.textContent = passed === checks.length
      ? "4/4 — neu, bekannt und Großschreibung sind klar markiert."
      : `${passed}/4 — prüfe: erst ein/eine, danach der/die/das, und zum Essen.`;
    feedback.className = `feedback ${passed === checks.length ? "good" : "try"}`;
  });
});

document.querySelectorAll("[data-case-production]").forEach((checker) => {
  const input = checker.querySelector("textarea");
  const button = checker.querySelector("[data-check-production]");
  const feedback = checker.querySelector(".feedback");
  const checks = [...checker.querySelectorAll("[data-check]")];

  button?.addEventListener("click", () => {
    const text = input.value.trim();
    const recipient = "(?:einem Kollegen|einem Freund|einer Kollegin|einer Freundin|einem Team|den Kollegen)";
    const thing = "(?:einen Link|eine Nachricht|ein Dokument|ein Geschenk|ein Projekt|die Unterlagen)";
    const pairPattern = new RegExp(`\\b(?:schicke|sende|zeige|gebe)\\s+${recipient}\\s+${thing}\\b`, "gi");
    const pairs = text.match(pairPattern) || [];
    const results = {
      dative: new RegExp(`\\b${recipient}\\b`, "i").test(text),
      accusative: new RegExp(`\\b${thing}\\b`, "i").test(text),
      pairs: pairs.length >= 2,
      home: /\bzu Hause\b/.test(text)
    };
    const passed = checks.reduce((count, item) => {
      const ok = results[item.dataset.check];
      item.classList.toggle("pass", ok);
      return count + Number(ok);
    }, 0);
    checker.dataset.score = `${passed}/${checks.length}`;
    feedback.textContent = passed === checks.length
      ? "4/4 — zwei klare Wem-was-Paare und die Großschreibung stimmen."
      : `${passed}/4 — baue zwei Sätze als Verb + Wem? + Was? und prüfe „zu Hause“.`;
    feedback.className = `feedback ${passed === checks.length ? "good" : "try"}`;
  });
});

document.querySelectorAll("[data-ending-production]").forEach((checker) => {
  const input = checker.querySelector("textarea");
  const button = checker.querySelector("[data-check-production]");
  const feedback = checker.querySelector(".feedback");
  const checks = [...checker.querySelectorAll("[data-check]")];

  button?.addEventListener("click", () => {
    const text = input.value.trim();
    const recipient = "(?:einem Kollegen|einem Freund|einem Bruder|einem Team|einer Kollegin|einer Freundin|einer Schwester|einer Kundin)";
    const masculineThing = "(?:einen Bericht|einen Vertrag|einen Link|einen Termin|einen Apfel|einen Brief)";
    const neuterThing = "(?:ein Projekt|ein Dokument|ein Geschenk|ein Angebot|ein Buch)";
    const pairPattern = new RegExp(`\\b(?:schicke|sende|zeige|gebe|schenke)\\s+${recipient}\\s+(?:${masculineThing}|${neuterThing})\\b`, "gi");
    const results = {
      masculine: new RegExp(`\\b${masculineThing}\\b`, "i").test(text),
      neuter: new RegExp(`\\b${neuterThing}\\b`, "i").test(text),
      recipients: /\beinem\s+(Kollegen|Freund|Bruder|Team)\b/i.test(text) && /\beiner\s+(Kollegin|Freundin|Schwester|Kundin)\b/i.test(text),
      pairs: (text.match(pairPattern) || []).length >= 3
    };
    const passed = checks.reduce((count, item) => {
      const ok = results[item.dataset.check];
      item.classList.toggle("pass", ok);
      return count + Number(ok);
    }, 0);
    checker.dataset.score = `${passed}/${checks.length}`;
    feedback.textContent = passed === checks.length
      ? "4/4 — einen für maskulin, ein für neutral: sauber getrennt."
      : `${passed}/4 — prüfe zuerst den Grundartikel: der → einen, das → ein.`;
    feedback.className = `feedback ${passed === checks.length ? "good" : "try"}`;
  });
});

document.querySelectorAll("[data-passport-production]").forEach((checker) => {
  const input = checker.querySelector("textarea");
  const button = checker.querySelector("[data-check-production]");
  const feedback = checker.querySelector(".feedback");
  const checks = [...checker.querySelectorAll("[data-check]")];

  button?.addEventListener("click", () => {
    const text = input.value.trim();
    const recipientM = "(?:einem Bruder|einem Kollegen|einem Freund|einem Kunden)";
    const recipientF = "(?:einer Schwester|einer Kollegin|einer Freundin|einer Kundin)";
    const thingM = "(?:einen Apfel|einen Brief|einen Bericht|einen Vertrag|einen Link)";
    const thingN = "(?:ein Buch|ein Projekt|ein Dokument|ein Geschenk|ein Angebot)";
    const pairPattern = new RegExp(`\\b(?:gebe|schenke|sende|schicke|zeige)\\s+(?:${recipientM}|${recipientF})\\s+(?:${thingM}|${thingN})\\b`, "gi");
    const results = {
      recipientM: new RegExp(`\\b${recipientM}\\b`, "i").test(text),
      recipientF: new RegExp(`\\b${recipientF}\\b`, "i").test(text),
      objects: new RegExp(`\\b${thingM}\\b`, "i").test(text) && new RegExp(`\\b${thingN}\\b`, "i").test(text),
      pairs: (text.match(pairPattern) || []).length >= 3
    };
    const passed = checks.reduce((count, item) => {
      const ok = results[item.dataset.check];
      item.classList.toggle("pass", ok);
      return count + Number(ok);
    }, 0);
    checker.dataset.score = `${passed}/${checks.length}`;
    feedback.textContent = passed === checks.length
      ? "4/4 — alle Pässe, Rollen und Endungen stimmen."
      : `${passed}/4 — sage vor jeder Form den Grundartikel: der, die oder das?`;
    feedback.className = `feedback ${passed === checks.length ? "good" : "try"}`;
  });
});

document.querySelectorAll("[data-handover-production]").forEach((checker) => {
  const input = checker.querySelector("textarea");
  const button = checker.querySelector("[data-check-production]");
  const feedback = checker.querySelector(".feedback");
  const checks = [...checker.querySelectorAll("[data-check]")];

  button?.addEventListener("click", () => {
    const text = input.value.trim();
    const recipientM = "(?:einem Kollegen|einem Kunden|einem Freund|einem Chef)";
    const recipientF = "(?:einer Kollegin|einer Kundin|einer Freundin|einer Chefin)";
    const thingM = "(?:einen Kugelschreiber|einen Schlüssel|einen Vertrag|einen Bericht|einen Link)";
    const thingN = "(?:ein Buch|ein Formular|ein Angebot|ein Dokument|ein Paket)";
    const pairPattern = new RegExp(`\\b(?:gebe|schicke|sende|zeige|bringe)\\s+(?:${recipientM}|${recipientF})\\s+(?:${thingM}|${thingN})\\b`, "gi");
    const results = {
      three: (text.match(pairPattern) || []).length >= 3,
      recipients: new RegExp(`\\b${recipientM}\\b`, "i").test(text) && new RegExp(`\\b${recipientF}\\b`, "i").test(text),
      objects: new RegExp(`\\b${thingM}\\b`, "i").test(text) && new RegExp(`\\b${thingN}\\b`, "i").test(text),
      vocabulary: new Set((text.match(/Kugelschreiber|Schlüssel|Vertrag|Bericht|Link|Buch|Formular|Angebot|Dokument|Paket/gi) || []).map((word) => word.toLowerCase())).size >= 3
    };
    const passed = checks.reduce((count, item) => {
      const ok = results[item.dataset.check];
      item.classList.toggle("pass", ok);
      return count + Number(ok);
    }, 0);
    checker.dataset.score = `${passed}/${checks.length}`;
    feedback.textContent = passed === checks.length
      ? "4/4 — drei vollständige Übergaben. Lies sie jetzt in einem ruhigen Rhythmus laut."
      : `${passed}/4 — vervollständige alle drei Sätze; du brauchst einem, einer, einen und ein.`;
    feedback.className = `feedback ${passed === checks.length ? "good" : "try"}`;
  });
});

document.querySelectorAll("[data-copy-lesson]").forEach((section) => {
  const button = section.querySelector("[data-copy-button]");
  const status = section.querySelector(".copy-status");
  const output = section.querySelector("[data-copy-output]");
  const confidenceInput = document.querySelector("[data-confidence]");
  const confidenceValue = section.querySelector("[data-confidence-value]");
  confidenceInput?.addEventListener("input", () => {
    confidenceValue.textContent = confidenceInput.value;
  });
  button?.addEventListener("click", async () => {
    const lesson = section.dataset.lesson || "0004";
    const lab = document.querySelector(section.dataset.lab || "[data-article-lab]");
    const productionBox = document.querySelector(section.dataset.production || "[data-article-production]");
    const answerHeading = section.dataset.answerHeading || "ARTIKEL-ANTWORTEN";
    const productionHeading = section.dataset.productionHeading || "MEINE NACHRICHT";
    const nextFocus = section.dataset.nextFocus || "Übe weiter Artikel und nützlichen Wortschatz.";
    const articleAnswers = [...lab.querySelectorAll("[data-answer]")]
      .map((select) => `${select.dataset.prompt}: ${select.value || "—"}`)
      .join("\n");
    const production = productionBox.querySelector("textarea")?.value.trim() || "—";
    const confidence = document.querySelector("[data-confidence]")?.value || "—";
    const hardPart = document.querySelector("[data-hard-part]:checked")?.value || "—";
    const message = `Hallo! Ich habe Lektion ${lesson} abgeschlossen.\n\n${answerHeading}\n${articleAnswers}\nErgebnis: ${lab?.dataset.score || "noch nicht geprüft"}\n\n${productionHeading}\n${production}\nSchreib-Ergebnis: ${productionBox?.dataset.score || "noch nicht geprüft"}\n\nSELBSTEINSCHÄTZUNG\nSicherheit: ${confidence}/5\nAm schwierigsten: ${hardPart}\n\nBitte korrigiere meine Antworten kurz und erstelle danach die nächste interaktive Lektion passend zu meinen Fehlern. ${nextFocus}`;
    output.value = message;
    output.hidden = false;
    let copied = false;
    try {
      await navigator.clipboard.writeText(message);
      copied = true;
    } catch {
      output.select();
      copied = document.execCommand("copy");
    }
    status.textContent = copied
      ? "Kopiert! Füge den Text jetzt in unseren Chat ein."
      : "Der Lernbericht steht unten bereit. Markiere und kopiere ihn bitte manuell.";
    completeLesson(lesson);
  });
});
