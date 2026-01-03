const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// PRODUCTION CREDENTIALS
const CASHFREE_APP_ID = process.env.CASHFREE_APP_ID || '116714870f25988ef8806680e8e8417611';
const CASHFREE_SECRET_KEY = process.env.CASHFREE_SECRET_KEY || 'cfsk_ma_prod_f70e048138f501475c478f80f10c9cf1_02facbc7';
const CASHFREE_API_URL = 'https://api.cashfree.com/pg'; // PRODUCTION URL

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ 
    status: 'NS Supplements Payment Server - PRODUCTION MODE',
    mode: 'LIVE',
    version: '2.0'
  });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK',
    mode: 'PRODUCTION',
    cashfree: 'ACTIVE'
  });
});

app.post('/api/create-order', async (req, res) => {
  try {
    const { orderId, amount, customerName, customerEmail, customerPhone } = req.body;

    const orderData = {
      order_id: orderId,
      order_amount: amount,
      order_currency: 'INR',
      customer_details: {
        customer_id: customerPhone,
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone
      },
      order_meta: {
        return_url: `https://ns-supplement.web.app/order-success?order_id=${orderId}`
      }
    };

    const response = await axios.post(`${CASHFREE_API_URL}/orders`, orderData, {
      headers: {
        'Content-Type': 'application/json',
        'x-client-id': CASHFREE_APP_ID,
        'x-client-secret': CASHFREE_SECRET_KEY,
        'x-api-version': '2023-08-01'
      }
    });

    console.log('Order created:', orderId, 'Amount:', amount);
    res.json(response.data);
  } catch (error) {
    console.error('Create order error:', error.response?.data || error.message);
    res.status(500).json({ 
      error: error.response?.data?.message || error.message,
      details: error.response?.data
    });
  }
});

app.post('/api/verify-payment', async (req, res) => {
  try {
    const { orderId } = req.body;

    const response = await axios.get(`${CASHFREE_API_URL}/orders/${orderId}`, {
      headers: {
        'Content-Type': 'application/json',
        'x-client-id': CASHFREE_APP_ID,
        'x-client-secret': CASHFREE_SECRET_KEY,
        'x-api-version': '2023-08-01'
      }
    });

    console.log('Payment verified:', orderId, 'Status:', response.data.order_status);
    res.json(response.data);
  } catch (error) {
    console.error('Verify payment error:', error.response?.data || error.message);
    res.status(500).json({ 
      error: error.response?.data?.message || error.message,
      details: error.response?.data
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`💳 Cashfree Mode: PRODUCTION`);
  console.log(`🌐 API URL: ${CASHFREE_API_URL}`);
});
