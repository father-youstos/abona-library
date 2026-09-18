const grid=document.getElementById('grid'), q=document.getElementById('q'), filters=document.getElementById('filters'), count=document.getElementById('count'), empty=document.getElementById('empty');
let active='الكل';
const cats=['الكل',...new Set(BOOKS.map(b=>b.category))];
cats.forEach(c=>{const x=document.createElement('button');x.textContent=c;x.className=c==='الكل'?'active':'';x.onclick=()=>{active=c;[...filters.children].forEach(b=>b.classList.toggle('active',b.textContent===c));render()};filters.appendChild(x)});
function card(b){const view=`https://drive.google.com/file/d/${b.id}/view`; const dl=`https://drive.google.com/uc?export=download&id=${b.id}`; const thumb=`https://drive.google.com/thumbnail?id=${b.id}&sz=w800`;
return `<article class="card"><div class="cover"><img loading="lazy" src="${thumb}" alt="غلاف ${b.title}"><span class="badge">${b.category}</span></div><div class="info"><h2>${b.title}</h2><p class="author">القمص يسطس جوزيف</p><div class="actions"><a class="btn primary" target="_blank" rel="noopener" href="${view}">قراءة الكتاب</a><a class="btn" href="${dl}">تحميل PDF</a></div></div></article>`}
function render(){const term=q.value.trim().toLowerCase();const list=BOOKS.filter(b=>(active==='الكل'||b.category===active)&&b.title.toLowerCase().includes(term));grid.innerHTML=list.map(card).join('');count.textContent=list.length;empty.hidden=!!list.length}
q.addEventListener('input',render);render();
