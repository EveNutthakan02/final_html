const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Mock Data แทนฐานข้อมูล MySQL
const mockDatabase = [
  {
    pushNotifications: "push-new",
    idCard: "1234567890123",
    titleName: "นาย",
    firstName: "สมชาย",
    lastName: "ใจดี",
    warEvent: "ww2",
    book: "ประวัติศาสตร์การทหาร",
    pages: 1,
    pushOption: 1,
    idHeir: "",
    titleHeir: "",
    firstHeir: "",
    lastHeir: "",
    affiliationName: "มทบ.1",
    bookNum: 1,
    bookDate: "2023-01-01",
    dateVerify: "2024-01-01",
    step: "step2",
  },
  {
    pushNotifications: "push-lost",
    idCard: "1234567890123",
    titleName: "ร.ต.",
    firstName: "อนุชา",
    lastName: "กล้าหาญ",
    warEvent: "ww1",
    book: "บันทึกนักรบ",
    pages: 2,
    pushOption: 2,
    idHeir: "1234567890111",
    titleHeir: "นาย",
    firstHeir: "เอกพล",
    lastHeir: "กล้าหาญ",
    affiliationName: "มทบ.2",
    bookNum: 2,
    bookDate: "2022-05-15",
    dateVerify: "2023-05-15",
    step: "step5",
  },
];

// Function to check if an object contains a URL
function containsHttpLink(data) {
  return Object.values(data).some(value => {
    return typeof value === 'string' && (value.startsWith('http://') || value.startsWith('https://'));
  });
}


// API สำหรับตรวจสอบสถานะการล็อกอิน
app.get("/api/check-login-status", (req, res) => {
  const userId = req.query.user; // รับ userId (idCard) จาก query string

  // ค้นหาผู้ใช้จาก mockDatabase
  const user = mockDatabase.find((record) => record.idCard === userId);

  if (user) {
    // ส่งข้อมูลทั้งหมดของผู้ใช้
    res.status(200).send({
      status: "found",
      userData: user,
    });
  } else {
    res.status(404).send({
      status: "not found",
    });
  }
});

//API สำหรับบันทึกข้อมูล (Mock Insert)
app.post("/submit", (req, res) => {
  const data = req.body;
  console.log("Received data:", data);

  mockDatabase.push(data); // เก็บข้อมูลลงใน array mockDatabase

  res.status(200).send("บันทึกข้อมูลสำเร็จ!");
});

// API สำหรับค้นหาข้อมูลโดย idCard (Mock Search)
app.get("/search", (req, res) => {
  const idCard = req.query.id;

  if (!idCard) {
    return res.status(400).send({ found: false, message: "กรุณาระบุ idCard" });
  }

  // ค้นหาใน mockDatabase
  const result = mockDatabase.find((record) => record.idCard === idCard);

  if (result) {
    return res.status(200).send({ found: true, data: result });
  } else {
    return res.status(404).send({ found: false, message: "ไม่พบข้อมูล" });
  }
});

// API สำหรับอัปเดตข้อมูลเดิม
app.put("/update", (req, res) => {
  const data = req.body;
  console.log("Updating data:", data);

  const index = mockDatabase.findIndex(record => record.idCard === data.idCard);
  if (index !== -1) {
    mockDatabase[index] = { ...mockDatabase[index], ...data }; // อัปเดตข้อมูลเดิม
    res.status(200).send("อัปเดตข้อมูลสำเร็จ!");ถ
  } else {
    res.status(404).send("ไม่พบข้อมูลสำหรับอัปเดต");
  }
});


// เริ่มเซิร์ฟเวอร์
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


