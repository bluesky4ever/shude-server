const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');

const app = express();

// ✅ 允许跨域（前端在 Vercel）
app.use(cors());

// ✅ 解析 JSON
app.use(express.json());

// ✅ 确保 uploads 文件夹存在
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// 📁 配置文件上传
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// 📦 模拟数据库（后面可以换真正数据库）
let materials = [];

// 🚀 上传接口（核心）
app.post('/upload', upload.single('file'), (req, res) => {
  console.log('📥 收到上传请求');

  const file = req.file;
  const { title, author } = req.body;

  if (!file) {
    return res.status(400).json({ error: '没有文件' });
  }

  const newItem = {
    id: Date.now(),
    title: title || '未命名',
    author: author || '匿名',
    filename: file.filename,
    url: `https://shude-server-1.onrender.com/uploads/${file.filename}`,
    status: 'approved', // ✅ 先直接通过（方便测试）
    time: new Date()
  };

  materials.push(newItem);

  console.log('✅ 上传成功:', newItem);

  res.json({
    message: '上传成功',
    data: newItem
  });
});

// 📚 获取素材列表
app.get('/materials', (req, res) => {
  res.json(materials);
});

// 🖼️ 静态文件访问
app.use('/uploads', express.static('uploads'));

// 🧪 测试接口
app.get('/', (req, res) => {
  res.send('🚀 Server is running');
});

// 🚀 启动服务
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
