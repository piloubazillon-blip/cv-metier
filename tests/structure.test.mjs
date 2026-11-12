import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync,existsSync} from "node:fs";
import vm from "node:vm";
const root=new URL("../",import.meta.url);
const read=path=>readFileSync(new URL(path,root),"utf8");
const profiles={};
vm.runInNewContext(read("metiers.js"),{window:{set CV_METIERS(value){profiles.entries=value}}});
test("all five careers have unique, valid labels, skills and copy",()=>{
 const data=profiles.entries;
 assert.equal(Object.keys(data).length,5);
 for(const [slug,profile] of Object.entries(data)){
  assert.ok(profile.title.length>4,slug);
  assert.ok(profile.skills.length>=8,slug);
  assert.ok(profile.defaultSkills.every(s=>profile.skills.includes(s)),slug);
  assert.notEqual(profile.beginner,profile.experienced,slug);
 }
});
test("landing pages contain unique meta, canonical and editor links",()=>{
 for(const [path,key] of [["cv-preparateur-commandes","preparateur-commandes"],["cv-vendeur","vendeur"],["cv-serveur","serveur"],["cv-aide-domicile","aide-domicile"],["cv-agent-entretien","agent-entretien"]]){
  const page=read(path+"/index.html");
  assert.match(page,/<meta name="description"/);
  assert.ok(page.includes('href="/?metier='+key+'#editeur"'));
  assert.ok(page.includes('href="https://cv-metier.pilou-bazillon.workers.dev/'+path+'/'));
  assert.ok(!page.includes("6,90 €")); // free launch
 }
});
test("homepage has career picker, free export, SEO navigation",()=>{
 const home=read("index.html");
 assert.match(home,/id="job-choice"/);
 assert.match(home,/id="export"/);
 assert.match(home,/metiers\.js/);
 assert.match(home,/Créer mon CV gratuitement/);
 const app=read("app.js");
 assert.match(app,/chooseCareer/);
 assert.match(app,/window\.print\(\)/);
});
test("Google sitemap and robots include all pages",()=>{
 const sitemap=read("sitemap.xml"),robots=read("robots.txt");
 for(const path of ["cv-preparateur-commandes","cv-vendeur","cv-serveur","cv-aide-domicile","cv-agent-entretien"]){
  assert.ok(sitemap.includes("/"+path+"/"));
 }
 assert.match(robots,/Sitemap:/);
});
