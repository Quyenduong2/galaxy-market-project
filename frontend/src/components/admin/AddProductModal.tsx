import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';

const games = ['League of Legends', 'PUBG Mobile', 'Valorant', 'Mobile Legends', 'Free Fire', 'Liên Quân Mobile'];
const categories = ['MOBA', 'FPS', 'RPG', 'Strategy', 'Adventure', 'Simulation'];

const AddProductModal = ({
  open,
  onOpenChange,
  onAddProduct
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddProduct: (product: any) => void;
}) => {
  const [formData, setFormData] = useState({
    name: '',
    seller: '',
    game: '',
    price: '',
    description: '',
    image: '',
    category: '',
    ngayHetHan: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);

    if (
      !formData.name ||
      !formData.seller ||
      !formData.game ||
      !formData.price ||
      !formData.category
    ) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin bắt buộc",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    if (!formData.ngayHetHan) {
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn ngày hết hạn",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }
    // So sánh ngày hết hạn với ngày hiện tại
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expiryDate = new Date(formData.ngayHetHan);
    expiryDate.setHours(0, 0, 0, 0);

    if (expiryDate.getTime() === today.getTime()) {
      toast({
        title: "Lỗi",
        description: "Ngày hết hạn không được là ngày hôm nay. Vui lòng chọn ngày khác.",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    if (expiryDate.getTime() < today.getTime()) {
      toast({
        title: "Lỗi",
        description: "Ngày hết hạn phải lớn hơn ngày hiện tại.",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    const price = Number(formData.price);
    if (isNaN(price) || price <= 0) {
      toast({
        title: "Lỗi",
        description: "Giá phải là số dương",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    const newAccount = {
      seller: formData.seller,
      game: formData.game,
      title: formData.name,
      category: formData.category,
      image: formData.image || 'https://via.placeholder.com/300x200?text=' + encodeURIComponent(formData.game),
      price: price,
      originalPrice: Math.round(price * 1.3),
      rating: 4.5,
      accounts: 1,
      description: formData.description,
      featured: false,
      status: "available",
      username: "user_" + Math.random().toString(36).substring(2, 8),
      password: "pass" + Math.floor(Math.random() * 10000),
      ngayHetHan: formData.ngayHetHan || null // Gửi ngày hết hạn
    };

    try {
      const res = await axios.post('http://localhost:5000/api/accounts', newAccount);
      onAddProduct(res.data);
      setFormData({ name: '', seller: '', game: '', price: '', description: '', image: '', category: '', ngayHetHan: '' });
      onOpenChange(false);
      toast({
        title: "Thành công",
        description: "Đã thêm sản phẩm mới"
      });
    } catch (err) {
      setIsLoading(false);
      toast({
        title: "Lỗi",
        description: "Không thể thêm sản phẩm",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Thêm sản phẩm mới</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nội dung sản phẩm *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Tài khoản LOL Rank Kim Cương"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="seller">Tên người bán *</Label>
            <Input
              id="seller"
              value={formData.seller}
              onChange={(e) => setFormData(prev => ({ ...prev, seller: e.target.value }))}
              placeholder="Nhập tên người bán"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="game">Tên game *</Label>
            <Select value={formData.game} onValueChange={(value) => setFormData(prev => ({ ...prev, game: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn game" />
              </SelectTrigger>
              <SelectContent>
                {games.map((game) => (
                  <SelectItem key={game} value={game}>{game}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Thể loại *</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn thể loại" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="price">Giá (VNĐ) *</Label>
            <Input
              id="price"
              type="number"
              value={formData.price}
              onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
              placeholder="1000000"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="image">URL hình ảnh</Label>
            <Input
              id="image"
              value={formData.image}
              onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
              placeholder="https://example.com/image.jpg"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="expiryDate">Ngày hết hạn</Label>
            <Input
              id="expiryDate"
              type="date"
              value={formData.ngayHetHan}
              onChange={(e) => setFormData(prev => ({ ...prev, ngayHetHan: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Mô tả</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Mô tả chi tiết sản phẩm..."
              rows={3}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button
              type="submit"
              className="w-full bg-gaming-primary hover:bg-gaming-primary/90"
              disabled={isLoading}
            >
              {isLoading ? 'Đang thêm...' : 'Thêm sản phẩm'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddProductModal;