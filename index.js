// Nigerian destinations database
let nigerianDestinations = [];

// DOM Elements
const featuredDestinationsGrid = document.getElementById('featured-destinations-grid');
const bookingModal = document.getElementById('booking-modal');
const successModal = document.getElementById('success-modal');
const bookingForm = document.getElementById('booking-form');
const contactForm = document.getElementById('contactForm');
const newsletterForm = document.getElementById('newsletterForm');

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    loadDestinations();
    setupEventListeners();
    setupMobileMenu();
});

// Load destinations from JSON or localStorage
async function loadDestinations() {
    // If no stored destinations, try to load from JSON file
    try {
        const response = await fetch('./data/destinations.json');
        nigerianDestinations = await response.json();
        loadFeaturedDestinations();
    } catch (error) {
        console.error('Error loading destinations:', error);
        // Fallback to default destinations if JSON fails to load
        nigerianDestinations = getDefaultDestinations();
        loadFeaturedDestinations();
    }
}

// Get default destinations (fallback)
function getDefaultDestinations() {
    return [
        {
            id: 1,
            name: "Obudu Mountain Resort",
            location: "Cross River State",
            region: "South South",
            category: "Mountain Resort",
            description: "A breathtaking mountain resort with stunning views, cable cars, and natural swimming pools.",
            image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
            featured: true
        },
        {
            id: 2,
            name: "Yankari Game Reserve",
            location: "Bauchi State",
            region: "North East",
            category: "Wildlife Reserve",
            description: "Home to a wide variety of wildlife including elephants, lions, and baboons, with natural warm springs.",
            image: "https://images.unsplash.com/photo-1550358864-518f202c02ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
            featured: true
        },
        {
            id: 3,
            name: "Erin Ijesha Waterfall",
            location: "Osun State",
            region: "South West",
            category: "Waterfall",
            description: "A spectacular seven-level waterfall with natural pools perfect for swimming and relaxation.",
            image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
            featured: true
        },
        {
            id: 4,
            name: "Lekki Conservation Centre",
            location: "Lagos State",
            region: "South West",
            category: "Nature Reserve",
            description: "A nature reserve with a famous canopy walkway, wildlife viewing, and beautiful landscapes.",
            image: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
            featured: true
        },
        {
            id: 5,
            name: "Zuma Rock",
            location: "Niger State",
            region: "North Central",
            category: "Natural Landmark",
            description: "A massive monolith that stands out prominently in the landscape, often called the 'Gateway to Abuja'.",
            image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
            featured: true
        },
        {
            id: 6,
            name: "Gurara Waterfalls",
            location: "Niger State",
            region: "North Central",
            category: "Waterfall",
            description: "A majestic waterfall with a drop of about 30 meters, surrounded by beautiful scenery.",
            image: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
            featured: true
        }
    ];
}

// Load featured destinations
function loadFeaturedDestinations() {
    // Only run if the featured destinations grid exists (i.e., on index.html)
    if (!featuredDestinationsGrid) {
        return;
    }
    
    const featuredDestinations = nigerianDestinations.filter(dest => dest.featured);
    
    featuredDestinationsGrid.innerHTML = '';
    
    featuredDestinations.forEach(destination => {
        const card = document.createElement('div');
        card.className = 'destination-card animate';
        card.innerHTML = `
            <div class="card-img">
                <img src="${destination.image}" alt="${destination.name}" loading="lazy">
            </div>
            <div class="card-content">
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
        featuredDestinationsGrid.appendChild(card);
    });
    
    // Add event listeners to book buttons
    document.querySelectorAll('.book-btn').forEach(button => {
        button.addEventListener('click', function() {
            const destinationId = this.getAttribute('data-id');
            openBookingModal(destinationId);
        });
    });
}

// Setup mobile menu
function setupMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
    }
}

// Setup event listeners
function setupEventListeners() {
    // Close modals
    const closeBookingModal = document.getElementById('close-booking-modal');
    if (closeBookingModal) {
        closeBookingModal.addEventListener('click', () => {
            bookingModal.style.display = 'none';
        });
    }
    
    const closeSuccessModal = document.getElementById('close-success-modal');
    if (closeSuccessModal) {
        closeSuccessModal.addEventListener('click', () => {
            successModal.style.display = 'none';
        });
    }
    
    const closeSuccessBtn = document.getElementById('close-success-btn');
    if (closeSuccessBtn) {
        closeSuccessBtn.addEventListener('click', () => {
            successModal.style.display = 'none';
        });
    }

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (bookingModal && e.target === bookingModal) {
            bookingModal.style.display = 'none';
        }
        if (successModal && e.target === successModal) {
            successModal.style.display = 'none';
        }
    });
    
    // Form submissions
    if (bookingForm) {
        bookingForm.addEventListener('submit', handleBookingSubmit);
    }
    
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', handleNewsletterSubmit);
    }
}

// Open booking modal
function openBookingModal(destinationId) {
    const destination = nigerianDestinations.find(dest => dest.id == destinationId);
    if (destination) {
        document.getElementById('booking-destination').value = destination.name;
        bookingModal.style.display = 'flex';
    }
}

// Handle booking form submission
function handleBookingSubmit(e) {
    e.preventDefault();
    
    // Safely get form values with fallbacks
    const getValueById = (id) => {
        const element = document.getElementById(id);
        return element ? element.value : '';
    };
    
    const formData = {
        destination: getValueById('booking-destination'),
        name: getValueById('booking-name'),
        email: getValueById('booking-email'),
        phone: getValueById('booking-phone'),
        date: getValueById('booking-date'),
        groupSize: getValueById('booking-group-size'),
        message: getValueById('booking-message')
    };
    
    // Validate required fields
    if (!formData.name || !formData.email || !formData.phone) {
        alert('Please fill in all required fields.');
        return;
    }
    
    // Send to WhatsApp
    const whatsappMessage = `New Booking Request:%0A%0A*Destination:* ${formData.destination}%0A*Name:* ${formData.name}%0A*Email:* ${formData.email}%0A*Phone:* ${formData.phone}%0A*Preferred Date:* ${formData.date || 'Not specified'}%0A*Group Size:* ${formData.groupSize || 'Not specified'}%0A*Message:* ${formData.message}`;
    
    const whatsappNumber = '2349042007583';
    window.open(`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`, '_blank');
    
    // Send to EmailJS
    sendEmailJS('booking_template', formData);
    
    // Show success message
    if (bookingModal) bookingModal.style.display = 'none';
    if (successModal) successModal.style.display = 'flex';
    if (bookingForm) bookingForm.reset();
}

// Handle contact form submission
function handleContactSubmit(e) {
    e.preventDefault();
    
    // Safely get form values with fallbacks
    const getValueById = (id) => {
        const element = document.getElementById(id);
        return element ? element.value : '';
    };
    
    const formData = {
        name: getValueById('name'),
        email: getValueById('email'),
        phone: getValueById('phone'),
        subject: getValueById('subject'),
        message: getValueById('message')
    };
    
    // Validate required fields
    if (!formData.name || !formData.email || !formData.message) {
        alert('Please fill in all required fields.');
        return;
    }
    
    // Send to WhatsApp
    const whatsappMessage = `New Contact Form Submission:%0A%0A*Name:* ${formData.name}%0A*Email:* ${formData.email}%0A*Phone:* ${formData.phone || 'Not provided'}%0A*Subject:* ${formData.subject || 'No subject'}%0A*Message:* ${formData.message}`;
    
    const whatsappNumber = '2349042007583';
    window.open(`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`, '_blank');
    
    // Send to EmailJS
    sendEmailJS('contact_template', formData);
    
    alert('Thank you for your message! We will get back to you soon.');
    if (contactForm) contactForm.reset();
}

// Handle newsletter subscription
function handleNewsletterSubmit(e) {
    e.preventDefault();
    const email = e.target.querySelector('input[type="email"]').value;
    
    // Send to EmailJS
    sendEmailJS('newsletter_template', { email: email });
    
    alert('Thank you for subscribing to our newsletter!');
    e.target.reset();
}

// EmailJS integration
function sendEmailJS(template, data) {
    // Check if emailjs is loaded
    if (typeof emailjs === 'undefined') {
        console.log('EmailJS not loaded. Skipping email send. Data:', { template, data });
        return;
    }
    
    const serviceID = 'service_qdqu4cb';
    const templateID = 'template_1t3wlw9';
    const publicKey = 'hziy2oF_5ZR2zWtO9';
    
    try {
        emailjs.send(serviceID, templateID, data, publicKey)
            .then((response) => {
                console.log('Email sent successfully:', response);
            })
            .catch((error) => {
                console.log('Email failed to send:', error);
            });
    } catch (error) {
        console.log('EmailJS error:', error);
    }
}

// Scroll animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.animate').forEach(element => {
    observer.observe(element);
});