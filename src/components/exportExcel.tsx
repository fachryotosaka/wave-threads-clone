"use client";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getServerSession } from "next-auth";
import React, { useEffect, useState } from 'react';
import prisma from "@/DB/db.config";
import {
    CustomSession,
    authOptions,
    getAuthSession,
  } from "@/app/api/auth/[...nextauth]/options";
import { useSession } from 'next-auth/react';
import axios from 'axios';

const exportUsersToExcel = async () => {
  try {
    const res = await fetch('/api/export', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error('Failed to export data: ' + (await res.text()));
    }
  
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
  
    a.href = url;
    a.download = 'users.xlsx';
    a.rel = 'noopener noreferrer'; // Tambahkan atribut rel untuk keamanan
    document.body.appendChild(a);
    a.click();
    // Hapus elemen anchor setelah selesai
    document.body.removeChild(a);
    // Hapus URL objek setelah selesai
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error exporting data:', error);
  }
};


// Komponen React yang menggunakan fungsi exportUsersToExcel
function ExportButton() {
  const { data: session, status } = useSession();

  // Pastikan sesi sudah dimuat dan user memiliki peran admin sebelum menampilkan tombol
  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (session?.user?.role === 'admin') {
    return (
      <button onClick={exportUsersToExcel}>Export to Excel</button>
    );
  } else {
    return null; // Tombol tidak ditampilkan jika user bukan admin
  }
}

export default ExportButton;
