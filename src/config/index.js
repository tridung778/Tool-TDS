require('dotenv').config();

module.exports = {
  TRAODOISUB_API_URL: 'https://traodoisub.com/api',
  TTC_ACCESS_TOKEN: process.env.TTC_ACCESS_TOKEN || '',
  
  // Nền tảng TikTok
  TIKTOK_ID: process.env.TIKTOK_ID || '',
  
  // Nền tảng Facebook
  FACEBOOK_ID: process.env.FACEBOOK_ID || '',
  
  // Nền tảng Instagram
  INSTAGRAM_ID: process.env.INSTAGRAM_ID || '',
  
  // Delay time (ms)
  DELAY_MIN: 3000,
  DELAY_MAX: 7000
};
