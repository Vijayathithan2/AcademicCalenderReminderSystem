const adminBtn = document.getElementById('adminBtn');
const studentBtn = document.getElementById('studentBtn');
const adminSection = document.getElementById('adminSection');
const studentSection = document.getElementById('studentSection');
const message = document.getElementById('message');

adminBtn.onclick = () => { adminSection.classList.toggle('hidden'); studentSection.classList.add('hidden'); }
studentBtn.onclick = () => { studentSection.classList.toggle('hidden'); adminSection.classList.add('hidden'); }

// Create event
document.getElementById('createEventBtn').onclick = async () => {
  const title = document.getElementById('eventTitle').value;
  const date = document.getElementById('eventDate').value;
  const desc = document.getElementById('eventDesc').value;
  const alertBefore = parseInt(document.getElementById('alertBefore').value || '24');
  if(!title || !date){ showMsg('Title and date required'); return; }
  const res = await fetch('/api/events', {
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify({title, date, description:desc, alertBeforeHours:alertBefore})
  });
  showMsg((await res.json()).message || 'Event created');
  loadEvents();
}

// Student register & auto-subscribe (simple)
document.getElementById('stuRegisterBtn').onclick = async () => {
  const name = document.getElementById('stuName').value;
  const email = document.getElementById('stuEmail').value;
  if(!name || !email){ showMsg('Name and Email required'); return; }
  const res = await fetch('/api/users', {
    method:'POST', headers:{'Content-Type':'application/json'},
    body: JSON.stringify({name, email})
  });
  showMsg((await res.json()).message || 'Registered');
  loadEvents();
}

async function loadEvents(){
  const res = await fetch('/api/events');
  const events = await res.json();
  const el = document.getElementById('eventsList');
  el.innerHTML = events.map(e => `<div class="card"><strong>${e.title}</strong><div>${new Date(e.date).toLocaleString()}</div><div>${e.description||''}</div></div>`).join('');
  const ael = document.getElementById('adminEventsList');
  if(ael) ael.innerHTML = events.map(e => `<div><strong>${e.title}</strong> - ${new Date(e.date).toLocaleString()}</div>`).join('');
}

function showMsg(txt){
  message.textContent = txt; message.classList.remove('hidden');
  setTimeout(()=>message.classList.add('hidden'),3000);
}

loadEvents()