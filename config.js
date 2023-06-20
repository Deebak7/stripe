require('dotenv').config();

CONFIG={};

CONFIG.stripe_secret_key=process.env.stripe_secret_key
CONFIG.stripe_public_key=process.env.stripe_public_key