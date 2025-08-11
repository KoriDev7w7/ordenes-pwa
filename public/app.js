const API = '/.netlify/functions/fetchOrders';
const info = document.getElementById('info');
const tableWrap = document.getElementById('table-wrap');
const btnRefresh = document.getElementById('refresh');

async function fetchData() {
  info.textContent = 'Cargando...';
  tableWrap.innerHTML = '';
  try {
    const res = await fetch(API);
    if (!res.ok) throw new Error('Error al consultar API');
    const data = await res.json();
    renderTable(data);
    info.textContent = `Última actualización: ${new Date().toLocaleString()}`;
  } catch (err) {
    info.textContent = 'Error al obtener datos.';
    tableWrap.innerHTML = `<pre>${err}</pre>`;
  }
}

function renderTable(data) {
  if (!data || !data.rows || data.rows.length === 0) {
    tableWrap.innerHTML = '<p>No hay datos.</p>';
    return;
  }
  const headers = data.headers && data.headers.length ? data.headers : Object.keys(data.rows[0]);
  let html = '<table><thead><tr>' + headers.map(h => `<th>${escape(h)}</th>`).join('') + '</tr></thead><tbody>';
  data.rows.forEach(row => {
    html += '<tr>' + headers.map(h => `<td>${escape(row[h]||'')}</td>`).join('') + '</tr>';
  });
  html += '</tbody></table>';
  tableWrap.innerHTML = html;
}

function escape(s){ return String(s).replace(/[&<>]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[c])); }

btnRefresh.addEventListener('click', fetchData);
window.addEventListener('load', () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(()=>{});
  }
  fetchData();
});
