import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, ShoppingCart, User, Menu, X } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useCart } from '@/pages/Cartcontext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [user, setUser] = useState<{ name?: string; username?: string; role?: string } | null>(null);
  const { cartItems } = useCart();

    const cartCount = cartItems.length;

  const navigate = useNavigate();

  const gameCategories = [
    'MOBA', 'FPS', 'RPG', 'Strategy', 'Adventure', 'Simulation'
  ];

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/";
  };

  useEffect(() => {
    const userData = localStorage.getItem("user");
    try {
      // Kiểm tra kỹ giá trị trước khi parse
      if (userData && userData !== "undefined" && userData !== "null") {
        setUser(JSON.parse(userData));
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    }
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container mx-auto px-4">
        {/* Main Header */}
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-gaming-gradient flex items-center justify-center">
              <span className="text-lg font-bold text-white">G</span>
            </div>
            <span className="text-xl font-bold bg-gaming-gradient bg-clip-text text-transparent">
              GameStore
            </span>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-6">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm game, tài khoản..."
                className="pl-10 bg-muted/50"
              />
            </div>
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-4">
            <Link to="/games">
              <Button variant="ghost" className="hover:bg-gaming-primary/10">
                Danh mục
              </Button>
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="hover:bg-gaming-primary/10">
                  Game
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-card border-border">
                {gameCategories.map((category) => (
                  <DropdownMenuItem key={category} asChild>
                    <Link to={`/games?category=${category.toLowerCase()}`} className="cursor-pointer">
                      {category}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Link to="/payment">
              <Button variant="ghost" className="hover:bg-gaming-primary/10">
                Thanh toán
              </Button>
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center space-x-3">
            {/* Cart */}
            <Button
              variant="ghost"
              size="icon"
              className="relative hover:bg-gaming-primary/10"
              onClick={() => navigate('/cart')}
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-gaming-accent">
                  {cartCount}
                </Badge>
              )}
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:bg-gaming-primary/10">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48 bg-card border-border" align="end">
                {user ? (
                  <>
                    <DropdownMenuItem>
                      Xin chào, <b className="ml-1">{user.username}</b>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard" className="cursor-pointer">
                        Tài khoản
                      </Link>
                    </DropdownMenuItem>
                    {user.role === "admin" && (
                      <DropdownMenuItem asChild>
                        <Link to="/admin" className="cursor-pointer">
                          Admin
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
                      Đăng xuất
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem asChild>
                      <Link to="/login" className="cursor-pointer">
                        Đăng nhập
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/register" className="cursor-pointer">
                        Đăng ký
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden hover:bg-gaming-primary/10"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm game, tài khoản..."
              className="pl-10 bg-muted/50"
            />
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border py-4">
            <nav className="flex flex-col space-y-2">
              <Link to="/games" onClick={() => setIsMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start hover:bg-gaming-primary/10">
                  Danh mục Game
                </Button>
              </Link>
              <Link to="/payment" onClick={() => setIsMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start hover:bg-gaming-primary/10">
                  Thanh toán
                </Button>
              </Link>
              <div className="border-t border-border pt-2 mt-2">
                <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start hover:bg-gaming-primary/10">
                    Đăng nhập
                  </Button>
                </Link>
                <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start hover:bg-gaming-primary/10">
                    Đăng ký
                  </Button>
                </Link>
                {/* Tạm thời */}
                <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start hover:bg-gaming-primary/10">
                    Tài khoản
                  </Button>
                </Link>
                <Link to="/admin" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start hover:bg-gaming-primary/10">
                    Admin
                  </Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;