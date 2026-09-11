const items = Array.from({ length: 100 }, (_, index) => ({
  id: index + 1,
  title: `JavaScript Learning Resource ${String(index + 1).padStart(3, '0')}`,
  level: ['Beginner', 'Intermediate', 'Advanced'][index % 3]
}));
const perPage = 10;
const totalPages = Math.ceil(items.length / perPage);
let currentPage = 1;

function renderPage() {
  const start = (currentPage - 1) * perPage;
  const visible = items.slice(start, start + perPage);
  document.querySelector('#rangeLabel').textContent = `${start + 1}–${start + visible.length} of ${items.length}`;
  document.querySelector('#itemList').innerHTML = visible.map(item => `<article class="list-item"><div><strong>${item.title}</strong><div class="muted">Resource ID: JS-${String(item.id).padStart(3, '0')}</div></div><span class="badge ${item.level === 'Advanced' ? 'high' : item.level === 'Intermediate' ? 'medium' : 'low'}">${item.level}</span></article>`).join('');
  const controls = [
    `<button class="page-btn" data-page="${currentPage - 1}" ${currentPage === 1 ? 'disabled' : ''} aria-label="Previous page">‹</button>`,
    ...Array.from({ length: totalPages }, (_, index) => `<button class="page-btn ${currentPage === index + 1 ? 'active' : ''}" data-page="${index + 1}" aria-label="Page ${index + 1}" ${currentPage === index + 1 ? 'aria-current="page"' : ''}>${index + 1}</button>`),
    `<button class="page-btn" data-page="${currentPage + 1}" ${currentPage === totalPages ? 'disabled' : ''} aria-label="Next page">›</button>`
  ];
  document.querySelector('#pagination').innerHTML = controls.join('');
}

document.querySelector('#pagination').addEventListener('click', event => {
  const page = Number(event.target.dataset.page);
  if (!page || page < 1 || page > totalPages) return;
  currentPage = page;
  renderPage();
  document.querySelector('#itemList').focus?.();
});
renderPage();
