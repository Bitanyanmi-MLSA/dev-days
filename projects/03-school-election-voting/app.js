/* School Election Voting App
   Vanilla JS. All state lives in this browser via localStorage. */

(function () {
  "use strict";

  /* ---------------------------------------------------------------
     1. Election data
  --------------------------------------------------------------- */
  var POSITIONS = [
    {
      id: "president",
      title: "President",
      desc: "Leads the student council and represents the student body to school management.",
      candidates: [
        { id: "p1", name: "Amara Okonkwo", meta: "Grade 12 · Blue House", pitch: "A weekly open forum so every year group gets heard.", colour: "#dbeafe" },
        { id: "p2", name: "Daniel Mensah", meta: "Grade 12 · Gold House", pitch: "Longer library hours and a proper exam study space.", colour: "#fef3c7" },
        { id: "p3", name: "Sofia Ramirez", meta: "Grade 11 · Green House", pitch: "Clubs for everyone — funding split fairly across societies.", colour: "#dcfce7" }
      ]
    },
    {
      id: "vice-president",
      title: "Vice President",
      desc: "Supports the president and coordinates the council's sub-committees.",
      candidates: [
        { id: "v1", name: "Ibrahim Sesay", meta: "Grade 11 · Red House", pitch: "Monthly progress reports so promises get tracked.", colour: "#fee2e2" },
        { id: "v2", name: "Chloe Bennett", meta: "Grade 11 · Blue House", pitch: "A peer mentoring scheme pairing seniors with juniors.", colour: "#dbeafe" }
      ]
    },
    {
      id: "secretary",
      title: "Secretary",
      desc: "Keeps records of council meetings and manages student communications.",
      candidates: [
        { id: "s1", name: "Tunde Alabi", meta: "Grade 10 · Gold House", pitch: "Minutes published within 24 hours of every meeting.", colour: "#fef3c7" },
        { id: "s2", name: "Priya Raman", meta: "Grade 10 · Green House", pitch: "A single noticeboard app instead of scattered group chats.", colour: "#dcfce7" },
        { id: "s3", name: "Noah Fischer", meta: "Grade 11 · Red House", pitch: "Clear agendas shared before meetings, not after.", colour: "#fee2e2" }
      ]
    },
    {
      id: "sports-prefect",
      title: "Sports Prefect",
      desc: "Organises inter-house fixtures and manages sports equipment.",
      candidates: [
        { id: "sp1", name: "Grace Adeyemi", meta: "Grade 12 · Blue House", pitch: "An inter-house league that runs all three terms.", colour: "#dbeafe" },
        { id: "sp2", name: "Marcus Lee", meta: "Grade 11 · Gold House", pitch: "Equipment audit and a fair booking rota for the courts.", colour: "#fef3c7" }
      ]
    }
  ];

  var TALLY_KEY = "sev-tally";
  var VOTERS_KEY = "sev-voters";

  /* ---------------------------------------------------------------
     2. Helpers
  --------------------------------------------------------------- */
  function $(id) { return document.getElementById(id); }

  function read(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (err) {
      return fallback;
    }
  }

  function write(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (err) { /* storage full or blocked */ }
  }

  function initials(name) {
    return name.split(" ").map(function (part) { return part.charAt(0); }).join("").slice(0, 2).toUpperCase();
  }

  function findPosition(id) {
    for (var i = 0; i < POSITIONS.length; i++) {
      if (POSITIONS[i].id === id) { return POSITIONS[i]; }
    }
    return null;
  }

  function findCandidate(position, id) {
    for (var i = 0; i < position.candidates.length; i++) {
      if (position.candidates[i].id === id) { return position.candidates[i]; }
    }
    return null;
  }

  var toastTimer = null;
  function toast(message) {
    var el = $("toast");
    el.textContent = message;
    el.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.hidden = true; }, 2600);
  }

  /* ---------------------------------------------------------------
     3. View routing
  --------------------------------------------------------------- */
  var STEP_ORDER = ["checkin", "ballot", "review", "done"];

  function showView(name) {
    var views = document.querySelectorAll(".view");
    for (var i = 0; i < views.length; i++) {
      views[i].classList.toggle("active", views[i].id === "view-" + name);
    }

    var stepper = $("stepper");
    var index = STEP_ORDER.indexOf(name);
    stepper.classList.toggle("hidden", index === -1);

    var items = stepper.querySelectorAll("li");
    for (var j = 0; j < items.length; j++) {
      items[j].classList.toggle("active", j === index);
      items[j].classList.toggle("complete", index > -1 && j < index);
    }

    window.scrollTo(0, 0);
  }

  /* ---------------------------------------------------------------
     4. Step 1 — check in
  --------------------------------------------------------------- */
  var currentVoter = "";

  function normaliseId(value) {
    return value.trim().toUpperCase();
  }

  function validateId(value) {
    if (!value) { return "Please enter your student ID."; }
    if (!/^[A-Z0-9]{4,12}$/.test(value)) { return "IDs are 4–12 letters and numbers, with no spaces or symbols."; }
    if (read(VOTERS_KEY, []).indexOf(value) !== -1) { return "This ID has already voted in this election."; }
    return "";
  }

  $("checkinForm").addEventListener("submit", function (event) {
    event.preventDefault();

    var input = $("studentId");
    var errorEl = $("idError");
    var id = normaliseId(input.value);
    var problem = validateId(id);

    if (problem) {
      errorEl.textContent = problem;
      errorEl.hidden = false;
      input.classList.add("invalid");
      input.focus();
      return;
    }

    errorEl.hidden = true;
    input.classList.remove("invalid");
    currentVoter = id;

    var name = $("studentName").value.trim();
    $("greeting").textContent = name
      ? "Welcome, " + name + ". Choose one candidate for each position."
      : "Choose one candidate for each position.";

    renderBallot();
    showView("ballot");
  });

  $("studentId").addEventListener("input", function () {
    $("idError").hidden = true;
    this.classList.remove("invalid");
  });

  /* ---------------------------------------------------------------
     5. Step 2 — ballot
  --------------------------------------------------------------- */
  function candidateMarkup(position, candidate) {
    var inputId = position.id + "-" + candidate.id;
    return '' +
      '<div class="candidate">' +
        '<input type="radio" id="' + inputId + '" name="' + position.id + '" value="' + candidate.id + '" />' +
        '<label for="' + inputId + '">' +
          '<span class="avatar" style="background:' + candidate.colour + '" aria-hidden="true">' + initials(candidate.name) + '</span>' +
          '<span>' +
            '<span class="cand-name">' + candidate.name + '</span>' +
            '<span class="cand-meta">' + candidate.meta + '</span>' +
            '<span class="cand-pitch">' + candidate.pitch + '</span>' +
          '</span>' +
        '</label>' +
        '<span class="check" aria-hidden="true">✓</span>' +
      '</div>';
  }

  function abstainMarkup(position) {
    var inputId = position.id + "-abstain";
    return '' +
      '<div class="candidate abstain">' +
        '<input type="radio" id="' + inputId + '" name="' + position.id + '" value="abstain" />' +
        '<label for="' + inputId + '">' +
          '<span class="avatar" aria-hidden="true">—</span>' +
          '<span>' +
            '<span class="cand-name">Abstain</span>' +
            '<span class="cand-meta">No preference</span>' +
            '<span class="cand-pitch">Skip this position. Your ballot still counts for the others.</span>' +
          '</span>' +
        '</label>' +
        '<span class="check" aria-hidden="true">✓</span>' +
      '</div>';
  }

  function renderBallot() {
    var html = POSITIONS.map(function (position) {
      var cards = position.candidates.map(function (candidate) {
        return candidateMarkup(position, candidate);
      }).join("");

      return '' +
        '<fieldset class="position-block">' +
          '<legend>' +
            '<span class="position-title">' +
              '<h2>' + position.title + '</h2>' +
              '<span class="pick-one">PICK ONE</span>' +
            '</span>' +
          '</legend>' +
          '<p class="position-desc">' + position.desc + '</p>' +
          '<div class="candidate-grid">' + cards + abstainMarkup(position) + '</div>' +
        '</fieldset>';
    }).join("");

    $("ballotForm").innerHTML = html;
    updateProgress();
  }

  function getSelections() {
    var form = $("ballotForm");
    var selections = {};
    POSITIONS.forEach(function (position) {
      var checked = form.querySelector('input[name="' + position.id + '"]:checked');
      selections[position.id] = checked ? checked.value : null;
    });
    return selections;
  }

  function updateProgress() {
    var selections = getSelections();
    var chosen = POSITIONS.filter(function (position) {
      return selections[position.id] !== null;
    }).length;

    $("progressLabel").textContent = chosen + " of " + POSITIONS.length + " chosen";
    $("progressBar").style.width = (chosen / POSITIONS.length * 100) + "%";
  }

  $("ballotForm").addEventListener("change", updateProgress);
  $("ballotForm").addEventListener("submit", function (event) { event.preventDefault(); });

  $("backToCheckin").addEventListener("click", function () { showView("checkin"); });

  $("toReview").addEventListener("click", function () {
    var selections = getSelections();
    var missing = POSITIONS.filter(function (position) { return selections[position.id] === null; });

    if (missing.length) {
      toast("Please choose an option for " + missing[0].title + " (you may abstain).");
      var target = $("ballotForm").querySelector('input[name="' + missing[0].id + '"]');
      if (target) { target.focus(); }
      return;
    }

    renderReview(selections);
    showView("review");
  });

  /* ---------------------------------------------------------------
     6. Step 3 — review
  --------------------------------------------------------------- */
  function renderReview(selections) {
    $("reviewList").innerHTML = POSITIONS.map(function (position) {
      var value = selections[position.id];
      var candidate = value === "abstain" ? null : findCandidate(position, value);

      var avatar = candidate
        ? '<span class="avatar" style="background:' + candidate.colour + '" aria-hidden="true">' + initials(candidate.name) + '</span>'
        : '<span class="avatar" style="background:#eceef6;color:#6c6f89" aria-hidden="true">—</span>';

      var choice = candidate
        ? '<span class="review-choice">' + candidate.name + '</span>'
        : '<span class="review-choice none">Abstained</span>';

      return '' +
        '<div class="review-row">' +
          avatar +
          '<span>' +
            '<span class="review-role">' + position.title.toUpperCase() + '</span>' +
            choice +
          '</span>' +
          '<button class="review-edit" type="button" data-position="' + position.id + '">Change</button>' +
        '</div>';
    }).join("");
  }

  $("reviewList").addEventListener("click", function (event) {
    var button = event.target.closest(".review-edit");
    if (!button) { return; }

    showView("ballot");
    var field = $("ballotForm").querySelector('input[name="' + button.getAttribute("data-position") + '"]');
    if (field) {
      field.focus();
      field.closest(".position-block").scrollIntoView({ behavior: "smooth", block: "center" });
    }
  });

  $("backToBallot").addEventListener("click", function () { showView("ballot"); });

  /* ---------------------------------------------------------------
     7. Casting the vote
  --------------------------------------------------------------- */
  function makeReceipt() {
    var alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    var code = "";
    for (var i = 0; i < 5; i++) {
      code += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
    }
    return "SEV-" + code;
  }

  function recordBallot(selections) {
    var tally = read(TALLY_KEY, {});

    POSITIONS.forEach(function (position) {
      if (!tally[position.id]) { tally[position.id] = {}; }
      var value = selections[position.id];
      if (value && value !== "abstain") {
        tally[position.id][value] = (tally[position.id][value] || 0) + 1;
      }
    });

    tally.__ballots = (tally.__ballots || 0) + 1;
    write(TALLY_KEY, tally);
  }

  $("castVote").addEventListener("click", function () {
    // Re-check eligibility in case another tab voted with the same ID.
    var problem = validateId(currentVoter);
    if (problem) {
      toast(problem);
      showView("checkin");
      return;
    }

    recordBallot(getSelections());

    var voters = read(VOTERS_KEY, []);
    voters.push(currentVoter);
    write(VOTERS_KEY, voters);

    $("receiptCode").textContent = makeReceipt();
    currentVoter = "";
    $("checkinForm").reset();

    showView("done");
  });

  /* ---------------------------------------------------------------
     8. Step 4 — confirmation
  --------------------------------------------------------------- */
  $("copyReceipt").addEventListener("click", function () {
    var code = $("receiptCode").textContent;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(code).then(function () {
        toast("Receipt code copied.");
      }, function () {
        toast("Copy failed — please write down " + code + ".");
      });
    } else {
      toast("Please write down " + code + ".");
    }
  });

  $("viewResults").addEventListener("click", function () {
    renderResults();
    showView("results");
  });

  /* ---------------------------------------------------------------
     9. Results
  --------------------------------------------------------------- */
  function renderResults() {
    var tally = read(TALLY_KEY, {});
    var ballots = tally.__ballots || 0;
    $("totalBallots").textContent = ballots;

    if (!ballots) {
      $("resultsGrid").innerHTML = '<p class="results-empty">No ballots have been cast yet. Vote, or load sample votes to see how the tally looks.</p>';
      return;
    }

    $("resultsGrid").innerHTML = POSITIONS.map(function (position) {
      var counts = tally[position.id] || {};
      var cast = position.candidates.reduce(function (sum, candidate) {
        return sum + (counts[candidate.id] || 0);
      }, 0);

      var top = position.candidates.reduce(function (best, candidate) {
        return Math.max(best, counts[candidate.id] || 0);
      }, 0);

      var leaders = position.candidates.filter(function (candidate) {
        return top > 0 && (counts[candidate.id] || 0) === top;
      }).length;

      var rows = position.candidates.slice().sort(function (a, b) {
        return (counts[b.id] || 0) - (counts[a.id] || 0);
      }).map(function (candidate) {
        var votes = counts[candidate.id] || 0;
        var pct = cast ? Math.round(votes / cast * 100) : 0;
        var state = votes > 0 && votes === top ? (leaders > 1 ? " tied" : " leading") : "";

        return '' +
          '<div class="bar-row' + state + '">' +
            '<div class="bar-label">' +
              '<b>' + candidate.name + '</b>' +
              '<span class="pct">' + votes + ' · ' + pct + '%</span>' +
            '</div>' +
            '<div class="bar-track"><span class="bar-fill" style="width:' + pct + '%"></span></div>' +
          '</div>';
      }).join("");

      return '' +
        '<article class="result-card">' +
          '<h2>' + position.title + '</h2>' +
          '<p class="result-total">' + cast + ' vote' + (cast === 1 ? "" : "s") + ' cast · ' + (ballots - cast) + ' abstained</p>' +
          rows +
        '</article>';
    }).join("");
  }

  $("demoData").addEventListener("click", function () {
    var tally = read(TALLY_KEY, {});

    for (var i = 0; i < 40; i++) {
      POSITIONS.forEach(function (position) {
        if (!tally[position.id]) { tally[position.id] = {}; }
        if (Math.random() < 0.08) { return; } // occasional abstention
        var pick = position.candidates[Math.floor(Math.random() * position.candidates.length)];
        tally[position.id][pick.id] = (tally[position.id][pick.id] || 0) + 1;
      });
      tally.__ballots = (tally.__ballots || 0) + 1;
    }

    write(TALLY_KEY, tally);
    renderResults();
    toast("Added 40 sample ballots.");
  });

  $("resetAll").addEventListener("click", function () {
    if (!window.confirm("Clear all votes and check-in records? This cannot be undone.")) { return; }
    localStorage.removeItem(TALLY_KEY);
    localStorage.removeItem(VOTERS_KEY);
    renderResults();
    toast("Election reset.");
  });

  $("backHome").addEventListener("click", function () { showView("checkin"); });

  /* ---------------------------------------------------------------
     10. Start
  --------------------------------------------------------------- */
  showView("checkin");
})();
