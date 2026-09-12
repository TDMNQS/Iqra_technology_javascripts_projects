const items = Array.from({ length: 100 }, (_, index) => `Item ${index + 1}`);
const perPage = 10; const pageCount = Math.ceil(items.length / perPage); let currentPage = 1;
function render() {
  const list = document.querySelector('#itemList'); list.replaceChildren();
  items.slice((currentPage - 1) * perPage, currentPage * perPage).forEach(value => { const item = document.createElement('li'); item.textContent = value; list.append(item); });
  const numbers = document.querySelector('#pageNumbers'); numbers.replaceChildren();
  for (let page = 1; page <= pageCount; page += 1) { const button = document.createElement('button'); button.type = 'button'; button.textContent = page; button.classList.toggle('active', page === currentPage); button.addEventListener('click', () => { currentPage = page; render(); }); numbers.append(button); }
  document.querySelector('#prevBtn').disabled = currentPage === 1; document.querySelector('#nextBtn').disabled = currentPage === pageCount;
  document.querySelector('#pageInfo').textContent = `Page ${currentPage} of ${pageCount}`;
}
document.querySelector('#prevBtn').addEventListener('click', () => { if (currentPage > 1) { currentPage -= 1; render(); } });
document.querySelector('#nextBtn').addEventListener('click', () => { if (currentPage < pageCount) { currentPage += 1; render(); } }); render();
