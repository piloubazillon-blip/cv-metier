// CV MÉTIER · Stripe Checkout et documents premium (4,99 €).
// Aucun paiement possible tant que STRIPE_SECRET_KEY et PAYMENTS_ENABLED ne sont pas configurés.
const AMOUNT = 499;
const PRODUCT = "cv_metier_premium_499_v1";
const NO_CACHE = {"Cache-Control":"no-store","X-Content-Type-Options":"nosniff"};
const json = (data, status=200) => new Response(JSON.stringify(data), {status, headers:{...NO_CACHE,"Content-Type":"application/json; charset=utf-8"}});
const available = env => env.PAYMENTS_ENABLED === "true" && !!env.STRIPE_SECRET_KEY && /^sk_(test|live)_/.test(env.STRIPE_SECRET_KEY);
const safe = (v, len=500) => String(v ?? "").slice(0,len).replace(/[\u0000-\u001f\u007f]/g," ").trim();
const esc = x => safe(x,1200).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;");
const rootURL = req => new URL(req.url).origin;
const stripe = async (env, resource, options={}) => {
  const res = await fetch("https://api.stripe.com/v1/" + resource, { ...options,
    headers:{ Authorization:"Bearer " + env.STRIPE_SECRET_KEY, ...(options.headers||{}) }});
  if (!res.ok) throw new Error("Stripe a renvoyé " + res.status);
  return res.json();
};
const isPaid = async (env, sessionId) => {
  if (!/^cs_(test|live)_[A-Za-z0-9]{10,256}$/.test(sessionId||"")) return false;
  const s = await stripe(env, "checkout/sessions/" + encodeURIComponent(sessionId));
  return s.object==="checkout.session" && s.status==="complete" &&
    s.mode==="payment" && s.payment_status==="paid" && s.currency==="eur" &&
    s.amount_total===AMOUNT && s.metadata?.product===PRODUCT;
};
const clampLines = (v, n=12) => String(v||"").split(/\r?\n/).map(x=>safe(x,150)).filter(Boolean).slice(0,n);
const wordDoc = (fields, type) => {
  const name = [safe(fields.firstName,60),safe(fields.lastName,60)].filter(Boolean).join(" ") || "Nom à compléter";
  const job = safe(fields.jobTitle,120) || "Poste recherché";
  const company = safe(fields.targetCompany,100);
  const summary = safe(fields.summary,700);
  const contact = [fields.city,fields.phone,fields.email].filter(Boolean).map(esc).join(" · ");
  const tasks = clampLines(fields.tasks);
  const skills = Array.isArray(fields.skills) ? fields.skills.slice(0,20).map(s=>safe(s,100)).filter(Boolean) : [];
  const title = type==="letter" ? "Lettre de motivation" : "CV modifiable";
  let inner;
  if(type==="letter") {
    inner = '<p style="text-align:right">' + esc(fields.city || "Ville") + ', le ' +
      esc(new Intl.DateTimeFormat("fr-FR",{dateStyle:"long",timeZone:"Europe/Paris"}).format(new Date())) + '</p>' +
      '<p>' + (company ? 'À l’attention de ' + esc(company) : 'À l’attention du service recrutement') + '</p>' +
      '<p><strong>Objet : Candidature au poste de ' + esc(job) + '</strong></p>' +
      '<p>Madame, Monsieur,</p>' +
      '<p>Je vous présente ma candidature pour le poste de ' + esc(job) + '.</p>' +
      (summary ? '<p>' + esc(summary) + '</p>' : '<p>Je souhaite mettre mes qualités et ma motivation au service de votre équipe.</p>') +
      (tasks.length ? '<p>Mon parcours comprend notamment : ' + tasks.map(esc).join(' ; ') + '.</p>' : '') +
      '<p>Je serais heureux de pouvoir échanger avec vous au sujet de cette candidature.</p>' +
      '<p>Je vous prie d’agréer, Madame, Monsieur, mes salutations distinguées.</p><p>' + esc(name) + '</p>';
  } else {
    inner = '<h2>' + esc(job) + '</h2>' +
      (summary ? '<h3>Profil</h3><p>' + esc(summary) + '</p>' : '') +
      ([fields.employer,fields.pastRole,fields.period].some(Boolean)||tasks.length ? '<h3>Expérience</h3><p><strong>' + [fields.pastRole,fields.employer,fields.period].filter(Boolean).map(esc).join(' · ') + '</strong></p><ul>' + tasks.map(s=>'<li>'+esc(s)+'</li>').join('') + '</ul>' : '') +
      ([fields.degree,fields.school,fields.graduation].some(Boolean) ? '<h3>Formation</h3><p>' + [fields.degree,fields.school,fields.graduation].filter(Boolean).map(esc).join(' · ') + '</p>' : '') +
      (skills.length ? '<h3>Compétences</h3><ul>' + skills.map(s=>'<li>'+esc(s)+'</li>').join('') + '</ul>' : '') +
      (fields.extras ? '<h3>Informations complémentaires</h3><p>'+esc(fields.extras)+'</p>' : '');
  }
  return '<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>' + esc(title) + '</title><style>@page{size:A4;margin:20mm}body{font-family:Arial,sans-serif;color:#20364b;font-size:12pt;line-height:1.55;max-width:175mm;margin:15mm auto}h1{font-size:23pt;margin-bottom:2pt}h2,h3{color:#0c8766}h2{font-size:14pt}h3{font-size:12pt;margin-top:18pt}.contact{font-size:10pt;color:#657688}p{margin:12pt 0}</style></head><body><h1>' + esc(name) + '</h1><p class="contact">' + contact + '</p>' + inner + '</body></html>';
};
export default {
 async fetch(request, env) {
   const url = new URL(request.url);
   if (!url.pathname.startsWith("/api/")) return env.ASSETS.fetch(request);
   if (url.pathname==="/api/payment-config" && request.method==="GET")
     return json({ enabled:available(env), price_cents:AMOUNT, currency:"eur" });
   if (url.pathname==="/api/checkout" && request.method==="POST") {
     if (!available(env)) return json({error:"Le paiement n'est pas encore activé."},503);
     if (request.headers.get("Origin")!==rootURL(request)) return json({error:"Origine non autorisée."},403);
     try {
       const origin=rootURL(request);
       const params=new URLSearchParams({
         mode:"payment",
         "line_items[0][price_data][currency]":"eur",
         "line_items[0][price_data][unit_amount]":String(AMOUNT),
         "line_items[0][price_data][product_data][name]":"Pack Premium CV MÉTIER",
         "line_items[0][price_data][product_data][description]":"CV modifiable + lettre de motivation personnalisable",
         "line_items[0][quantity]":"1",
         "metadata[product]":PRODUCT,
         success_url:origin+"/premium.html?session_id={CHECKOUT_SESSION_ID}",
         cancel_url:origin+"/#premium",
         "billing_address_collection":"auto"
       });
       const session=await stripe(env,"checkout/sessions",{
         method:"POST",
         headers:{"Content-Type":"application/x-www-form-urlencoded","Idempotency-Key":crypto.randomUUID()},
         body:params
       });
       if (!session.url || !session.url.startsWith("https://checkout.stripe.com/")) throw new Error("Invalid URL");
       return json({url:session.url});
     } catch {return json({error:"Impossible de lancer le paiement pour le moment."},502);}
   }
   if (url.pathname==="/api/payment-status" && request.method==="GET") {
     if (!available(env)) return json({paid:false});
     try {return json({paid:await isPaid(env,url.searchParams.get("session_id"))});}
     catch {return json({paid:false,error:"Vérification temporairement indisponible."},502);}
   }
   if (url.pathname==="/api/premium-download" && request.method==="POST") {
     if (!available(env)) return json({error:"Paiement non disponible"},503);
     if (request.headers.get("Origin")!==rootURL(request)) return json({error:"Origine non autorisée"},403);
     if (Number(request.headers.get("Content-Length")||0)>18000) return json({error:"Document trop volumineux"},413);
     try {
       const data=await request.json();
       if (!data || !["cv","letter"].includes(data.type)) return json({error:"Type invalide"},400);
       if (!(await isPaid(env,data.session_id))) return json({error:"Paiement non confirmé"},403);
       const html=wordDoc(data.fields||{},data.type);
       return new Response(html,{status:200,headers:{
         ...NO_CACHE,
         "Content-Type":"application/msword; charset=utf-8",
         "Content-Disposition":'attachment; filename="cv-metier-'+data.type+'.doc"',
         "X-Robots-Tag":"noindex"
       }});
     }catch{return json({error:"Téléchargement indisponible"},400);}
   }
   return json({error:"API introuvable"},404);
 }
};
