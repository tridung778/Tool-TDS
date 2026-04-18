const axios = require('axios');
const config = require('../config');
const logger = require('../utils/logger');

// Init Axios Instance
const apiClient = axios.create({
  baseURL: config.TRAODOISUB_API_URL,
  params: {
    access_token: config.TTC_ACCESS_TOKEN
  }
});

/**
 * Lấy thông tin Account TDS
 */
const getProfile = async () => {
  try {
    const response = await apiClient.get('/', { params: { fields: 'profile' } });
    return response.data;
  } catch (error) {
    logger.error(`Lỗi getProfile: ${error.message}`);
    return null;
  }
};

/**
 * Cấu hình nick chạy theo nền tảng
 * @param {string} platform - facebook_run, tiktok_run, instagram_run
 * @param {string} runId - ID của nick
 */
const configRunNick = async (platform, runId) => {
  try {
    const response = await apiClient.get('/', {
      params: {
        fields: platform,
        id: runId
      }
    });
    return response.data;
  } catch (error) {
    logger.error(`Lỗi configRunNick (${platform}): ${error.message}`);
    return null;
  }
};

/**
 * Lấy danh sách nhiệm vụ (Job)
 * @param {string} jobType - VD: tiktok_follow, facebook_like
 */
const getJobs = async (jobType) => {
  try {
    const response = await apiClient.get('/', { params: { fields: jobType } });
    return response.data; // Thường trả về mảng danh sách ID hoặc object
  } catch (error) {
    logger.error(`Lỗi getJobs (${jobType}): ${error.message}`);
    return null;
  }
};

/**
 * Gửi duyệt bộ đệm (Gửi ID job vừa thực hiện vào cache)
 * @param {string} cacheType - VD: tiktok_follow_cache
 * @param {string} jobId - ID bài viết / cá nhân
 */
const sendCache = async (cacheType, jobId) => {
  try {
    const response = await apiClient.get('/coin/', {
      params: {
        type: cacheType,
        id: jobId
      }
    });
    return response.data;
  } catch (error) {
    logger.error(`Lỗi sendCache (${jobId}): ${error.message}`);
    return null;
  }
};

/**
 * Nhận xu (sau khi đã làm đủ nhiệm vụ)
 * @param {string} earnType - VD: tiktok_follow 
 * @param {string} apiId - VD: tiktok_api (tùy thuộc job, có job nhận xu theo ID luôn)
 */
const earnCoins = async (earnType, apiId) => {
  try {
    const response = await apiClient.get('/coin/', {
      params: {
        type: earnType,
        id: apiId
      }
    });
    return response.data;
  } catch (error) {
    logger.error(`Lỗi earnCoins: ${error.message}`);
    return null;
  }
};

module.exports = {
  getProfile,
  configRunNick,
  getJobs,
  sendCache,
  earnCoins
};
