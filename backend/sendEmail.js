const nodemailer = require('nodemailer');
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.post('/send-receipt', async (req, res) => {
  const { email, base64Pdf } = req.body;

  const path = './receipt.pdf';
  fs.writeFileSync(path, base64Pdf.split(';base64,').pop(), 'base64');

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'your-email@gmail.com',
      pass: 'your-app-password'
    }
  });

  try {
    await transporter.sendMail({
      from: '"StandardTime" <your-email@gmail.com>',
      to: email,
      subject: 'Your Order Receipt',
      text: 'Thank you for your order.',
      attachments: [{ filename: 'receipt.pdf', path }]
    });

    fs.unlinkSync(path);
    res.send({ success: true });
  } catch (e) {
    res.status(500).send({ success: false, error: e.message });
  }
});

app.listen(4000, () => console.log('Email server on http://localhost:4000'));
