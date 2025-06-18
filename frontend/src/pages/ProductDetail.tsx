import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star, ShoppingCart, Shield, Clock, CheckCircle, ArrowLeft, Heart } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [selectedAccount, setSelectedAccount] = useState(0);

  // Mock data - in real app this would come from API
  const product = {
    id: 1,
    title: 'League of Legends',
    category: 'MOBA',
    images: [
      'https://via.placeholder.com/600x400?text=League+of+Legends+1',
      'https://via.placeholder.com/600x400?text=League+of+Legends+2',
      'https://via.placeholder.com/600x400?text=League+of+Legends+3'
    ],
    price: '500,000',
    originalPrice: '700,000',
    rating: 4.8,
    totalReviews: 156,
    availability: 15,
    description: 'Tài khoản League of Legends với rank cao, nhiều tướng và skin hiếm. Tài khoản đã được verify và bảo hành 6 tháng.',
    features: [
      'Rank: Vàng II - Platinum IV',
      '142+ Tướng đã mở khóa',
      '25+ Skin hiếm và đẹp',
      'Blue Essence: 50,000+',
      'Riot Points: 1,350',
      'Honor Level: 5',
      'Email có thể thay đổi',
      'Bảo hành 6 tháng'
    ],
    accounts: [
      {
        id: 1,
        rank: 'Vàng II',
        champions: 142,
        skins: 25,
        be: 52000,
        rp: 1350,
        honor: 5,
        price: '500,000'
      },
      {
        id: 2,
        rank: 'Vàng I',
        champions: 145,
        skins: 28,
        be: 48000,
        rp: 1200,
        honor: 4,
        price: '550,000'
      },
      {
        id: 3,
        rank: 'Platinum IV',
        champions: 147,
        skins: 32,
        be: 45000,
        rp: 1500,
        honor: 5,
        price: '650,000'
      }
    ],
    specifications: {
      'Thể loại': 'MOBA',
      'Nhà phát hành': 'Riot Games',
      'Khu vực': 'Việt Nam',
      'Ngôn ngữ': 'Tiếng Việt',
      'Bảo hành': '6 tháng',
      'Hỗ trợ': '24/7'
    },
    reviews: [
      {
        id: 1,
        user: 'Nguyễn Văn A',
        rating: 5,
        comment: 'Tài khoản chất lượng, đúng mô tả. Shop hỗ trợ nhiệt tình!',
        date: '2024-01-15'
      },
      {
        id: 2,
        user: 'Trần Thị B',
        rating: 4,
        comment: 'Giao hàng nhanh, tài khoản ổn định. Sẽ mua thêm.',
        date: '2024-01-10'
      }
    ]
  };

  const handleAddToCart = () => {
    toast({
      title: "Thêm vào giỏ hàng thành công!",
      description: `${product.title} đã được thêm vào giỏ hàng của bạn.`,
    });
  };

  const handleBuyNow = () => {
    toast({
      title: "Chuyển đến thanh toán",
      description: "Đang chuyển hướng đến trang thanh toán...",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-gaming-primary">Trang chủ</Link>
          <span>/</span>
          <Link to="/games" className="hover:text-gaming-primary">Danh mục</Link>
          <span>/</span>
          <span className="text-foreground">{product.title}</span>
        </nav>

        {/* Back Button */}
        <Link to="/games" className="inline-flex items-center mb-6 text-gaming-primary hover:text-gaming-primary/80">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại danh sách
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square rounded-lg overflow-hidden bg-card">
              <img 
                src={product.images[0]} 
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              {product.images.slice(1).map((image, index) => (
                <div key={index} className="aspect-square rounded-lg overflow-hidden bg-card cursor-pointer hover:opacity-80">
                  <img 
                    src={image} 
                    alt={`${product.title} ${index + 2}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <Badge className="mb-2 bg-gaming-primary">{product.category}</Badge>
              <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
              
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  <div className="flex items-center mr-2">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium">{product.rating}</span>
                  <span className="text-sm text-muted-foreground ml-2">({product.totalReviews} đánh giá)</span>
                </div>
              </div>

              <div className="flex items-center space-x-4 mb-6">
                <span className="text-3xl font-bold text-gaming-primary">
                  {product.accounts[selectedAccount].price}đ
                </span>
                <span className="text-xl text-muted-foreground line-through">
                  {product.originalPrice}đ
                </span>
                <Badge variant="destructive">
                  -{Math.round(((parseInt(product.originalPrice.replace(',', '')) - parseInt(product.accounts[selectedAccount].price.replace(',', ''))) / parseInt(product.originalPrice.replace(',', ''))) * 100)}%
                </Badge>
              </div>

              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center text-green-600">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  <span className="text-sm">Còn {product.availability} tài khoản</span>
                </div>
                <div className="flex items-center text-blue-600">
                  <Shield className="h-4 w-4 mr-1" />
                  <span className="text-sm">Bảo hành 6 tháng</span>
                </div>
                <div className="flex items-center text-purple-600">
                  <Clock className="h-4 w-4 mr-1" />
                  <span className="text-sm">Giao ngay</span>
                </div>
              </div>
            </div>

            {/* Account Selection */}
            <div className="space-y-4">
              <h3 className="font-semibold">Chọn tài khoản:</h3>
              <div className="grid gap-3">
                {product.accounts.map((account, index) => (
                  <Card 
                    key={account.id}
                    className={`cursor-pointer transition-all ${selectedAccount === index ? 'ring-2 ring-gaming-primary bg-gaming-primary/5' : 'hover:shadow-md'}`}
                    onClick={() => setSelectedAccount(index)}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <div className="font-medium">Rank: {account.rank}</div>
                          <div className="text-sm text-muted-foreground">
                            {account.champions} tướng • {account.skins} skin • Honor {account.honor}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            BE: {account.be.toLocaleString()} • RP: {account.rp.toLocaleString()}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-gaming-primary">{account.price}đ</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Quantity and Actions */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <label className="font-medium">Số lượng:</label>
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    -
                  </Button>
                  <span className="w-12 text-center">{quantity}</span>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => setQuantity(Math.min(product.availability, quantity + 1))}
                  >
                    +
                  </Button>
                </div>
              </div>

              <div className="flex space-x-3">
                <Button 
                  onClick={handleAddToCart}
                  variant="outline" 
                  className="flex-1 border-gaming-primary text-gaming-primary hover:bg-gaming-primary/10"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Thêm vào giỏ
                </Button>
                <Button 
                  onClick={handleBuyNow}
                  className="flex-1 bg-gaming-primary hover:bg-gaming-primary/90"
                >
                  Mua ngay
                </Button>
                <Button variant="outline" size="icon">
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="description">Mô tả</TabsTrigger>
            <TabsTrigger value="specifications">Thông số</TabsTrigger>
            <TabsTrigger value="reviews">Đánh giá</TabsTrigger>
          </TabsList>
          
          <TabsContent value="description" className="mt-6">
            <Card>
              <CardHeader>
                <h3 className="text-xl font-semibold">Mô tả sản phẩm</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">{product.description}</p>
                <div>
                  <h4 className="font-semibold mb-3">Tính năng nổi bật:</h4>
                  <ul className="space-y-2">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="specifications" className="mt-6">
            <Card>
              <CardHeader>
                <h3 className="text-xl font-semibold">Thông số kỹ thuật</h3>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b border-border last:border-b-0">
                      <span className="font-medium">{key}:</span>
                      <span className="text-muted-foreground">{value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="reviews" className="mt-6">
            <Card>
              <CardHeader>
                <h3 className="text-xl font-semibold">Đánh giá khách hàng</h3>
              </CardHeader>
              <CardContent className="space-y-6">
                {product.reviews.map((review) => (
                  <div key={review.id} className="border-b border-border last:border-b-0 pb-4 last:pb-0">
                    <div className="flex items-center space-x-4 mb-2">
                      <span className="font-medium">{review.user}</span>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-4 w-4 ${i < review.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} 
                          />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground">{review.date}</span>
                    </div>
                    <p className="text-muted-foreground">{review.comment}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetail;