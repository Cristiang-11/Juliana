
document.addEventListener("DOMContentLoaded", () => {
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];

  const sections = $$(".section");
  const nav = $("#mainNav");
  const menuToggle = $("#menuToggle");

  // NAVEGACIÓN ENTRE LAS SECCIONES
  function showSection(id) {
    const target = document.getElementById(id);

    if (!target || !target.classList.contains("section")) {
      showToast("No se encontró esa sección.");
      return;
    }

    sections.forEach(section => {
      section.classList.toggle("active", section.id === id);
    });

    $$(".nav-button").forEach(button => {
      button.classList.toggle("active", button.dataset.page === id);
    });

    nav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  document.addEventListener("click", event => {
    const button = event.target.closest("[data-go], [data-page]");

    if (!button) return;

    event.preventDefault();
    showSection(button.dataset.go || button.dataset.page);
  });

  // MENÚ PARA CELULARES
  menuToggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(open));
  });

  // RAZONES POR LAS QUE DEISY JULIANA ES ESPECIAL
  const reasons = [
    "Tu forma de ser tiene una luz que hace más bonitos los días.",
    "Tu sonrisa puede convertir un momento sencillo en un recuerdo especial.",
    "Mereces que te quieran con sinceridad, respeto y ternura.",
    "Tu manera de ver el mundo te hace única.",
    "Incluso cuando dudas de ti, sigues teniendo un valor enorme.",
    "Tu presencia puede hacer que los días pesados se sientan más ligeros.",
    "Tienes sueños, ideas y cualidades que merecen ser celebrados.",
    "No necesitas ser perfecta para ser maravillosa.",
    "Hay algo especial en ser tú, y nadie podría hacerlo de la misma manera.",
    "Ojalá siempre encuentres motivos para sentir orgullo de ti misma."
  ];

  let reasonIndex = 0;

  function renderReason() {
    $("#reasonNumber").textContent =
      String(reasonIndex + 1).padStart(2, "0");

    $("#reasonText").textContent = reasons[reasonIndex];
  }

  $("#nextReason").addEventListener("click", () => {
    reasonIndex = (reasonIndex + 1) % reasons.length;
    renderReason();
    burstHearts(5);
  });

  $("#reasonGrid").innerHTML = reasons.slice(0, 6).map((reason, i) =>
    `<div class="reason-tile">
      <span>${["♡", "✦", "✧", "♥", "❀", "✨"][i]}</span>
      ${escapeHTML(reason)}
    </div>`
  ).join("");

  // MENSAJES
  const messages = [
    {
      title: "Si hoy fue un día difícil",
      text: "Respira un poquito. No tienes que resolverlo todo hoy. Mereces descansar y tratarte con la misma ternura que les das a los demás."
    },
    {
      title: "Para recordarte tu valor",
      text: "Tu valor no depende de cuánto logres, de cómo te veas ni de la opinión de otras personas. Eres valiosa simplemente por ser tú."
    },
    {
      title: "Un deseo bonito",
      text: "Deseo que la vida te sorprenda con oportunidades lindas, personas sinceras y momentos que te hagan pensar: qué bonito es estar aquí."
    },
    {
      title: "Cuando necesites una sonrisa",
      text: "Este pequeño rincón existe para recordarte que alguien quiso dedicar tiempo a crear algo pensando en ti. Ojalá te saque una sonrisa."
    },
    {
      title: "Nunca lo olvides",
      text: "No tienes que hacerlo todo perfecto. Puedes aprender, cambiar de opinión, equivocarte y volver a intentarlo. Sigue creyendo en ti."
    }
  ];

  let selectedMessage = 0;

  function setMessage(index) {
    selectedMessage = index;
    $("#messageText").textContent = messages[index].text;
    $("#copyStatus").textContent = "";

    $$(".message-choice").forEach((button, i) => {
      button.classList.toggle("active", i === index);
    });
  }

  $("#messageList").innerHTML = messages.map((message, i) =>
    `<button class="message-choice${i === 0 ? " active" : ""}"
      data-message="${i}">
      ${escapeHTML(message.title)} <span>↗</span>
    </button>`
  ).join("");

  $("#messageList").addEventListener("click", event => {
    const button = event.target.closest("[data-message]");

    if (button) {
      setMessage(Number(button.dataset.message));
    }
  });

  // COPIAR UN MENSAJE
  $("#copyMessage").addEventListener("click", async () => {
    const text = messages[selectedMessage].text;

    try {
      await navigator.clipboard.writeText(text);
      $("#copyStatus").textContent = "¡Mensaje copiado!";
    } catch {
      const area = document.createElement("textarea");
      area.value = text;
      document.body.appendChild(area);
      area.select();

      const copied = document.execCommand("copy");
      area.remove();

      $("#copyStatus").textContent = copied
        ? "¡Mensaje copiado!"
        : "Selecciona y copia el mensaje manualmente.";
    }
  });

  // JUEGO DE PREGUNTAS
  const questions = [
    {
      q: "¿Para quién se hizo esta página?",
      options: [
        "Deisy Juliana",
        "Una estrella de cine",
        "Un gato famoso"
      ],
      answer: 0,
      feedback: "¡Exacto! Todo este rinconcito es para ti. ♥"
    },
    {
      q: "¿Qué debes recordar siempre?",
      options: [
        "Que debes ser perfecta",
        "Que eres valiosa y especial",
        "Que nunca puedes descansar"
      ],
      answer: 1,
      feedback: "Así es: eres valiosa tal como eres. ✨"
    },
    {
      q: "¿Qué puedes hacer cuando quieras una sonrisa?",
      options: [
        "Volver a este pequeño rincón",
        "Olvidarte de ti",
        "Dejar de soñar"
      ],
      answer: 0,
      feedback: "¡Sí! Este detalle está aquí para recordarte cosas bonitas. 💗"
    }
  ];

  let questionIndex = 0;
  let answered = false;

  function renderQuestion() {
    const question = questions[questionIndex];
    answered = false;

    $("#quizCount").textContent =
      `Pregunta ${questionIndex + 1} de ${questions.length}`;

    $("#quizProgress").style.width =
      `${((questionIndex + 1) / questions.length) * 100}%`;

    $("#quizQuestion").textContent = question.q;
    $("#quizFeedback").textContent = "";
    $("#nextQuestion").disabled = true;

    $("#nextQuestion").textContent =
      questionIndex === questions.length - 1
        ? "Volver a empezar ↻"
        : "Siguiente pregunta →";

    $("#quizOptions").innerHTML = question.options.map((option, i) =>
      `<button class="quiz-option" data-answer="${i}">
        ${escapeHTML(option)}
      </button>`
    ).join("");
  }

  $("#quizOptions").addEventListener("click", event => {
    const button = event.target.closest("[data-answer]");

    if (!button || answered) return;

    answered = true;

    const question = questions[questionIndex];
    const answer = Number(button.dataset.answer);

    $$(".quiz-option").forEach((option, i) => {
      option.disabled = true;

      if (i === question.answer) {
        option.classList.add("correct");
      }

      if (i === answer && answer !== question.answer) {
        option.classList.add("wrong");
      }
    });

    $("#quizFeedback").textContent =
      answer === question.answer
        ? question.feedback
        : "Casi 💗. La respuesta correcta está marcada; ¡vamos a seguir!";

    $("#nextQuestion").disabled = false;
  });

  $("#nextQuestion").addEventListener("click", () => {
    if (!answered) return;

    if (questionIndex === questions.length - 1) {
      questionIndex = 0;
      renderQuestion();
      showToast("¡Juego reiniciado! Puedes jugar otra vez.");
    } else {
      questionIndex++;
      renderQuestion();
    }
  });

  renderQuestion();

  // SORPRESA SECRETA
  $("#unlockSecret").addEventListener("click", unlockSecret);

  $("#secretWord").addEventListener("keydown", event => {
    if (event.key === "Enter") {
      unlockSecret();
    }
  });

  function unlockSecret() {
    const word = $("#secretWord").value
      .trim()
      .toLocaleLowerCase("es")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    const accepted = [
      "juliana",
      "deisy",
      "deisy juliana",
      "amor",
      "sonrie",
      "especial"
    ];

    if (accepted.includes(word)) {
      $("#secretReveal").hidden = false;
      $("#secretFeedback").textContent = "¡Sorpresa desbloqueada!";
      $("#lockIcon").textContent = "🔓";
      burstHearts(20);
    } else {
      $("#secretFeedback").textContent =
        "Esa no es la palabra. Prueba con tu nombre o con «amor». 💗";

      $("#secretWord").focus();
    }
  }

  // LLUVIA DE CORAZONES
  $("#celebrateButton").addEventListener("click", () => {
    burstHearts(35);
    showToast("Un montón de cariño para ti, Deisy Juliana ♥");
  });

  // MENSAJE EMERGENTE
  function showToast(message) {
    const toast = $("#toast");

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(showToast.timer);

    showToast.timer = setTimeout(() => {
      toast.classList.remove("show");
    }, 2400);
  }

  // CREAR CORAZONES ANIMADOS
  function burstHearts(amount) {
    const symbols = ["♥", "♡", "✦", "💗"];

    for (let i = 0; i < amount; i++) {
      const particle = document.createElement("span");

      particle.className = "heart-particle";
      particle.textContent =
        symbols[Math.floor(Math.random() * symbols.length)];

      particle.style.left = `${Math.random() * 100}vw`;
      particle.style.top = `${55 + Math.random() * 40}vh`;
      particle.style.fontSize = `${14 + Math.random() * 20}px`;
      particle.style.animationDuration = `${1.5 + Math.random() * 1.5}s`;

      document.body.appendChild(particle);

      setTimeout(() => particle.remove(), 3200);
    }
  }

  // EVITAR QUE LOS TEXTOS GENEREN HTML ACCIDENTAL
  function escapeHTML(value) {
    return value.replace(/[&<>"']/g, char => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[char]));
  }

  renderReason();
  setMessage(0);
});
