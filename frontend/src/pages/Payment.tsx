import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CreditCard, Smartphone, Building, Wallet, Shield, Clock, CheckCircle, ArrowLeft } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';
import { useCart } from './Cartcontext';

const Payment = () => {
  const [selectedMethod, setSelectedMethod] = useState('momo');
  const location = useLocation();
  const { cartItems, fetchCart } = useCart();

  const { toast } = useToast();

  // Lấy bill từ state truyền qua navigate hoặc fallback về cartItems
  const bill = location.state
    ? {
      ...location.state,
      shipping: location.state.subtotal >= 1000000 ? 0 : 50000, // phí xử lý
    }
    : {
      items: cartItems,
      subtotal: cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
      discount: cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0) * 0.1,
      shipping:
        cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0) >= 1000000
          ? 0
          : 50000,
      total: 0, // sẽ tính lại bên dưới
    };
  bill.total =
    (bill.subtotal - bill.discount + bill.shipping) *
    (selectedMethod === "card" ? 1.025 : 1);

  // Khi xác nhận thanh toán mới tạo đơn hàng 
  //  const handleCheckout = async () => {
  //   try {
  //     const userStr = localStorage.getItem("user");
  //     if (!userStr) return;
  //     const user = JSON.parse(userStr);

  //     const total =
  //       selectedMethod === "card"
  //         ? bill.total + Math.round(bill.total * 0.025)
  //         : bill.total;

  //     const res = await axios.post("http://localhost:5000/api/orders", {
  //       email: user.email,
  //       name: user.name,
  //       total,
  //       paymentMethod: selectedMethod,
  //       items: bill.items.map(item => ({
  //         title: item.title,
  //         name: item.name,
  //         price: item.price,
  //         quantity: item.quantity,
  //       })),
  //     });

  //     if (res.data && res.data.order) {
  //       await axios.post("http://localhost:5000/api/cart/clear", {
  //         user: user._id,
  //       });

  //       toast({
  //         title: "Thanh toán thành công!",
  //         description: "Đơn hàng của bạn đã được ghi nhận.",
  //       });

  //       await fetchCart();
  //     }
  //   } catch (err) {
  //     toast({
  //       title: "Thanh toán thất bại",
  //       description: "Vui lòng thử lại hoặc liên hệ hỗ trợ.",
  //       variant: "destructive",
  //     });
  //   }
  // };

 const handleCheckout = async () => {
  try {
    const userStr = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (!userStr || !token) {
      toast({
        title: "Lỗi xác thực",
        description: "Bạn cần đăng nhập để thanh toán.",
        variant: "destructive",
      });
      return;
    }
    const user = JSON.parse(userStr);

    const res = await axios.post(
      "http://localhost:5000/api/orders",
      {
        user: user._id,
        email: user.email,
        name: user.name,
        total: bill.total,
        paymentMethod: selectedMethod,
        items: bill.items.map(item => ({
          product: item._id,
          title: item.title,
          price: item.price,
        })),
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (res.data && res.data.order) {
      await axios.post("http://localhost:5000/api/cart/clear", {
        user: user._id,
      });

      toast({
        title: "Thanh toán thành công!",
        description: "Đơn hàng của bạn đã được ghi nhận.",
      });

      await fetchCart();
    } else {
      toast({
        title: "Thanh toán thất bại",
        description: "Không nhận được phản hồi từ máy chủ.",
        variant: "destructive",
      });
    }
  } catch (err: any) {
    console.error("Lỗi thanh toán:", err);
    toast({
      title: "Thanh toán thất bại",
      description: err?.response?.data?.message || "Vui lòng thử lại hoặc liên hệ hỗ trợ.",
      variant: "destructive",
    });
  }
};




  const paymentMethods = [
    {
      id: 'momo',
      name: 'Ví MoMo',
      icon: <Smartphone className="h-6 w-6" />,
      description: 'Thanh toán qua ví điện tử MoMo',
      fee: 'Miễn phí',
      processingTime: 'Tức thì',
      popular: true
    },
    {
      id: 'banking',
      name: 'Chuyển khoản ngân hàng',
      icon: <Building className="h-6 w-6" />,
      description: 'Chuyển khoản qua ngân hàng hoặc ATM',
      fee: 'Miễn phí',
      processingTime: '5-15 phút'
    },
    {
      id: 'zalopay',
      name: 'ZaloPay',
      icon: <Wallet className="h-6 w-6" />,
      description: 'Thanh toán qua ví điện tử ZaloPay',
      fee: 'Miễn phí',
      processingTime: 'Tức thì'
    },
    {
      id: 'card',
      name: 'Thẻ tín dụng/ghi nợ',
      icon: <CreditCard className="h-6 w-6" />,
      description: 'Visa, Mastercard, JCB',
      fee: '2.5%',
      processingTime: 'Tức thì'
    }
  ];

  const bankingInfo = {
    bank: 'Vietcombank',
    accountNumber: '1234567890',
    accountName: 'CONG TY TNHH GAMESTORE',
    branch: 'Chi nhánh Quận 1, TP.HCM'
  };

  const momoInfo = {
    phoneNumber: '0123456789',
    accountName: 'GameStore Official'
  };



  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Link to="/cart" className="text-gaming-primary hover:text-gaming-primary/80">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <h1 className="text-3xl font-bold">Thanh toán</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Methods */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Choose Payment Method */}
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold flex items-center">
                  <span className="bg-gaming-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3">1</span>
                  Chọn phương thức thanh toán
                </h2>
              </CardHeader>
              <CardContent>
                <RadioGroup value={selectedMethod} onValueChange={setSelectedMethod} className="space-y-4">
                  {paymentMethods.map((method) => (
                    <div key={method.id} className="relative">
                      <Label
                        htmlFor={method.id}
                        className={`flex items-center space-x-4 p-4 rounded-lg border cursor-pointer transition-all ${selectedMethod === method.id
                          ? 'border-gaming-primary bg-gaming-primary/5'
                          : 'border-border hover:border-gaming-primary/50'
                          }`}
                      >
                        <RadioGroupItem value={method.id} id={method.id} />
                        <div className="flex items-center space-x-4 flex-1">
                          <div className="text-gaming-primary">
                            {method.icon}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <h3 className="font-medium">{method.name}</h3>
                              {method.popular && (
                                <Badge className="bg-gaming-accent text-white text-xs">Phổ biến</Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">{method.description}</p>
                            <div className="flex items-center space-x-4 mt-1 text-xs text-muted-foreground">
                              <span>Phí: {method.fee}</span>
                              <span>Xử lý: {method.processingTime}</span>
                            </div>
                          </div>
                        </div>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Step 2: Payment Details */}
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold flex items-center">
                  <span className="bg-gaming-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3">2</span>
                  Thông tin thanh toán
                </h2>
              </CardHeader>
              <CardContent>
                {selectedMethod === 'momo' && (
                  <div className="space-y-4">
                    <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
                      <h3 className="font-medium mb-2 text-blue-900 dark:text-blue-100">Thông tin MoMo</h3>
                      <div className="space-y-2 text-sm">
                        <p><strong>Số điện thoại:</strong> {momoInfo.phoneNumber}</p>
                        <p><strong>Tên tài khoản:</strong> {momoInfo.accountName}</p>
                        <p><strong>Nội dung:</strong> GAMESTORE {Date.now()}</p>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <p>• Vui lòng chuyển khoản đúng nội dung để được xử lý tự động</p>
                      <p>• Tài khoản sẽ được giao trong vòng 5 phút sau khi thanh toán</p>
                    </div>
                  </div>
                )}

                {selectedMethod === 'banking' && (
                  <div className="space-y-4">
                    <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg">
                      <h3 className="font-medium mb-2 text-green-900 dark:text-green-100">Thông tin ngân hàng</h3>
                      <div className="space-y-2 text-sm">
                        <p><strong>Ngân hàng:</strong> {bankingInfo.bank}</p>
                        <p><strong>Số tài khoản:</strong> {bankingInfo.accountNumber}</p>
                        <p><strong>Tên tài khoản:</strong> {bankingInfo.accountName}</p>
                        <p><strong>Chi nhánh:</strong> {bankingInfo.branch}</p>
                        <p><strong>Nội dung:</strong> GAMESTORE {Date.now()}</p>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <p>• Vui lòng chuyển khoản đúng nội dung để được xử lý tự động</p>
                      <p>• Tài khoản sẽ được giao trong vòng 15 phút sau khi thanh toán</p>
                    </div>
                  </div>
                )}

                {selectedMethod === 'zalopay' && (
                  <div className="space-y-4">
                    <div className="bg-purple-50 dark:bg-purple-950 p-4 rounded-lg">
                      <h3 className="font-medium mb-2 text-purple-900 dark:text-purple-100">Thanh toán ZaloPay</h3>
                      <p className="text-sm">Bạn sẽ được chuyển đến trang thanh toán ZaloPay để hoàn tất giao dịch.</p>
                    </div>
                  </div>
                )}

                {selectedMethod === 'card' && (
                  <div className="space-y-4">
                    <div className="bg-orange-50 dark:bg-orange-950 p-4 rounded-lg">
                      <h3 className="font-medium mb-2 text-orange-900 dark:text-orange-100">Thanh toán thẻ</h3>
                      <p className="text-sm">Bạn sẽ được chuyển đến trang thanh toán an toàn để nhập thông tin thẻ.</p>
                      <p className="text-xs text-muted-foreground mt-2">Phí giao dịch 2.5% sẽ được tính thêm vào tổng số tiền.</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Security Info */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-4 text-sm">
                  <Shield className="h-5 w-5 text-green-600" />
                  <span className="text-muted-foreground">
                    Giao dịch được bảo mật bằng SSL 256-bit
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <h2 className="text-xl font-semibold">Đơn hàng của bạn</h2>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Items */}
                <div className="space-y-3">
                  {bill.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.title || item.name}</p>
                        {/* <p className="font-medium text-sm">{item.title}</p> */}
                        {/* <p className="font-medium text-sm">{item.name}</p> */}
                        {/* <p className="text-xs text-muted-foreground">Số lượng: {item.quantity}</p> */}
                      </div>
                      <p className="font-medium">
                        {(item.price * item.quantity).toLocaleString()}đ
                      </p>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-3">
                  <div className="flex justify-between">
                    <span>Tạm tính:</span>
                    <span>{bill.subtotal.toLocaleString()}đ</span>
                  </div>

                  <div className="flex justify-between text-green-600">
                    <span>Giảm giá:</span>
                    <span>-{bill.discount.toLocaleString()}đ</span>
                  </div>

                  {/* phí xử lý */}
                  <div className="flex justify-between">
                    <span>Phí xử lý:</span>
                    <span>
                      {bill.shipping === 0 ? "Miễn phí" : `${bill.shipping.toLocaleString()}đ`}
                    </span>
                  </div>


                  {selectedMethod === 'card' && (
                    <div className="flex justify-between text-orange-600">
                      <span>Phí giao dịch (2.5%):</span>
                      <span>+{Math.round(bill.total * 0.025).toLocaleString()}đ</span>
                    </div>
                  )}

                  <div className="border-t pt-3">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Tổng cộng:</span>
                      <span className="text-gaming-primary">
                        {selectedMethod === 'card'
                          ? (bill.total + Math.round(bill.total * 0.025)).toLocaleString()
                          : bill.total.toLocaleString()
                        }đ
                      </span>
                    </div>
                  </div>
                </div>

                <Button
                  className="w-full bg-gaming-primary hover:bg-gaming-primary/90"
                  onClick={handleCheckout}
                >
                  Xác nhận thanh toán
                </Button>

                {/* Guarantees */}
                <div className="pt-4 space-y-3 text-sm">
                  <div className="flex items-center space-x-2 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span>Bảo hành tài khoản 6 tháng</span>
                  </div>
                  <div className="flex items-center space-x-2 text-blue-600">
                    <Clock className="h-4 w-4" />
                    <span>Giao hàng tự động 24/7</span>
                  </div>
                  <div className="flex items-center space-x-2 text-purple-600">
                    <Shield className="h-4 w-4" />
                    <span>Hoàn tiền 100% nếu lỗi</span>
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

export default Payment;