import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Card, CardHeader, CardContent, CardFooter } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Search, Star, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useCart } from "./Cartcontext";

type Product = {
  _id: string;
  title: string;
  category: string;
  image: string;
  price: number; // Đổi sang number
  originalPrice?: number; // Đổi sang number
  rating?: number;
  accounts?: number;
  level?: string | number;
  rank?: string;
  ar?: number;
  champions?: number;
  agents?: number;
  characters?: number;
  heroes?: number;
  mmr?: string;
  jobs?: number;
  hours?: number;
  itemLevel?: number;
  featured?: boolean;
};

const categories = [
  { value: "all", label: "Tất cả" },
  { value: "moba", label: "MOBA" },
  { value: "fps", label: "FPS" },
  { value: "rpg", label: "RPG" },
  { value: "strategy", label: "Strategy" },
  { value: "adventure", label: "Adventure" },
  { value: "simulation", label: "Simulation" },
];

const sortOptions = [
  { value: "featured", label: "Nổi bật" },
  { value: "price-low", label: "Giá thấp đến cao" },
  { value: "price-high", label: "Giá cao đến thấp" },
  { value: "rating", label: "Đánh giá cao nhất" },
  { value: "newest", label: "Mới nhất" },
];

const Games = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [filteredGames, setFilteredGames] = useState<Product[]>([]);
  const { fetchCart } = useCart();

  const addToCart = async (game) => {
    try {
      const userStr = localStorage.getItem("user");
      if (!userStr) {
        alert("Bạn cần đăng nhập để thêm vào giỏ hàng!");
        return;
      }
      const user = JSON.parse(userStr);
      if (!user._id) {
        alert("Không tìm thấy thông tin tài khoản!");
        return;
      }
      const res = await axios.post("http://localhost:5000/api/cart/add", {
        user: user._id,
        items: [
          {
            product: game._id,
            quantity: 1,
          },
        ],
      });
      if (res.status === 200) {
        await fetchCart(); // Cập nhật lại cart context
        alert("Đã thêm vào giỏ hàng!");
      } else {
        alert("Thêm vào giỏ hàng thất bại!");
      }
    } catch (err) {
      alert("Lỗi khi thêm vào giỏ hàng!");
    }
  };

  // Fetch tài khoản chưa bán
  const fetchAvailableAccounts = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/accounts/available");
      const data = await res.json();
      setProducts(data);
      setLoading(false);
    } catch {
      setProducts([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailableAccounts();
  }, []);

  useEffect(() => {
    let ignore = false;

    const fetchAndFilter = async () => {
      setLoading(true);
      try {
        // Chỉ fetch khi products chưa có dữ liệu
        let data = products;
        if (products.length === 0) {
          const res = await fetch("http://localhost:5000/api/accounts/available");
          data = await res.json();
          if (!ignore) setProducts(data);
        }

        // Filter
        let filtered = [...data];
        if (searchTerm) {
          filtered = filtered.filter((game) =>
            game.title.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
        if (selectedCategory !== "all") {
          filtered = filtered.filter(
            (game) => game.category?.toLowerCase() === selectedCategory
          );
        }

        // Sort
        switch (sortBy) {
          case "price-low":
            filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
            break;
          case "price-high":
            filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
            break;
          case "rating":
            filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
            break;
          case "featured":
            filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
            break;
          default:
            break;
        }

        if (!ignore) setFilteredGames(filtered);
      } catch {
        if (!ignore) setFilteredGames([]);
      }
      setLoading(false);
    };

    fetchAndFilter();

    return () => {
      ignore = true;
    };
    // eslint-disable-next-line
  }, [searchTerm, selectedCategory, sortBy]);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Page Header */}
      <section className="py-12 bg-card border-b border-border">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">Danh mục Game</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Khám phá hàng ngàn tài khoản game chất lượng với giá cả hợp lý
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-6 bg-background border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              {/* Search */}
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm game..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Category Filter */}
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Chọn thể loại" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-4 w-full lg:w-auto">
              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Sắp xếp theo" />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="text-sm text-muted-foreground whitespace-nowrap">
                {filteredGames.length} kết quả
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Games Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="text-center py-12">Đang tải dữ liệu...</div>
          ) : filteredGames.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                Không tìm thấy game nào phù hợp.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredGames.map((game) => (
                <Card
                  key={game._id}
                  className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105 bg-card border-border/50"
                >
                  <div className="relative">
                    <img
                      src={game.image}
                      alt={game.title}
                      className="w-full h-48 object-cover"
                    />
                    <Badge className="absolute top-3 left-3 bg-gaming-primary text-white">
                      {game.category}
                    </Badge>
                    {game.featured && (
                      <Badge className="absolute top-3 right-3 bg-gaming-accent text-white">
                        HOT
                      </Badge>
                    )}
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
                      {game.rank && (
                        <p>
                          Rank:{" "}
                          <span className="text-gaming-primary font-medium">
                            {game.rank}
                          </span>
                        </p>
                      )}
                      {game.champions && (
                        <p>
                          Tướng:{" "}
                          <span className="text-gaming-primary font-medium">
                            {game.champions}
                          </span>
                        </p>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0 flex flex-col space-y-3">
                    <div className="w-full">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold text-gaming-primary">
                          {game.price.toLocaleString()}đ
                        </span>
                        {game.originalPrice && (
                          <span className="text-sm text-muted-foreground line-through">
                            {game.originalPrice.toLocaleString()}đ
                          </span>
                        )}
                        {game.originalPrice && (
                          <Badge variant="destructive">
                            -
                            {Math.round(
                              ((game.originalPrice - game.price) / game.originalPrice) * 100
                            )}
                            %
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex w-full space-x-2">
                      <Link to={`/games/${game._id}`} className="flex-1">
                        <Button variant="outline" className="w-full">
                          Xem chi tiết
                        </Button>
                      </Link>
                      <Button
                        size="icon"
                        className="bg-gaming-primary hover:bg-gaming-primary/90"
                        onClick={() => addToCart(game)}
                      >
                        <ShoppingCart className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Games;