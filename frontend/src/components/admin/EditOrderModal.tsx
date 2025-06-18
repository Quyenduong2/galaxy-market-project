import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface Order {
  id: string;
  user: string;
  product: string;
  amount: string;
  status: string;
}

interface EditOrderModalProps {
  order: Order | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateOrder: (order: Order) => void;
}

const EditOrderModal = ({ order, open, onOpenChange, onUpdateOrder }: EditOrderModalProps) => {
  const [status, setStatus] = useState('');
  const { toast } = useToast();

  const statusOptions = [
    { value: 'pending', label: 'Chờ xử lý' },
    { value: 'processing', label: 'Đang xử lý' },
    { value: 'completed', label: 'Hoàn thành' },
    { value: 'cancelled', label: 'Đã hủy' }
  ];

  useEffect(() => {
    if (order) {
      setStatus(order.status);
    }
  }, [order]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!order) return;

    const updatedOrder = {
      ...order,
      status: status
    };

    onUpdateOrder(updatedOrder);
    onOpenChange(false);
    
    toast({
      title: "Thành công",
      description: "Đã cập nhật trạng thái đơn hàng"
    });
  };

  if (!order) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa đơn hàng {order.id}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Khách hàng</Label>
            <div className="p-2 bg-muted rounded-md text-sm">
              {order.user}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Sản phẩm</Label>
            <div className="p-2 bg-muted rounded-md text-sm">
              {order.product}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Số tiền</Label>
            <div className="p-2 bg-muted rounded-md text-sm">
              {order.amount}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="status">Trạng thái *</Label>
            <Select value={status} onValueChange={setStatus}>
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

export default EditOrderModal;