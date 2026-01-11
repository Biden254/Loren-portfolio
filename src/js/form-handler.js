const API_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:3001/api/contact' 
  : 'https://loren-portfolio-backend.onrender.com/api/contact';

document.addEventListener('DOMContentLoaded', function() {
  const contactForm = document.querySelector('form[name="contact"]');
  
  if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      // Show loading state
      const submitButton = contactForm.querySelector('button[type="submit"]');
      const originalButtonText = submitButton.innerHTML;
      submitButton.disabled = true;
      submitButton.innerHTML = 'Sending...';
      
      // Get form data
      const formData = new FormData(contactForm);
      const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        subject: formData.get('subject') || 'New Message from Portfolio Contact Form',
        message: formData.get('message')
      };
      try {
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        const result = await response.json();
        
        if (result.success) {
          // Show success message
          const successMessage = document.createElement('div');
          successMessage.className = 'success-message';
          successMessage.innerHTML = `
            <div style="background: #d4edda; color: #155724; padding: 1rem; margin: 1rem 0; border-radius: 4px; border: 1px solid #c3e6cb; display: flex; justify-content: space-between; align-items: center;">
              <span>✅ Your message has been sent successfully! I'll get back to you soon.</span>
              <button onclick="this.parentElement.style.display='none'" style="background: none; border: none; color: #155724; font-size: 1.2rem; cursor: pointer;">&times;</button>
            </div>
          `;
          
          // Insert the message before the form
          contactForm.parentNode.insertBefore(successMessage, contactForm);
          contactForm.reset();
          
          // Auto-hide after 5 seconds
          setTimeout(() => {
            successMessage.style.transition = 'opacity 0.5s';
            successMessage.style.opacity = '0';
            setTimeout(() => successMessage.remove(), 500);
          }, 5000);
        } else {
          throw new Error(result.message || 'Failed to send message');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('There was an error sending your message. Please try again later.');
      } finally {
        // Reset button state
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonText;
      }
    });
  }
});
