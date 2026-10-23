&#x20;         # Gym \& Fitness Management System (Đề tài 23)



!\[Build Status](https://img.shields.io/badge/build-passing-brightgreen)

!\[Docker Compose](https://img.shields.io/badge/docker--compose-v2-blue)

!\[License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)



&#x20;        ## 📖 Mô tả 

Dự án triển khai hệ thống quản trị phòng Gym và Fitness đa dịch vụ dựa trên kiến trúc microservices và Docker Compose. Ứng dụng cung cấp giải pháp quản lý hội viên, huấn luyện viên, gói tập và lịch tập luyện tập trung với cơ sở dữ liệu MySQL và công cụ phpMyAdmin. Hệ thống được tích hợp cổng Reverse Proxy Nginx bảo mật SSL, hạ tầng giám sát hiệu năng Prometheus + Grafana và quản lý log tập trung với Loki + Promtail.



&#x20;        ## 📋 Yêu cầu hệ thống 

Trước khi cài đặt, máy chủ hoặc máy ảo (Ubuntu/Linux) cần chuẩn bị:

\- Hệ điều hành: Ubuntu 20.04 / 22.04 LTS hoặc Linux tương đương

\- Docker Engine: phiên bản ≥ 20.10

\- Docker Compose: phiên bản V2 (lệnh `docker compose`)

\- Tài nguyên tối thiểu: 2 vCPU, RAM ≥ 4GB, Ổ cứng trống ≥ 10GB

\- Đã cài đặt Git và OpenSSL



&#x20;         ## ⚙️ Cách cài đặt

Thực hiện lần lượt các bước sau trên Terminal:



&#x20;1.Sao chép mã nguồn dự án từ GitHub:



git clone \[https://github.com/Haibeotn/DTC245220009-de23.git](https://github.com/Haibeotn/DTC245220009-de23.git)



cd DTC245220009-de23



&#x20;2. Thiết lập biến môi trường bảo mật:

&#x20;- Tạo file .env tại thư mục gốc dự án để cấu hình mật khẩu cơ sở dữ liệu:



cat << 'EOF' > .env

MYSQL\_ROOT\_PASSWORD=GymRoot@Pass\_2026!Strong

MYSQL\_DATABASE=gym\_db

MYSQL\_USER=gym\_app\_user

MYSQL\_PASSWORD=GymApp@User\_2026!Sec

EOF



&#x20;3. Tạo chứng chỉ SSL tự ký cho Nginx Reverse Proxy:



mkdir -p nginx/ssl



openssl req -x509 -nodes -days 365 -newkey rsa:2048 \\

&#x20; -keyout nginx/ssl/gym.key \\

&#x20; -out nginx/ssl/gym.crt \\

&#x20; -subj "/C=VN/ST=ThaiNguyen/L=ThaiNguyen/O=ICTU/OU=IT/CN=gym.local"

chmod -R 755 nginx/ssl



&#x20;4. Khởi chạy toàn bộ hệ thống bằng Docker Compose:



docker compose up -d --build



&#x20;5. Xác nhận trạng thái các container:



docker compose ps



&#x20;         ## 🚀 Ví dụ sử dụng

&#x20;1. Truy cập các dịch vụ qua trình duyệt:



Web Quản lý Phòng Gym: https://<IP\_MAY\_CHU> (Chấp nhận cảnh báo chứng chỉ SSL tự ký)



Quản trị Cơ sở dữ liệu (phpMyAdmin): http://<IP\_MAY\_CHU>:8080 (Đăng nhập tài khoản root)



Hệ thống giám sát Prometheus: http://<IP\_MAY\_CHU>:9090



Dashboard \& Log Explorer (Grafana): http://<IP\_MAY\_CHU>:3000 (Tài khoản: admin / admin1)



&#x20;2. Kiểm tra kết nối HTTPS và Security Headers:



curl -I -k https://localhost



&#x20;3. Ví dụ truy vấn LogQL trên Grafana Explore (Nguồn: Loki):

* Truy vấn toàn bộ log của ứng dụng Gym:



{container="gym-web"}



* Lọc các dòng log chứa thông báo lỗi:



{container="gym-web"} |\~ "(?i)error"



&#x20;         ## 📄 Giấy phép

Dự án được phân phối dưới giấy phép MIT License.



