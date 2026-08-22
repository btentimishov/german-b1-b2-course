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

document.querySelectorAll("[data-article-lab], [data-genus-lab], [data-context-lab], [data-case-lab], [data-ending-lab]").forEach((lab) => {
  const selects = [...lab.querySelectorAll("select[data-answer]")];
  const button = lab.querySelector("[data-check-articles]");
  const feedback = lab.querySelector(".feedback");
  const fill = lab.querySelector(".progress-fill");

  button?.addEventListener("click", () => {
    let score = 0;
    selects.forEach((select) => {
      const correct = select.value === select.dataset.answer;
      select.setAttribute("aria-invalid", String(!correct));
      select.style.borderColor = correct ? "var(--green)" : "var(--accent)";
      if (correct) score += 1;
    });
    lab.dataset.score = `${score}/${selects.length}`;
    fill.style.width = `${(score / selects.length) * 100}%`;
    feedback.textContent = score === selects.length
      ? `${score}/${selects.length} — stark! Alle Artikel sitzen.`
      : `${score}/${selects.length} — die roten Felder brauchen noch einen Versuch.`;
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
    const articleAnswers = [...lab.querySelectorAll("select[data-answer]")]
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
  });
});
