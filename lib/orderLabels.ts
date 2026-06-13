// Человекочитаемые подписи способов получения и оплаты.
// Используются в чеке, админке и Telegram.

export const DELIVERY_LABELS: Record<string, string> = {
  pickup: "Самовывоз из магазина",
  nova_poshta: "Доставка Новой почтой",
};

export const PAYMENT_LABELS: Record<string, string> = {
  on_receipt: "При получении",
  prepaid: "Предоплата",
};

export const deliveryLabel = (v: string) => DELIVERY_LABELS[v] ?? v;
export const paymentLabel = (v: string) => PAYMENT_LABELS[v] ?? v;

// Статусы заказа — для покупателя (проверка по номеру) и админки.
export const STATUS_LABELS: Record<string, string> = {
  new: "Принят, ожидает обработки",
  processing: "В работе, готовим заказ",
  done: "Готов / выполнен",
};

export const statusLabel = (v: string) => STATUS_LABELS[v] ?? v;
