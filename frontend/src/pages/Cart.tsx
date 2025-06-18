import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';
import { useCart } from './Cartcontext';

const Cart = () => {
  const { toast } = useToast();

  const navigate = useNavigate();
  
  const { cartItems, fetchCart, setCartItems, removeItemFromCart, updateQuantityOnServer } = useCart();

  const [promoCode, setPromoCode] = useState('');

const updateQuantity = async (id: string, newQuantity: number) => {
  if (newQuantity === 0) {
    await removeItemFromCart(id);
    toast({
      title: "Đã xóa sản phẩm",
      description: "Sản phẩm đã được xóa khỏi giỏ hàng.",
    });
    return;
  }
  await updateQuantityOnServer(id, newQuantity);
  toast({
    title: "Lưu ý",
    description: "Số lượng chỉ có 1 không thể tăng",
  });
};

const removeItem = async (id: string) => {
  await removeItemFromCart(id);
  toast({
    title: "Đã xóa sản phẩm",
    description: "Sản phẩm đã được xóa khỏi giỏ hàng.",
  });
};

const applyPromoCode = () => {
  if (promoCode.trim()) {
    toast({
      title: "Mã giảm giá đã được áp dụng",
      description: `Mã "${promoCode}" đã được áp dụng thành công.`,
    });
  }
};



 const handleProceedToPayment = () => {
    // Truyền bill qua state
    navigate("/payment", {
      state: {
        items: cartItems,
        subtotal,
        discount,
        shipping,
        total,
      },
    });
  };

 useEffect(() => {
    fetchCart();
  }, []);


const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
const discount = subtotal * 0.1; // 10% discount
const shipping = subtotal > 1000000 ? 0 : 50000; // Free shipping over 1M
const total = subtotal - discount + shipping;

if (cartItems.length === 0) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-12">
        <div className="text-center space-y-6">
          <ShoppingBag className="h-24 w-24 mx-auto text-muted-foreground" />
          <h1 className="text-3xl font-bold">Giỏ hàng trống</h1>
          <p className="text-muted-foreground">Bạn chưa có sản phẩm nào trong giỏ hàng</p>
          <Link to="/games">
            <Button className="bg-gaming-primary hover:bg-gaming-primary/90">
              Tiếp tục mua sắm
            </Button>
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}



return (
  <div className="min-h-screen bg-background">
    <Header />

    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Link to="/games" className="text-gaming-primary hover:text-gaming-primary/80">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <h1 className="text-3xl font-bold">Giỏ hàng</h1>
          <Badge variant="secondary">{cartItems.length} sản phẩm</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-20 h-16 rounded-lg object-cover"
                  />

                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h3 className="font-semibold text-lg">{item.title}</h3>
                        <Badge variant="outline" className="w-fit">
                          {item.category}
                        </Badge>
                        <div className="text-sm text-muted-foreground space-y-1">
                          {item.rank && <p>Rank: {item.rank}</p>}
                          {item.ar && <p>AR: {item.ar}</p>}
                          {item.champions && <p>Tướng: {item.champions}</p>}
                          {item.agents && <p>Agents: {item.agents}</p>}
                          {item.characters && <p>Nhân vật: {item.characters}</p>}
                          {item.skins && <p>Skins: {item.skins}</p>}
                          {item.weapons && <p>Vũ khí: {item.weapons}</p>}
                        </div>
                      </div>

                      <div className="text-right space-y-2">
                        <p className="text-lg font-bold text-gaming-primary">
                          {(item.price * item.quantity).toLocaleString()}đ
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {item.price.toLocaleString()}đ x {item.quantity}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-12 text-center font-medium">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                        className="text-destructive hover:text-destructive/80"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Xóa
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <h2 className="text-xl font-semibold">Tóm tắt đơn hàng</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Promo Code */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Mã giảm giá</label>
                <div className="flex space-x-2">
                  <Input
                    placeholder="Nhập mã giảm giá"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                  />
                  <Button variant="outline" onClick={applyPromoCode}>
                    Áp dụng
                  </Button>
                </div>
              </div>

              <div className="border-t pt-4 space-y-3">
                <div className="flex justify-between">
                  <span>Tạm tính:</span>
                  <span>{subtotal.toLocaleString()}đ</span>
                </div>

                <div className="flex justify-between text-green-600">
                  <span>Giảm giá:</span>
                  <span>-{discount.toLocaleString()}đ</span>
                </div>

                <div className="flex justify-between">
                  <span>Phí xử lý:</span>
                  <span>{shipping === 0 ? 'Miễn phí' : `${shipping.toLocaleString()}đ`}</span>
                </div>

                {shipping === 0 && (
                  <p className="text-sm text-green-600">
                    🎉 Bạn được miễn phí xử lý!
                  </p>
                )}

                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Tổng cộng:</span>
                    <span className="text-gaming-primary">
                      {total.toLocaleString()}đ
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-4">
                <Link to="/payment" className="w-full">
                  <Button onClick={handleProceedToPayment} className="w-full bg-gaming-primary hover:bg-gaming-primary/90">
                    Thanh toán
                  </Button>
                </Link>

                <Link to="/games" className="w-full">
                  <Button variant="outline" className="w-full">
                    Tiếp tục mua sắm
                  </Button>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-4 space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <span className="text-green-600">✓</span>
                  <span>Bảo hành tài khoản 6 tháng</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-green-600">✓</span>
                  <span>Giao hàng ngay sau thanh toán</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-green-600">✓</span>
                  <span>Hỗ trợ 24/7</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>

    <Footer />
  </div>
);
};

export default Cart;