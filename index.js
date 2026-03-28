const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors());
app.use(express.json());

// 📁 存储文件到本地（Render会临时保存）
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, uuidv4() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// 👉 让上传文件可访问
app.use('/uploads', express.static('uploads'));

let materials = [];

// 📤 上传接口
app.post('/upload', upload.single('file'), (req, res) => {
  const item = {
    id: uuidv4(),
    title: req.body.title,
    author: req.body.author || '匿名',
    type: req.file.mimetype.startsWith('video') ? 'video' : 'image',
    url: `https://shude-server-1.onrender.com/uploads/${req.file.filename}`,
    status: 'pending',
    createdAt: new Date()
  };

  materials.push(item);

  res.json({ success: true });
});

// 📥 获取已审核素材
app.get('/materials', (req, res) => {
  res.json(materials.filter(m => m.status === 'approved'));
});

// 📋 获取待审核
app.get('/admin/materials', (req, res) => {
  res.json(materials.filter(m => m.status === 'pending'));
});

// ✅ 审核通过
app.post('/admin/approve/:id', (req, res) => {
  materials = materials.map(m =>
    m.id === req.params.id ? { ...m, status: 'approved' } : m
  );
  res.json({ success: true });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log('Server running'));
