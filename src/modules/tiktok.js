const config = require('../config');
const tdsApi = require('../services/tdsApi');
const logger = require('../utils/logger');
const { sleep } = require('../utils/helpers');

// Hàm mô phỏng làm nhiệm vụ Follow (Bạn có thể nhúng thư viện puppeteer/selenium vào đây)
const doTask = async (job) => {
  logger.job(`-> [GIẢ LẬP] Đang mở trình duyệt follow nick ID: ${job.id} / ${job.link}`);
  // Mô phỏng người dùng làm việc mất vài giây
  await sleep(config.DELAY_MIN, config.DELAY_MAX);
  logger.success(`-> [GIẢ LẬP] Đã follow thành công ID: ${job.id}`);
  return true;
};

const runTiktokBot = async () => {
  logger.info('=== BẮT ĐẦU CHẠY AUTO TIKTOK ===');

  if (!config.TIKTOK_ID) {
    logger.error('Vui lòng điền TIKTOK_ID vào file .env');
    return;
  }

  // 1. Cấu hình nick Tiktok
  logger.info(`Đang Cấu Hình Nick Tiktok: ${config.TIKTOK_ID} ...`);
  const setupRes = await tdsApi.configRunNick('tiktok_run', config.TIKTOK_ID);
  
  if (!setupRes || setupRes.error) {
    logger.error(`Cấu hình thất bại: ${setupRes ? setupRes.error : 'Lỗi không xác định'}`);
    return;
  }
  logger.success(`Cấu hình thành công nick Tiktok: ${config.TIKTOK_ID}`);

  let jobDoneCount = 0;

  // Lặp vô hạn việc cày cuốc
  while (true) {
    logger.info('Đang lấy danh sách Job Tiktok Follow...');
    const jobRes = await tdsApi.getJobs('tiktok_follow');

    // Kiểm tra cấu trúc API trả về
    if (jobRes && Array.isArray(jobRes.data) && jobRes.data.length > 0) {
      const jobs = jobRes.data;
      logger.success(`Tìm thấy ${jobs.length} nhiệm vụ.`);

      // Duyệt qua từng nhiệm vụ để làm
      for (const job of jobs) {
        // Thực hiện tương tác (Giả lập)
        const isDone = await doTask(job);

        if (isDone) {
          // Gửi duyệt cache cho TDS
          logger.info(`Đang báo cáo cache lên server cho job: ${job.id}`);
          const cacheRes = await tdsApi.sendCache('tiktok_follow_cache', job.id);
          
          if (cacheRes && !cacheRes.error) {
            logger.success(`Cache thành công job: ${job.id}`);
            jobDoneCount++;

            // Mỗi 5 - 10 jobs thì gửi yêu cầu Nhận Xu một lần (Theo luật TDS)
            if (jobDoneCount >= 5) {
              logger.info('Đã đạt đủ số lượng job, tiến hành NHẬN XU...');
              await sleep(3000, 5000); // Nghỉ 1 nhịp trước khi nhận xu để tránh gửi API liên tục
              
              const earnRes = await tdsApi.earnCoins('tiktok_follow', 'tiktok_api');
              
              if (earnRes && earnRes.error) {
                  logger.warn(`Lỗi nhận xu: ${earnRes.error}`);
                  if (earnRes.error.includes('quá nhanh')) {
                      logger.info('Thao tác quá nhanh. Nghỉ 10s...');
                      await sleep(10000, 10000);
                      // Không reset jobDoneCount để lần sau lặp lại nó sẽ tiến hành nhận xu tiếp
                  }
              } else {
                  logger.success(`Nhận xu thành công: ${JSON.stringify(earnRes)}`);
                  // Reset đếm số cache
                  jobDoneCount = 0;
              }
            } else {
                logger.info(`Số cache hiện tại: ${jobDoneCount}/5`);
            }
          } else {
            logger.error(`Gửi cache thất bại: ${cacheRes ? cacheRes.error : 'Lỗi mạng'}`);
          }
        }
        
        // Cần delay trước khi chuyển sang nick sau
        await sleep(2000, 4000); 
      }
    } else {
      logger.warn(`Danh sách rỗng hoặc có lỗi: ${jobRes ? (jobRes.error || jobRes.msg) : 'Không có dữ liệu'}`);
      logger.info('Nghỉ ngơi 15 giây trước khi tìm Job mới...');
      await sleep(15000, 15000); // Đợi 15s rồi tìm tiếp
    }
  }
};

module.exports = runTiktokBot;
