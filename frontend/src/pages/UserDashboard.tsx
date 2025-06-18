import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  User, 
  ShoppingBag, 
  Heart,
  Settings,
  Download,
  Eye,
  Star,
  Package
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);

  // Lấy user hiện tại từ localStorage
  const userLocal = localStorage.getItem('user');
  const userObj = userLocal ? JSON.parse(userLocal) : {};

  // State cho user và lịch sử đơn hàng
  const [user, setUser] = useState({
    name: userObj.name || '',
    email: userObj.email || '',
    phone: userObj.phone || '',
    joinDate: userObj.createdAt
      ? new Date(userObj.createdAt).toLocaleDateString()
      : '',
    totalOrders: 0,
    totalSpent: '0 VNĐ',
    avatar: '/placeholder.svg'
  });
  const [orderHistory, setOrderHistory] = useState([]);

   const [editForm, setEditForm] = useState({
    name: userObj.name || '',
    phone: userObj.phone || ''
  });
  const [isSaving, setIsSaving] = useState(false);

  // Khi bấm "Chỉnh sửa"
  const handleEditClick = () => {
    setEditForm({
      name: user.name,
      phone: user.phone
    });
    setIsEditing(true);
  };

  // Khi thay đổi input
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  // Khi bấm "Lưu thay đổi"
  const handleSaveEdit = async () => {
    setIsSaving(true);
    try {
      const res = await axios.put(`http://localhost:5000/api/users/self/${userObj._id}`, {
        name: editForm.name,
        phone: editForm.phone
      });
      setUser(prev => ({
        ...prev,
        name: res.data.name,
        phone: res.data.phone
      }));
      // Cập nhật localStorage để các trang khác cũng nhận được thay đổi
      const updatedUser = { ...userObj, name: res.data.name, phone: res.data.phone };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setIsEditing(false);
    } catch {
      alert('Cập nhật thông tin thất bại!');
    }
    setIsSaving(false);
  };

  // Fetch lịch sử đơn hàng thực tế từ backend
  useEffect(() => {
    if (!userObj._id) return;
    axios.get(`http://localhost:5000/api/orders/user/${userObj._id}`)
      .then(res => {
        setOrderHistory(res.data);
        // Tính tổng đơn và tổng chi tiêu
        setUser(prev => ({
          ...prev,
          totalOrders: res.data.length,
          totalSpent: res.data.reduce((sum, order) => sum + (order.total || 0), 0).toLocaleString() + ' VNĐ'
        }));
      })
      .catch(() => setOrderHistory([]));
  }, [userObj._id]);

  // ...wishlist, recentViewed giữ nguyên hoặc fetch thực tế nếu có...

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gaming-gradient bg-clip-text text-transparent">
            Tài khoản của tôi
          </h1>
          <p className="text-muted-foreground mt-2">
            Quản lý thông tin cá nhân và đơn hàng của bạn
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center space-y-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="text-center">
                    <h3 className="font-semibold">{user.name}</h3>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                
                <div className="mt-6 space-y-2">
                  <Button 
                    variant={activeTab === 'profile' ? 'default' : 'ghost'} 
                    className="w-full justify-start"
                    onClick={() => setActiveTab('profile')}
                  >
                    <User className="h-4 w-4 mr-2" />
                    Thông tin cá nhân
                  </Button>
                  <Button 
                    variant={activeTab === 'orders' ? 'default' : 'ghost'} 
                    className="w-full justify-start"
                    onClick={() => setActiveTab('orders')}
                  >
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    Lịch sử đơn hàng
                  </Button>
                  <Button 
                    variant={activeTab === 'wishlist' ? 'default' : 'ghost'} 
                    className="w-full justify-start"
                    onClick={() => setActiveTab('wishlist')}
                  >
                    <Heart className="h-4 w-4 mr-2" />
                    Danh sách yêu thích
                  </Button>
                  <Button 
                    variant={activeTab === 'recent' ? 'default' : 'ghost'} 
                    className="w-full justify-start"
                    onClick={() => setActiveTab('recent')}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Đã xem gần đây
                  </Button>
                  <Button 
                    variant={activeTab === 'settings' ? 'default' : 'ghost'} 
                    className="w-full justify-start"
                    onClick={() => setActiveTab('settings')}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Cài đặt
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'profile' && (
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                  <CardTitle>Thông tin cá nhân</CardTitle>
                  <Button 
                    variant="outline" 
                    onClick={isEditing ? () => setIsEditing(false) : handleEditClick}
                  >
                    {isEditing ? 'Hủy' : 'Chỉnh sửa'}
                  </Button>
                </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Họ và tên</Label>
                    <Input 
                      id="name"
                      name="name"
                      value={isEditing ? editForm.name : user.name}
                      onChange={handleEditChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      value={user.email} 
                      disabled
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Số điện thoại</Label>
                    <Input 
                      id="phone"
                      name="phone"
                      value={isEditing ? editForm.phone : user.phone}
                      onChange={handleEditChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="joinDate">Ngày tham gia</Label>
                    <Input 
                      id="joinDate" 
                      value={user.joinDate} 
                      disabled
                    />
                  </div>
                </div>
                  
                  {/* Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-2">
                          <Package className="h-5 w-5 text-gaming-primary" />
                          <div>
                            <p className="text-sm text-muted-foreground">Tổng đơn hàng</p>
                            <p className="text-2xl font-bold">{user.totalOrders}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-2">
                          <Star className="h-5 w-5 text-gaming-primary" />
                          <div>
                            <p className="text-sm text-muted-foreground">Tổng chi tiêu</p>
                            <p className="text-2xl font-bold">{user.totalSpent}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {isEditing && (
                  <div className="flex space-x-4">
                    <Button
                      className="bg-gaming-primary hover:bg-gaming-primary/90"
                      onClick={handleSaveEdit}
                      disabled={isSaving}
                    >
                      {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
                    </Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Hủy
                    </Button>
                  </div>
                )}
                </CardContent>
              </Card>
            )}

            {activeTab === 'orders' && (
              <Card>
                <CardHeader>
                  <CardTitle>Lịch sử đơn hàng</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Mã đơn</TableHead>
                        <TableHead>Sản phẩm</TableHead>
                        <TableHead>Ngày mua</TableHead>
                        <TableHead>Số tiền</TableHead>
                        <TableHead>Trạng thái</TableHead>
                        <TableHead>Hành động</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orderHistory.map((order) => (
                        <TableRow key={order._id}>
                          <TableCell className="font-medium">{order._id}</TableCell>
                          <TableCell>
                            {order.items?.map(item => item.title).join(", ")}
                          </TableCell>
                          <TableCell>
                            {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : ''}
                          </TableCell>
                          <TableCell>
                            {order.total?.toLocaleString()}đ
                          </TableCell>
                          <TableCell>
                            <Badge variant={
                              order.status === 'completed' ? 'default' : 'secondary'
                            }>
                              {order.status === 'completed' ? 'Hoàn thành' : 'Chờ xử lý'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {/* Nếu có link tải về, hiển thị nút tải */}
                            {order.downloadLink && (
                              <Button variant="outline" size="sm">
                                <Download className="h-4 w-4 mr-2" />
                                Tải về
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                      {orderHistory.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center text-muted-foreground">
                            Bạn chưa có đơn hàng nào.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}

            {/* ...wishlist, recent, settings giữ nguyên... */}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default UserDashboard;