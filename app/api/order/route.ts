import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data", "orders.json");

export async function POST(req: Request) {
    try {
        const body = await req.json();

        // читаем заказы
        const fileData = fs.readFileSync(filePath, "utf-8");
        const orders = JSON.parse(fileData);

        // новый заказ
        const newOrder = {
            id: Date.now().toString(),
            ...body,
            status: "new",
            createdAt: new Date().toISOString(),
        };

        // сохраняем в файл
        orders.push(newOrder);
        fs.writeFileSync(filePath, JSON.stringify(orders, null, 2));

        // 📩 Telegram уведомление
        const message = `
        🛒 Новый заказ

        📦 Товар: ${body.productId}
        👤 Имя: ${body.name}
        📱 Телефон: ${body.phone}
        💬 Комментарий: ${body.comment}
    `;

        await fetch(
            `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    chat_id: process.env.TELEGRAM_CHAT_ID,
                    text: message,
                }),
            }
        );

        console.log("NEW ORDER SAVED + SENT:", newOrder);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            { success: false },
            { status: 500 }
        );
    }
}