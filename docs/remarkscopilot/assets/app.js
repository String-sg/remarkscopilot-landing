// assets/app.js

// your data
const quarters = ['2025 Q2','2025 Q1','2024 Q4','2024 Q3','2024 Q2','2023 Q4','2023 Q3'];
const metrics = {
  '2025 Q2': { totalUsers:'1825', mau:'53,894', cost:'$50*', teamMembers:1, remarks:'7664' },
  '2025 Q1': { totalUsers:'1641', mau:'48,000', cost:'$50*', teamMembers:1, remarks:'1991' },
  '2024 Q4': { totalUsers:'1557', mau:'45,000', cost:'$50*', teamMembers:1, remarks:'6374' },
  '2024 Q3': { totalUsers:'1460', mau:'42,000', cost:'$50*', teamMembers:1, remarks:'10918' },
  '2024 Q2': { totalUsers:'1210', mau:'42,000', cost:'$50*', teamMembers:1, remarks:'11499' },
  '2024 Q1': { totalUsers:'833', mau:'42,000', cost:'$50*', teamMembers:1, remarks:'2013' },
  '2023 Q4': { totalUsers:'711', mau:'42,000', cost:'$50*', teamMembers:1, remarks:'10247' },
  '2023 Q3': { totalUsers:'413', mau:'42,000', cost:'$3,379.48', teamMembers:3, remarks:'10546' }
};

// only Q3-2024 has a special team layout
const teamConfig = {
  '2024 Q3': {
    count:    3,
    avatars: ['kahhow.png','rayner.png','natalie.png'],
    breakdown: '1/10 Eng, 1/10 Design, 1/10 PM+Ops'
  }
};

// helper to pull nested props
function get(obj,path){
  return path.split('.').reduce((o,p)=>o&&o[p], obj);
}
// strip non-numeric chars
function parseNumber(str){
  return parseFloat(str.toString().replace(/[^0-9\.]/g,''))||0;
}

document.addEventListener('DOMContentLoaded', ()=>{
  const sel = document.getElementById('quarter');
  // build dropdown
  quarters.forEach(q=> sel.add(new Option(q,q)));
  sel.addEventListener('change', ()=> render(sel.value));
  sel.value = quarters[0];
  render(sel.value);
});

function render(q){
  const idx  = quarters.indexOf(q),
        prev = quarters[idx+1],
        d    = metrics[q],
        p    = metrics[prev]||{};

  // ---- fill basic metrics ----
  document.querySelectorAll('[data-metric]').forEach(el=>{
    el.textContent = get(d, el.dataset.metric);
  });

  // ---- fill %-changes ----
  document.querySelectorAll('[data-change]').forEach(el=>{
    const key   = el.dataset.change,
          curr  = parseNumber(get(d,key)),
          prevv = parseNumber(get(p,key)),
          pct   = prevv ? ((curr-prevv)/prevv*100).toFixed(1) : 0;
    el.textContent = (pct>=0?'+':'')+pct+'%';
    el.classList.remove('positive','negative');
    el.classList.add(pct>=0?'positive':'negative');
  });

  // ---- team members & avatars ----
  let conf;
  if (q === '2024 Q3') {
    conf = teamConfig[q];
  } else {
    // everyone else: 1 person, Kahhow + Ops
    conf = {
      count:    1,
      avatars: ['kahhow.png'],
      breakdown: '1/10 Ops'
    };
  }

  // update the count
  document.querySelector('[data-metric="teamMembers"]').textContent = conf.count;
  // update the breakdown line (make sure you have an element with class="breakdown")
  const bd = document.querySelector('.breakdown');
  if (bd) bd.textContent = conf.breakdown;

  // rebuild avatars
  const avatarGroup = document.querySelector('.avatar-group');
  avatarGroup.innerHTML = '';
  conf.avatars.forEach(file => {
    const img = document.createElement('img');
    img.src       = `team/${file}`;
    img.className = 'avatar';
    avatarGroup.appendChild(img);
  });
}
