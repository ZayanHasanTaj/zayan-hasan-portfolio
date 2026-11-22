(() => {
  'use strict';

  // Category Filtering Logic
  const filterTabs = document.querySelectorAll('.filter-tab');
  const projectCards = document.querySelectorAll('.showcase-card');
  const showingText = document.getElementById('showing-text');

  function calculateCounts() {
    let counts = {
      all: projectCards.length,
      fullstack: 0,
      frontend: 0,
      dashboard: 0
    };

    projectCards.forEach(card => {
      const cat = card.getAttribute('data-category');
      if (counts[cat] !== undefined) {
        counts[cat]++;
      }
    });

    const countAllEl = document.getElementById('count-all');
    const countFullstackEl = document.getElementById('count-fullstack');
    const countFrontendEl = document.getElementById('count-frontend');
    const countDashboardEl = document.getElementById('count-dashboard');

    if (countAllEl) countAllEl.textContent = counts.all;
    if (countFullstackEl) countFullstackEl.textContent = counts.fullstack;
    if (countFrontendEl) countFrontendEl.textContent = counts.frontend;
    if (countDashboardEl) countDashboardEl.textContent = counts.dashboard;
  }

  function filterProjects(category) {
    let visibleCount = 0;

    projectCards.forEach(card => {
      const cardCategory = card.getAttribute('data-category');
      const shouldShow = category === 'all' || cardCategory === category;

      if (shouldShow) {
        card.classList.remove('card-hidden');
        card.style.opacity = '0';
        card.style.transform = 'translateY(15px)';
        setTimeout(() => {
          card.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, 30);
        visibleCount++;
      } else {
        card.classList.add('card-hidden');
      }
    });

    if (showingText) {
      showingText.textContent = `Showing ${visibleCount} of ${projectCards.length} projects`;
    }
  }

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      const filterValue = tab.getAttribute('data-filter');
      filterProjects(filterValue);
    });
  });

  // Initialize
  calculateCounts();
})();
