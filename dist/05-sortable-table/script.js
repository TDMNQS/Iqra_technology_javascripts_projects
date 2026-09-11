const products = [
  { name: 'Mechanical Keyboard', price: 3499, category: 'Accessories', rating: 4.7, stock: 18 },
  { name: 'Wireless Mouse', price: 1299, category: 'Accessories', rating: 4.4, stock: 42 },
  { name: '27-inch Monitor', price: 18999, category: 'Displays', rating: 4.6, stock: 11 },
  { name: 'USB-C Hub', price: 2199, category: 'Accessories', rating: 4.2, stock: 30 },
  { name: 'Developer Laptop', price: 74999, category: 'Computers', rating: 4.8, stock: 7 },
  { name: 'Noise-Canceling Headphones', price: 8999, category: 'Audio', rating: 4.5, stock: 16 },
  { name: 'Portable SSD 1TB', price: 7299, category: 'Storage', rating: 4.7, stock: 23 },
  { name: 'Web Camera', price: 2799, category: 'Video', rating: 4.1, stock: 14 },
  { name: 'Bluetooth Speaker', price: 3999, category: 'Audio', rating: 4.3, stock: 28 },
  { name: 'Tablet', price: 32999, category: 'Computers', rating: 4.4, stock: 9 },
  { name: '4K Monitor', price: 31999, category: 'Displays', rating: 4.8, stock: 5 },
  { name: 'External HDD 2TB', price: 5999, category: 'Storage', rating: 4.2, stock: 20 }
];
let sortKey = 'name';
let direction = 1;
const price = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });

function render() {
  const query = document.querySelector('#search').value.trim().toLowerCase();
  const category = document.querySelector('#categoryFilter').value;
  const rows = products.filter(product => product.name.toLowerCase().includes(query) && (category === 'all' || product.category === category)).sort((a,b) => {
    const left = a[sortKey], right = b[sortKey];
    return (typeof left === 'string' ? left.localeCompare(right) : left - right) * direction;
  });
  document.querySelector('#resultCount').textContent = `${rows.length} results`;
  document.querySelector('#productRows').innerHTML = rows.length ? rows.map(product => `<tr><td><strong>${product.name}</strong></td><td>${price.format(product.price)}</td><td><span class="badge">${product.category}</span></td><td>${product.rating.toFixed(1)} / 5</td><td>${product.stock}</td></tr>`).join('') : '<tr><td colspan="5" class="empty">No matching products found.</td></tr>';
  document.querySelectorAll('[data-sort] span').forEach(span => { span.textContent = ''; });
  document.querySelector(`[data-sort="${sortKey}"] span`).textContent = direction === 1 ? '↑' : '↓';
}

const categorySelect = document.querySelector('#categoryFilter');
[...new Set(products.map(item => item.category))].sort().forEach(category => categorySelect.add(new Option(category, category)));
document.querySelector('#search').addEventListener('input', render);
categorySelect.addEventListener('change', render);
document.querySelectorAll('[data-sort]').forEach(button => button.addEventListener('click', () => {
  if (sortKey === button.dataset.sort) direction *= -1;
  else { sortKey = button.dataset.sort; direction = 1; }
  render();
}));
render();
