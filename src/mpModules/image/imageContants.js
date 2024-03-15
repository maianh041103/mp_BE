const config = require("config");
const moment = require("moment");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

const UPLOAD_FOLDER = config.get("api.storageFolder") || "public/upload";

export const storage = multer.diskStorage({
  destination(req, file, cb) {
    const subFolder = moment().format("YYYY-MM-DD");
    const fullPath = path.join(
      __dirname,
      `../../../${UPLOAD_FOLDER}/images/${subFolder}`
    );
    if (!fs.existsSync(fullPath)) {
      console.log("folder chưa tồn tại, tạo mới folder");
      fs.mkdirSync(fullPath, { recursive: true });
    }
    cb(null, fullPath);
  },
  filename(req, file, cb) {
    cb(null, `${uuidv4()}.${file.mimetype.split("/")[1]}`);
  },
});

// const AWS = require('aws-sdk');
// const s3 = new AWS.S3({
//     accessKeyId: 'AKIATPXZANQ5H5EXGM5T',
//     secretAccessKey: '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',
// });
// export const storage = multerS3({
//     s3,
//     bucket: 'biz-dev-storage',
//     acl: 'public-read',
//     key(req, file, cb) {
//         cb(null, `${uuidv4()}.${file.mimetype.split("/")[1]}`);
//     },
// });
