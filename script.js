// ========= Helpers =========
const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);

function formatINR(value){
  const n = Number(value || 0);
  return n.toLocaleString("en-IN");
}

function toast(message){
  const t = $("#toast");
  t.textContent = message;
  t.style.display = "block";
  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(() => {
    t.style.display = "none";
  }, 2200);
}

// ========= Navbar (Mobile) =========
const menuBtn = $("#menuBtn");
const navLinks = $("#navLinks");

menuBtn.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
});

// Close menu when clicking a link (mobile)
$$(".links a").forEach(a => {
  a.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
  });
});

// ========= Footer year =========
$("#year").textContent = new Date().getFullYear();

// ========= Animated Counters =========
function animateCounter(el, target, duration=900){
  const start = 0;
  const t0 = performance.now();
  const step = (now) => {
    const p = Math.min((now - t0) / duration, 1);
    const value = Math.floor(start + (target - start) * p);
    el.textContent = value.toLocaleString("en-IN");
    if(p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

animateCounter($("#statRescued"), 1280);
animateCounter($("#statAdopted"), 940);
animateCounter($("#statMeals"), 18500);

animateCounter($("#monthRescues"), 48, 700);
animateCounter($("#monthTreatments"), 72, 700);
animateCounter($("#monthAdoptions"), 29, 700);
animateCounter($("#monthMeals"), 610, 700);

// ========= Featured medical fund progress =========
const medicalGoal = 25000;
let medicalRaised = 14250;

function updateMedicalUI(){
  $("#medicalGoalText").textContent = `₹ ${formatINR(medicalRaised)} / ₹ ${formatINR(medicalGoal)}`;
  const pct = Math.min((medicalRaised / medicalGoal) * 100, 100);
  $("#medicalProgress").style.width = pct + "%";
}
updateMedicalUI();

$("#quickDonateBtn").addEventListener("click", () => {
  medicalRaised = Math.min(medicalRaised + 500, medicalGoal);
  updateMedicalUI();
  toast("Thanks! Quick donation added (demo).");
});

// ========= Donate Form =========
const presetAmount = $("#presetAmount");
const donationAmount = $("#donationAmount");
const donationProgram = $("#donationProgram");

presetAmount.addEventListener("change", () => {
  if(presetAmount.value){
    donationAmount.value = presetAmount.value;
  }
});

// Program support buttons auto-select program + scroll
$$(".donate-program").forEach(btn => {
  btn.addEventListener("click", () => {
    const program = btn.dataset.program;
    donationProgram.value = program;
    toast(`Selected program: ${program}`);
    document.querySelector("#donate").scrollIntoView({behavior:"smooth"});
  });
});

// Receipt fields
const rName = $("#rName");
const rEmail = $("#rEmail");
const rProgram = $("#rProgram");
const rAmount = $("#rAmount");
const rDate = $("#rDate");
const rId = $("#rId");

function makeReceiptId(){
  const part = Math.random().toString(16).slice(2, 8).toUpperCase();
  return "PC-" + part;
}

function updateReceipt({name,email,program,amount}){
  rName.textContent = name || "—";
  rEmail.textContent = email || "—";
  rProgram.textContent = program || "—";
  rAmount.textContent = amount ? `₹ ${formatINR(amount)}` : "—";
  rDate.textContent = new Date().toLocaleString();
  rId.textContent = makeReceiptId();
}

$("#donationForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const name = $("#donorName").value.trim();
  const email = $("#donorEmail").value.trim();
  const amount = Number($("#donationAmount").value);
  const program = $("#donationProgram").value;
  const anonymous = $("#anonymous").checked;

  if(!name || !email || !amount || amount < 50){
    toast("Please enter valid donation details.");
    return;
  }

  updateReceipt({
    name: anonymous ? "Anonymous Donor" : name,
    email,
    program,
    amount
  });

  toast("Donation successful (demo). Receipt updated.");
});

// Download receipt as TXT (simple + works without libraries)
$("#downloadReceiptBtn").addEventListener("click", () => {
  const data = {
    donor: rName.textContent,
    email: rEmail.textContent,
    program: rProgram.textContent,
    amount: rAmount.textContent,
    date: rDate.textContent,
    receiptId: rId.textContent
  };

  if(data.receiptId === "—"){
    toast("Generate receipt first by donating (demo).");
    return;
  }

  const text =
`PawCare Foundation (Demo Receipt)
---------------------------------
Receipt ID : ${data.receiptId}
Date       : ${data.date}

Donor      : ${data.donor}
Email      : ${data.email}
Program    : ${data.program}
Amount     : ${data.amount}

Thank you for supporting animal rescue & care.
`;

  const blob = new Blob([text], {type:"text/plain"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${data.receiptId}.txt`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);

  toast("Receipt downloaded.");
});

// ========= Contact form (demo) =========
$("#contactForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = $("#cName").value.trim();
  const msg = $("#cMessage").value.trim();
  const status = $("#contactStatus");

  if(!name || !msg){
    status.textContent = "Please fill required fields.";
    return;
  }

  status.textContent = "Message sent successfully (demo). We'll contact you soon!";
  toast("Message sent (demo).");
  e.target.reset();
});
