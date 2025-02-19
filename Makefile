# ใช้ docker-compose สำหรับ Development
dev:
	docker-compose -f docker-compose.dev.yml up --build


# หยุดทุกอย่าง (แต่ไม่ลบ volumes)
down:
	docker-compose -f docker-compose.dev.yml down

# ดู logs ของ Development
logs-dev:
	docker-compose -f docker-compose.dev.yml logs -f



# ล้างข้อมูลทั้งหมด (ลบ container + volumes)
clean:
	docker-compose -f docker-compose.dev.yml down -v
	docker system prune -f

reload:
	docker exec -it frontend-vue  nginx -s reload
