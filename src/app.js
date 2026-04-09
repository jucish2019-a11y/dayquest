/* DayQuest - All-in-one, no modules, inline handlers for file:// compatibility */

(function() {
  "use strict";

  /* ========== CONSTANTS ========== */
  var CAT_ICONS = { health: "\u{1F4AA}", mind: "\u{1F9E0}", skills: "\u{1F4BB}", social: "\u{1F4AC}" };
  var CAT_CLR = {
    health: { bg: "rgba(0,229,255,0.1)", brd: "rgba(0,229,255,0.3)", txt: "#00e5ff" },
    mind:   { bg: "rgba(180,74,255,0.1)", brd: "rgba(180,74,255,0.3)", txt: "#b44aff" },
    skills: { bg: "rgba(255,179,0,0.1)", brd: "rgba(255,179,0,0.3)", txt: "#ffb300" },
    social: { bg: "rgba(244,63,94,0.1)", brd: "rgba(244,63,94,0.3)", txt: "#f43f5e" }
  };
  var XP = { easy: 10, medium: 25, hard: 50 };
  var LVL_TITLES = [
    [1,"Novice"],[3,"Apprentice"],[5,"Explorer"],[10,"Warrior"],
    [15,"Champion"],[20,"Master"],[30,"Grandmaster"],[50,"Legend"]
  ];
  var ACH = [
    {id:"a1",name:"First Step",desc:"Complete your first quest",icon:"\u{1F3AF}",fn:function(s){return s.totalCompleted>=1;}},
    {id:"a2",name:"Getting Started",desc:"Complete 10 quests",icon:"\u{1F331}",fn:function(s){return s.totalCompleted>=10;}},
    {id:"a3",name:"On Fire",desc:"7-day streak on any quest",icon:"\u{1F525}",fn:function(s){return s.bestStreak>=7;}},
    {id:"a4",name:"Unstoppable",desc:"30-day streak on any quest",icon:"\u{1F4A5}",fn:function(s){return s.bestStreak>=30;}},
    {id:"a5",name:"Balanced Life",desc:"Complete all 4 categories in one day",icon:"\u2696\uFE0F",fn:function(s){return s.balancedDays>=1;}},
    {id:"a6",name:"Centurion",desc:"Complete 100 quests total",icon:"\u{1F4AF}",fn:function(s){return s.totalCompleted>=100;}},
    {id:"a7",name:"Rise & Shine",desc:"Complete 3 quests before 9am",icon:"\u{1F305}",fn:function(s){return s.earlyBirdDays>=1;}},
    {id:"a8",name:"Night Owl",desc:"Complete 3 quests after 9pm",icon:"\u{1F989}",fn:function(s){return s.nightOwlDays>=1;}},
    {id:"a9",name:"Level 10",desc:"Reach level 10",icon:"\u2694\uFE0F",fn:function(s){return s.level>=10;}},
    {id:"a10",name:"Halfway There",desc:"Reach level 25",icon:"\u{1F3C6}",fn:function(s){return s.level>=25;}},
    {id:"a11",name:"Legendary",desc:"Reach level 50",icon:"\u{1F451}",fn:function(s){return s.level>=50;}},
    {id:"a12",name:"Completionist",desc:"Complete ALL active quests in one day",icon:"\u2728",fn:function(s){return s.perfectDays>=1;}}
  ];
  var DEFAULTS = [
    {id:"q1",name:"Exercise 30 min",cat:"health",diff:"medium",active:true},
    {id:"q2",name:"Drink 8 glasses of water",cat:"health",diff:"easy",active:true},
    {id:"q3",name:"Sleep 8 hours",cat:"health",diff:"medium",active:true},
    {id:"q4",name:"Stretch for 10 min",cat:"health",diff:"easy",active:true},
    {id:"q5",name:"Meditate 10 min",cat:"mind",diff:"easy",active:true},
    {id:"q6",name:"Journal your thoughts",cat:"mind",diff:"easy",active:true},
    {id:"q7",name:"Read for 20 min",cat:"mind",diff:"medium",active:true},
    {id:"q8",name:"No social media for 2h",cat:"mind",diff:"hard",active:false},
    {id:"q9",name:"Code for 2 hours",cat:"skills",diff:"medium",active:true},
    {id:"q10",name:"Study a new topic",cat:"skills",diff:"medium",active:true},
    {id:"q11",name:"Practice a language",cat:"skills",diff:"hard",active:false},
    {id:"q12",name:"Write for 30 min",cat:"skills",diff:"medium",active:true},
    {id:"q13",name:"Call or text a friend",cat:"social",diff:"easy",active:true},
    {id:"q14",name:"Spend quality time with family",cat:"social",diff:"medium",active:true},
    {id:"q15",name:"Attend a social event",cat:"social",diff:"hard",active:false},
    {id:"q16",name:"Reach out to someone new",cat:"social",diff:"medium",active:false}
  ];

  /* ========== STATE ========== */
  var SKEY = "dayquest-data";
  var S; // global state
  var currentRoute = "home";
  var deleteTarget = null;
  var editTarget = null;

  function loadState() {
    try {
      var raw = localStorage.getItem(SKEY);
      if (raw) { var d = JSON.parse(raw); if (d.version === "v1") return d; }
    } catch(e) {}
    var quests = [];
    for (var i = 0; i < DEFAULTS.length; i++) quests.push(JSON.parse(JSON.stringify(DEFAULTS[i])));
    return { version:"v1", quests:quests, completions:{}, totalXP:0, level:1, unlocked:[], streaks:{}, settings:{ xpMul:1, sound:true, cursor:"star", hideCompleted:false, sortOrder:"default", themeColor:"purple", compactMode:false } };
  }

  function saveState() {
    try { localStorage.setItem(SKEY, JSON.stringify(S)); } catch(e) {}
  }

  function initState() { S = loadState(); }

  /* ========== HELPERS ========== */
  function todayKey() { return new Date().toISOString().split("T")[0]; }
  function weekKeys() {
    var keys = [], t = new Date();
    for (var i = 6; i >= 0; i--) { var d = new Date(t); d.setDate(d.getDate()-i); keys.push(d.toISOString().split("T")[0]); }
    return keys;
  }
  function lvlTitle(lv) { var t="Novice"; for (var i=0;i<LVL_TITLES.length;i++) { if (lv>=LVL_TITLES[i][0]) t=LVL_TITLES[i][1]; else break; } return t; }
  function xpForLv(lv) { return 100+(lv-1)*50; }
  function calcLevel(xp) { var lv=1,r=xp; while(r>=xpForLv(lv)){r-=xpForLv(lv);lv++;} return lv; }
  function xpForCurrentLevel() { var t=0; for(var i=1;i<S.level;i++) t+=xpForLv(i); return t; }
  function fmtN(n) { return n>=1000?(n/1000).toFixed(1)+"k":String(n); }
  function genId() { return "q"+Date.now().toString(36)+Math.random().toString(36).substring(2,6); }
  function esc(s) { return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"); }
  function greeting() {
    var h = new Date().getHours();
    if (h>=5&&h<12) return "Rise and grind \u{1F5E1}\uFE0F";
    if (h>=12&&h<17) return "Afternoon push \u{1F5E1}\uFE0F";
    if (h>=17&&h<21) return "Evening stretch \u{1F5E1}\uFE0F";
    return "Night owl mode \u{1F5E1}\uFE0F";
  }

  function getMotivationalHint(st, tc, aq) {
    // Check for active streaks
    var bestActiveStreak = 0, bestStreakName = "";
    for (var sid in S.streaks) {
      var s2 = S.streaks[sid];
      if (s2.current >= 3 && s2.current > bestActiveStreak) {
        bestActiveStreak = s2.current;
        for (var qi=0;qi<S.quests.length;qi++) { if (S.quests[qi].id===sid) { bestStreakName=S.quests[qi].name; break; } }
      }
    }
    if (bestActiveStreak >= 3) return "\uD83D\uDD25 "+bestActiveStreak+"-day streak on "+bestStreakName+"!";

    // Check achievement progress
    var closestAch = null, closestProgress = 0;
    for (var ai=0;ai<ACH.length;ai++) {
      var a = ACH[ai];
      if (S.unlocked.indexOf(a.id)!==-1) continue;
      var progress = 0;
      if (a.id==="a1") progress = Math.min(st.totalCompleted/1*100, 99);
      else if (a.id==="a2") progress = Math.min(st.totalCompleted/10*100, 99);
      else if (a.id==="a3") progress = Math.min(st.bestStreak/7*100, 99);
      else if (a.id==="a5") progress = Math.min(st.balancedDays/1*100, 99);
      else if (a.id==="a6") progress = Math.min(st.totalCompleted/100*100, 99);
      else if (a.id==="a9") progress = Math.min(st.level/10*100, 99);
      if (progress > closestProgress) { closestProgress = progress; closestAch = a; }
    }
    if (closestAch && closestProgress > 0) return "\uD83C\uDFC6 "+Math.round(closestProgress)+"% to "+closestAch.name;

    // Default hints
    var remaining = aq.length - Object.keys(tc).length;
    if (remaining === aq.length) return "Complete your quests and earn XP";
    if (remaining <= 2) return "\u2B50 Almost done \u2014 "+remaining+" quest"+(remaining!==1?"s":"")+" to go!";
    return remaining+" quest"+(remaining!==1?"s":"")+" remaining \u2014 keep going!";
  }

  /* ========== STATS ========== */
  function getStats() {
    var totalCompleted = 0;
    var catCounts = {health:0,mind:0,skills:0,social:0};
    var bestStreak = 0, balancedDays = 0, earlyBirdDays = 0, nightOwlDays = 0, perfectDays = 0;

    // Extended data collection
    var xpPerDay = {};
    var completionsPerDay = {};
    var questCompletionCounts = {};
    var allDates = Object.keys(S.completions).sort();

    for (var dk in S.completions) {
      var day = S.completions[dk];
      var n = Object.keys(day).length;
      totalCompleted += n;

      // XP per day
      var dayXP = 0;
      for (var qid in day) {
        for (var qi=0;qi<S.quests.length;qi++) {
          if (S.quests[qi].id===qid) {
            catCounts[S.quests[qi].cat]++;
            dayXP += xpForDiff(S.quests[qi].diff);
            questCompletionCounts[qid] = (questCompletionCounts[qid]||0)+1;
            break;
          }
        }
      }
      xpPerDay[dk] = dayXP;
      completionsPerDay[dk] = n;

      // Category per day
      var activeQs = 0, completedQs = 0;
      var cats = {};
      for (var qi2 in S.quests) {
        var q = S.quests[qi2];
        if (!q.active) continue;
        activeQs++;
        if (day[q.id]) { completedQs++; cats[q.cat]=true; }
      }
      if (completedQs===activeQs && activeQs>0) perfectDays++;
      if (Object.keys(cats).length>=4) balancedDays++;
      var hasEarly=false,hasNight=false;
      for (var cid in day) {
        var hr = parseInt(day[cid].time.split(":")[0],10);
        if (hr<9) hasEarly=true;
        if (hr>=21) hasNight=true;
      }
      if (hasEarly&&n>=3) earlyBirdDays++;
      if (hasNight&&n>=3) nightOwlDays++;
    }
    for (var sid in S.streaks) { if (S.streaks[sid].best>bestStreak) bestStreak=S.streaks[sid].best; }

    // Weekly data (7 days)
    var wk = weekKeys();
    var wkData = [];
    for (var ki=0;ki<wk.length;ki++) {
      var d2 = S.completions[wk[ki]]||{};
      wkData.push({date:wk[ki],completed:Object.keys(d2).length,total:S.quests.filter(function(q){return q.active;}).length,
        xp:xpPerDay[wk[ki]]||0});
    }

    // 30-day completion rate trend
    var trendData = [];
    var now = new Date();
    for (var ti=29;ti>=0;ti--) {
      var td = new Date(now); td.setDate(td.getDate()-ti);
      var tdKey = td.toISOString().split("T")[0];
      var activeCount = S.quests.filter(function(q){return q.active;}).length;
      var compCount = (S.completions[tdKey]||{});
      var compN = Object.keys(compCount).length;
      trendData.push({date:tdKey,rate:activeCount>0?Math.round((compN/activeCount)*100):0,completed:compN,total:activeCount});
    }

    // Cumulative XP chart (last 30 days)
    var xpChartData = [];
    var runningXP = 0;
    for (var xi=29;xi>=0;xi--) {
      var xd = new Date(now); xd.setDate(xd.getDate()-xi);
      var xKey = xd.toISOString().split("T")[0];
      // Calculate XP up to this date
      var xpSoFar = 0;
      for (var xdk in S.completions) {
        if (xdk <= xKey) {
          for (var xqid in S.completions[xdk]) {
            for (var xqi=0;xqi<S.quests.length;xqi++) {
              if (S.quests[xqi].id===xqid) { xpSoFar += xpForDiff(S.quests[xqi].diff); break; }
            }
          }
        }
      }
      xpChartData.push({date:xKey,xp:xpSoFar});
    }

    // Top quests leaderboard
    var topQuests = [];
    for (var tqId in questCompletionCounts) {
      for (var tqi=0;tqi<S.quests.length;tqi++) {
        if (S.quests[tqi].id===tqId) {
          topQuests.push({name:S.quests[tqi].name,count:questCompletionCounts[tqId],cat:S.quests[tqi].cat});
          break;
        }
      }
    }
    topQuests.sort(function(a,b){return b.count-a.count;});
    topQuests = topQuests.slice(0,5);

    // This week vs last week
    var thisWeekStart = new Date(now);
    var dayOfWeek = thisWeekStart.getDay();
    thisWeekStart.setDate(thisWeekStart.getDate()-dayOfWeek);
    var thisWeekKey = thisWeekStart.toISOString().split("T")[0];
    var lastWeekStart = new Date(thisWeekStart);
    lastWeekStart.setDate(lastWeekStart.getDate()-7);
    var lastWeekKey = lastWeekStart.toISOString().split("T")[0];

    var thisWeekXP=0,thisWeekComp=0,lastWeekXP=0,lastWeekComp=0;
    for (var dwk in S.completions) {
      var dwkN = Object.keys(S.completions[dwk]).length;
      if (dwk >= thisWeekKey) {
        thisWeekXP += xpPerDay[dwk]||0;
        thisWeekComp += dwkN;
      } else if (dwk >= lastWeekKey) {
        lastWeekXP += xpPerDay[dwk]||0;
        lastWeekComp += dwkN;
      }
    }

    // Heatmap data (last 90 days)
    var heatmapData = [];
    for (var hi=89;hi>=0;hi--) {
      var hd = new Date(now); hd.setDate(hd.getDate()-hi);
      var hKey = hd.toISOString().split("T")[0];
      var hComp = (S.completions[hKey]||{});
      var hN = Object.keys(hComp).length;
      var hActive = S.quests.filter(function(q){return q.active;}).length;
      heatmapData.push({date:hKey,completed:hN,total:hActive,pct:hActive>0?Math.round((hN/hActive)*100):0,dayOfWeek:hd.getDay()});
    }

    return { totalXP:S.totalXP, level:S.level, levelTitle:lvlTitle(S.level),
      totalCompleted:totalCompleted, bestStreak:bestStreak, balancedDays:balancedDays,
      earlyBirdDays:earlyBirdDays, nightOwlDays:nightOwlDays, perfectDays:perfectDays,
      categoryCounts:catCounts, weeklyData:wkData, trendData:trendData,
      xpChartData:xpChartData, topQuests:topQuests,
      thisWeekXP:thisWeekXP, lastWeekXP:lastWeekXP,
      thisWeekComp:thisWeekComp, lastWeekComp:lastWeekComp,
      heatmapData:heatmapData };
  }

  /* ========== ACTIONS ========== */
  function xpForDiff(d) { return Math.round(XP[d]*(S.settings.xpMul||1)); }

  function completeQuest(id) {
    var tk = todayKey();
    var quest = null;
    for (var i=0;i<S.quests.length;i++) { if (S.quests[i].id===id) { quest=S.quests[i]; break; } }
    if (!quest) return null;
    var tc = S.completions[tk]||{};
    if (tc[id]) return null;

    var xp = xpForDiff(quest.diff);
    var time = new Date().toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit",hour12:false});
    S.completions[tk] = tc;
    tc[id] = {completed:true,time:time};

    S.totalXP += xp;
    var newLv = calcLevel(S.totalXP);
    var lvlUp = newLv > S.level;
    S.level = newLv;

    // streak
    var str = S.streaks[id]||{current:0,best:0,last:null};
    var yest = new Date(); yest.setDate(yest.getDate()-1);
    var yk = yest.toISOString().split("T")[0];
    if (str.last===yk) str.current++;
    else if (str.last!==tk) str.current=1;
    str.last = tk;
    if (str.current>str.best) str.best=str.current;
    S.streaks[id] = str;

    // achievements
    var st = getStats();
    var newAch = [];
    for (var ai=0;ai<ACH.length;ai++) {
      if (S.unlocked.indexOf(ACH[ai].id)===-1 && ACH[ai].fn(st)) {
        S.unlocked.push(ACH[ai].id);
        newAch.push(ACH[ai]);
      }
    }

    saveState();
    return {xp:xp, levelUp:lvlUp, newLevel:newLv, newAch:newAch};
  }

  function undoQuest(id) {
    var tk = todayKey();
    var tc = S.completions[tk]||{};
    if (!tc[id]) return;
    delete tc[id];
    if (Object.keys(tc).length===0) delete S.completions[tk];

    var totalXP2 = 0;
    for (var dk in S.completions) {
      for (var qid2 in S.completions[dk]) {
        for (var qi=0;qi<S.quests.length;qi++) {
          if (S.quests[qi].id===qid2) { totalXP2+=xpForDiff(S.quests[qi].diff); break; }
        }
      }
    }
    S.totalXP = totalXP2;
    S.level = calcLevel(totalXP2);
    saveState();
  }

  function addQuest(name,cat,diff) {
    S.quests.push({id:genId(),name:name,cat:cat,diff:diff,active:true});
    saveState();
  }

  function editQuest(id,name,cat,diff) {
    for (var i=0;i<S.quests.length;i++) { if (S.quests[i].id===id) { S.quests[i].name=name; S.quests[i].cat=cat; S.quests[i].diff=diff; break; } }
    saveState();
  }

  function deleteQuestById(id) {
    var newQ = [];
    for (var i=0;i<S.quests.length;i++) { if (S.quests[i].id!==id) newQ.push(S.quests[i]); }
    S.quests = newQ;
    saveState();
  }

  function toggleQuestActive(id) {
    for (var i=0;i<S.quests.length;i++) { if (S.quests[i].id===id) { S.quests[i].active=!S.quests[i].active; break; } }
    saveState();
  }

  /* ========== NAVIGATION ========== */
  function navigateTo(route) {
    currentRoute = route;
    document.querySelectorAll(".nav-link").forEach(function(el) {
      el.classList.toggle("active", el.getAttribute("data-route")===route);
    });
    switch(route) {
      case "home": renderHome(); break;
      case "stats": renderStats(); break;
      case "achievements": renderAchievements(); break;
      case "settings": renderSettings(); break;
    }
    updateNavbar();
  }

  function updateNavbar() {
    var st = getStats();
    var el = document.getElementById("nav-level");
    var el2 = document.getElementById("nav-title");
    var el3 = document.getElementById("nav-xp-bar");
    if (el) el.textContent = st.level;
    if (el2) el2.textContent = st.levelTitle;
    if (el3) {
      var pct = ((st.totalXP - xpForCurrentLevel()) / xpForLv(st.level)) * 100;
      el3.style.width = Math.min(pct, 100) + "%";
    }
  }

  /* ========== TOAST ========== */
  function toast(msg, type, dur) {
    type = type||"info"; dur = dur||3000;
    var c = document.getElementById("toast-container");
    if (!c) return;
    var t = document.createElement("div");
    t.className = "toast toast-"+type;
    var ic = type==="success"?"\u2705":type==="error"?"\u274C":"\u2139\uFE0F";
    t.innerHTML = '<span class="toast-icon">'+ic+'</span><span>'+msg+'</span>';
    c.appendChild(t);
    setTimeout(function(){ t.classList.add("toast-enter"); }, 10);
    setTimeout(function(){ t.classList.remove("toast-enter"); t.classList.add("toast-exit"); setTimeout(function(){ t.remove(); }, 300); }, dur);
  }

  function achOverlay(ach) {
    var ov = document.getElementById("achievement-overlay");
    document.getElementById("ach-overlay-icon").textContent = ach.icon;
    document.getElementById("ach-overlay-name").textContent = ach.name;
    ov.classList.remove("hidden");
    setTimeout(function(){ ov.classList.add("hidden"); }, 2000);
  }

  /* ========== RENDER: HOME ========== */
  function renderHome() {
    var tc = S.completions[todayKey()]||{};
    var s = S.settings;
    var aq = S.quests.filter(function(q){return q.active;});

    // Sort quests
    if (s.sortOrder === "alphabetical") {
      aq.sort(function(a,b){ return a.name.localeCompare(b.name); });
    }
    // "default" keeps definition order (original array order)

    if (s.hideCompleted) {
      aq = aq.filter(function(q){ return !tc[q.id]; });
    }

    var cc = Object.keys(tc).length;
    var total = S.quests.filter(function(q){return q.active;}).length;
    var pct = total>0 ? Math.round((cc/total)*100) : 0;
    var circ = 2*Math.PI*34;
    var offset = circ*(1-pct/100);

    var html = '<div class="page-header">';
    var st = getStats();
    var hint = getMotivationalHint(st, tc, aq);
    html += '<div><h1 class="page-title">'+greeting()+'</h1><p class="page-subtitle">'+hint+'</p></div>';
    html += '<div class="page-actions"><button class="btn btn-ghost" onclick="openQuestModal()">+ Add Quest</button></div>';
    html += '</div>';

    // Progress ring
    html += '<div class="daily-progress">';
    html += '<div class="progress-ring-container">';
    html += '<svg class="progress-ring" width="80" height="80">';
    html += '<circle class="progress-ring-bg" cx="40" cy="40" r="34" fill="none" stroke-width="6"/>';
    html += '<circle class="progress-ring-fill" cx="40" cy="40" r="34" fill="none" stroke-width="6" stroke-dasharray="'+circ+'" stroke-dashoffset="'+offset+'" transform="rotate(-90 40 40)" stroke-linecap="round"/>';
    html += '</svg>';
    html += '<div class="progress-ring-text"><span class="progress-ring-number">'+pct+'%</span><span class="progress-ring-label">'+cc+'/'+total+'</span></div>';
    html += '</div>';
    html += '<div class="daily-stats">';
    html += '<div class="daily-stat"><div class="daily-stat-value">'+st.totalXP+'</div><div class="daily-stat-label">Total XP</div></div>';
    html += '<div class="daily-stat"><div class="daily-stat-value">'+st.level+'</div><div class="daily-stat-label">Level</div></div>';
    html += '<div class="daily-stat"><div class="daily-stat-value">\uD83D\uDD25 '+st.bestStreak+'</div><div class="daily-stat-label">Best Streak</div></div>';
    html += '</div></div>';

    // Quest categories
    html += '<div class="quest-grid">';
    var cats = ["health","mind","skills","social"];
    for (var ci=0;ci<cats.length;ci++) {
      var catKey = cats[ci];
      var catQuests = aq.filter(function(q){return q.cat===catKey;});
      var clr = CAT_CLR[catKey];
      var completedInCat = catQuests.filter(function(q){return tc[q.id];}).length;

      html += '<div class="category-section">';
      html += '<div class="category-header" style="background:'+clr.bg+';border-color:'+clr.brd+'">';
      html += '<span class="category-icon">'+CAT_ICONS[catKey]+'</span>';
      html += '<span class="category-name">'+catKey.charAt(0).toUpperCase()+catKey.slice(1)+'</span>';
      html += '<span class="category-count">'+completedInCat+'/'+catQuests.length+'</span>';
      html += '</div><div class="quest-list">';

      // Empty state: no quests in this category
      if (catQuests.length===0) {
        html += '<div class="category-empty-state"><span class="empty-state-icon">+</span><span class="empty-state-text">No quests yet — tap + to add one</span></div>';
        html += '</div></div>';
        continue;
      }

      // Sort: incomplete first, completed last (archived at bottom)
      var pending = catQuests.filter(function(q){return !tc[q.id];});
      var completed = catQuests.filter(function(q){return tc[q.id];});

      for (var qi=0;qi<catQuests.length;qi++) {
        // Insert "Archived Today" divider before first completed quest
        if (qi===pending.length && completed.length>0) {
          html += '<div class="archive-divider">\u2728 Completed Today</div>';
        }

        var q = pending[qi]||completed[qi-pending.length];
        var done = !!tc[q.id];
        var dl = q.diff==="easy"?"\u26A1":q.diff==="medium"?"\u26A1\u26A1":"\u26A1\u26A1\u26A1";

        // Stagger entrance animation
        var staggerDelay = Math.min(qi * 60, 300);
        html += '<div class="quest-card'+(done?' completed':'')+' stagger-enter'+(s.compactMode?' compact':'')+'" data-quest-id="'+q.id+'" style="--cat-color:'+clr.txt+';--cat-bg:'+clr.bg+';--cat-border:'+clr.brd+';animation-delay:'+staggerDelay+'ms">';
        html += '<div class="quest-check'+(done?' checked':'')+'" onclick="toggleComplete(\''+q.id+'\')">'+(done?'\u2713':'')+'</div>';
        if (!s.compactMode) {
          html += '<div class="quest-info">';
          html += '<div class="quest-name'+(done?' completed-text':'')+'">'+esc(q.name)+'</div>';
          html += '<div class="quest-meta">';
          html += '<span class="quest-difficulty">'+dl+' '+q.diff+'</span>';
          html += '<span class="quest-xp">+'+XP[q.diff]+' XP</span>';
          if (done) html += '<span class="quest-time">\u2713 '+tc[q.id].time+'</span>';
          html += '</div></div>';
        } else {
          html += '<div class="quest-info">';
          html += '<div class="quest-name'+(done?' completed-text':'')+'">'+esc(q.name)+'</div>';
          html += '<div class="quest-meta">';
          html += '<span class="quest-difficulty">'+dl+'</span>';
          html += '<span class="quest-xp">+'+XP[q.diff]+'</span>';
          html += '</div></div>';
        }
        html += '<button class="quest-menu-btn" onclick="event.stopPropagation();showQMenu(\''+q.id+'\',this)">\u22EF</button>';
        html += '</div>';
      }

      html += '</div></div>';
    }
    html += '</div>';

    document.getElementById("main-content").innerHTML = html;
  }

  /* ========== QUEST ACTIONS ========== */
  function toggleComplete(id) {
    var tc = S.completions[todayKey()]||{};
    if (tc[id]) {
      undoQuest(id);
      toast("Quest undone","info");
      renderHome();
      updateNavbar();
    } else {
      // Find the card element and play celebration animation
      var card = document.querySelector('.quest-card[data-quest-id="'+id+'"]');
      if (card) {
        card.classList.add("celebrating");
        // Wait for animation to finish, then re-render
        setTimeout(function() {
          var r = completeQuest(id);
          if (r) {
            toast("+"+r.xp+" XP earned!","success");
            if (r.levelUp) toast("\uD83C\uDF89 Level Up! You're now Level "+r.newLevel+"!","success",5000);
            if (r.newAch.length>0) {
              for (var i=0;i<r.newAch.length;i++) {
                achOverlay(r.newAch[i]);
                toast("\uD83C\uDFC6 Achievement: "+r.newAch[i].name,"success",2500);
              }
            }
          }
          renderHome();
          updateNavbar();
        }, 400);
      } else {
        var r = completeQuest(id);
        if (r) {
          toast("+"+r.xp+" XP earned!","success");
          if (r.levelUp) toast("\uD83C\uDF89 Level Up! You're now Level "+r.newLevel+"!","success",5000);
          if (r.newAch.length>0) {
            for (var i=0;i<r.newAch.length;i++) {
              achOverlay(r.newAch[i]);
              toast("\uD83C\uDFC6 Achievement: "+r.newAch[i].name,"success",2500);
            }
          }
        }
        renderHome();
        updateNavbar();
      }
    }
  }

  function showQMenu(id, btnEl) {
    document.querySelectorAll(".quest-context-menu").forEach(function(el){el.remove();});
    var quest = null;
    for (var i=0;i<S.quests.length;i++) { if (S.quests[i].id===id) { quest=S.quests[i]; break; } }
    if (!quest) return;

    var menu = document.createElement("div");
    menu.className = "quest-context-menu";
    menu.innerHTML = '<button onclick="event.stopPropagation();closeQMenus();openQuestModal(\''+id+'\')">\u270F\uFE0F Edit</button>' +
      '<button onclick="event.stopPropagation();closeQMenus();toggleQuestActive(\''+id+'\');renderHome();updateNavbar();">'+(quest.active?'\u23F8\uFE0F Deactivate':'\u25B6\uFE0F Activate')+'</button>' +
      '<button style="color:#ef4444" onclick="event.stopPropagation();closeQMenus();openDeleteModal(\''+id+'\')">\u{1F5D1}\uFE0F Remove</button>';

    menu.style.position = "fixed";
    menu.style.zIndex = "200";
    menu.style.background = "#1c1c28";
    menu.style.border = "1px solid rgba(255,255,255,0.1)";
    menu.style.borderRadius = "8px";
    menu.style.padding = "4px";
    menu.style.minWidth = "160px";
    menu.style.boxShadow = "0 8px 24px rgba(0,0,0,0.4)";

    document.body.appendChild(menu);

    // Position near the clicked button
    var bRect = btnEl.getBoundingClientRect();
    menu.style.right = (window.innerWidth - bRect.right) + "px";
    menu.style.top = (bRect.bottom + 4) + "px";
    menu.style.left = "auto";
    menu.style.transform = "none";

    // Click backdrop to close
    var backdrop = document.createElement("div");
    backdrop.style.cssText = "position:fixed;inset:0;z-index:199;";
    backdrop.onclick = function(){ closeQMenus(); };
    document.body.appendChild(backdrop);
  }

  function closeQMenus() {
    document.querySelectorAll(".quest-context-menu").forEach(function(el){el.remove();});
    // Remove backdrops too
    document.querySelectorAll("div[style*='z-index:199']").forEach(function(el){el.remove();});
  }

  /* ========== MODALS ========== */
  function openQuestModal(editId) {
    editTarget = editId||null;
    var modal = document.getElementById("quest-modal");
    var title = document.getElementById("quest-modal-title");
    var nameIn = document.getElementById("quest-name");
    var catSel = document.getElementById("quest-category");
    var subBtn = document.getElementById("quest-submit");

    if (editId) {
      var q = null;
      for (var i=0;i<S.quests.length;i++) { if (S.quests[i].id===editId) { q=S.quests[i]; break; } }
      if (!q) return;
      title.textContent = "Edit Quest";
      nameIn.value = q.name;
      catSel.value = q.cat;
      document.querySelectorAll(".diff-btn").forEach(function(b){b.classList.toggle("selected",b.getAttribute("data-d")===q.diff);});
      subBtn.textContent = "Save Changes";
    } else {
      title.textContent = "Add New Quest";
      nameIn.value = "";
      catSel.value = "health";
      document.querySelectorAll(".diff-btn").forEach(function(b,i){b.classList.toggle("selected",i===1);});
      subBtn.textContent = "Add Quest";
    }
    modal.classList.remove("hidden");
    nameIn.focus();
  }

  function closeQuestModal() {
    document.getElementById("quest-modal").classList.add("hidden");
    editTarget = null;
  }

  function selectDiff(btn,d) {
    document.querySelectorAll(".diff-btn").forEach(function(b){b.classList.remove("selected");});
    btn.classList.add("selected");
  }

  function submitQuestForm(e) {
    e.preventDefault();
    var name = document.getElementById("quest-name").value.trim();
    var cat = document.getElementById("quest-category").value;
    var diffBtn = document.querySelector(".diff-btn.selected");
    var diff = diffBtn ? diffBtn.getAttribute("data-d") : "medium";
    if (!name) return;

    if (editTarget) {
      editQuest(editTarget, name, cat, diff);
      toast("Quest updated","success");
    } else {
      addQuest(name, cat, diff);
      toast("New quest added!","success");
    }
    closeQuestModal();
    renderHome();
  }

  function openDeleteModal(id) {
    deleteTarget = id;
    var q = null;
    for (var i=0;i<S.quests.length;i++) { if (S.quests[i].id===id) { q=S.quests[i]; break; } }
    document.getElementById("delete-quest-name").textContent = 'Remove "'+(q?q.name:"")+'"? This won\'t affect past completions.';
    document.getElementById("delete-modal").classList.remove("hidden");
  }

  function closeDeleteModal() {
    document.getElementById("delete-modal").classList.add("hidden");
    deleteTarget = null;
  }

  function confirmDelete() {
    if (deleteTarget) {
      deleteQuestById(deleteTarget);
      toast("Quest removed","info");
      renderHome();
      updateNavbar();
    }
    closeDeleteModal();
  }

  /* ========== RENDER: STATS ========== */
  function renderStats() {
    var st = getStats();
    var wd = st.weeklyData;
    var maxC = 1;
    for (var i=0;i<wd.length;i++) { if (wd[i].completed>maxC) maxC=wd[i].completed; }

    var cats = [
      {icon:CAT_ICONS.health,label:"Health",count:st.categoryCounts.health,color:CAT_CLR.health.txt},
      {icon:CAT_ICONS.mind,label:"Mind",count:st.categoryCounts.mind,color:CAT_CLR.mind.txt},
      {icon:CAT_ICONS.skills,label:"Skills",count:st.categoryCounts.skills,color:CAT_CLR.skills.txt},
      {icon:CAT_ICONS.social,label:"Social",count:st.categoryCounts.social,color:CAT_CLR.social.txt}
    ];
    var maxCat = 1;
    for (var j=0;j<cats.length;j++) { if (cats[j].count>maxCat) maxCat=cats[j].count; }

    var dayNames = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

    var html = '<div class="page-header"><h1 class="page-title">Stats Dashboard \uD83D\uDCCA</h1><p class="page-subtitle">Your quest performance at a glance</p></div>';

    // Summary cards
    html += '<div class="stats-grid">';
    html += '<div class="stat-card"><div class="stat-card-icon" style="color:#06b6d4">\u26A1</div><div class="stat-card-value">'+fmtN(st.totalXP)+'</div><div class="stat-card-label">Total XP Earned</div></div>';
    html += '<div class="stat-card"><div class="stat-card-icon" style="color:#a855f7">\uD83C\uDF96\uFE0F</div><div class="stat-card-value">'+st.level+'</div><div class="stat-card-label">'+esc(st.levelTitle)+'</div></div>';
    html += '<div class="stat-card"><div class="stat-card-icon" style="color:#f59e0b">\uD83D\uDD25</div><div class="stat-card-value">'+st.bestStreak+'</div><div class="stat-card-label">Best Streak</div></div>';
    html += '<div class="stat-card"><div class="stat-card-icon" style="color:#22c55e">\u2705</div><div class="stat-card-value">'+fmtN(st.totalCompleted)+'</div><div class="stat-card-label">Quests Completed</div></div>';
    html += '</div>';

    // === NEW: This Week vs Last Week ===
    var xpChange = st.lastWeekXP>0 ? Math.round(((st.thisWeekXP-st.lastWeekXP)/st.lastWeekXP)*100) : 0;
    var compChange = st.lastWeekComp>0 ? Math.round(((st.thisWeekComp-st.lastWeekComp)/st.lastWeekComp)*100) : 0;
    html += '<div class="chart-section"><h2 class="chart-title">\uD83D\uDD04 Week Comparison</h2>';
    html += '<div class="week-comparison">';
    html += '<div class="week-col"><div class="week-label">This Week</div>';
    html += '<div class="week-val" style="color:#22c55e">'+st.thisWeekXP+' XP</div>';
    html += '<div class="week-val">'+st.thisWeekComp+' quests</div></div>';
    html += '<div class="week-col"><div class="week-label">Last Week</div>';
    html += '<div class="week-val">'+st.lastWeekXP+' XP</div>';
    html += '<div class="week-val">'+st.lastWeekComp+' quests</div></div>';
    html += '<div class="week-col"><div class="week-label">Change</div>';
    html += '<div class="week-val" style="color:'+(xpChange>=0?'#22c55e':'#ef4444')+'">'+(xpChange>=0?'+':'')+xpChange+'%</div>';
    html += '<div class="week-val" style="color:'+(compChange>=0?'#22c55e':'#ef4444')+'">'+(compChange>=0?'+':'')+compChange+'%</div></div>';
    html += '</div></div>';

    // === NEW: Level Progress Donut ===
    var xpForCur = xpForCurrentLevel();
    var xpNeeded = xpForLv(st.level);
    var xpProgress = st.totalXP - xpForCur;
    var xpPct = Math.min((xpProgress/xpNeeded)*100, 100);
    var donutR = 50, donutC = 2*Math.PI*donutR;
    var donutOff = donutC*(1-xpPct/100);

    html += '<div class="chart-section"><h2 class="chart-title">\uD83C\uDF96\uFE0F Level Progress</h2>';
    html += '<div class="level-donut-wrap">';
    html += '<svg class="level-donut" width="120" height="120">';
    html += '<circle cx="60" cy="60" r="'+donutR+'" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="10"/>';
    html += '<circle cx="60" cy="60" r="'+donutR+'" fill="none" stroke="#b44aff" stroke-width="10" stroke-dasharray="'+donutC+'" stroke-dashoffset="'+donutOff+'" transform="rotate(-90 60 60)" stroke-linecap="round"/>';
    html += '</svg>';
    html += '<div class="level-donut-text"><span class="level-donut-num">'+st.level+'</span><span class="level-donut-label">'+esc(st.levelTitle)+'</span>';
    html += '<span class="level-donut-xp">'+xpProgress+'/'+xpNeeded+' XP</span></div></div></div>';

    // === NEW: XP Progress Line Chart (30 days) ===
    html += '<div class="chart-section"><h2 class="chart-title">\uD83D\uDCC8 XP Progress (30 Days)</h2>';
    html += renderLineChart(st.xpChartData, "xp");
    html += '</div>';

    // === NEW: Streak Heatmap ===
    html += '<div class="chart-section"><h2 class="chart-title">\uD83D\uDD25 Activity Heatmap (90 Days)</h2>';
    html += renderHeatmap(st.heatmapData);
    html += '</div>';

    // === NEW: Completion Rate Trend ===
    html += '<div class="chart-section"><h2 class="chart-title">\uD83D\uDCC9 Completion Rate (30 Days)</h2>';
    html += renderLineChart(st.trendData, "rate");
    html += '</div>';

    // Weekly bar chart
    html += '<div class="chart-section"><h2 class="chart-title">Weekly Activity</h2><div class="bar-chart">';
    for (var ki=0;ki<wd.length;ki++) {
      var h2 = (wd[ki].completed/maxC)*100;
      var dn = dayNames[new Date(wd[ki].date+"T12:00:00").getDay()];
      var isT = wd[ki].date===todayKey();
      html += '<div class="bar-item'+(isT?' bar-today':'')+'">';
      html += '<div class="bar-value">'+wd[ki].completed+'</div>';
      html += '<div class="bar-fill" style="height:'+h2+'%"></div>';
      html += '<div class="bar-label">'+dn+'</div></div>';
    }
    html += '</div></div>';

    // Category bars
    html += '<div class="chart-section"><h2 class="chart-title">Category Breakdown</h2><div class="category-bars">';
    for (var cj=0;cj<cats.length;cj++) {
      var w = (cats[cj].count/maxCat)*100;
      html += '<div class="cat-bar-item"><div class="cat-bar-label">'+cats[cj].icon+' '+cats[cj].label+'</div>';
      html += '<div class="cat-bar-track"><div class="cat-bar-fill" style="width:'+w+'%;background:'+cats[cj].color+'"></div></div>';
      html += '<div class="cat-bar-count">'+cats[cj].count+'</div></div>';
    }
    html += '</div></div>';

    // === NEW: Top Quests Leaderboard ===
    if (st.topQuests.length > 0) {
      html += '<div class="chart-section"><h2 class="chart-title">\uD83C\uDFC6 Top Quests</h2><div class="leaderboard">';
      var medals = ["\uD83E\uDD47","\uD83E\uDD48","\uD83E\uDD49","4","5"];
      for (var li=0;li<st.topQuests.length;li++) {
        var tq = st.topQuests[li];
        html += '<div class="leader-row">';
        html += '<span class="leader-rank">'+medals[li]+'</span>';
        html += '<span class="leader-name">'+esc(tq.name)+'</span>';
        html += '<span class="leader-count">'+tq.count+'x</span>';
        html += '</div>';
      }
      html += '</div></div>';
    }

    // Milestones
    html += '<div class="chart-section"><h2 class="chart-title">Milestones</h2><div class="milestone-grid">';
    html += '<div class="milestone'+(st.perfectDays>0?' unlocked':'')+'"><span class="milestone-icon">\u2728</span><div class="milestone-info"><div class="milestone-name">Perfect Days</div><div class="milestone-value">'+st.perfectDays+'</div></div></div>';
    html += '<div class="milestone'+(st.balancedDays>0?' unlocked':'')+'"><span class="milestone-icon">\u2696\uFE0F</span><div class="milestone-info"><div class="milestone-name">Balanced Days</div><div class="milestone-value">'+st.balancedDays+'</div></div></div>';
    html += '<div class="milestone'+(st.earlyBirdDays>0?' unlocked':'')+'"><span class="milestone-icon">\uD83C\uDF05</span><div class="milestone-info"><div class="milestone-name">Early Birds</div><div class="milestone-value">'+st.earlyBirdDays+'</div></div></div>';
    html += '<div class="milestone'+(st.nightOwlDays>0?' unlocked':'')+'"><span class="milestone-icon">\uD83E\uDD89</span><div class="milestone-info"><div class="milestone-name">Night Owls</div><div class="milestone-value">'+st.nightOwlDays+'</div></div></div>';
    html += '</div></div>';

    document.getElementById("main-content").innerHTML = html;
  }

  /* ========== CHART RENDERERS ========== */

  // SVG Line Chart with smooth curves and gradient fill
  function renderLineChart(data, type) {
    if (!data || data.length === 0) return '<div class="chart-empty">No data yet</div>';

    var W = 600, H = 160, pad = 30;
    var chartW = W - pad*2, chartH = H - pad*2;

    var values = data.map(function(d){ return type==="xp"?d.xp:d.rate; });
    var maxV = Math.max.apply(null, values) || 1;
    var minV = type==="rate"?0:Math.min.apply(null, values);

    if (maxV === minV) { maxV = minV + 1; }

    // Build points
    var points = [];
    for (var i=0;i<data.length;i++) {
      var x = pad + (i/(data.length-1||1))*chartW;
      var y = pad + chartH - ((values[i]-minV)/(maxV-minV))*chartH;
      points.push({x:x,y:y});
    }

    // Build smooth path
    var pathD = "M"+points[0].x+","+points[0].y;
    for (var pi=1;pi<points.length;pi++) {
      var prev = points[pi-1];
      var curr = points[pi];
      var cpx1 = prev.x + (curr.x-prev.x)/3;
      var cpy1 = prev.y;
      var cpx2 = curr.x - (curr.x-prev.x)/3;
      var cpy2 = curr.y;
      pathD += " C"+cpx1+","+cpy1+" "+cpx2+","+cpy2+" "+curr.x+","+curr.y;
    }

    // Area fill path
    var areaD = pathD + " L"+points[points.length-1].x+","+(pad+chartH)+" L"+points[0].x+","+(pad+chartH)+" Z";
    var color = type==="xp"?"#a855f7":"#06b6d4";
    var colorRgb = type==="xp"?"168,85,247":"6,182,212";

    var svg = '<div class="line-chart-wrap"><svg viewBox="0 0 '+W+' '+H+'" class="line-chart-svg">';
    svg += '<defs><linearGradient id="lcg-'+type+'" x1="0" y1="0" x2="0" y2="1">';
    svg += '<stop offset="0%" stop-color="rgba('+colorRgb+',0.3)"/>';
    svg += '<stop offset="100%" stop-color="rgba('+colorRgb+',0.02)"/>';
    svg += '</linearGradient></defs>';
    svg += '<path d="'+areaD+'" fill="url(#lcg-'+type+')"/>';
    svg += '<path d="'+pathD+'" fill="none" stroke="'+color+'" stroke-width="2.5" stroke-linecap="round"/>';

    // Y-axis labels
    svg += '<text x="'+(pad-4)+'" y="'+(pad+4)+'" fill="#6a6a80" font-size="10" text-anchor="end">'+maxV+'</text>';
    svg += '<text x="'+(pad-4)+'" y="'+(pad+chartH/2+4)+'" fill="#6a6a80" font-size="10" text-anchor="end">'+Math.round((maxV+minV)/2)+'</text>';
    svg += '<text x="'+(pad-4)+'" y="'+(pad+chartH+4)+'" fill="#6a6a80" font-size="10" text-anchor="end">'+minV+'</text>';

    // X-axis labels (5 evenly spaced)
    for (var xl=0;xl<5;xl++) {
      var xIdx = Math.round((xl/4)*(data.length-1));
      var d = new Date(data[xIdx].date+"T12:00:00");
      var lbl = d.getDate()+"/"+(d.getMonth()+1);
      svg += '<text x="'+points[xIdx].x+'" y="'+(H-2)+'" fill="#6a6a80" font-size="9" text-anchor="middle">'+lbl+'</text>';
    }

    svg += '</svg></div>';
    return svg;
  }

  // GitHub-style Contribution Heatmap
  function renderHeatmap(data) {
    if (!data || data.length === 0) return '<div class="chart-empty">No data yet</div>';

    // Organize into 13 weeks x 7 days (Sunday-Saturday)
    var html = '<div class="heatmap-wrap">';
    // Month labels on top
    html += '<div class="heatmap-months">';
    for (var mi=0;mi<13;mi++) {
      var md = new Date(data[mi*7].date+"T12:00:00");
      var mNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
      html += '<span class="heatmap-mo-label" style="margin-left:'+(mi*16)+'px">'+mNames[md.getMonth()]+'</span>';
    }
    html += '</div>';

    html += '<div class="heatmap-body">';
    // Day labels
    var dayLabels = ["","Mon","","","Wed","",""];
    html += '<div class="heatmap-day-labels">';
    for (var dli=0;dli<7;dli++) {
      html += '<span class="heatmap-dl-label">'+dayLabels[dli]+'</span>';
    }
    html += '</div>';

    // Grid: 13 columns (weeks), 7 rows (days)
    html += '<div class="heatmap-grid">';
    for (var col=0;col<13;col++) {
      html += '<div class="heatmap-col">';
      for (var row=0;row<7;row++) {
        var idx = col*7+row;
        if (idx >= data.length) {
          html += '<div class="heatmap-cell heatmap-empty"></div>';
          continue;
        }
        var d = data[idx];
        var level = d.pct===0?0:d.pct<=25?1:d.pct<=50?2:d.pct<=75?3:4;
        html += '<div class="heatmap-cell heatmap-l'+level+'" title="'+d.date+': '+d.completed+'/'+d.total+' ('+d.pct+'%)"></div>';
      }
      html += '</div>';
    }
    html += '</div></div>';

    // Legend
    html += '<div class="heatmap-legend">';
    html += '<span>Less</span>';
    html += '<div class="heatmap-cell heatmap-l0"></div>';
    html += '<div class="heatmap-cell heatmap-l1"></div>';
    html += '<div class="heatmap-cell heatmap-l2"></div>';
    html += '<div class="heatmap-cell heatmap-l3"></div>';
    html += '<div class="heatmap-cell heatmap-l4"></div>';
    html += '<span>More</span></div>';

    html += '</div>';
    return html;
  }

  /* ========== RENDER: ACHIEVEMENTS ========== */
  function renderAchievements() {
    var all = ACH.map(function(a){ return {id:a.id,name:a.name,desc:a.desc,icon:a.icon,unlocked:S.unlocked.indexOf(a.id)!==-1}; });
    var unlocked = all.filter(function(a){return a.unlocked;});
    var locked = all.filter(function(a){return !a.unlocked;});

    var html = '<div class="page-header"><h1 class="page-title">Achievements \uD83C\uDFC6</h1><p class="page-subtitle">'+unlocked.length+' of '+all.length+' unlocked</p></div>';

    html += '<div class="achievement-progress"><div class="achievement-progress-bar"><div class="achievement-progress-fill" style="width:'+(all.length>0?(unlocked.length/all.length)*100:0)+'%"></div></div>';
    html += '<span class="achievement-progress-text">'+unlocked.length+'/'+all.length+'</span></div>';

    if (unlocked.length>0) {
      html += '<div class="achievement-section"><h2 class="achievement-section-title">\u2728 Unlocked</h2><div class="achievement-grid">';
      for (var i=0;i<unlocked.length;i++) {
        var a = unlocked[i];
        html += '<div class="achievement-card unlocked"><div class="achievement-icon">'+a.icon+'</div><div class="achievement-name">'+esc(a.name)+'</div><div class="achievement-desc">'+esc(a.desc)+'</div></div>';
      }
      html += '</div></div>';
    }

    html += '<div class="achievement-section"><h2 class="achievement-section-title">\uD83D\uDD12 Locked</h2><div class="achievement-grid">';
    for (var j=0;j<locked.length;j++) {
      var b = locked[j];
      html += '<div class="achievement-card locked"><div class="achievement-icon locked-icon">\u2753</div><div class="achievement-name locked-name">???</div><div class="achievement-desc">'+esc(b.desc)+'</div></div>';
    }
    html += '</div></div>';

    document.getElementById("main-content").innerHTML = html;
  }

  /* ========== RENDER: SETTINGS ========== */
  function renderSettings() {
    var s = S.settings;
    var html = '<div class="page-header"><h1 class="page-title">Settings \u2699\uFE0F</h1><p class="page-subtitle">Customize your quest experience</p></div>';

    html += '<div class="settings-section"><h2 class="settings-section-title">Preferences</h2>';
    html += '<div class="setting-item"><div class="setting-info"><div class="setting-name">XP Multiplier</div><div class="setting-desc">Adjust how much XP you earn per quest</div></div>';
    html += '<select class="setting-select" onchange="changeXpMul(this.value)">';
    html += '<option value="0.5"'+(s.xpMul===0.5?' selected':'')+'>0.5x - Half XP</option>';
    html += '<option value="1"'+(s.xpMul===1?' selected':'')+'>1x - Normal</option>';
    html += '<option value="1.5"'+(s.xpMul===1.5?' selected':'')+'>1.5x - Bonus XP</option>';
    html += '<option value="2"'+(s.xpMul===2?' selected':'')+'>2x - Double XP</option>';
    html += '</select></div>';

    html += '<div class="setting-item"><div class="setting-info"><div class="setting-name">Cursor Style</div><div class="setting-desc">Choose your quest cursor appearance</div></div>';
    html += '<select class="setting-select" onchange="changeCursor(this.value)">';
    var cursors = [
      {id:"star",name:"\u272F Magic Star"},
      {id:"sword",name:"\uD83D\uDDE1\uFE0F Sword"},
      {id:"potion",name:"\uD83E\uDDEA Potion"},
      {id:"shield",name:"\uD83D\uDEE1\uFE0F Shield"},
      {id:"scroll",name:"\uD83D\uDCDC Scroll"},
      {id:"default",name:"\uD83D\uDDB1\uFE0F System Default"}
    ];
    var curCursor = s.cursor||"star";
    for (var ci2=0;ci2<cursors.length;ci2++) {
      html += '<option value="'+cursors[ci2].id+'"'+(curCursor===cursors[ci2].id?' selected':'')+'>'+cursors[ci2].name+'</option>';
    }
    html += '</select></div>';

    html += '<div class="setting-item"><div class="setting-info"><div class="setting-name">Theme Color</div><div class="setting-desc">Primary accent color for the UI</div></div>';
    html += '<select class="setting-select" onchange="changeTheme(this.value)">';
    var themes = [
      {id:"purple",name:"\uD83D\uDFE3 Purple Realm",hex:"#b44aff"},
      {id:"cyan",name:"\uD83D\uDD35 Cyan Depths",hex:"#06b6d4"},
      {id:"amber",name:"\uD83D\uDFE0 Amber Glow",hex:"#f59e0b"},
      {id:"rose",name:"\uD83D\uDFE5 Rose Flame",hex:"#f43f5e"},
      {id:"emerald",name:"\uD83D\uDFE2 Emerald Forest",hex:"#10b981"}
    ];
    var curTheme = s.themeColor||"purple";
    for (var ti=0;ti<themes.length;ti++) {
      html += '<option value="'+themes[ti].id+'"'+(curTheme===themes[ti].id?' selected':'')+'>'+themes[ti].name+'</option>';
    }
    html += '</select></div>';

    html += '<div class="setting-item"><div class="setting-info"><div class="setting-name">Quest Sort Order</div><div class="setting-desc">How quests are arranged on the board</div></div>';
    html += '<select class="setting-select" onchange="changeSortOrder(this.value)">';
    html += '<option value="default"'+(s.sortOrder==="default"?' selected':'')+'>Default (your order)</option>';
    html += '<option value="alphabetical"'+(s.sortOrder==="alphabetical"?' selected':'')+'>Alphabetical (A-Z)</option>';
    html += '</select></div></div>';

    html += '<div class="settings-section"><h2 class="settings-section-title">Display</h2>';
    html += '<div class="setting-item"><div class="setting-info"><div class="setting-name">Hide Completed Quests</div><div class="setting-desc">Remove completed quests from the board</div></div>';
    html += '<button class="toggle'+(s.hideCompleted?' on':'')+'" onclick="toggleHideCompleted(this)"><div class="toggle-knob"></div></button></div>';

    html += '<div class="setting-item"><div class="setting-info"><div class="setting-name">Compact Mode</div><div class="setting-desc">Smaller quest cards for more quests on screen</div></div>';
    html += '<button class="toggle'+(s.compactMode?' on':'')+'" onclick="toggleCompact(this)"><div class="toggle-knob"></div></button></div></div>';

    html += '<div class="settings-section"><h2 class="settings-section-title">Data</h2>';
    html += '<div class="setting-item"><div class="setting-info"><div class="setting-name">Export Data</div><div class="setting-desc">Download your quest data as JSON</div></div>';
    html += '<button class="btn btn-secondary" onclick="exportData()">Export</button></div>';

    html += '<div class="setting-item"><div class="setting-info"><div class="setting-name">Import Data</div><div class="setting-desc">Load quest data from a JSON file</div></div>';
    html += '<button class="btn btn-secondary" onclick="document.getElementById(\'import-file\').click()">Import</button>';
    html += '<input type="file" id="import-file" accept=".json" class="hidden" onchange="importData(this)"></div>';

    html += '<div class="setting-item"><div class="setting-info"><div class="setting-name">Reset Quests to Default</div><div class="setting-desc">Restore the original 16 quests. Keeps your XP, level, streaks, and achievements.</div></div>';
    html += '<button class="btn btn-warning" onclick="resetQuests()">Reset Quests</button></div>';

    html += '<div class="setting-item danger-zone"><div class="setting-info"><div class="setting-name">Reset All Data</div><div class="setting-desc">Permanently delete all quests, completions, XP, and achievements</div></div>';
    html += '<button class="btn btn-danger" onclick="resetAll()">Reset Everything</button></div></div>';

    html += '<div class="settings-section"><h2 class="settings-section-title">About</h2>';
    html += '<div class="about-card"><div class="about-name">DayQuest</div><div class="about-version">v1.0.0</div>';
    html += '<div class="about-desc">A gamified daily quest tracker built with a full AI design pipeline. 20 AI agents collaborated on the design before a single line of code was written.</div>';
    html += '<div class="about-links"><a href="https://github.com/jucish2019-a11y/awesome-qwen-agents" target="_blank" class="about-link">\uD83E\uDD16 AI Agent Collection</a>';
    html += '<a href="https://github.com/jucish2019-a11y/nokia-snake" target="_blank" class="about-link">\uD83D\uDC0D Nokia Snake (Previous Project)</a></div></div></div>';

    document.getElementById("main-content").innerHTML = html;
  }

  function changeXpMul(v) {
    S.settings.xpMul = parseFloat(v);
    saveState();
    toast("XP multiplier updated","success");
  }

  function toggleSound(btn) {
    S.settings.sound = !S.settings.sound;
    saveState();
    btn.classList.toggle("on", S.settings.sound);
  }

  /* ========== NEW SETTINGS HANDLERS ========== */

  function toggleHideCompleted(btn) {
    S.settings.hideCompleted = !S.settings.hideCompleted;
    saveState();
    btn.classList.toggle("on", S.settings.hideCompleted);
    toast(S.settings.hideCompleted ? "Completed quests hidden" : "Completed quests visible", "info");
  }

  function toggleCompact(btn) {
    S.settings.compactMode = !S.settings.compactMode;
    saveState();
    btn.classList.toggle("on", S.settings.compactMode);
    toast(S.settings.compactMode ? "Compact mode enabled" : "Compact mode disabled", "info");
  }

  function changeTheme(v) {
    S.settings.themeColor = v;
    saveState();
    applyTheme(v);
    toast("Theme updated", "success");
  }

  function changeSortOrder(v) {
    S.settings.sortOrder = v;
    saveState();
    toast("Sort order updated", "info");
  }

  function resetQuests() {
    if (!confirm("Reset all quests to default? This will NOT affect your XP, level, streaks, or achievements.")) return;
    var newQuests = [];
    for (var i = 0; i < DEFAULTS.length; i++) newQuests.push(JSON.parse(JSON.stringify(DEFAULTS[i])));
    // Keep completions for matching quest names (by name match, not ID)
    var oldQuestNames = S.quests.map(function(q) { return q.name; });
    S.quests = newQuests;
    // Remove completions for quests that no longer exist
    for (var dk in S.completions) {
      for (var qid in S.completions[dk]) {
        var found = false;
        for (var qi = 0; qi < S.quests.length; qi++) {
          if (S.quests[qi].id === qid) { found = true; break; }
        }
        if (!found) delete S.completions[dk][qid];
      }
    }
    // Remove streaks for removed quests
    for (var sid in S.streaks) {
      var found2 = false;
      for (var qi2 = 0; qi2 < S.quests.length; qi2++) {
        if (S.quests[qi2].id === sid) { found2 = true; break; }
      }
      if (!found2) delete S.streaks[sid];
    }
    saveState();
    toast("Quests restored to default", "success");
    navigateTo("home");
  }

  /* ========== THEME SYSTEM ========== */
  var THEME_COLORS = {
    purple: { primary: "#b44aff", primaryRgb: "180,74,255" },
    cyan:   { primary: "#06b6d4", primaryRgb: "6,182,212" },
    amber:  { primary: "#f59e0b", primaryRgb: "245,158,11" },
    rose:   { primary: "#f43f5e", primaryRgb: "244,63,94" },
    emerald:{ primary: "#10b981", primaryRgb: "16,185,129" }
  };

  function applyTheme(v) {
    var theme = THEME_COLORS[v];
    if (!theme) return;
    var css = ':root{--mind:'+theme.primary+' !important;}'+
      '.nav-link.active{border-left-color:'+theme.primary+' !important;box-shadow:0 0 16px rgba('+theme.primaryRgb+',0.25) !important;}'+
      '.nav-link.active .nav-icon{filter:drop-shadow(0 0 4px rgba('+theme.primaryRgb+',0.6)) !important;}';
    var styleEl = document.getElementById("custom-theme-style");
    if (!styleEl) {
      styleEl = document.createElement("style");
      styleEl.id = "custom-theme-style";
      document.head.appendChild(styleEl);
    }
    styleEl.textContent = css;
  }
  var CURSOR_MAP = {
    star:   "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 24 24'%3E%3Cpath d='M12 2L14 10L22 12L14 14L12 22L10 14L2 12L10 10Z' fill='%23b44aff' stroke='%23c084fc' stroke-width='0.5'/%3E%3C/svg%3E",
    sword:  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 24 24'%3E%3Cpath d='M6.92 5L5 7l4 4-3 3 3 3 1.5-1.5L14 19l1-1-3.5-3.5L13 13l3 3 1.5-1.5-3.5-3.5L17 8l-4-4-3 3L6.92 5z' fill='%23e0e0e0' stroke='%23b44aff' stroke-width='0.5'/%3E%3C/svg%3E",
    potion: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 24 24'%3E%3Cpath d='M12 2C10.9 2 10 2.9 10 4v2H8v2l-2 3v7c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2v-7l-2-3V6h-2V4c0-1.1-.9-2-2-2zm-3 14c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1zm6 0c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1z' fill='%23a855f7' stroke='%23c084fc' stroke-width='0.3'/%3E%3C/svg%3E",
    shield: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 24 24'%3E%3Cpath d='M12 2L3 7v5c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5zm0 2.2L19 8v4c0 4.5-3 8.7-7 9.8-4-1.1-7-5.3-7-9.8V8l7-3.8z' fill='%233b82f6' stroke='%2360a5fa' stroke-width='0.5'/%3E%3C/svg%3E",
    scroll: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 24 24'%3E%3Cpath d='M6 2h12c1.1 0 2 .9 2 2v16c0 1.1-.9 2-2 2H6c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2zm0 2v2h12V4H6zm0 4v2h12V8H6zm0 4v2h8v-2H6z' fill='%23d4a574' stroke='%23c084fc' stroke-width='0.3'/%3E%3C/svg%3E"
  };

  function applyCursor(type) {
    if (type === "default") {
      document.documentElement.style.cursor = "";
      document.body.style.cursor = "";
      var styleEl = document.getElementById("custom-cursor-style");
      if (styleEl) styleEl.remove();
      return;
    }
    var svg = CURSOR_MAP[type];
    if (!svg) return;
    var css = 'html,body{cursor:url("'+svg+'") 14 14,crosshair !important;}'+
      'a,button,.quest-card,.quest-check,.quest-menu-btn,.nav-link,.toggle,.diff-btn,'+
      '.achievement-card,select,input,.setting-select,.btn,.modal-backdrop{cursor:url("'+svg+'") 14 14,pointer !important;}';

    var styleEl = document.getElementById("custom-cursor-style");
    if (!styleEl) {
      styleEl = document.createElement("style");
      styleEl.id = "custom-cursor-style";
      document.head.appendChild(styleEl);
    }
    styleEl.textContent = css;
  }

  function changeCursor(type) {
    S.settings.cursor = type;
    saveState();
    applyCursor(type);
    toast("Cursor updated","success");
  }

  function exportData() {
    var data = JSON.stringify(S, null, 2);
    var blob = new Blob([data], {type:"application/json"});
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url; a.download = "dayquest-export-"+todayKey()+".json";
    a.click(); URL.revokeObjectURL(url);
    toast("Data exported","success");
  }

  function importData(input) {
    var file = input.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function(ev) {
      try {
        var data = JSON.parse(ev.target.result);
        if (data.quests && data.completions) {
          S = data;
          saveState();
          toast("Data imported successfully","success");
          navigateTo(currentRoute);
        } else toast("Invalid file format","error");
      } catch(e) { toast("Failed to parse file","error"); }
    };
    reader.readAsText(file);
  }

  function resetAll() {
    if (confirm("Are you sure? This will permanently delete ALL your data.")) {
      try { localStorage.removeItem(SKEY); } catch(e) {}
      S = loadState();
      toast("All data has been reset","info");
      navigateTo(currentRoute);
    }
  }

  /* ========== INIT ========== */
  function init() {
    initState();
    applyCursor(S.settings.cursor||"star");
    applyTheme(S.settings.themeColor||"purple");
    navigateTo("home");
  }

  // Expose all global functions
  window.navigateTo = navigateTo;
  window.toggleComplete = toggleComplete;
  window.openQuestModal = openQuestModal;
  window.closeQuestModal = closeQuestModal;
  window.selectDiff = selectDiff;
  window.submitQuestForm = submitQuestForm;
  window.showQMenu = showQMenu;
  window.closeQMenus = closeQMenus;
  window.openDeleteModal = openDeleteModal;
  window.closeDeleteModal = closeDeleteModal;
  window.confirmDelete = confirmDelete;
  window.changeXpMul = changeXpMul;
  window.toggleSound = toggleSound;
  window.changeCursor = changeCursor;
  window.changeTheme = changeTheme;
  window.changeSortOrder = changeSortOrder;
  window.toggleHideCompleted = toggleHideCompleted;
  window.toggleCompact = toggleCompact;
  window.exportData = exportData;
  window.importData = importData;
  window.resetQuests = resetQuests;
  window.resetAll = resetAll;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

})();
