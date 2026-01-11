require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://deklerk.netlify.app'
  ],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  //const path = require('path');
  // Serve static files from the React app
  app.use(express.static(path.join(__dirname, '../dist')));
  
  // Handle React routing, return all requests to React app
  app.get('/*path', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
} else {
  // In development, just serve the API
  app.get('/', (req, res) => {
    res.send('API is running...');
  });
}

// Create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Test the transporter
const verifyTransporter = async () => {
  try {
    await transporter.verify();
    console.log('Server is ready to take our messages');
  } catch (error) {
    console.error('Error verifying transporter:', error);
  }
};

verifyTransporter();

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// API endpoint to handle form submissions
app.post('/api/contact', async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: 'Name, email, and message are required' });
  }

  // Email options
  const mailOptions = {
    from: `"${name}" <${process.env.EMAIL_USER}>`,
    to: process.env.TO_EMAIL,
    subject: subject || `New Message from ${name}`,
    text: `
      You have received a new message from your portfolio website:
      
      Name: ${name}
      Email: ${email}
      
      Message:
      ${message}
    `,
    html: `
      <h2>You have received a new message from your portfolio website:</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, '<br>')}</p>
    `,
  };

  try {
    // Send email
    await transporter.sendMail(mailOptions);
    
    // Send auto-reply to the sender
    const autoReplyOptions = {
      from: `"Loren's Portfolio" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Thank you for your message',
      text: `
        Dear ${name},
        
        Thank you for reaching out to me through my portfolio website. 
        I have received your message and will get back to you as soon as possible.
        
        Best regards,
        Loren
      `,
      html: `
        <p>Dear ${name},</p>
        <p>Thank you for reaching out to me through my portfolio website.</p>
        <p>I have received your message and will get back to you as soon as possible.</p>
        <p>Best regards,<br>Loren</p>
      `,
    };

    await transporter.sendMail(autoReplyOptions);
    
    res.status(200).json({ 
      success: true, 
      message: 'Your message has been sent successfully!' 
    });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send message. Please try again later.' 
    });
  }
});
module.exports = app;
