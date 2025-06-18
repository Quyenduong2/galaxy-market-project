import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, ShoppingCart, Gamepad2, Shield, Clock, Users } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Home = () => {
  const featuredGames = [
    {
      id: 1,
      title: 'League of Legends',
      category: 'MOBA',
      image: 'https://via.placeholder.com/300x200?text=League+of+Legends',
      price: '500,000',
      originalPrice: '700,000',
      rating: 4.8,
      accounts: 150,
      level: 'Vàng II',
      champions: 142
    },
    {
      id: 2,
      title: 'Valorant',
      category: 'FPS',
      image: 'https://via.placeholder.com/300x200?text=Valorant',
      price: '300,000',
      originalPrice: '400,000',
      rating: 4.9,
      accounts: 89,
      rank: 'Diamond',
      agents: 18
    },
    {
      id: 3,
      title: 'Genshin Impact',
      category: 'RPG',
      image: 'https://via.placeholder.com/300x200?text=Genshin+Impact',
      price: '800,000',
      originalPrice: '1,200,000',
      rating: 4.7,
      accounts: 67,
      ar: 55,
      characters: 25
    },
    {
      id: 4,
      title: 'Counter-Strike 2',
      category: 'FPS',
      image: 'https://via.placeholder.com/300x200?text=Counter+Strike+2',
      price: '400,000',
      originalPrice: '600,000',
      rating: 4.6,
      accounts: 203,
      rank: 'Legendary Eagle',
      hours: 2500
    }
  ];

  const gameCategories = [
    { name: 'MOBA', count: 150, icon: '⚔️' },
    { name: 'FPS', count: 200, icon: '🔫' },
    { name: 'RPG', count: 120, icon: '🗡️' },
    { name: 'Strategy', count: 80, icon: '♞' },
    { name: 'Adventure', count: 95, icon: '🗺️' },
    { name: 'Simulation', count: 45, icon: '🎮' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-hero-gradient">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0iIzUzM0ZGRiIgZmlsbC1vcGFjaXR5PSIwLjEiLz4KPC9zdmc+')] opacity-20"></div>
        <div className="container mx-auto px-4 py-24 relative">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground">
              Mua Tài Khoản Game
              <span className="block bg-gaming-gradient bg-clip-text text-transparent">
                Uy Tín & Chất Lượng
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Cung cấp tài khoản game hàng đầu với giá cả hợp lý. 
              Bảo hành tài khoản, hỗ trợ 24/7 và giao dịch an toàn.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/games">
                <Button size="lg" className="bg-gaming-primary hover:bg-gaming-primary/90 text-white px-8">
                  <Gamepad2 className="mr-2 h-5 w-5" />
                  Khám phá ngay
                </Button>
              </Link>
              <Link to="/register">
                <Button size="lg" variant="outline" className="border-gaming-primary text-gaming-primary hover:bg-gaming-primary/10 px-8">
                  Đăng ký miễn phí
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="h-16 w-16 mx-auto rounded-full bg-gaming-primary/10 flex items-center justify-center">
                <Shield className="h-8 w-8 text-gaming-primary" />
              </div>
              <h3 className="text-xl font-semibold">Bảo mật tuyệt đối</h3>
              <p className="text-muted-foreground">
                Tài khoản được bảo hành và cam kết không thu hồi
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="h-16 w-16 mx-auto rounded-full bg-gaming-secondary/10 flex items-center justify-center">
                <Clock className="h-8 w-8 text-gaming-secondary" />
              </div>
              <h3 className="text-xl font-semibold">Giao hàng nhanh</h3>
              <p className="text-muted-foreground">
                Nhận tài khoản ngay sau khi thanh toán thành công
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="h-16 w-16 mx-auto rounded-full bg-gaming-accent/10 flex items-center justify-center">
                <Users className="h-8 w-8 text-gaming-accent" />
              </div>
              <h3 className="text-xl font-semibold">Hỗ trợ 24/7</h3>
              <p className="text-muted-foreground">
                Đội ngũ hỗ trợ chuyên nghiệp sẵn sàng giúp đỡ
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Game Categories */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Thể loại Game phổ biến</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Tìm kiếm tài khoản game theo thể loại yêu thích của bạn
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {gameCategories.map((category) => (
              <Link key={category.name} to={`/games?category=${category.name.toLowerCase()}`}>
                <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 bg-card-gradient border-border/50">
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl mb-3">{category.icon}</div>
                    <h3 className="font-semibold mb-2">{category.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {category.count} tài khoản
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Games */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Game Nổi Bật</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Những tài khoản game hot nhất với giá ưu đãi
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredGames.map((game) => (
              <Card key={game.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105 bg-card border-border/50">
                <div className="relative">
                  <img 
                    src={game.image} 
                    alt={game.title}
                    className="w-full h-48 object-cover"
                  />
                  <Badge className="absolute top-3 left-3 bg-gaming-primary text-white">
                    {game.category}
                  </Badge>
                  <Badge className="absolute top-3 right-3 bg-destructive text-white">
                    -{Math.round(((parseInt(game.originalPrice.replace(',', '')) - parseInt(game.price.replace(',', ''))) / parseInt(game.originalPrice.replace(',', ''))) * 100)}%
                  </Badge>
                </div>
                <CardHeader className="pb-3">
                  <h3 className="font-semibold text-lg">{game.title}</h3>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm ml-1">{game.rating}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      ({game.accounts} tài khoản)
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="pt-0 pb-3">
                  <div className="space-y-2 text-sm">
                    {game.level && <p>Rank: <span className="text-gaming-primary font-medium">{game.level}</span></p>}
                    {game.rank && <p>Rank: <span className="text-gaming-primary font-medium">{game.rank}</span></p>}
                    {game.ar && <p>AR: <span className="text-gaming-primary font-medium">{game.ar}</span></p>}
                    {game.champions && <p>Tướng: <span className="text-gaming-primary font-medium">{game.champions}</span></p>}
                    {game.agents && <p>Agents: <span className="text-gaming-primary font-medium">{game.agents}</span></p>}
                    {game.characters && <p>Nhân vật: <span className="text-gaming-primary font-medium">{game.characters}</span></p>}
                    {game.hours && <p>Giờ chơi: <span className="text-gaming-primary font-medium">{game.hours}h</span></p>}
                  </div>
                </CardContent>
                <CardFooter className="pt-0 flex flex-col space-y-3">
                  <div className="w-full">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold text-gaming-primary">
                        {game.price}đ
                      </span>
                      <span className="text-sm text-muted-foreground line-through">
                        {game.originalPrice}đ
                      </span>
                    </div>
                  </div>
                  <div className="flex w-full space-x-2">
                    <Link to={`/games/${game.id}`} className="flex-1">
                      <Button variant="outline" className="w-full">
                        Xem chi tiết
                      </Button>
                    </Link>
                    <Button size="icon" className="bg-gaming-primary hover:bg-gaming-primary/90">
                      <ShoppingCart className="h-4 w-4" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/games">
              <Button variant="outline" size="lg" className="border-gaming-primary text-gaming-primary hover:bg-gaming-primary/10">
                Xem tất cả game
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;