(() => {
  "use strict";
  const form = document.querySelector("#cv-form");
  const panels = [...document.querySelectorAll(".form-panel")];
  const steps = [...document.querySelectorAll(".step")];
  const stepCounter = document.querySelector("#step-counter");
  const previous = document.querySelector("#previous");
  const next = document.querySelector("#next");
  const skillInputs = [...document.querySelectorAll("#skills input[type=checkbox]")];
  const cv = document.querySelector("#cv-preview");
  let currentStep = 0;

  const value = (name) => (new FormData(form).get(name) || "").toString().trim();
  const text = (id, content) => { document.getElementById(id).textContent = content; };
  const lines = (data) => data.split(/\r?\n/).map(line => line.trim()).filter(Boolean).slice(0, 12);

  function makeList(el, items) {
    el.replaceChildren();
    items.forEach(item => { const li = document.createElement("li"); li.textContent = item; el.append(li); });
  }

  function update() {
    const fullName = [value("firstName"), value("lastName")].filter(Boolean).join(" ");
    text("out-name", fullName ? fullName.toLocaleUpperCase("fr") : "VOTRE PRÉNOM NOM");
    text("out-job", (value("jobTitle") || "Préparateur de commandes").toLocaleUpperCase("fr"));
    text("out-contact", [value("city"), value("phone"), value("email")].filter(Boolean).join("  ·  "));

    const summary = value("summary");
    text("out-summary", summary || "Votre présentation apparaîtra ici. Renseignez votre profil ou utilisez notre proposition de formulation.");
    document.getElementById("out-summary").classList.toggle("placeholder-text", !summary);

    const employer = value("employer"), role = value("pastRole"), period = value("period"), tasks = lines(value("tasks"));
    const hasWork = !!(employer || role || period || tasks.length);
    document.getElementById("sec-experience").hidden = !hasWork;
    text("out-position", [role, employer].filter(Boolean).join(" — ") || "Expérience professionnelle");
    text("out-period", period);
    makeList(document.getElementById("out-tasks"), tasks);

    const degree = value("degree"), school = value("school"), graduation = value("graduation");
    document.getElementById("sec-education").hidden = !(degree || school || graduation);
    text("out-degree", degree);
    text("out-school", [school, graduation].filter(Boolean).join(" · "));

    const skills = [...skillInputs.filter(input => input.checked).map(input => input.value), ...lines(value("otherSkills"))].slice(0, 14);
    document.getElementById("sec-skills").hidden = skills.length === 0;
    makeList(document.getElementById("out-skills"), skills);

    const extras = value("extras");
    document.getElementById("sec-extras").hidden = !extras;
    text("out-extras", extras);
    cv.className = "cv-paper theme-" + (value("theme") || "classic");
  }

  function setStep(index) {
    currentStep = Math.max(0, Math.min(index, panels.length - 1));
    panels.forEach((panel, i) => panel.hidden = i !== currentStep);
    steps.forEach((step, i) => {
      step.classList.toggle("current", i === currentStep);
      if (i === currentStep) step.setAttribute("aria-current", "step");
      else step.removeAttribute("aria-current");
    });
    previous.disabled = currentStep === 0;
    next.hidden = currentStep === panels.length - 1;
    stepCounter.textContent = `Étape ${currentStep + 1} sur ${panels.length}`;
  }

  function suggestSummary() {
    const beginner = value("experienceLevel") !== "experienced";
    const job = (value("jobTitle") || "préparateur de commandes").toLocaleLowerCase("fr");
    form.elements.summary.value = beginner
      ? `Candidat motivé pour un poste de ${job}, souhaitant mettre à profit son sens de l'organisation, sa rigueur et sa capacité à travailler en équipe. Prêt à apprendre les procédures de préparation et de contrôle des commandes.`
      : `Professionnel du secteur logistique recherchant un poste de ${job}. Habitué à organiser son travail et à respecter les consignes de préparation, de qualité et de sécurité. Soucieux de contribuer à la fiabilité des opérations.`;
    update();
  }

  function printCV() {
    update();
    const name = [value("firstName"), value("lastName")].filter(Boolean).join(" ");
    if (!name) {
      setStep(0);
      form.elements.firstName.focus();
      alert("Renseignez au moins votre prénom et votre nom avant d'exporter votre CV.");
      return;
    }
    window.print();
  }

  form.addEventListener("input", update);
  form.addEventListener("change", update);
  form.addEventListener("submit", event => event.preventDefault());
  document.querySelector("#suggest-summary").addEventListener("click", suggestSummary);
  document.querySelector("#print-top").addEventListener("click", printCV);
  document.querySelector("#export").addEventListener("click", printCV);
  document.querySelector("#reset").addEventListener("click", () => {
    if (!confirm("Voulez-vous effacer toutes les informations renseignées dans ce formulaire ?")) return;
    form.reset();
    form.elements.jobTitle.value = "Préparateur de commandes";
    setStep(0);
    update();
  });
  previous.addEventListener("click", () => setStep(currentStep - 1));
  next.addEventListener("click", () => {
    if (currentStep === 0 && form.elements.email.value && !form.elements.email.validity.valid) {
      form.elements.email.reportValidity();
      return;
    }
    setStep(currentStep + 1);
  });
  steps.forEach((step, i) => step.addEventListener("click", () => setStep(i)));
  update();
  setStep(0);
})();
