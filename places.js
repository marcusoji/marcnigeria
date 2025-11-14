
// Places page functionality
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('places.html')) {
        setupPlacesPage();
    }
});

function setupPlacesPage() {
    const searchInput = document.getElementById('search-input');
    const regionFilter = document.getElementById('region-filter');
    const categoryFilter = document.getElementById('category-filter');
    const resetFilters = document.getElementById('reset-filters');
    const placesGrid = document.getElementById('places-grid');
    const noResults = 

document.getElementById('no-results');

    // Load all destinations
    loadAllDestinations();

    // Event listeners for filters
    searchInput.addEventListener('input', filterDestinations);
    regionFilter.addEventListener('change', filterDestinations);
    categoryFilter.addEventListener('change', filterDestinations);
    resetFilters.addEventListener('click', resetAllFilters);

    function loadAllDestinations() {
        placesGrid.innerHTML = '';
        
        nigerianDestinations.forEach(destination => {

            const card = document.createElement('div');
            card.className = 'place-card animate';
            card.innerHTML = `
                <img src="${destination.image}" alt="${destination.name}" loading="lazy">
                <div class="place-card-content">
                    <h3>${destination.name}</h3>
                    <div class="location">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${destination.location}</span>
                    </div>
                    <span class="category">${destination.category}</span>
                    <p>${destination.description}</p>
                    <button class="btn btn-outline book-btn" data-id="${destination.id}">Book Visit</button>

                </div>
            `;
            placesGrid.appendChild(card);
        });

        // Add event listeners to book buttons
        document.querySelectorAll('.book-btn').forEach(button => {
            button.addEventListener('click', function() {
                const destinationId = this.getAttribute('data-id');
                openBookingModal(destinationId);
            });
        });
    }

    function filterDestinations() {
        const searchTerm = searchInput.value.toLowerCase();
        const regionValue = regionFilter.value;

        const categoryValue = categoryFilter.value;

        const filteredDestinations = nigerianDestinations.filter(destination => {
            const matchesSearch = destination.name.toLowerCase().includes(searchTerm) ||
                                destination.location.toLowerCase().includes(searchTerm) ||
                                destination.description.toLowerCase().includes(searchTerm);
            
            const matchesRegion = !regionValue || destination.region === regionValue;
            const matchesCategory = !categoryValue || destination.category === categoryValue;

            return matchesSearch && matchesRegion && matchesCategory;
        });

        displayFilteredDestinations(filteredDestinations);
    }

    function displayFilteredDestinations(destinations) {
        placesGrid.innerHTML = '';
        
        if (destinations.length === 0) {
            noResults.style.display = 'block';
            return;
        }

        noResults.style.display = 'none';

        destinations.forEach(destination => {
            const card = document.createElement('div');

            card.className = 'place-card animate';
            card.innerHTML = `
                <img src="${destination.image}" alt="${destination.name}" loading="lazy">
                <div class="place-card-content">
                    <h3>${destination.name}</h3>
                    <div class="location">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${destination.location}</span>
                    </div>
                    <span class="category">${destination.category}</span>
                    <p>${destination.description}</p>
                    <button class="btn btn-outline book-btn" data-id="${destination.id}">Book Visit</button>
                </div>
            `;

            placesGrid.appendChild(card);
        });

        // Re-add event listeners to book buttons
        document.querySelectorAll('.book-btn').forEach(button => {
            button.addEventListener('click', function() {
                const destinationId = this.getAttribute('data-id');
                openBookingModal(destinationId);
            });
        });
    }

    function resetAllFilters() {
        searchInput.value = '';
        regionFilter.value = '';
        categoryFilter.value = '';
        filterDestinations();

    }
}
