import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  username: string;
  orders: number;
  spent: string;
  status: string;
}

interface EditUserModalProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateUser: (user: User) => void;
}

const EditUserModal = ({ user, open, onOpenChange, onUpdateUser }: EditUserModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    username: '',
    status: ''
  });
  const { toast } = useToast();

  const statusOptions = [
    { value: 'active', label: 'Hoạt động' },
    { value: 'inactive', label: 'Không hoạt động' },
    { value: 'banned', label: 'Bị cấm' }
  ];

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        username: user.username || '',
        status: user.status
      });
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  if (!formData.name || !formData.email) {
    toast({
      title: "Lỗi",
      description: "Vui lòng điền đầy đủ thông tin bắt buộc",
      variant: "destructive"
    });
    return;
  }
  if (!user) return;
  const updatedUser = {
    ...user,
    name: formData.name,
    email: formData.email,
    phone: formData.phone,
    username: formData.username,
  };
  onUpdateUser(updatedUser);
  onOpenChange(false);
  toast({
    title: "Thành công",
    description: "Đã cập nhật thông tin người dùng"
  });
};

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa người dùng</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-user-name">Tên *</Label>
            <Input
              id="edit-user-name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Tên người dùng"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="edit-user-email">Email *</Label>
            <Input
              id="edit-user-email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="email@example.com"
            />
          </div>

          {/* <div className="space-y-2">
            <Label>Số đơn hàng</Label>
            <div className="p-2 bg-muted rounded-md text-sm">
              {user.orders}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Tổng chi tiêu</Label>
            <div className="p-2 bg-muted rounded-md text-sm">
              {user.spent}
            </div>
          </div> */}
          
          <div className="space-y-2">
            <Label htmlFor="edit-user-status">Trạng thái *</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button type="submit" className="bg-gaming-primary hover:bg-gaming-primary/90">
              Cập nhật
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserModal;