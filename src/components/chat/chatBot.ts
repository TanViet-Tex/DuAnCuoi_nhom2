// Simple rule-based chatbot for frontend-only support
export type BotResponse = {
  text: string;
};

export async function getBotResponse(message: string): Promise<BotResponse> {
  const m = message.trim().toLowerCase();

  // Small delay to simulate thinking
  await new Promise((r) => setTimeout(r, 600));

  if (!m) return { text: "Xin chào! Bạn cần mình giúp gì hôm nay?" };

  // Keywords mapping
  if (m.includes('giá') || m.includes('bao nhiêu') || m.includes('price')) {
    return { text: 'Giá sản phẩm thay đổi theo model. Bạn cho biết tên model hoặc gửi link sản phẩm để mình kiểm tra giá chi tiết nhé.' };
  }

  if (m.includes('bảo hành') || m.includes('baohanh') || m.includes('warranty')) {
    return { text: 'Sản phẩm chính hãng có bảo hành 12-24 tháng tùy model. Vui lòng cung cấp mã đơn hàng hoặc model để kiểm tra chính xác.' };
  }

  if (m.includes('giao') || m.includes('ship') || m.includes('vận chuyển')) {
    return { text: 'Chúng tôi giao hàng toàn quốc. Thời gian giao động 2-5 ngày tùy khu vực. Phí vận chuyển miễn phí cho đơn trên 1.000.000 VNĐ.' };
  }

  if (m.includes('đổi') || m.includes('trả') || m.includes('return') || m.includes('refund')) {
    return { text: 'Chính sách đổi trả: đổi trong 7 ngày nếu lỗi nhà sản xuất. Giữ hóa đơn và hộp sản phẩm để được hỗ trợ nhanh.' };
  }

  if (m.includes('xin chào') || m.includes('hello') || m.includes('hi') || m.includes('chào')) {
    return { text: 'Xin chào! Mình là trợ lý ảo. Bạn muốn hỏi về giá, bảo hành, giao hàng hay đổi trả?' };
  }

  // Fallback
  return { text: 'Cảm ơn bạn! Mình đã nhận tin nhắn, bạn có thể mô tả cụ thể hơn (ví dụ: giá/model, bảo hành, giao hàng, đổi trả)?' };
}
