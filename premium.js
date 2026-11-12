(() => {
  "use strict";
  const label = document.querySelector("#payment-result");
  const downloads = document.querySelector("#premium-downloads");
  const missing = document.querySelector("#missing-draft");
  const status = document.querySelector("#download-status");
  const sessionId = new URLSearchParams(location.search).get("session_id");
  let draft = null;

  async function init() {
    if(!sessionId || !/^cs_(test|live)_[a-zA-Z0-9]{10,256}$/.test(sessionId)) {
      label.textContent="Lien de paiement invalide. Aucun document n'est débloqué.";
      return;
    }
    try{
      const res=await fetch("/api/payment-status?session_id="+encodeURIComponent(sessionId),{cache:"no-store"});
      const data=await res.json();
      if(!res.ok || !data.paid) {
        label.textContent="Ce paiement n'a pas encore été confirmé. Aucun téléchargement premium n'est autorisé.";
        return;
      }
      label.textContent="Paiement de 4,99 € confirmé !";
      try {draft=JSON.parse(sessionStorage.getItem("cv_metier_premium_draft") || "null");}
      catch {draft=null;}
      if(!draft){missing.hidden=false;return;}
      downloads.hidden=false;
    }catch{label.textContent="Impossible de vérifier le paiement actuellement. Réessayez plus tard avec ce même lien.";}
  }
  async function download(type) {
    status.textContent="Préparation de votre fichier Word…";
    try {
      const fields={...draft,targetCompany:document.querySelector("#target-company").value};
      const res=await fetch("/api/premium-download",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({session_id:sessionId,type,fields})
      });
      if(!res.ok) throw new Error("Votre paiement n'a pas pu être vérifié. Aucun fichier délivré.");
      const blob=await res.blob();
      const url=URL.createObjectURL(blob);
      const link=document.createElement("a");
      link.href=url;link.download=type==="cv"?"cv-metier-modifiable.doc":"lettre-motivation-cv-metier.doc";
      document.body.append(link);link.click();link.remove();
      setTimeout(()=>URL.revokeObjectURL(url),30000);
      status.textContent="Téléchargement lancé. Ouvrez le fichier dans Word ou un logiciel compatible.";
    } catch(e){status.textContent=e.message;}
  }
  document.querySelector("#get-cv").addEventListener("click",()=>download("cv"));
  document.querySelector("#get-letter").addEventListener("click",()=>download("letter"));
  init();
})();