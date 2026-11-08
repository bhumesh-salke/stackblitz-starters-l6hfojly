// run `node index.js` in the terminal

// ============================================================
//  ATM MACHINE - PURA PROJECT EK HI FILE ME
//  Features : Card + PIN + Balance + Withdraw + Deposit
//             + Transfer + Statement + PIN Change + Admin
//  Koi package nahi hai, isliye sabhi compiler me chalega
//  StackBlitz / Replit / VS Code - Sab jagah
// ============================================================

const http = require('http');

// ------------------------------------------------------------
//  STEP 1 : DATABASE - Asli me ye MySQL me hota hai
//  Yahan humne isko memory me rakha hai taaki
//  bina install ke har jagah chal jaye
// ------------------------------------------------------------
let DB = {
  // 3 Demo Accounts
  users: [
    { card: '1234567890123456', pin: '1234', name: 'Bhumesh Kumar', balance: 50000, type: 'Saving', attempts: 0, blocked: false },
    { card: '1111222233334444', pin: '1111', name: 'Rahul Sharma', balance: 25000, type: 'Saving', attempts: 0, blocked: false },
    { card: '9999888877776666', pin: '9999', name: 'Admin - Bank', balance: 100000, type: 'Admin', attempts: 0, blocked: false },
  ],
  // Saare Transactions yahan save honge
  transactions: [
    { card: '1234567890123456', type: 'Deposit', amount: 50000, date: 'Aaj se pehle', balanceAfter: 50000 },
    { card: '1111222233334444', type: 'Deposit', amount: 25000, date: 'Aaj se pehle', balanceAfter: 25000 },
  ]
};

// ------------------------------------------------------------
//  STEP 2 : Server banana
// ------------------------------------------------------------
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(`
<!DOCTYPE html>
<html lang="hi"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>ATM Machine - Mera Bank</title>
<style>
*{box-sizing:border-box;font-family:'Segoe UI',system-ui}body{margin:0;background:#0B1020;color:white;min-height:100vh}
.box{max-width:460px;margin:auto;padding:16px}
.topbar{display:flex;justify-content:space-between;align-items:center;padding:8px 2px}
.logo{font-size:22px;font-weight:900}.logo span{color:#22c55e}
.card{background:rgba(255,255,255,0.07);padding:20px;border-radius:22px;margin:12px 0;border:1px solid rgba(255,255,255,0.12)}
.atm-card{background:linear-gradient(135deg,#1e40af,#3b82f6 50%,#06b6d4);padding:20px;border-radius:20px;position:relative;overflow:hidden}
.atm-card:after{content:'VISA';position:absolute;right:18px;bottom:14px;font-weight:900;font-style:italic;font-size:22px;letter-spacing:2px}
.chip{width:48px;height:34px;background:linear-gradient(90deg,#fbbf24,#f59e0b);border-radius:8px;margin:10px 0}
.balance-card{background:linear-gradient(135deg,#16a34a,#22c55e);padding:22px;border-radius:22px}
input{width:100%;padding:14px;margin:7px 0;border-radius:13px;border:1px solid rgba(255,255,255,0.15);background:#111827;color:white;outline:none;font-size:16px;letter-spacing:1px}
button{width:100%;padding:14px;border:none;border-radius:13px;background:#22c55e;font-weight:800;font-size:16px;color:white;cursor:pointer;margin:5px 0}button:active{transform:scale(0.98)}
.btn-blue{background:#3b82f6}.btn-yellow{background:#eab308;color:black}.btn-red{background:#ef4444}.btn-ghost{background:transparent;border:1px solid rgba(255,255,255,0.3)}
.grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}.grid button{font-size:14px;padding:16px 8px}
.small{font-size:13px;color:#cbd5e1;line-height:1.5}.hidden{display:none}
.keypad{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-top:10px}.keypad button{background:#1e293b;padding:14px;font-size:18px}
.item{display:flex;justify-content:space-between;background:rgba(255,255,255,0.07);padding:13px;border-radius:14px;margin:8px 0}
.center{text-align:center}.pin-dots{font-size:32px;letter-spacing:12px;text-align:center;margin:10px 0}
.badge{display:inline-block;background:rgba(255,255,255,0.25);padding:4px 10px;border-radius:20px;font-size:11px;font-weight:700}
.success{border:2px solid #22c55e!important}.error{border:2px solid #ef4444!important}
</style></head><body><div class="box">

<div class="topbar"><div class="logo">🏦 Mera Bank <span>ATM</span></div><div class="small" id="clock"></div></div>

<!-- ================= SCREEN 1 : CARD DALO ================= -->
<div id="screen-card">
  <div class="center" style="font-size:50px;margin:10px 0">💳</div>
  <h1 class="center" style="margin:0">ATM Machine Me Swagat Hai</h1>
  <p class="small center">Apna Card Number Daalein</p>
  <div class="card">
    <div class="small">💳 Card Number (16 Ank)</div>
    <input id="cardInput" placeholder="1234 5678 9012 3456" maxlength="19" oninput="formatCard(this)">
    <button onclick="checkCard()">➡️ Card Daalo - Aage Badhein</button>
    <p class="small center" id="cardMsg"></p>
    <div style="background:#111827;padding:12px;border-radius:12px">
      <div class="small"><b>🔑 Demo Card - Ise Use Karein:</b></div>
      <div class="small">Card: <b style="color:#4ade80">1234 5678 9012 3456</b> • PIN: <b>1234</b></div>
      <div class="small">Card: <b style="color:#4ade80">1111 2222 3333 4444</b> • PIN: <b>1111</b></div>
      <div class="small">Admin: <b style="color:#facc15">9999 8888 7777 6666</b> • PIN: <b>9999</b></div>
    </div>
    <button class="btn-ghost" onclick="fillDemo()">✨ Demo Card Bharo</button>
  </div>
</div>

<!-- ================= SCREEN 2 : PIN DALO ================= -->
<div id="screen-pin" class="hidden">
  <div class="center" style="font-size:44px">🔐</div>
  <h2 class="center">Apna 4-Ank Ka PIN Daalein</h2>
  <p class="small center" id="pinUser"></p>
  <div class="card">
    <div class="pin-dots" id="pinDots">• • • •</div>
    <input id="pinInput" type="password" maxlength="4" placeholder="****" style="text-align:center;font-size:22px;letter-spacing:10px" oninput="updateDots()">
    <div class="keypad">
      <button onclick="press('1')">1</button><button onclick="press('2')">2</button><button onclick="press('3')">3</button>
      <button onclick="press('4')">4</button><button onclick="press('5')">5</button><button onclick="press('6')">6</button>
      <button onclick="press('7')">7</button><button onclick="press('8')">8</button><button onclick="press('9')">9</button>
      <button onclick="clearPin()">❌</button><button onclick="press('0')">0</button><button onclick="checkPin()" style="background:#22c55e">✔️</button>
    </div>
    <button onclick="checkPin()" style="margin-top:12px">🔓 PIN Check Karein</button>
    <button class="btn-ghost" onclick="backToCard()">⬅️ Wapas - Card Badlein</button>
    <p class="small center" id="pinMsg"></p>
    <p class="small center">⚠️ 3 Baar galat PIN pe Card Block ho jayega</p>
  </div>
</div>

<!-- ================= SCREEN 3 : MAIN MENU ================= -->
<div id="screen-menu" class="hidden">
  <div class="atm-card">
    <div class="small">MERA BANK • DEBIT CARD</div>
    <div class="chip"></div>
    <div style="font-size:19px;letter-spacing:2px;font-weight:700" id="menuCardNo"></div>
    <div style="display:flex;justify-content:space-between;margin-top:12px"><span class="small" id="menuName"></span><span class="badge" id="menuType"></span></div>
  </div>
  <div class="balance-card"><div class="small" style="color:white">💰 Available Balance</div><h1 style="margin:5px 0;font-size:36px">₹<span id="menuBalance">0</span></h1><div class="small" style="color:#dcfce7">Account Safe Hai ✅</div></div>
  <h3>🏧 Kya Karna Chahte Hain?</h3>
  <div class="grid">
    <button onclick="showScreen('withdraw')">💸<br>Cash Nikalein<br><span style="font-size:11px;font-weight:400">Withdrawal</span></button>
    <button class="btn-blue" onclick="showScreen('deposit')">💰<br>Paisa Jama Karein<br><span style="font-size:11px;font-weight:400">Deposit</span></button>
    <button class="btn-yellow" onclick="showScreen('transfer')">🔄<br>Paisa Bhejein<br><span style="font-size:11px;font-weight:400">Transfer</span></button>
    <button style="background:#8b5cf6" onclick="showScreen('statement')">📜<br>Mini Statement<br><span style="font-size:11px;font-weight:400">History</span></button>
    <button style="background:#f97316" onclick="showScreen('pinchange')">🔑<br>PIN Badlein<br><span style="font-size:11px;font-weight:400">Change PIN</span></button>
    <button class="btn-red" onclick="logout()">🚪<br>Exit / Logout<br><span style="font-size:11px;font-weight:400">Card Nikalein</span></button>
  </div>
  <div id="adminBox" class="card hidden" style="border-color:#facc15"><b>👑 Admin Panel</b><p class="small">Bank Manager ke liye - Sabhi Accounts Dekhein</p><button class="btn-yellow" onclick="showScreen('admin')">👑 Admin Dashboard Kholein</button></div>
  <p class="small center">Card nikalna na bhoolein! 🙏</p>
</div>

<!-- ================= SCREEN 4 : WITHDRAW ================= -->
<div id="screen-withdraw" class="hidden">
  <h2>💸 Cash Withdrawal</h2><p class="small">Kitne paise nikalne hain? Balance: ₹<span class="bal"></span></p>
  <div class="card">
    <div class="grid"><button onclick="setAmt(500,'wAmt')">₹500</button><button onclick="setAmt(1000,'wAmt')">₹1,000</button><button onclick="setAmt(2000,'wAmt')">₹2,000</button><button onclick="setAmt(5000,'wAmt')">₹5,000</button><button onclick="setAmt(10000,'wAmt')">₹10,000</button><button onclick="setAmt(20000,'wAmt')">₹20,000</button></div>
    <input id="wAmt" type="number" placeholder="Ya apni rashi likhein - 1500">
    <button onclick="doWithdraw()">✅ Cash Nikalein</button>
    <button class="btn-ghost" onclick="showScreen('menu')">⬅️ Menu Me Wapas</button>
    <p class="small center" id="wMsg"></p>
  </div>
</div>

<!-- ================= SCREEN 5 : DEPOSIT ================= -->
<div id="screen-deposit" class="hidden">
  <h2>💰 Cash Deposit</h2><p class="small">Kitne paise jama karne hain? Balance: ₹<span class="bal"></span></p>
  <div class="card">
    <div class="grid"><button onclick="setAmt(500,'dAmt')">₹500</button><button onclick="setAmt(1000,'dAmt')">₹1,000</button><button onclick="setAmt(5000,'dAmt')">₹5,000</button><button onclick="setAmt(10000,'dAmt')">₹10,000</button><button onclick="setAmt(20000,'dAmt')">₹20,000</button><button onclick="setAmt(50000,'dAmt')">₹50,000</button></div>
    <input id="dAmt" type="number" placeholder="Rashi likhein - 5000">
    <button class="btn-blue" onclick="doDeposit()">✅ Paisa Jama Karein</button>
    <button class="btn-ghost" onclick="showScreen('menu')">⬅️ Menu Me Wapas</button>
    <p class="small center" id="dMsg"></p>
  </div>
</div>

<!-- ================= SCREEN 6 : TRANSFER ================= -->
<div id="screen-transfer" class="hidden">
  <h2>🔄 Money Transfer</h2><p class="small">Dusre account me paisa bhejein. Balance: ₹<span class="bal"></span></p>
  <div class="card">
    <div class="small">Jisko bhejna hai uska Card Number</div>
    <input id="tTo" placeholder="1111 2222 3333 4444" maxlength="19" oninput="formatCard(this)">
    <div class="small">Kitne paise bhejne hain?</div>
    <input id="tAmt" type="number" placeholder="Rashi - 1000">
    <button class="btn-yellow" onclick="doTransfer()">✅ Transfer Karein</button>
    <button class="btn-ghost" onclick="showScreen('menu')">⬅️ Menu Me Wapas</button>
    <p class="small center" id="tMsg"></p>
    <div class="small" style="background:#111827;padding:10px;border-radius:10px">Try Karein: <b>1111 2222 3333 4444</b> (Rahul) ko ₹1000 bhejein</div>
  </div>
</div>

<!-- ================= SCREEN 7 : STATEMENT ================= -->
<div id="screen-statement" class="hidden">
  <h2>📜 Mini Statement</h2><p class="small">Aakhri 10 Transactions • Balance: ₹<span class="bal"></span></p>
  <div id="stmtList"></div>
  <button class="btn-ghost" onclick="showScreen('menu')">⬅️ Menu Me Wapas</button>
  <button onclick="window.print()">🖨️ Receipt Print Karein</button>
</div>

<!-- ================= SCREEN 8 : PIN CHANGE ================= -->
<div id="screen-pinchange" class="hidden">
  <h2>🔑 PIN Change Karein</h2>
  <div class="card">
    <div class="small">Purana PIN</div><input id="oldPin" type="password" maxlength="4" placeholder="Purana PIN">
    <div class="small">Naya PIN (4 Ank)</div><input id="newPin" type="password" maxlength="4" placeholder="Naya PIN">
    <div class="small">Naya PIN Dobara</div><input id="newPin2" type="password" maxlength="4" placeholder="Naya PIN Dobara">
    <button style="background:#f97316" onclick="doPinChange()">✅ PIN Badlein</button>
    <button class="btn-ghost" onclick="showScreen('menu')">⬅️ Menu Me Wapas</button>
    <p class="small center" id="pcMsg"></p>
  </div>
</div>

<!-- ================= SCREEN 9 : ADMIN ================= -->
<div id="screen-admin" class="hidden">
  <h2>👑 Admin Dashboard</h2><p class="small">Bank ke saare accounts</p>
  <div id="adminList"></div>
  <button class="btn-ghost" onclick="showScreen('menu')">⬅️ Menu Me Wapas</button>
</div>

<!-- ================= SCREEN 10 : SUCCESS ================= -->
<div id="screen-success" class="hidden">
  <div class="card center success" style="margin-top:30px">
    <div style="font-size:60px">✅</div>
    <h2 id="successTitle">Ho Gaya!</h2>
    <p class="small" id="successMsg"></p>
    <h1 id="successBal" style="color:#22c55e"></h1>
    <p class="small">Receipt Number: <span id="receiptNo"></span></p>
    <button onclick="showScreen('menu')">🏧 Menu Me Wapas</button>
    <button class="btn-red" onclick="logout()">🚪 Exit Karein</button>
  </div>
</div>

<p class="small center" style="margin-top:20px">🏦 Mera Bank ATM • 24x7 Service • Made by Bhumesh ❤️</p>
</div>

<script>
// ---------- DATA - Browser ki memory ----------
// Asli project me ye MySQL se aata hai
let currentUser = null;
let currentCard = '';
let allUsers = JSON.parse(localStorage.getItem('atm_users') || 'null');
let allTxns = JSON.parse(localStorage.getItem('atm_txns') || 'null');
if(!allUsers){ allUsers = ${JSON.stringify(DB.users)}; localStorage.setItem('atm_users', JSON.stringify(allUsers)); }
if(!allTxns){ allTxns = ${JSON.stringify(DB.transactions)}; localStorage.setItem('atm_txns', JSON.stringify(allTxns)); }
function save(){ localStorage.setItem('atm_users', JSON.stringify(allUsers)); localStorage.setItem('atm_txns', JSON.stringify(allTxns)); }
function now(){ return new Date().toLocaleString('hi-IN', { day:'numeric', month:'short', hour:'numeric', minute:'numeric' }); }
function fmt(n){ return Number(n).toLocaleString('en-IN'); }
setInterval(()=>{ document.getElementById('clock').innerText = new Date().toLocaleTimeString('hi-IN'); }, 1000);

// ---------- CARD FORMAT - 1234 5678 jaisa ----------
function formatCard(el){ let v = el.value.replace(/\\D/g,'').slice(0,16); el.value = v.replace(/(.{4})/g,'$1 ').trim(); }

// ---------- DEMO BHARO ----------
function fillDemo(){ document.getElementById('cardInput').value='1234 5678 9012 3456'; document.getElementById('cardMsg').innerText='✅ Demo Card bhar gaya, ab aage badhein'; }

// ---------- SCREEN BADALNA ----------
function showScreen(name){
  ['card','pin','menu','withdraw','deposit','transfer','statement','pinchange','admin','success'].forEach(s=>{
    document.getElementById('screen-'+s).classList.add('hidden');
  });
  document.getElementById('screen-'+name).classList.remove('hidden');
  if(name==='menu' || name==='withdraw' || name==='deposit' || name==='transfer' || name==='statement'){
    document.querySelectorAll('.bal').forEach(e=> e.innerText = fmt(currentUser.balance));
    document.getElementById('menuBalance').innerText = fmt(currentUser.balance);
  }
  if(name==='statement') renderStatement();
  if(name==='admin') renderAdmin();
  window.scrollTo(0,0);
}

// ---------- 1. CARD CHECK ----------
function checkCard(){
  let card = document.getElementById('cardInput').value.replace(/\\s/g,'');
  if(card.length !== 16) return document.getElementById('cardMsg').innerText = '⚠️ Card Number 16 ank ka hona chahiye';
  let u = allUsers.find(x=> x.card === card);
  if(!u) return document.getElementById('cardMsg').innerText = '❌ Ye card nahi mila. Demo Card use karein - 1234 5678 9012 3456';
  if(u.blocked) return document.getElementById('cardMsg').innerText = '🚫 Ye card BLOCK hai. 3 baar galat PIN dala tha. Admin se sampark karein.';
  currentCard = card;
  document.getElementById('pinUser').innerText = 'Namaste, ' + u.name + ' 🙏';
  document.getElementById('pinInput').value=''; updateDots();
  showScreen('pin');
}

// ---------- PIN KEYPAD ----------
function press(d){ let el=document.getElementById('pinInput'); if(el.value.length<4) el.value+=d; updateDots(); }
function clearPin(){ document.getElementById('pinInput').value=''; updateDots(); }
function updateDots(){ let v=document.getElementById('pinInput').value; document.getElementById('pinDots').innerText = '• '.repeat(v.length) + '○ '.repeat(4-v.length); }
function backToCard(){ showScreen('card'); }

// ---------- 2. PIN CHECK - SECURITY ----------
function checkPin(){
  let pin = document.getElementById('pinInput').value;
  let u = allUsers.find(x=> x.card === currentCard);
  if(pin.length !== 4) return document.getElementById('pinMsg').innerText = '⚠️ 4 ank ka PIN daalein';
  if(u.pin === pin){
    u.attempts = 0; save(); currentUser = u;
    document.getElementById('menuCardNo').innerText = currentCard.replace(/(.{4})/g,'$1 ').trim();
    document.getElementById('menuName').innerText = u.name;
    document.getElementById('menuType').innerText = u.type;
    document.getElementById('menuBalance').innerText = fmt(u.balance);
    if(u.type==='Admin') document.getElementById('adminBox').classList.remove('hidden');
    else document.getElementById('adminBox').classList.add('hidden');
    showScreen('menu');
  } else {
    u.attempts++; save();
    if(u.attempts >= 3){ u.blocked = true; save(); document.getElementById('pinMsg').innerText = '🚫 3 baar galat PIN! Card BLOCK ho gaya.'; }
    else document.getElementById('pinMsg').innerText = '❌ Galat PIN! Bache hue mauke: ' + (3-u.attempts);
    clearPin();
  }
}

// ---------- AMOUNT SET ----------
function setAmt(v,id){ document.getElementById(id).value=v; }

// ---------- SUCCESS DIKHANA ----------
function showSuccess(title,msg){
  document.getElementById('successTitle').innerText = title;
  document.getElementById('successMsg').innerText = msg;
  document.getElementById('successBal').innerText = 'Naya Balance: ₹' + fmt(currentUser.balance);
  document.getElementById('receiptNo').innerText = 'TXN' + Math.floor(Math.random()*900000+100000);
  showScreen('success');
}

// ---------- 3. WITHDRAW ----------
function doWithdraw(){
  let amt = Number(document.getElementById('wAmt').value);
  if(!amt || amt<=0) return document.getElementById('wMsg').innerText='⚠️ Sahi rashi daalein';
  if(amt % 100 !== 0) return document.getElementById('wMsg').innerText='⚠️ ATM se sirf 100 ke gunank me paise nikalte hain - jaise 500, 1000';
  if(amt > 20000) return document.getElementById('wMsg').innerText='⚠️ Ek baar me max ₹20,000 nikal sakte hain';
  if(amt > currentUser.balance) return document.getElementById('wMsg').innerText='❌ Balance kam hai! Aapke paas ₹'+fmt(currentUser.balance)+' hain';
  currentUser.balance -= amt; save();
  allTxns.unshift({card:currentUser.card, type:'Withdrawal', amount:amt, date:now(), balanceAfter:currentUser.balance}); save();
  document.getElementById('wAmt').value=''; document.getElementById('wMsg').innerText='';
  showSuccess('💸 Cash Nikal Gaya!', '₹'+fmt(amt)+' nikal liye. Cash neeche se le lein.');
}

// ---------- 4. DEPOSIT ----------
function doDeposit(){
  let amt = Number(document.getElementById('dAmt').value);
  if(!amt || amt<=0) return document.getElementById('dMsg').innerText='⚠️ Sahi rashi daalein';
  if(amt > 100000) return document.getElementById('dMsg').innerText='⚠️ Ek baar me max ₹1,00,000 jama kar sakte hain';
  currentUser.balance += amt;
  allTxns.unshift({card:currentUser.card, type:'Deposit', amount:amt, date:now(), balanceAfter:currentUser.balance}); save();
  document.getElementById('dAmt').value=''; document.getElementById('dMsg').innerText='';
  showSuccess('💰 Paisa Jama Ho Gaya!', '₹'+fmt(amt)+' aapke account me jama ho gaye.');
}

// ---------- 5. TRANSFER ----------
function doTransfer(){
  let to = document.getElementById('tTo').value.replace(/\\s/g,'');
  let amt = Number(document.getElementById('tAmt').value);
  if(to.length!==16) return document.getElementById('tMsg').innerText='⚠️ Sahi Card Number daalein';
  if(to===currentUser.card) return document.getElementById('tMsg').innerText='⚠️ Apne hi account me transfer nahi kar sakte';
  let receiver = allUsers.find(x=> x.card===to);
  if(!receiver) return document.getElementById('tMsg').innerText='❌ Ye account nahi mila';
  if(!amt || amt<=0) return document.getElementById('tMsg').innerText='⚠️ Sahi rashi daalein';
  if(amt > currentUser.balance) return document.getElementById('tMsg').innerText='❌ Balance kam hai';
  currentUser.balance -= amt; receiver.balance += amt;
  allTxns.unshift({card:currentUser.card, type:'Transfer Sent to '+receiver.name, amount:amt, date:now(), balanceAfter:currentUser.balance});
  allTxns.unshift({card:receiver.card, type:'Transfer Received from '+currentUser.name, amount:amt, date:now(), balanceAfter:receiver.balance});
  save();
  document.getElementById('tTo').value=''; document.getElementById('tAmt').value='';
  showSuccess('🔄 Transfer Ho Gaya!', '₹'+fmt(amt)+' '+receiver.name+' ko bhej diye.');
}

// ---------- 6. MINI STATEMENT ----------
function renderStatement(){
  let list = allTxns.filter(t=> t.card===currentUser.card).slice(0,10);
  document.getElementById('stmtList').innerHTML = list.map(t=>{
    let isOut = t.type.includes('Withdrawal') || t.type.includes('Sent');
    return '<div class="item"><div><b>'+t.type+'</b><div class="small">'+t.date+'</div></div><div style="text-align:right"><b style="color:'+(isOut?'#fca5a5':'#86efac')+'">'+(isOut?'- ₹':'+ ₹')+fmt(t.amount)+'</b><div class="small">Bal: ₹'+fmt(t.balanceAfter)+'</div></div></div>';
  }).join('') || '<div class="card center">Koi transaction nahi</div>';
}

// ---------- 7. PIN CHANGE ----------
function doPinChange(){
  let oldP=document.getElementById('oldPin').value;
  let n1=document.getElementById('newPin').value;
  let n2=document.getElementById('newPin2').value;
  if(oldP !== currentUser.pin) return document.getElementById('pcMsg').innerText='❌ Purana PIN galat hai';
  if(n1.length!==4) return document.getElementById('pcMsg').innerText='⚠️ Naya PIN 4 ank ka hona chahiye';
  if(n1!==n2) return document.getElementById('pcMsg').innerText='❌ Dono naya PIN same nahi hain';
  if(n1===oldP) return document.getElementById('pcMsg').innerText='⚠️ Naya PIN purane se alag rakhein';
  currentUser.pin=n1; save();
  document.getElementById('oldPin').value=''; document.getElementById('newPin').value=''; document.getElementById('newPin2').value='';
  showSuccess('🔑 PIN Badal Gaya!', 'Aapka naya PIN save ho gaya. Agli baar naya PIN use karein.');
}

// ---------- 8. ADMIN ----------
function renderAdmin(){
  document.getElementById('adminList').innerHTML = allUsers.map(u=>{
    return '<div class="card"><div style="display:flex;justify-content:space-between"><b>'+u.name+'</b><span class="badge">'+u.type+'</span></div><div class="small">Card: '+u.card.replace(/(.{4})/g,'$1 ').trim()+'<br>Balance: ₹'+fmt(u.balance)+' • Status: '+(u.blocked?'🚫 Blocked':'✅ Active')+'</div><button class="btn-yellow" onclick="unblock(\\''+u.card+'\\')">🔓 Unblock Karein</button></div>';
  }).join('');
}
function unblock(card){ let u=allUsers.find(x=> x.card===card); u.blocked=false; u.attempts=0; save(); renderAdmin(); alert(u.name+' ka card unblock ho gaya'); }

// ---------- 9. LOGOUT ----------
function logout(){ currentUser=null; currentCard=''; document.getElementById('cardInput').value=''; showScreen('card'); alert('Dhanyavaad! Apna Card le lena 🙏'); }
</script>
</body></html>
  `);
});

// ------------------------------------------------------------
//  STEP 3 : Server chalao
// ------------------------------------------------------------
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log('ATM chal gaya port ' + PORT + ' pe'));
