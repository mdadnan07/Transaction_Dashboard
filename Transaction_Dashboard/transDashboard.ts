document.addEventListener('DOMContentLoaded', () => {
  const tableBody = document.getElementById('transaction-table');
  const barChartCanvas = document.getElementById('bar-chart');
  const searchBox = document.getElementById('search-box');
  const monthSelect = document.getElementById('month-select');
  const totalSaleElement = document.getElementById('total-sale');
  const totalSoldItemsElement = document.getElementById('total-sold-items');
  const totalNotSoldItemsElement = document.getElementById('total-not-sold-items');
  const selectedMonthElement = document.getElementById('selected-month');

  let transactions = []; // Mocked transaction data
  let filteredTransactions = []; // Filtered data based on search or month
  let currentPage = 1;
  const perPage = 10;
  let barChartInstance = null;

  // Mock data for the table 
  for (let i = 1; i <= 50; i++) {
    transactions.push({
      id: i,
      title: `Product ${i}`,
      description: `Description for product ${i}`,
      price: Math.floor(Math.random() * 1000),
      category: 'Category ' + ((i % 5) + 1),
      sold: i % 2 === 0 ? 'Yes' : 'No',
      image: 'https://via.placeholder.com/50',
      month: ["March", "April", "May"][(i % 3)] // Mock month data for demonstration
    });
  }

  function updateStats() {
    const totalSale = filteredTransactions.reduce((sum, item) => sum + item.price, 0);
    const totalSoldItems = filteredTransactions.filter(item => item.sold === 'Yes').length;
    const totalNotSoldItems = filteredTransactions.filter(item => item.sold === 'No').length;

    totalSaleElement.textContent = totalSale;
    totalSoldItemsElement.textContent = totalSoldItems;
    totalNotSoldItemsElement.textContent = totalNotSoldItems;
    selectedMonthElement.textContent = monthSelect.value;
  }

  function applyFilters() {
    const selectedMonth = monthSelect.value;
    // Filter transactions based on selected month
    filteredTransactions = transactions.filter(item => item.month === selectedMonth);
    if (filteredTransactions.length === 0) {
      filteredTransactions = transactions; // If no data for selected month, show all
    }
  }

  function renderTable() {
    tableBody.innerHTML = '';
    const startIndex = (currentPage - 1) * perPage;
    const paginatedData = filteredTransactions.slice(startIndex, startIndex + perPage);

    paginatedData.forEach(item => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${item.id}</td>
        <td>${item.title}</td>
        <td>${item.description}</td>
        <td>${item.price}</td>
        <td>${item.category}</td>
        <td>${item.sold}</td>
        <td><img src="${item.image}" alt="Product Image"></td>
      `;
      tableBody.appendChild(row);
    });
    updateStats();
    renderBarChart();
  }

  function renderBarChart() {
    const priceRanges = {
      '0-100': 0,
      '101-200': 0,
      '201-300': 0,
      '301-400': 0,
      '401-500': 0,
      '501-600': 0,
      '601-700': 0,
      '701-800': 0,
      '801-900': 0,
      '901-above': 0
    };

    filteredTransactions.forEach(item => {
      if (item.price <= 100) priceRanges['0-100']++;
      else if (item.price <= 200) priceRanges['101-200']++;
      else if (item.price <= 300) priceRanges['201-300']++;
      else if (item.price <= 400) priceRanges['301-400']++;
      else if (item.price <= 500) priceRanges['401-500']++;
      else if (item.price <= 600) priceRanges['501-600']++;
      else if (item.price <= 700) priceRanges['601-700']++;
      else if (item.price <= 800) priceRanges['701-800']++;
      else if (item.price <= 900) priceRanges['801-900']++;
      else priceRanges['901-above']++;
    });

    if (barChartInstance) {
      barChartInstance.destroy();
    }

    barChartInstance = new Chart(barChartCanvas, {
      type: 'bar',
      data: {
        labels: Object.keys(priceRanges),
        datasets: [{
          label: '# of Items',
          data: Object.values(priceRanges),
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: { enabled: true }
        },
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  }

  // Event listeners
  document.getElementById('prev-page').addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      renderTable();
    }
  });

  document.getElementById('next-page').addEventListener('click', () => {
    if (currentPage < Math.ceil(filteredTransactions.length / perPage)) {
      currentPage++;
      renderTable();
    }
  });

  searchBox.addEventListener('input', () => {
    const query = searchBox.value.toLowerCase();

    // Filter transactions by title, description, price and selected month
    filteredTransactions = transactions.filter(item => 
      item.month === monthSelect.value && (
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.price.toString().includes(query)
      )
    );

    currentPage = 1; // Reset to first page when searching
    renderTable();
  });

  monthSelect.addEventListener('change', () => {
    applyFilters();
    currentPage = 1;
    renderTable();
  });

  applyFilters();
  renderTable();
});
