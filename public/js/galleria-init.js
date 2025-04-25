// Function to show error messages
function showError(message) {
  var gallery = document.getElementById('birthday-gallery');
  if (gallery) {
    gallery.innerHTML = '<div class="error-message">' + (message || 'Could not load gallery. Please try again later.') + '</div>';
  }
}

// Function to load the Galleria theme
function loadGalleriaTheme(callback) {
  var themeScript = document.createElement('script');
  themeScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/galleria/1.6.1/themes/classic/galleria.classic.min.js';
  
  themeScript.onload = function() {
    console.log('Galleria theme loaded successfully');
    if (callback && typeof callback === 'function') {
      callback();
    }
  };
  
  themeScript.onerror = function() {
    console.error('Failed to load Galleria theme');
    showError('Failed to load gallery theme');
  };
  
  document.head.appendChild(themeScript);
}

// Function to load Galleria and its theme sequentially
function loadGalleria(callback) {
  console.log('Loading Galleria.js...');
  
  // Check if Galleria is already loaded
  if (window.Galleria) {
    console.log('Galleria already in global scope, proceeding to theme');
    loadGalleriaTheme(callback);
    return;
  }
  
  // First load the Galleria core
  var galleriaScript = document.createElement('script');
  galleriaScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/galleria/1.6.1/galleria.min.js';
  galleriaScript.crossOrigin = 'anonymous';
  
  galleriaScript.onload = function() {
    console.log('Galleria core loaded successfully');
    
    // Then load the theme after core is loaded
    loadGalleriaTheme(callback);
  };
  
  galleriaScript.onerror = function() {
    console.error('Failed to load Galleria core');
    showError('Failed to load gallery library');
  };
  
  document.head.appendChild(galleriaScript);
}

// Function to initialize Galleria
function initGalleria() {
  console.log('Initializing Galleria...');
  
  if (!window.Galleria) {
    console.error('Galleria not loaded yet');
    return;
  }
  
  try {
    // Make sure the theme is properly loaded
    if (typeof window.Galleria.theme !== 'function') {
      console.log('Setting classic theme manually');
      window.Galleria.theme = window.Galleria.themes.classic || function() {};
    }
    
    // Configure Galleria with simpler options to avoid errors
    window.Galleria.configure({
      transition: 'fade',
      imageCrop: false,
      thumbCrop: true,
      responsive: true,
      showInfo: false,
      showCounter: false,
      height: 0.8,
      wait: true,
      debug: true
    });
    
    // Get all images from the gallery
    var images = [];
    document.querySelectorAll('#birthday-gallery a').forEach(function(a) {
      var img = a.querySelector('img');
      if (img) {
        images.push({
          image: a.getAttribute('href'),
          thumb: img.getAttribute('src')
        });
      }
    });
    
    // If we have images, use them directly
    if (images.length > 0) {
      console.log('Found ' + images.length + ' images in the gallery');
      window.Galleria.run('.galleria', {
        dataSource: images,
        theme: 'classic'
      });
    } else {
      // Otherwise use the default behavior
      window.Galleria.run('.galleria', {
        theme: 'classic'
      });
    }
    
    console.log('Galleria initialized successfully');
  } catch (error) {
    console.error('Error initializing Galleria:', error);
    showError('Error initializing gallery: ' + error.message);
  }
}

// Open gallery function - expose to global scope
window.openBirthdayGallery = function() {
  var container = document.getElementById('birthday-gallery-container');
  if (!container) {
    console.error('Gallery container not found');
    return;
  }
  
  // Show the gallery container
  container.style.display = 'flex';
  
  // Add a small delay to ensure the container is visible before initializing
  setTimeout(function() {
    // Check if Galleria is already loaded
    if (window.Galleria && typeof window.Galleria.run === 'function') {
      console.log('Galleria already loaded, initializing...');
      initGalleria();
    } else {
      // Load Galleria and initialize when ready
      console.log('Loading Galleria from scratch...');
      loadGalleria(function() {
        initGalleria();
      });
    }
  }, 100);
};

// Close gallery function - expose to global scope
window.closeBirthdayGallery = function() {
  var container = document.getElementById('birthday-gallery-container');
  if (!container) return;
  
  // Hide the gallery container
  container.style.display = 'none';
  
  // Try to destroy the Galleria instance to prevent memory leaks
  try {
    if (window.Galleria && typeof window.Galleria.get === 'function') {
      var gallery = window.Galleria.get(0);
      if (gallery && typeof gallery.destroy === 'function') {
        gallery.destroy();
      }
    }
  } catch (e) {
    console.error('Error destroying Galleria:', e);
  }
};

// Initialize event listeners when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  // Close when clicking outside the gallery
  var container = document.getElementById('birthday-gallery-container');
  if (container) {
    container.addEventListener('click', function(e) {
      if (e.target && e.target.id === 'birthday-gallery-container') {
        window.closeBirthdayGallery();
      }
    });
  }
  
  // Listen for ESC key to close gallery
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      window.closeBirthdayGallery();
    }
  });
});
