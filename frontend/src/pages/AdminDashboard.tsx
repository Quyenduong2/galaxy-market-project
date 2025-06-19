import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Users,
  ShoppingCart,
  TrendingUp,
  DollarSign,
  Package,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AddProductModal from '@/components/admin/AddProductModal';
import EditProductModal from '@/components/admin/EditProductModal';
import DeleteConfirmDialog from '@/components/admin/DeleteConfirmDialog';
import EditOrderModal from '@/components/admin/EditOrderModal';
import EditUserModal from '@/components/admin/EditUserModal';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
  });
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [addProductModalOpen, setAddProductModalOpen] = useState(false);
  const [editProductModal, setEditProductModal] = useState({ open: false, product: null });
  const [editOrderModal, setEditOrderModal] = useState({ open: false, order: null });
  const [editUserModal, setEditUserModal] = useState({ open: false, user: null });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, type: '', id: null, name: '' });
  const [soldAccounts, setSoldAccounts] = useState([]);

  // 7h41
  const [accounts, setAccounts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [search, setSearch] = useState('');
  // 7h41

  const { toast } = useToast();

  const getAuthConfig = () => {
  const token = localStorage.getItem('token');
  return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
};

  // 7h41
  const categories = [
    { value: "all", label: "Tất cả" },
    { value: "moba", label: "MOBA" },
    { value: "fps", label: "FPS" },
    { value: "rpg", label: "RPG" },
    { value: "strategy", label: "Strategy" },
    { value: "adventure", label: "Adventure" },
    { value: "simulation", label: "Simulation" },
  ];

  const fetchAccounts = async (category = '') => {
    let url = 'http://localhost:5000/api/accounts/available';
    if (category && category !== 'all') url += `?category=${encodeURIComponent(category)}`;
    try {
      const res = await axios.get(url);
      setAccounts(res.data);
    } catch {
      setAccounts([]);
      toast({ title: "Lỗi", description: "Không thể tải danh sách tài khoản", variant: "destructive" });
    }
  };

  // Khi chuyển tab sang "products", luôn fetch lại tài khoản chưa bán
  useEffect(() => {
    if (activeTab === "products") {
      fetchAccounts(selectedCategory);
    }
  }, [activeTab, selectedCategory]);

  // Lọc theo tên hoặc game, đồng thời lọc theo category
  const filteredAccounts = accounts.filter(acc =>
    (selectedCategory === "all" || acc.category?.toLowerCase() === selectedCategory) &&
    (
      acc.title?.toLowerCase().includes(search.toLowerCase()) ||
      acc.game?.toLowerCase().includes(search.toLowerCase())
    )
  );

  // 7h41

  // Lấy danh sách đơn hàng từ backend
  const fetchOrders = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/orders',getAuthConfig());
      setOrders(res.data);
    } catch (err) {
      setOrders([]);
      toast({ title: "Lỗi", description: "Không thể tải danh sách đơn hàng", variant: "destructive" });
    }
  };

  // Lấy danh sách sản phẩm và user (giữ nguyên)
  useEffect(() => {
    axios.get('http://localhost:5000/api/accounts', getAuthConfig())
      .then(res => setProducts(res.data))
      .catch(() => setProducts([]));
    axios.get('http://localhost:5000/api/users',getAuthConfig())
      .then(res => setUsers(res.data))
      .catch(() => setUsers([]));
    fetchOrders();
  }, []);

  const handleAddProduct = (newAccount) => {
    setAddProductModalOpen(false);
    // Gọi lại fetchAccounts để cập nhật danh sách tài khoản chưa bán
    fetchAccounts(selectedCategory);
  };


  // Xóa đơn hàng
  const handleDeleteOrder = async (orderId) => {
    await axios.delete(`http://localhost:5000/api/orders/${orderId}`,getAuthConfig());
    fetchOrders();
  };

  // Sửa trạng thái đơn hàng
  const handleUpdateOrder = async (updatedOrder) => {
    await axios.put(`http://localhost:5000/api/orders/${updatedOrder._id}`, { status: updatedOrder.status },getAuthConfig());
    fetchOrders();
    setEditOrderModal({ open: false, order: null });
    toast({ title: "Thành công", description: "Đã cập nhật trạng thái đơn hàng" });
  };

  // Mở modal sửa đơn hàng
  const openEditOrderModal = (order) => {
    setEditOrderModal({ open: true, order });
  };

  // Xử lý xóa (cho dialog xác nhận)
  const handleDelete = async () => {
    const { type, id } = deleteDialog;
    if (type === 'order') await handleDeleteOrder(id);
    if (type === 'user') {
      await axios.delete(`http://localhost:5000/api/users/${id}`,getAuthConfig());
      setUsers(users.filter(u => u._id !== id));
      toast({ title: "Thành công", description: "Đã xóa người dùng" });
    }
    setDeleteDialog({ open: false, type: '', id: null, name: '' });
  };

  // Hàm cập nhật user
  const handleUpdateUser = async (updatedUser) => {
    try {
      await axios.put(`http://localhost:5000/api/users/${updatedUser._id}`, {
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        username: updatedUser.username,
      },getAuthConfig());
      // Sau khi cập nhật, fetch lại danh sách user
      const res = await axios.get('http://localhost:5000/api/users',getAuthConfig());
      setUsers(res.data);
      setEditUserModal({ open: false, user: null });
      toast({ title: "Thành công", description: "Đã cập nhật thông tin người dùng" });
    } catch {
      toast({ title: "Lỗi", description: "Cập nhật người dùng thất bại", variant: "destructive" });
    }
  };

  const statsCards = [
    { title: 'Tổng doanh thu', value: stats.totalRevenue.toLocaleString() + ' VNĐ', icon: DollarSign, change: '' },
    { title: 'Đơn hàng', value: stats.totalOrders.toString(), icon: ShoppingCart, change: '' },
    { title: 'Người dùng', value: stats.totalUsers.toString(), icon: Users, change: '' },
    { title: 'Sản phẩm', value: stats.totalProducts.toString(), icon: Package, change: '' }
  ];


  useEffect(() => {
    axios.get('http://localhost:5000/api/accounts/sold',getAuthConfig())
      .then(res => setSoldAccounts(res.data))
      .catch(() => setSoldAccounts([]));
  }, []);


  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/accounts/stats',getAuthConfig());
        setStats(res.data);
      } catch {
        setStats({
          totalRevenue: 0,
          totalOrders: 0,
          totalProducts: 0,
          totalUsers: 0,
        });
      }
    };
    fetchStats();
  }, []);

  

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gaming-gradient bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Quản lý cửa hàng tài khoản game của bạn
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Tổng quan</TabsTrigger>
            <TabsTrigger value="products">Sản phẩm</TabsTrigger>
            <TabsTrigger value="orders">Đơn hàng</TabsTrigger>
            <TabsTrigger value="users">Người dùng</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {statsCards.map((stat, index) => (
                <Card key={index}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {stat.title}
                    </CardTitle>
                    <stat.icon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    {stat.change && (
                      <p className="text-xs text-gaming-primary">
                        {stat.change} so với tháng trước
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}


            </div>

            {/* Bảng sản phẩm đã bán và doanh thu từng sản phẩm */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Sản phẩm đã bán & Doanh thu từng sản phẩm</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tiêu đề</TableHead>
                      <TableHead>Game</TableHead>
                      {/* <TableHead>Thể loại</TableHead> */}
                      <TableHead>Giá bán</TableHead>
                      <TableHead>Ngày bán</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {soldAccounts.map(acc => (
                      <TableRow key={acc._id}>
                        <TableCell>{acc.title}</TableCell>
                        <TableCell>{acc.game}</TableCell>
                        {/* <TableCell>{acc.category}</TableCell> */}
                        <TableCell>{acc.price?.toLocaleString()}đ</TableCell>
                        <TableCell>{acc.createdAt ? new Date(acc.createdAt).toLocaleDateString() : ''}</TableCell>
                        <TableCell>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={async () => {
                              if (window.confirm('Bạn có chắc muốn xóa tài khoản này?')) {
                                await axios.delete(`http://localhost:5000/api/accounts/${acc._id}`);
                                setSoldAccounts(prev => prev.filter(a => a._id !== acc._id));
                                // Nếu muốn cập nhật lại tổng doanh thu, gọi lại fetchStats();
                              }
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {soldAccounts.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground">
                          Chưa có sản phẩm nào được thanh toán thành công.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>



          <TabsContent value="products" className="space-y-6">
            <h2 className="text-2xl font-bold">Quản lý tài khoản game chưa bán</h2>
            <div className="flex gap-4 mb-4 justify-between">
              <div className="flex gap-4 mb-4">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-48">
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
                <Input
                  placeholder="Tìm kiếm theo tên tài khoản hoặc game..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="max-w-xs"
                />
              </div>

              <Button className="bg-gaming-primary me-1" onClick={() => setAddProductModalOpen(true)}>
                Thêm tài khoản mới
              </Button>
            </div>
            <Card>
              <CardContent className="pt-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tiêu đề</TableHead>
                      <TableHead>Game</TableHead>
                      <TableHead>Giá</TableHead>
                      <TableHead>Rank</TableHead>
                      <TableHead>Ngày tạo</TableHead>
                      <TableHead>Ngày hết hạn</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAccounts.map(acc => (
                      <TableRow key={acc._id}>
                        <TableCell>{acc.title}</TableCell>
                        <TableCell>{acc.game}</TableCell>
                        <TableCell>{acc.price?.toLocaleString()}đ</TableCell>
                        <TableCell>{acc.rank}</TableCell>
                        <TableCell>{new Date(acc.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>{new Date(acc.ngayHetHan).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                    {filteredAccounts.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground">
                          Không có tài khoản nào phù hợp.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>



          <TabsContent value="orders" className="space-y-6">
            <h2 className="text-2xl font-bold">Quản lý đơn hàng</h2>
            <div className="flex space-x-4 mb-6">
              <Input placeholder="Tìm kiếm đơn hàng..." className="max-w-sm" />
              <Button variant="outline">Lọc</Button>
            </div>
            <Card>
              <CardContent className="pt-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mã đơn</TableHead>
                      <TableHead>Khách hàng</TableHead>
                      <TableHead>Sản phẩm</TableHead>
                      <TableHead>Số tiền</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead>Hành động</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order._id}>
                        <TableCell className="font-medium">{order._id}</TableCell>
                        <TableCell>{order.email || order.name}</TableCell>
                        <TableCell>
                          {order.items?.map(item => item.title || item.name).join(", ")}
                        </TableCell>
                        <TableCell>{order.total?.toLocaleString()}đ</TableCell>
                        <TableCell>
                          <Badge variant={
                            order.status === 'completed' ? 'default' :
                              order.status === 'pending' ? 'secondary' : 'outline'
                          }>
                            {order.status === 'completed' ? 'Hoàn thành' :
                              order.status === 'pending' ? 'Chờ xử lý' : 'Đang xử lý'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="icon" onClick={() => openEditOrderModal(order)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => setDeleteDialog({
                                open: true,
                                type: 'order',
                                id: order._id,
                                name: `Đơn hàng ${order._id}`
                              })}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ...giữ nguyên tabs products */}

          <TabsContent value="users" className="space-y-6">
            <h2 className="text-2xl font-bold">Danh sách tài khoản người dùng</h2>
            <div className="flex gap-4 mb-4">
              <Input
                placeholder="Tìm kiếm theo email hoặc tên..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="max-w-xs"
              />
            </div>
            <Card>
              <CardContent className="pt-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Họ tên</TableHead>
                      <TableHead>Tên Tài Khoản</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Số điện thoại</TableHead>
                      <TableHead>Ngày đăng ký</TableHead>
                      <TableHead>Hành động</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users
                      .filter(user =>
                        user.email?.toLowerCase().includes(search.toLowerCase()) ||
                        user.name?.toLowerCase().includes(search.toLowerCase())
                      )
                      .map(user => (
                        <TableRow key={user._id}>
                          <TableCell>{user.name}</TableCell>
                          <TableCell>{user.username}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{user.phone}</TableCell>
                          <TableCell>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : ''}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => setEditUserModal({ open: true, user })}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>

                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() =>
                                  setDeleteDialog({
                                    open: true,
                                    type: 'user',
                                    id: user._id,
                                    name: user.name,
                                  })
                                }
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    {users.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-muted-foreground">
                          Không có người dùng nào.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />

      {/* Modals */}

      <AddProductModal
        open={addProductModalOpen}
        onOpenChange={setAddProductModalOpen}
        onAddProduct={handleAddProduct}
      />

      <EditProductModal
        open={editProductModal.open}
        onOpenChange={(open) => setEditProductModal({ open, product: null })}
        account={editProductModal.product}
        onUpdateAccount={() => { }} // cập nhật lại danh sách tài khoản sau khi sửa nếu cần
      />

      <EditOrderModal
        order={editOrderModal.order}
        open={editOrderModal.open}
        onOpenChange={(open) => setEditOrderModal({ open, order: null })}
        onUpdateOrder={handleUpdateOrder}
      />

      <EditUserModal
        user={editUserModal.user}
        open={editUserModal.open}
        onOpenChange={(open) => setEditUserModal({ open, user: null })}
        onUpdateUser={handleUpdateUser}
      />

      <DeleteConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, type: '', id: null, name: '' })}
        title="Xác nhận xóa"
        description={`Bạn có chắc chắn muốn xóa "${deleteDialog.name}"? Hành động này không thể hoàn tác.`}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default AdminDashboard;