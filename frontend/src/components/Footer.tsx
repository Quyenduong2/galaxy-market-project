import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-gaming-gradient flex items-center justify-center">
                <span className="text-lg font-bold text-white">G</span>
              </div>
              <span className="text-xl font-bold bg-gaming-gradient bg-clip-text text-transparent">
                GameStore
              </span>
            </Link>
            <p className="text-muted-foreground text-sm">
              Nền tảng bán tài khoản game uy tín hàng đầu Việt Nam. 
              Cung cấp tài khoản game chất lượng với giá cả hợp lý.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Liên kết nhanh</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/games" className="text-muted-foreground hover:text-gaming-primary transition-colors">
                  Danh mục Game
                </Link>
              </li>
              <li>
                <Link to="/payment" className="text-muted-foreground hover:text-gaming-primary transition-colors">
                  Hướng dẫn thanh toán
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-gaming-primary transition-colors">
                  Về chúng tôi
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-gaming-primary transition-colors">
                  Liên hệ
                </Link>
              </li>
            </ul>
          </div>

          {/* Game Categories */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Thể loại Game</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/games?category=moba" className="text-muted-foreground hover:text-gaming-primary transition-colors">
                  MOBA
                </Link>
              </li>
              <li>
                <Link to="/games?category=fps" className="text-muted-foreground hover:text-gaming-primary transition-colors">
                  FPS
                </Link>
              </li>
              <li>
                <Link to="/games?category=rpg" className="text-muted-foreground hover:text-gaming-primary transition-colors">
                  RPG
                </Link>
              </li>
              <li>
                <Link to="/games?category=strategy" className="text-muted-foreground hover:text-gaming-primary transition-colors">
                  Strategy
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Hỗ trợ</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-muted-foreground hover:text-gaming-primary transition-colors">
                  Chính sách bảo mật
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-gaming-primary transition-colors">
                  Điều khoản dịch vụ
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-gaming-primary transition-colors">
                  Chính sách hoàn tiền
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-gaming-primary transition-colors">
                  Hỗ trợ 24/7
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-muted-foreground">
              © 2024 GameStore. Tất cả quyền được bảo lưu.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-muted-foreground hover:text-gaming-primary transition-colors">
                Facebook
              </a>
              <a href="#" className="text-muted-foreground hover:text-gaming-primary transition-colors">
                Discord
              </a>
              <a href="#" className="text-muted-foreground hover:text-gaming-primary transition-colors">
                YouTube
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;