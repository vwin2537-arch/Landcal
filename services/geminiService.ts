import { GoogleGenAI } from "@google/genai";
import { ThaiArea } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateLandReport = async (areaData: ThaiArea): Promise<string> => {
  try {
    const prompt = `
      ฉันมีที่ดินขนาด ${areaData.totalSqMeters.toLocaleString()} ตารางเมตร
      หรือคิดเป็น ${areaData.rai} ไร่ ${areaData.ngan} งาน ${areaData.sqWah.toFixed(2)} ตารางวา
      
      ช่วยวิเคราะห์สั้นๆ เกี่ยวกับขนาดของที่ดินนี้ว่า:
      1. เหมาะสำหรับทำอะไรได้บ้างในเชิงเกษตรกรรมหรือที่อยู่อาศัย (สั้นๆ)
      2. เปรียบเทียบขนาดให้เห็นภาพง่ายๆ (เช่น เทียบกับสนามฟุตบอล หรืออื่นๆ)
      
      ตอบเป็นภาษาไทย ให้ดูเป็นมืออาชีพแต่เข้าใจง่าย
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "ไม่สามารถสร้างรายงานได้ในขณะนี้";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("เกิดข้อผิดพลาดในการเชื่อมต่อกับ AI");
  }
};