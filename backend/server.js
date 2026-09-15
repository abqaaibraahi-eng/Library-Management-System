require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const { apiLimiter } = require('./middleware/rateLimiters');
const authRoutes = require('./routes/auth');
const artsRoutes = require('./routes/arts');
const authorsRoutes = require('./routes/authors');
const publishersRoutes = require('./routes/publishers');
const booksRoutes = require('./routes/books');
const dashboardRoutes = require('./routes/dashboard');

const app = express();

app.disable('x-powered-by');

// رؤوس أمان HTTP قياسية. لا تُخدَّم أي صفحات HTML من هذا الخادم (API + ملفات فقط)
// لذا تُعطَّل سياسة CSP الافتراضية ويُسمح صراحة بالوصول للموارد من أصل الواجهة الأمامية
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(apiLimiter);

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

app.use('/api/auth', authRoutes);
app.use('/api/arts', artsRoutes);
app.use('/api/authors', authorsRoutes);
app.use('/api/publishers', publishersRoutes);
app.use('/api/books', booksRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// معالج الأخطاء العام — لا يُسرَّب تفاصيل الخطأ الداخلية في بيئة الإنتاج
app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  const isProd = process.env.NODE_ENV === 'production';
  const message = !isProd && err.message ? err.message : 'حدث خطأ في الخادم';
  res.status(status).json({ message });
});

app.use((req, res) => {
  res.status(404).json({ message: 'المسار غير موجود' });
});

const PORT = process.env.PORT || 5000;
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 خادم نظام إدارة المكتبة يعمل على المنفذ ${PORT}`);
  });
}

module.exports = app;
