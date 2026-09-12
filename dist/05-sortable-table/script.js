const products = [
  { name: 'Product A', price: 29.99, category: 'Electronics' }, { name: 'Product B', price: 12.50, category: 'Clothing' },
  { name: 'Product C', price: 45.00, category: 'Home' }, { name: 'Product D', price: 8.99, category: 'Clothing' },
  { name: 'Product E', price: 99.00, category: 'Electronics' }, { name: 'Product F', price: 18.75, category: 'Books' },
  { name: 'Product G', price: 32.25, category: 'Home' }, { name: 'Product H', price: 6.50, category: 'Books' }
];
let sortKey = 'name'; let sortDirection = 1;
const categoryFilter = document.querySelector('#categoryFilter');
[...new Set(products.map(product => product.category))].sort().forEach(category => { const option = document.createElement('option'); option.value = category; option.textContent = category; categoryFilter.append(option); });

function render() {
  const query = document.querySelector('#searchInput').value.trim().toLowerCase(); const category = categoryFilter.value;
  const rows = products.filter(product => product.name.toLowerCase().includes(query) && (!category || product.category === category)).sort((a, b) => {
    const left = a[sortKey]; const right = b[sortKey]; return (typeof left === 'number' ? left - right : left.localeCompare(right)) * sortDirection;
  });
  const body = document.querySelector('#productBody'); body.replaceChildren();
  rows.forEach(product => { const row = body.insertRow(); [product.name, `$${product.price.toFixed(2)}`, product.category].forEach(value => { const cell = row.insertCell(); cell.textContent = value; }); });
  document.querySelector('#resultCount').textContent = `${rows.length} product(s) shown`;
}
document.querySelectorAll('th[data-key]').forEach(header => header.addEventListener('click', () => {
  const key = header.dataset.key; if (sortKey === key) sortDirection *= -1; else { sortKey = key; sortDirection = 1; } render();
}));
document.querySelector('#searchInput').addEventListener('input', render); categoryFilter.addEventListener('change', render); render();
