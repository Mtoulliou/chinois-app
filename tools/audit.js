/* Audit du contenu de l'app. Exécuté DANS la page par tools/run-audit.sh (ne pas l'inclure dans index.html).
   Affiche des lignes OK / AVERT / ERREUR. Toute ERREUR doit être corrigée avant de livrer. */
(function(){
const R=[];
const err=m=>R.push("ERREUR: "+m),warn=m=>R.push("AVERT: "+m),ok=m=>R.push("OK: "+m);
const chk=(name,f)=>{try{f()}catch(e){err(name+" a planté : "+e.message+" ("+(e.stack||"").split("\n")[1]+")")}};
const uniq=a=>[...new Set(a)];
const HAN=/[㐀-鿿]/;

/* 1. Structure des données */
chk("données",()=>{
  const seen={},dup=[];V.forEach(v=>{if(seen[v.id])dup.push(v.id);seen[v.id]=1});
  dup.length?err("identifiants en double (un mot ou une phrase défini deux fois, ou même zh) : "+uniq(dup).join(" ")):ok("identifiants uniques ("+V.length+" éléments, "+V.filter(v=>v.t==="w").length+" mots, "+V.filter(v=>v.t==="p").length+" phrases)");
  const bad=[];
  V.forEach(v=>{
    if(!THEMES.includes(v.th))bad.push(v.zh[0]+" : thème inconnu "+v.th);
    if(!v.zh.every(z=>z&&HAN.test(z)))bad.push(v.zh[0]+" : zh vide ou sans caractère chinois");
    if(!v.py.every(p=>p&&p.trim()&&!HAN.test(p)))bad.push(v.zh[0]+" : pinyin vide ou contenant du chinois");
    if(!v.fr.every(f=>f&&f.trim()))bad.push(v.zh[0]+" : traduction vide");
    if(v.zh.length>1&&v.py.length!==v.zh.length)bad.push(v.zh[0]+" : "+v.zh.length+" écritures mais "+v.py.length+" pinyin (séparer par | dans le même ordre)");
    if(v.zh.some(z=>z!==z.trim())||v.py.some(p=>p!==p.trim())||v.fr.some(f=>f!==f.trim()))bad.push(v.zh[0]+" : espace en début ou fin de variante");
  });
  bad.length?err("données mal formées : "+bad.slice(0,15).join(" ; ")+(bad.length>15?" …":"")):ok("champs zh / py / fr valides");
});

/* 2. Leçons, thèmes, mini-cours, compétences */
chk("leçons",()=>{
  const ids=LESSONS.map(l=>l.id),all=LESSONS.flatMap(l=>l.themes);
  if(new Set(ids).size!==ids.length)err("identifiants de leçon en double");
  if(new Set(all).size!==all.length)err("thème présent dans deux leçons : "+uniq(all.filter((t,i)=>all.indexOf(t)!==i)).join(", "));
  const empty=all.filter(t=>!V.some(v=>v.th===t)&&!TEMPLATES.some(x=>x.th===t));
  empty.length?err("thèmes sans aucun contenu (ni mot, ni phrase, ni générateur) : "+empty.join(", ")):ok(LESSONS.length+" leçons, "+all.length+" thèmes, tous avec du contenu");
  const noRule=all.filter(t=>!RULES[t]||!RULES[t].length),noCan=all.filter(t=>!CANDO[t]),noCanL=LESSONS.filter(l=>!CANDO_L[l.id]).map(l=>l.id);
  noRule.length?err("RULES (mini-cours) manquantes pour : "+noRule.join(", ")):ok("mini-cours présent pour chaque thème");
  noCan.length?err("CANDO (« Tu sais maintenant… ») manquant pour : "+noCan.join(", ")):ok("compétence présente pour chaque thème");
  noCanL.length?err("CANDO_L manquant pour les leçons : "+noCanL.join(", ")):ok("compétence présente pour chaque leçon");
  const extra=Object.keys(RULES).filter(t=>!all.includes(t)).concat(Object.keys(CANDO).filter(t=>!all.includes(t)));
  extra.length?warn("RULES/CANDO pour des thèmes qui n'existent pas : "+uniq(extra).join(", ")):0;
});

/* 2b. Fiches d'exception : thème d'apparition cohérent, aucune apparition plus tôt */
chk("exceptions",()=>{
  const ths=LESSONS.flatMap(l=>l.themes),bad=[];
  EXC.forEach(e=>{
    const t=EXC_TH[e.id];
    if(!t||!ths.includes(t)){bad.push(e.id+" : thème "+t+" inconnu");return}
    const early=V.filter(v=>ths.indexOf(v.th)<ths.indexOf(t)&&itemExc(v).includes(e.id));
    if(early.length)bad.push(e.id+" apparaît avant « "+t+" » : "+early[0].zh[0]);
    if(!V.some(v=>itemExc(v).includes(e.id))&&e.id!=="bu")bad.push(e.id+" : aucun élément ne le déclenche");
  });
  bad.length?err("fiches d'exception : "+bad.join(" ; ")):ok(EXC.length+" fiches d'exception cohérentes avec le parcours");
});

/* 3. Générateurs de phrases */
chk("générateurs",()=>{
  const bad=[];
  TEMPLATES.forEach((t,k)=>{
    if(!THEMES.includes(t.th)){bad.push("gabarit "+k+" : thème inconnu "+t.th);return}
    if(typeof t.make!=="function"||!Array.isArray(t.subj)||!t.subj.length){bad.push("gabarit "+k+" ("+t.th+") : make ou subj manquant");return}
    t.subj.forEach(si=>{for(let n=0;n<12;n++){try{const o=t.make(SUBJ[si],{});
      if(!o||typeof o.zh!=="string"||typeof o.py!=="string"||!Array.isArray(o.fr)||!o.fr.length||o.fr.some(f=>typeof f!=="string"||!f.trim()))throw new Error("zh, py ou fr invalide");
      if(!HAN.test(o.zh))throw new Error("zh sans caractère chinois")}catch(e){bad.push("gabarit "+k+" ("+t.th+", sujet "+si+") : "+e.message);return}}});
  });
  bad.length?err("générateurs en défaut : "+uniq(bad).slice(0,10).join(" ; ")):ok(TEMPLATES.length+" gabarits de phrases valides");
  // correction : la réponse canonique d'une phrase générée doit être jugée juste
  let n=0,fails=[];
  THEMES.forEach(th=>{if(!TEMPLATES.some(t=>t.th===th))return;let g=0;
    for(let i=0;i<40;i++){const it=genOne([th],TEMPLATES.some(t=>t.th===th&&!t.kind)?undefined:"w");if(!it||!it.gen)continue;g++;n++;
      const a=gradePy(toMarks(it.py[0]),acceptedItems(it,1)),b=gradeFr(it.fr[0],acceptedItems(it,3));
      if(a.s!==1||b.s!==1)fails.push(th+" : "+it.zh[0]+" (pinyin "+a.s+", français "+b.s+")")}
    if(TEMPLATES.some(t=>t.th===th&&!t.kind)&&g<15)warn("générateur appauvri pour « "+th+" » : "+g+"/40 phrases acceptées (mots des listes non enseignés avant ce thème ?)")});
  fails.length?err("phrases générées non acceptées avec leur propre réponse : "+uniq(fails).slice(0,8).join(" ; ")):ok(n+" phrases générées jugées justes avec leur réponse canonique");
  // listes des générateurs : chaque entrée doit être un mot enseigné quelque part
  const all=new Set();V.forEach(v=>{if(v.t==="w")v.zh.forEach(z=>all.add(z))});
  const miss=[];[["ACTS",typeof ACTS!=="undefined"&&ACTS],["FOODS",typeof FOODS!=="undefined"&&FOODS],["DRINKS",typeof DRINKS!=="undefined"&&DRINKS],["FAM",typeof FAM!=="undefined"&&FAM],["LANGS",typeof LANGS!=="undefined"&&LANGS]].forEach(([nm,arr])=>{
    (arr||[]).forEach(e=>{if(e&&typeof e.zh==="string"&&segmentWords(all,e.zh).unk.length)miss.push(nm+":"+e.zh)})});
  miss.length?warn("entrées de listes de générateur absentes du vocabulaire (W) : "+miss.join(" ")):ok("listes des générateurs couvertes par le vocabulaire");
});

/* 4. Chapitres, groupes et séries */
chk("séries",()=>{
  const bad=[],warnA=[];let nSer=0;
  const allThemes=new Set();
  LESSONS.forEach(l=>chaptersOf(l).forEach(ch=>{
    ch.themes.forEach(t=>{if(allThemes.has(t))bad.push("thème dans deux chapitres : "+t);allThemes.add(t)});
    const ids=ch.groups.flat().map(v=>v.id).join("|");
    if(ids!==ch.words.map(v=>v.id).join("|"))bad.push(ch.name+" : les groupes ne couvrent pas exactement les mots du chapitre");
    if(ch.groups.some(g=>g.length>MAX_GROUP||g.length<1))bad.push(ch.name+" : groupe de taille invalide");
    if(ch.series.length!==3*ch.groups.length+2)bad.push(ch.name+" : "+ch.series.length+" séries au lieu de "+(3*ch.groups.length+2));
    if(ch.words.length&&ch.words.length<MIN_CHAPTER&&chaptersOf(l).length>1)bad.push(ch.name+" : chapitre de moins de "+MIN_CHAPTER+" mots non fusionné");
    nSer+=ch.series.length;
    ch.series.forEach((S,i)=>{for(let r=0;r<4;r++){
      let qs;try{qs=buildSer(ch,i)}catch(e){bad.push(ch.name+" "+S.id+" : "+e.message);break}
      if(qs.length!==SER_LEN)bad.push(ch.name+" "+S.id+" : "+qs.length+" questions au lieu de "+SER_LEN);
      qs.forEach(q=>{
        const it=IT(q.id);if(!it){bad.push(ch.name+" "+S.id+" : question sur un élément inconnu");return}
        if(q.ex==="qcm"&&(!q.opts.includes(it.fr[0])||![2,4].includes(q.opts.length)||new Set(q.opts).size!==q.opts.length))bad.push(ch.name+" "+S.id+" : QCM mal formé pour "+it.zh[0]);
        if(q.ex==="qcmr"&&(!q.opts.includes(it.py[0])||![2,4].includes(q.opts.length)||new Set(q.opts).size!==q.opts.length))bad.push(ch.name+" "+S.id+" : QCM inverse mal formé pour "+it.zh[0]);
        if(q.ex==="qton"){const tl=pyToneless(it.py[0]);if(!q.opts.includes(it.py[0])||![2,4].includes(q.opts.length)||q.opts.some(o=>pyToneless(o)!==tl)||new Set(q.opts).size!==q.opts.length)bad.push(ch.name+" "+S.id+" : QCM de ton mal formé pour "+it.py[0])}
      });
      if(S.kind==="a1"){const q2=qs.filter(q=>(q.ex==="qcm"||q.ex==="qcmr")&&q.opts.length===2);if(ch.groups[S.g].some(v=>!q2.some(q=>q.id===v.id)))bad.push(ch.name+" "+S.id+" : un mot du groupe n'est pas présenté en QCM à 2 choix")}
      if(S.kind==="phr"&&qs.filter(q=>q.ex==="qcm").length!==8)bad.push(ch.name+" phrases : le nombre de QCM n'est pas 8");
    }});
    const phr=themePhrases(ch.themes,ch.words,SER_LEN).length;
    if(phr<10)warnA.push(ch.name+" ("+phr+" phrases)");
  }));
  bad.length?err("chapitres ou séries défectueux : "+uniq(bad).slice(0,10).join(" ; ")):ok(nSer+" séries construites (20 questions chacune) pour "+LESSONS.reduce((n,l)=>n+chaptersOf(l).length,0)+" chapitres");
  warnA.length?warn("peu de phrases pour la série Phrases (complétée par des mots) : "+warnA.join(", ")):ok("assez de phrases pour chaque série Phrases");
  const tiny=THEMES.filter(t=>ownWords(t).length>0&&ownWords(t).length<3);if(tiny.length)warn("thèmes de moins de 3 mots : "+tiny.join(", "));
});

/* 5. RÈGLE IMPÉRATIVE : tout mot d'une phrase a été enseigné plus haut */
chk("mots enseignés",()=>{
  const ex=V.filter(v=>v.t==="p"&&!phraseOk(v,v.th)).map(v=>{
    const d=new Set();THEMES.forEach(t=>{if(themeIdx(t)<=themeIdx(v.th))ownWords(t).forEach(w=>w.zh.forEach(z=>d.add(z)))});
    return v.zh[0]+" [mot(s) non enseigné(s) : "+segmentWords(d,v.zh[0]).unk.join("+")+"]"});
  ex.length?err("phrases du cours contenant des mots jamais enseignés avant leur thème (ajouter ces mots en W dans ce thème ou un thème précédent) : "+ex.join(" ; ")):ok("toutes les phrases du cours n'utilisent que des mots enseignés");
  // séries de phrases réellement construites : dictionnaire = mots des groupes des chapitres jusqu'au chapitre courant
  const viol=[];let n=0;const dict=new Set();
  LESSONS.forEach(l=>chaptersOf(l).forEach(ch=>{
    ch.words.forEach(w=>w.zh.forEach(z=>dict.add(z)));
    const pi=ch.series.findIndex(S=>S.kind==="phr");
    for(let r=0;r<20;r++)buildSer(ch,pi).forEach(q=>{const it=IT(q.id);if(!it||it.t!=="p")return;n++;const u=segmentWords(dict,it.zh[0]).unk;if(u.length)viol.push(ch.name+" : "+it.zh[0]+" ["+u.join("+")+"]")});
  }));
  viol.length?err("série Phrases avec un mot non enseigné : "+uniq(viol).slice(0,8).join(" ; ")):ok(n+" phrases de séries Phrases testées : aucun mot non enseigné");
  // contrôles de leçon : taille et mots
  const cv=[],sz=[];LESSONS.forEach((l,li)=>{const d=new Set();THEMES.forEach(t=>{if(LESSONS.indexOf(LESSON_OF[t])<=li)ownWords(t).forEach(w=>w.zh.forEach(z=>d.add(z)))});
    const expect=chaptersOf(l).reduce((a,c)=>a+c.words.length,0)<=45?30:40;
    for(let r=0;r<10;r++){const q=buildCtl(l);if(q.length!==expect)sz.push(l.n+" : "+q.length+" questions au lieu de "+expect);
      if(chaptersOf(l).some(c=>!q.some(x=>c.themes.includes(IT(x.id).th))))sz.push(l.n+" : un chapitre n'a aucune question au contrôle");
      q.forEach(x=>{const it=IT(x.id);if(!it)return;const u=segmentWords(d,it.zh[0]).unk;if(u.length)cv.push(l.n+" : "+it.zh[0]+" ["+u.join("+")+"]")})}});
  sz.length?err("contrôle de leçon mal dimensionné : "+uniq(sz).slice(0,5).join(" ; ")):ok("contrôles de leçon : 30 questions (jusqu'à 45 mots) ou 40, au moins 1 question par chapitre");
  cv.length?err("contrôle de leçon avec un mot non enseigné : "+uniq(cv).slice(0,6).join(" ; ")):ok("contrôles de leçon : aucun mot non enseigné");
  // un mot enseigné après un thème dont une phrase le contient
  const late=[];V.filter(v=>v.t==="w").forEach(w=>{const wi=themeIdx(w.th);V.filter(p=>p.t==="p"&&themeIdx(p.th)<wi&&w.zh.some(z=>p.zh[0].includes(z)&&z.length>1)).slice(0,1).forEach(p=>late.push(w.zh[0]+" (thème "+w.th+") apparaît déjà dans la phrase « "+p.zh[0]+" » du thème « "+p.th+" »"))});
  late.length?warn("mot enseigné après un thème dont une phrase le contient (peut être normal si la phrase le décompose autrement) : "+late.slice(0,5).join(" ; ")):0;
});

/* 6. Séries, contrôles, export */
chk("séries",()=>{
  let e=0;LESSONS.forEach(l=>{for(let r=0;r<4;r++){try{const q=buildCtl(l);if(q.length<16)warn("contrôle de « "+l.n+" » court : "+q.length+" questions")}catch(x){e++}}});
  for(let i=0;i<6;i++){try{buildSeries()}catch(x){e++}}
  e?err(e+" construction(s) de contrôle ou de série en échec"):ok("contrôles et séries se construisent");
});
chk("export",()=>{
  const keep=JSON.stringify(state);
  state.ser={"Langues":{g1a:100}};state.days={"2026-01-01":1};state.srs={};state.fx={vib:false};
  const code=exportCode();importCode(code);
  const okk=state.ser.Langues&&state.ser.Langues.g1a===100&&state.days["2026-01-01"]===1&&state.fx.vib===false&&state.lvVer===3;
  state=Object.assign(freshState(),JSON.parse(keep));
  okk?ok("export / import conservent séries, flamme, révision, réglages"):err("export / import perdent un champ (ajouter les nouveaux champs d'état à exportCode et importCode)");
});

/* 6bis. Barre de tons : un accent par syllabe, les précédents sont conservés */
chk("barre de tons",()=>{
  const inp=document.createElement("input");document.body.appendChild(inp);
  const run=seq=>{inp.value="";inp.setSelectionRange(0,0);for(const a of seq){if(typeof a==="number")applyTone(inp,a);else{const p=inp.selectionStart;inp.value=inp.value.slice(0,p)+a+inp.value.slice(p);inp.setSelectionRange(p+a.length,p+a.length)}}return inp.value.normalize("NFC")};
  const cases=[[["zai",4,"jian",4],"zàijiàn"],[["zàijian",4],"zàijiàn"],[["zai",4,"jian",4,2],"zàijián"],[["ni",3,"hao",3],"nǐhǎo"],[["wo",3,"men"],"wǒmen"],[["xie",4,"xie",4],"xièxiè"],[["lv",4],"lǜ"],[["xi",1,"'an",4],"xī'àn"]];
  const bad=cases.filter(([seq,exp])=>run(seq)!==exp.normalize("NFC")).map(([seq,exp])=>JSON.stringify(seq)+" -> "+run(seq)+" (attendu "+exp+")");
  inp.remove();
  const m=[["zai4jian4","zàijiàn"],["mei2you3","méiyǒu"]].filter(([x,e])=>toMarks(x)!==e.normalize("NFC")).map(([x])=>"toMarks "+x);
  bad.concat(m).length?err("barre de tons ou saisie avec chiffres en défaut : "+bad.concat(m).join(" ; ")):ok("barre de tons : plusieurs accents dans un même mot, saisie avec chiffres correcte");
});

/* 7. Caractères : données de tracé */
chk("tracé",()=>{
  const miss=[];V.filter(v=>v.t==="w").forEach(v=>{const z=v.zh[0];if(!HAN_RE.test(z))return;[...new Set([...z])].forEach(c=>{if(!hasData(c))miss.push(c)})});
  const u=uniq(miss);
  u.length?warn(u.length+" caractère(s) sans données de tracé, absents de la Collection : "+u.join(" ")):ok("tous les caractères ont des données de tracé");
});

const nE=R.filter(x=>x.startsWith("ERREUR")).length,nW=R.filter(x=>x.startsWith("AVERT")).length;
R.push("RESULTAT: "+nE+" erreur(s), "+nW+" avertissement(s)");
return R.join("\n");
})()
