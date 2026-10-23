CREATE DATABASE IF NOT EXISTS gym_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE gym_db;

-- 1. Bảng Gói tập (Packages)
CREATE TABLE packages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    duration_months INT NOT NULL,
    price DECIMAL(10,2) NOT NULL
);

-- 2. Bảng Huấn luyện viên (Trainers)
CREATE TABLE trainers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    specialty VARCHAR(100) NOT NULL,
    phone VARCHAR(20)
);

-- 3. Bảng Hội viên (Members)
CREATE TABLE members (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    package_id INT,
    join_date DATE NOT NULL,
    FOREIGN KEY (package_id) REFERENCES packages(id)
);

-- 4. Bảng Lịch tập (Schedules)
CREATE TABLE schedules (
    id INT AUTO_INCREMENT PRIMARY KEY,
    member_id INT,
    trainer_id INT,
    workout_time DATETIME NOT NULL,
    note VARCHAR(255),
    FOREIGN KEY (member_id) REFERENCES members(id),
    FOREIGN KEY (trainer_id) REFERENCES trainers(id)
);

-- Thêm dữ liệu mẫu
INSERT INTO packages (name, duration_months, price) VALUES
('Gói Cơ Bản (Gym)', 1, 500000),
('Gói Nâng Cao (Gym + Yoga)', 6, 2500000),
('Gói VIP (1 kèm 1 với PT)', 12, 12000000);

INSERT INTO trainers (full_name, specialty, phone) VALUES
('Nguyễn Văn Mạnh', 'Thể hình & Tăng cơ', '0901234567'),
('Trần Thị Lan', 'Yoga & Giảm mỡ', '0912345678');

INSERT INTO members (full_name, phone, package_id, join_date) VALUES
('Lê Hoàng Nam', '0987654321', 3, '2026-01-15'),
('Phạm Minh Anh', '0976543210', 2, '2026-02-01');

INSERT INTO schedules (member_id, trainer_id, workout_time, note) VALUES
(1, 1, '2026-10-25 17:30:00', 'Tập ngực và tay sau'),
(2, 2, '2026-10-26 08:00:00', 'Yoga phục hồi cột sống');

-- HARDENING (Least Privilege): Chỉ cấp quyền đọc/thêm/sửa, cấm quyền xóa bảng/xóa dữ liệu
REVOKE ALL PRIVILEGES, GRANT OPTION FROM 'gym_app_user'@'%';
GRANT SELECT, INSERT, UPDATE ON gym_db.* TO 'gym_app_user'@'%';
FLUSH PRIVILEGES;
