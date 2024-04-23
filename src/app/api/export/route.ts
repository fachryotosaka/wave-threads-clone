// pages/api/exportUsers.js

import { PrismaClient } from '@prisma/client';
import ExcelJS from 'exceljs';

export default async function handler(req, res) {
  const prisma = new PrismaClient();

  try {
    const users = await prisma.user.findMany();

    // Buat workbook Excel
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Users');

    // Buat header
    worksheet.addRow(['ID', 'Username', 'Email', 'Created At']);
    users.forEach(user => {
      worksheet.addRow([user.id, user.username, user.email, user.created_at]);
    }); 

    // Tulis workbook ke dalam buffer
    const buffer = await workbook.xlsx.writeBuffer();

    // Set header untuk respon
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=users.xlsx');

    // Kirim buffer sebagai respon
    res.send(Buffer.from(buffer));
  } catch (error) {
    console.error('Error exporting users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    await prisma.$disconnect();
  }
}
