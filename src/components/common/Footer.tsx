export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-20 py-10">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8">

        <div>
          <h2 className="text-xl font-semibold mb-3">MyStore</h2>
          <p className="text-gray-400">Nền tảng mua sắm hiện đại, nhanh chóng và tiện lợi.</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-3">Liên kết</h2>
          <ul className="space-y-2 text-gray-400">
            <li>Về chúng tôi</li>
            <li>Chính sách bảo mật</li>
            <li>Điều khoản sử dụng</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-3">Kết nối</h2>
          <p className="text-gray-400">Email: contact@mystore.com</p>
        </div>

      </div>

      <div className="text-center mt-8 text-gray-500">
        © 2025 MyStore. All rights reserved.
      </div>
    </footer>
  );
}
