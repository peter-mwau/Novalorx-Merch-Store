import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import adminRoutes from './routes/adminRoutes.js';
import publicProductRoutes from './routes/publicProductRoutes.js';
import authRoutes from './routes/authRoutes.js';
import { uploadDirectory } from './middlewares/uploadMiddleware.js';
import mailRoutes from './routes/mailRoutes.js';

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use('/uploads/productImages', express.static(uploadDirectory));
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/products', publicProductRoutes);
app.use('/api/mail', mailRoutes);

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});