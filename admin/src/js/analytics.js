  // Create rain effect
  function createRain() {
      const rain = document.querySelector('.rain');
      const dropCount = 200;

      for (let i = 0; i < dropCount; i++) {
          const drop = document.createElement('span');
          drop.style.left = Math.random() * 100 + '%';
          drop.style.animationDelay = Math.random() * 2 + 's';
          drop.style.animationDuration = Math.random() * 1 + 1 + 's';
          rain.appendChild(drop);
      }
  }

  // Initialize charts
  function initCharts() {
      // Revenue Chart
      const revenueCtx = document.getElementById('revenueChart').getContext('2d');
      new Chart(revenueCtx, {
          type: 'line',
          data: {
              labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
              datasets: [{
                  label: 'Revenue',
                  data: [12000, 19000, 15000, 25000, 22000, 30000],
                  borderColor: '#4a9fff',
                  tension: 0.4,
                  fill: true,
                  backgroundColor: 'rgba(74, 159, 255, 0.1)'
              }]
          },
          options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                  legend: {
                      display: false
                  }
              },
              scales: {
                  y: {
                      beginAtZero: true,
                      grid: {
                          color: 'rgba(255, 255, 255, 0.1)'
                      },
                      ticks: {
                          color: 'rgba(255, 255, 255, 0.7)'
                      }
                  },
                  x: {
                      grid: {
                          color: 'rgba(255, 255, 255, 0.1)'
                      },
                      ticks: {
                          color: 'rgba(255, 255, 255, 0.7)'
                      }
                  }
              }
          }
      });

      // Products Chart
      const productsCtx = document.getElementById('productsChart').getContext('2d');
      new Chart(productsCtx, {
          type: 'bar',
          data: {
              labels: ['iPhone 14', 'ASUS ROG', 'Samsung S23', 'MacBook Pro', 'Dell XPS'],
              datasets: [{
                  label: 'Units Sold',
                  data: [150, 120, 110, 95, 85],
                  backgroundColor: [
                      'rgba(74, 159, 255, 0.8)',
                      'rgba(74, 219, 255, 0.8)',
                      'rgba(74, 255, 159, 0.8)',
                      'rgba(159, 74, 255, 0.8)',
                      'rgba(255, 74, 159, 0.8)'
                  ]
              }]
          },
          options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                  legend: {
                      display: false
                  }
              },
              scales: {
                  y: {
                      beginAtZero: true,
                      grid: {
                          color: 'rgba(255, 255, 255, 0.1)'
                      },
                      ticks: {
                          color: 'rgba(255, 255, 255, 0.7)'
                      }
                  },
                  x: {
                      grid: {
                          color: 'rgba(255, 255, 255, 0.1)'
                      },
                      ticks: {
                          color: 'rgba(255, 255, 255, 0.7)'
                      }
                  }
              }
          }
      });
  }

  // Initialize
  document.addEventListener('DOMContentLoaded', function() {
      createRain();
      initCharts();

      // Handle period selection
      document.querySelectorAll('.chart-period').forEach(button => {
          button.addEventListener('click', function() {
              const parent = this.parentElement;
              parent.querySelectorAll('.chart-period').forEach(btn => btn.classList.remove('active'));
              this.classList.add('active');
              // Here you would typically update the chart data based on the selected period
          });
      });
  });

  // Mobile navigation handlers
  function showMore(event) {
      event.preventDefault();
      const moreMenu = document.getElementById('moreMenu');
      moreMenu.style.display = moreMenu.style.display === 'block' ? 'none' : 'block';
  }

  // Close more menu when clicking outside
  document.addEventListener('click', function(event) {
      const moreMenu = document.getElementById('moreMenu');
      if (!event.target.closest('.mobile-nav-item') && !event.target.closest('#moreMenu')) {
          moreMenu.style.display = 'none';
      }
  });