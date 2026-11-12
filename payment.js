(() => {
  "use strict";
  const button = document.querySelector("#buy-premium");
  const status = document.querySelector("#premium-status");
  const form = document.querySelector("#cv-form");
  if (!button || !form) return;
  let enabled = false;

  async function loadConfig() {
    try {
      const res = await fetch("/api/payment-config", {cache:"no-store"});
      if (!res.ok) throw new Error("unavailable");
      const cfg = await res.json();
      enabled = cfg.enabled === true && cfg.price_cents === 499;
      button.disabled = !enabled;
      status.textContent = enabled
        ? "Paiement de 4,99 € disponible : choisissez le pack quand votre CV est prêt."
        : "Le paiement sera disponible après activation de Stripe. Votre PDF reste gratuit.";
    } catch {
      button.disabled = true;
      status.textContent = "Le paiement n'est pas encore disponible. Votre PDF reste gratuit.";
    }
  }

  function gatherFields() {
    const data = new FormData(form);
    const fieldNames = ["firstName","lastName","jobTitle","city","phone","email","summary",
      "employer","pastRole","period","tasks","degree","school","graduation","extras"];
    const fields = {};
    fieldNames.forEach(k => fields[k] = String(data.get(k) || "").slice(0,850));
    fields.skills = [
      ...Array.from(document.querySelectorAll("#skills input[type=checkbox]:checked")).map(input => input.value),
      ...String(data.get("otherSkills") || "").split(/\r?\n/).map(x=>x.trim()).filter(Boolean)
    ].slice(0,20);
    return fields;
  }

  button.addEventListener("click", async () => {
    if(!enabled) return;
    const fields = gatherFields();
    if (!fields.firstName || !fields.lastName) {
      document.querySelector("#editeur").scrollIntoView({behavior:"smooth"});
      status.textContent="Renseignez votre prénom et votre nom dans le formulaire avant l'achat.";
      return;
    }
    if (!form.elements.email.checkValidity()) {
      form.elements.email.reportValidity();
      return;
    }
    button.disabled=true;
    status.textContent="Ouverture du paiement sécurisé…";
    // No personal information is sent to Stripe by this application.
    // Draft stays in sessionStorage only for the tab; it is never stored on our server.
    try {
      sessionStorage.setItem("cv_metier_premium_draft", JSON.stringify(fields));
      const res = await fetch("/api/checkout", {
        method:"POST", headers:{"Content-Type":"application/json"}, body:"{}"
      });
      const data = await res.json();
      if (!res.ok || !/^https:\/\/checkout\.stripe\.com\//.test(data.url||"")) {
        throw new Error(data.error || "Paiement momentanément indisponible.");
      }
      window.location.assign(data.url);
    } catch(err) {
      status.textContent=err.message || "Paiement momentanément indisponible.";
      button.disabled=false;
    }
  });
  loadConfig();
})();