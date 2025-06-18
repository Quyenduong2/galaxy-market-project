import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { toast } from "../ui/use-toast";
import axios from "axios";

const EditAccountModal = ({ open, onOpenChange, account, onUpdateAccount }) => {
  const [formData, setFormData] = useState({
    title: "",
    game: "",
    category: "",
    price: "",
    stock: "",
    description: "",
    image: "",
    username: "",
    password: ""
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (account) {
      setFormData({
        title: account.title || "",
        game: account.game || "",
        category: account.category || "",
        price: account.price || "",
        stock: account.stock || "",
        description: account.description || "",
        image: account.image || "",
        username: account.username || "",
        password: "" // Không show password cũ
      });
    }
  }, [account]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!account) return;
    setIsLoading(true);
    try {
      const res = await axios.put(`http://localhost:5000/api/accounts/${account._id}`, formData);
      toast({ title: "Thành công", description: "Đã cập nhật tài khoản!" });
      onUpdateAccount(res.data);
      onOpenChange(false);
    } catch (err) {
      toast({ title: "Lỗi", description: "Không thể cập nhật tài khoản", variant: "destructive" });
    }
    setIsLoading(false);
  };

  if (!account) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Chỉnh sửa tài khoản</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Tiêu đề</Label>
            <Input name="title" value={formData.title} onChange={handleChange} required />
          </div>
          <div>
            <Label>Tên game</Label>
            <Input name="game" value={formData.game} onChange={handleChange} required />
          </div>
          <div>
            <Label>Thể loại</Label>
            <Input name="category" value={formData.category} onChange={handleChange} required />
          </div>
          <div>
            <Label>Giá</Label>
            <Input name="price" type="number" value={formData.price} onChange={handleChange} required />
          </div>
          
          <div>
            <Label>Hình ảnh</Label>
            <Input name="image" value={formData.image} onChange={handleChange} />
          </div>
          <div>
            <Label>Mô tả</Label>
            <Input name="description" value={formData.description} onChange={handleChange} />
          </div>
          <div>
            <Label>Tên đăng nhập</Label>
            <Input name="username" value={formData.username} onChange={handleChange} required />
          </div>
          <div>
            <Label>Mật khẩu mới (nếu muốn đổi)</Label>
            <Input name="password" type="password" value={formData.password} onChange={handleChange} />
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button type="submit" className="bg-gaming-primary" disabled={isLoading}>
              {isLoading ? "Đang lưu..." : "Lưu thay đổi"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditAccountModal;