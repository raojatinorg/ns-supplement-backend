const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

const CASHFREE_APP_ID = 'TEST10938705a43fd5846d3fd499953850783901';
const CASHFREE_SECRET_KEY = 'cfsk_ma_test_8301c3441f83d222242ca75e79dcaf8b_98393735';
const CASHFREE_API_URL = 'https://sandbox.cashfree.com/pg';

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ status: 'Cashfree API Server Running' });
});

app.post('/api/create-order', async (req, res) => {
  try {
    const { orderId, amount, customerName, customerEmail, customerPhone } = req.body;

    const orderData = {
      order_id: orderId,
      order_amount: amount,
      order_currency: 'INR',
      customer_details: {
        customer_id: `customer_${Date.now()}`,
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone
      },
      order_meta: {
        return_url: 'https://ns-supplement.web.app/order-success?order_id={order_id}'
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

    res.json(response.data);
  } catch (error) {
    console.error('Cashfree error:', error.response?.data || error.message);
    res.status(500).json({ error: error.response?.data || error.message });
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

    res.json(response.data);
  } catch (error) {
    console.error('Verification error:', error.response?.data || error.message);
    res.status(500).json({ error: error.response?.data || error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
