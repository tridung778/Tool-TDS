const config = require('./src/config');
const tdsApi = require('./src/services/tdsApi');
const logger = require('./src/utils/logger');
const runTiktokBot = require('./src/modules/tiktok');

const startTool = async () => {
    logger.info('*********************************************');
    logger.info('*       TOOL AUTO TDS - KIẾM XU TỰ ĐỘNG     *');
    logger.info('*********************************************');

    if (!config.TTC_ACCESS_TOKEN || config.TTC_ACCESS_TOKEN === 'your_token_here') {
        logger.error('LỖI KIỂM TRA: Chưa cấu hình TTC_ACCESS_TOKEN trong file .env');
        process.exit(1);
    }

    // Lấy thông tin tài khoản
    logger.info('Đang kiểm tra thông tin tài khoản Traodoisub...');
    const profile = await tdsApi.getProfile();
    console.log(profile);

    if (profile && profile.data.user) {
        logger.success(`Đăng nhập thành công! Username: ${profile.user}`);
        logger.success(`Số Xu Hiện Tại: ${profile.xu}`);

        // Chạy Tool Tiktok (Có thể đổi sang Facebook bằng cách viết module tương tự và gọi ở đây)
        logger.info('\nĐang bắt đầu module cày xu Tiktok...');
        runTiktokBot();
    } else {
        logger.error(`Không thể lấy thông tin acc. API trả về: ${profile ? profile.error : 'null'}`);
        process.exit(1);
    }
};

// Start
startTool();
