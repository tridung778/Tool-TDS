const logger = require('./logger');

/**
 * Hàm dừng luồng thực thi (sleep) 
 * Tạo khoảng dừng ngẫu nhiên giúp tool giống người thật
 */
const sleep = (minMs, maxMs) => {
  const ms = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
  logger.info(`Đang delay chờ mô phỏng người thật: ${(ms / 1000).toFixed(1)}s ...`);
  return new Promise(resolve => setTimeout(resolve, ms));
};

module.exports = {
  sleep
};
