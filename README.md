```md
# 🎵 Discord Voice Bot (User Token)  

> **โค้ดนี้เป็นระบบบอทออนห้องเสียง** สำหรับ **โทเค่นผู้ใช้ (User Token)**  
> ไม่ใช่สำหรับห้องเสียงของบอท (Bot Token)  
>  
> โค้ดนี้ถูก **ดัดแปลงจาก Python เป็น Node.js**  
> และถูกพัฒนาให้ทำงานกับ **Discord**  

## 📌 คุณสมบัติ  
✅ เข้าร่วมห้องเสียงด้วยบัญชีผู้ใช้  
✅ ออนตลอด24/7 ชม ไม่มีหลุดเพราะมีระบบกันหลุด  

## 🛠 วิธีติดตั้ง  

1️⃣ **ติดตั้ง Node.js** (ถ้ายังไม่มี)  
ดาวน์โหลดและติดตั้งจาก [nodejs.org](https://nodejs.org/)  

2️⃣ **ติดตั้ง Dependencies**  
```bash
npm install discord.js
npm install fs
npm install axios
npm install ws
```

3️⃣ **ตั้งค่า Token ในไฟล์ `index_bot.js`**  
```
botToken=your_user_token_here
```

4️⃣ **รันบอท**  
```bash
node index_bot.js
```

## 📜 หมายเหตุ  
⚠️ **โค้ดนี้ใช้โทเค่นของบัญชีผู้ใช้ (User Token)** ซึ่งอาจละเมิด **Discord TOS**  
⚠️ ใช้สำหรับการศึกษาและใช้งานเท่านั้น!  
```
