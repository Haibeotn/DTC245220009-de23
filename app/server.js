const express = require('express');
const mysql = require('mysql2/promise');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'mysql',
  user: process.env.DB_USER || 'gym_app_user',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'gym_db',
  waitForConnections: true,
  connectionLimit: 10
});

// Ghi log mỗi khi có request để Promtail & Loki thu thập
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] INFO: ${req.method} ${req.url} - IP: ${req.ip}`);
  next();
});

// Trang chủ hiển thị dữ liệu phòng Gym
app.get('/', async (req, res) => {
  try {
    const [members] = await pool.query(`
      SELECT m.id, m.full_name, m.phone, m.join_date, p.name AS package_name 
      FROM members m LEFT JOIN packages p ON m.package_id = p.id ORDER BY m.id DESC
    `);
    const [packages] = await pool.query('SELECT * FROM packages');
    const [trainers] = await pool.query('SELECT * FROM trainers');
    const [schedules] = await pool.query(`
      SELECT s.id, m.full_name AS member_name, t.full_name AS trainer_name, s.workout_time, s.note
      FROM schedules s
      JOIN members m ON s.member_id = m.id
      JOIN trainers t ON s.trainer_id = t.id
      ORDER BY s.workout_time ASC
    `);

    res.send(`
      <!DOCTYPE html>
      <html lang="vi">
      <head>
        <meta charset="UTF-8">
        <title>Hệ thống Quản lý Phòng Gym / Fitness - Đề 23</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; background: #f4f6f9; color: #333; }
          h1 { color: #d9534f; text-align: center; }
          .form-box { background: #fff; padding: 15px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
          .card { background: #fff; padding: 15px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background: #343a40; color: #fff; }
          input, select, button { padding: 8px; margin-right: 10px; border: 1px solid #ccc; border-radius: 4px; }
          button { background: #d9534f; color: white; border: none; cursor: pointer; font-weight: bold; }
        </style>
      </head>
      <body>
        <h1>🏋️ HỆ THỐNG QUẢN LÝ PHÒNG GYM / FITNESS (ĐỀ TÀI 23)</h1>
        
        <div class="form-box">
          <h3>➕ Đăng ký Hội viên mới</h3>
          <form method="POST" action="/add-member">
            <input type="text" name="full_name" placeholder="Họ và tên hội viên" required />
            <input type="text" name="phone" placeholder="Số điện thoại" required />
            <select name="package_id">
              ${packages.map(p => `<option value="${p.id}">${p.name}</option>`).join('')}
            </select>
            <button type="submit">Thêm Hội Viên</button>
          </form>
        </div>

        <div class="grid">
          <div class="card">
            <h2>1. Danh sách Hội viên</h2>
            <table>
              <tr><th>ID</th><th>Họ tên</th><th>SĐT</th><th>Gói tập</th><th>Ngày ĐK</th></tr>
              ${members.map(m => `<tr><td>${m.id}</td><td>${m.full_name}</td><td>${m.phone}</td><td>${m.package_name || ''}</td><td>${new Date(m.join_date).toLocaleDateString('vi-VN')}</td></tr>`).join('')}
            </table>
          </div>
          <div class="card">
            <h2>2. Các Gói tập</h2>
            <table>
              <tr><th>ID</th><th>Tên gói</th><th>Thời hạn (Tháng)</th><th>Giá (VNĐ)</th></tr>
              ${packages.map(p => `<tr><td>${p.id}</td><td>${p.name}</td><td>${p.duration_months}</td><td>${Number(p.price).toLocaleString('vi-VN')}</td></tr>`).join('')}
            </table>
          </div>
          <div class="card">
            <h2>3. Huấn luyện viên (PT)</h2>
            <table>
              <tr><th>ID</th><th>Họ tên</th><th>Chuyên môn</th><th>SĐT</th></tr>
              ${trainers.map(t => `<tr><td>${t.id}</td><td>${t.full_name}</td><td>${t.specialty}</td><td>${t.phone}</td></tr>`).join('')}
            </table>
          </div>
          <div class="card">
            <h2>4. Lịch tập luyện</h2>
            <table>
              <tr><th>ID</th><th>Hội viên</th><th>Huấn luyện viên</th><th>Thời gian</th><th>Ghi chú</th></tr>
              ${schedules.map(s => `<tr><td>${s.id}</td><td>${s.member_name}</td><td>${s.trainer_name}</td><td>${new Date(s.workout_time).toLocaleString('vi-VN')}</td><td>${s.note}</td></tr>`).join('')}
            </table>
          </div>
        </div>
      </body>
      </html>
    `);
  } catch (err) {
    console.error(`[${new Date().toISOString()}] ERROR: Database query failed - ${err.message}`);
    res.status(500).send('Lỗi kết nối Cơ sở dữ liệu');
  }
});

// Xử lý thêm hội viên mới
app.post('/add-member', async (req, res) => {
  const { full_name, phone, package_id } = req.body;
  try {
    await pool.query(
      'INSERT INTO members (full_name, phone, package_id, join_date) VALUES (?, ?, ?, CURDATE())',
      [full_name, phone, package_id]
    );
    console.log(`[${new Date().toISOString()}] INFO: Added new member ${full_name}`);
    res.redirect('/');
  } catch (err) {
    console.error(`[${new Date().toISOString()}] ERROR: Insert member failed - ${err.message}`);
    res.status(500).send('Không thể thêm hội viên');
  }
});

// Endpoint tạo log lỗi giả lập để test LogQL trên Grafana
app.get('/simulate-error', (req, res) => {
  console.error(`[${new Date().toISOString()}] ERROR: Simulated error triggered by user for LogQL testing!`);
  res.status(500).send('Đã ghi nhận 1 dòng log ERROR vào hệ thống!');
});

app.listen(3000, () => console.log('Gym Management Web Server running on port 3000'));
