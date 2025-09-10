import React, { useState, useEffect } from 'react';
import { Link, useNavigate, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import { Button } from './components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { Textarea } from './components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import { Badge } from './components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { 
  ShoppingBag, 
  Package, 
  ShoppingCart, 
  BarChart, 
  Users, 
  Settings,
  Plus,
  Edit,
  Trash2,
  Eye,
  LogOut,
  TrendingUp,
  Activity,
  FileText,
  Tag,
  DollarSign,
  Calendar,
  Search,
  Filter,
  Download,
  Bell,
  CheckCircle,
  Clock,
  Truck,
  AlertCircle,
  RefreshCw
} from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Admin Context
const AdminContext = React.createContext();

// Admin Login Component
const AdminLogin = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { setAdmin } = React.useContext(AdminContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API}/admin/login`, credentials);
      localStorage.setItem('elyvra_admin', JSON.stringify(response.data.admin));
      setAdmin(response.data.admin);
    } catch (error) {
      setError(error.response?.data?.detail || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const initDefaultAdmin = async () => {
    try {
      const response = await axios.post(`${API}/admin/init-default-admin`);
      if (!response.data.existing) {
        alert(`Default admin created!\nUsername: ${response.data.username}\nPassword: ${response.data.password}`);
      } else {
        alert('Admin already exists. Use existing credentials.');
      }
    } catch (error) {
      console.error('Error creating default admin:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-charcoal-black via-deep-navy to-charcoal-black flex items-center justify-center p-6">
      <Card className="w-full max-w-md bg-glass-gradient border-accent/30 backdrop-blur-20">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-playfair bg-accent-gradient bg-clip-text text-transparent">
            Elyvra Admin
          </CardTitle>
          <CardDescription className="text-light-gray">
            لوحة تحكم الإدارة
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-light-gray">اسم المستخدم</Label>
              <Input
                id="username"
                type="text"
                value={credentials.username}
                onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                className="bg-glass-bg border-accent/30 text-white"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-light-gray">كلمة المرور</Label>
              <Input
                id="password"
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                className="bg-glass-bg border-accent/30 text-white"
                required
              />
            </div>
            {error && (
              <div className="text-red-400 text-sm text-center">{error}</div>
            )}
            <Button 
              type="submit" 
              className="w-full primary-button"
              disabled={loading}
            >
              {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
            </Button>
          </form>
          
          <div className="mt-6 pt-4 border-t border-accent/20 text-center">
            <p className="text-light-gray text-sm mb-3">تحتاج صلاحية الوصول؟</p>
            <Button 
              onClick={initDefaultAdmin}
              variant="outline"
              className="secondary-button text-sm"
            >
              إنشاء أدمن افتراضي
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Enhanced Dashboard Stats Component
const DashboardStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API}/admin/stats`);
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="bg-glass-gradient border-accent/30 animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-gray-600 rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-600 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-glass-gradient border-accent/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-light-gray">إجمالي الإيرادات</CardTitle>
            <DollarSign className="h-4 w-4 text-accent-orange" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">${stats?.total_revenue?.toFixed(2) || '0.00'}</div>
            <p className="text-xs text-light-gray">من جميع الطلبات</p>
          </CardContent>
        </Card>

        <Card className="bg-glass-gradient border-accent/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-light-gray">إجمالي الطلبات</CardTitle>
            <ShoppingCart className="h-4 w-4 text-accent-orange" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats?.total_orders || 0}</div>
            <p className="text-xs text-light-gray">جميع الطلبات</p>
          </CardContent>
        </Card>

        <Card className="bg-glass-gradient border-accent/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-light-gray">إجمالي العملاء</CardTitle>
            <Users className="h-4 w-4 text-accent-orange" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats?.total_customers || 0}</div>
            <p className="text-xs text-light-gray">عملاء مسجلون</p>
          </CardContent>
        </Card>

        <Card className="bg-glass-gradient border-accent/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-light-gray">إجمالي المنتجات</CardTitle>
            <Package className="h-4 w-4 text-accent-orange" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats?.total_products || 0}</div>
            <p className="text-xs text-light-gray">منتجات متاحة</p>
          </CardContent>
        </Card>

        <Card className="bg-glass-gradient border-accent/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-light-gray">السلات النشطة</CardTitle>
            <TrendingUp className="h-4 w-4 text-accent-orange" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats?.active_carts || 0}</div>
            <p className="text-xs text-light-gray">من إجمالي {stats?.total_carts || 0}</p>
          </CardContent>
        </Card>

        <Card className="bg-glass-gradient border-accent/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-light-gray">الفئات</CardTitle>
            <BarChart className="h-4 w-4 text-accent-orange" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {Object.keys(stats?.products_by_category || {}).length}
            </div>
            <p className="text-xs text-light-gray">فئات منتجات</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Products by Category */}
        <Card className="bg-glass-gradient border-accent/30">
          <CardHeader>
            <CardTitle className="text-white">المنتجات حسب الفئة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(stats?.products_by_category || {}).map(([category, count]) => (
                <div key={category} className="flex justify-between items-center">
                  <Badge variant="secondary" className="capitalize">
                    {category === 'performance' ? 'الأداء الجسدي' : 
                     category === 'vitality' ? 'الحيوية والصحة' : 
                     category === 'beauty' ? 'الجمال العملي' : category}
                  </Badge>
                  <span className="text-white font-semibold">{count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Orders by Status */}
        <Card className="bg-glass-gradient border-accent/30">
          <CardHeader>
            <CardTitle className="text-white">الطلبات حسب الحالة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(stats?.orders_by_status || {}).map(([status, count]) => (
                <div key={status} className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    {status === 'pending_payment' && <Clock className="w-4 h-4 text-yellow-500" />}
                    {status === 'processing' && <RefreshCw className="w-4 h-4 text-blue-500" />}
                    {status === 'shipped' && <Truck className="w-4 h-4 text-green-500" />}
                    {status === 'delivered' && <CheckCircle className="w-4 h-4 text-green-600" />}
                    {status === 'cancelled' && <AlertCircle className="w-4 h-4 text-red-500" />}
                    <Badge variant="outline" className="capitalize">
                      {status === 'pending_payment' ? 'بانتظار الدفع' :
                       status === 'processing' ? 'قيد المعالجة' :
                       status === 'shipped' ? 'تم الشحن' :
                       status === 'delivered' ? 'تم التسليم' :
                       status === 'cancelled' ? 'ملغي' : status}
                    </Badge>
                  </div>
                  <span className="text-white font-semibold">{count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Selling Products & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-glass-gradient border-accent/30">
          <CardHeader>
            <CardTitle className="text-white">المنتجات الأكثر مبيعاً</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {stats?.top_selling_products?.map((product, index) => (
                <div key={product.product_id} className="flex items-center justify-between p-2 rounded bg-glass-bg/50">
                  <div className="flex items-center gap-3">
                    <span className="text-accent-orange font-bold text-sm">#{index + 1}</span>
                    <div>
                      <p className="text-white text-sm font-medium">{product.name}</p>
                      <p className="text-light-gray text-xs">مبيع: {product.quantity_sold} قطعة</p>
                    </div>
                  </div>
                  <span className="text-accent-orange font-bold">${product.revenue?.toFixed(2)}</span>
                </div>
              ))}
              {(!stats?.top_selling_products || stats.top_selling_products.length === 0) && (
                <p className="text-light-gray text-center">لا توجد مبيعات بعد</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-glass-gradient border-accent/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Activity className="h-5 w-5" />
              النشاط الحديث
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {stats?.recent_activity?.map((activity, index) => (
                <div key={index} className="flex items-start gap-3 p-2 rounded bg-glass-bg/50">
                  <div className="flex-1">
                    <p className="text-white text-sm">{activity.message}</p>
                    <p className="text-light-gray text-xs">
                      {activity.timestamp ? new Date(activity.timestamp).toLocaleString('ar-SA') : 'وقت غير معروف'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Order Management Component
const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchOrders();
  }, [selectedStatus]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = selectedStatus !== 'all' ? { status: selectedStatus } : {};
      const response = await axios.get(`${API}/orders`, { params });
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await axios.put(`${API}/orders/${orderId}`, { status: newStatus });
      fetchOrders(); // Refresh list
      alert('تم تحديث حالة الطلب بنجاح');
    } catch (error) {
      console.error('Error updating order:', error);
      alert('خطأ في تحديث الطلب');
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending_payment: { label: 'بانتظار الدفع', color: 'bg-yellow-500', icon: Clock },
      processing: { label: 'قيد المعالجة', color: 'bg-blue-500', icon: RefreshCw },
      confirmed: { label: 'مؤكد', color: 'bg-green-500', icon: CheckCircle },
      shipped: { label: 'تم الشحن', color: 'bg-purple-500', icon: Truck },
      delivered: { label: 'تم التسليم', color: 'bg-green-600', icon: CheckCircle },
      cancelled: { label: 'ملغي', color: 'bg-red-500', icon: AlertCircle },
      refunded: { label: 'مُرجع', color: 'bg-gray-500', icon: RefreshCw }
    };

    const config = statusConfig[status] || { label: status, color: 'bg-gray-500', icon: AlertCircle };
    const Icon = config.icon;

    return (
      <Badge className={`${config.color} text-white`}>
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const filteredOrders = orders.filter(order => 
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customer_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="text-center py-8 text-light-gray">جاري تحميل الطلبات...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-playfair text-white">إدارة الطلبات</h2>
        <Button className="primary-button">
          <Plus className="w-4 h-4 mr-2" />
          طلب جديد
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <div className="flex-1">
          <Input
            placeholder="البحث بالرقم أو معرف العميل..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-glass-bg border-accent/30 text-white"
          />
        </div>
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-48 bg-glass-bg border-accent/30 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-glass-bg border-accent/30 backdrop-blur-lg">
            <SelectItem value="all">جميع الطلبات</SelectItem>
            <SelectItem value="pending_payment">بانتظار الدفع</SelectItem>
            <SelectItem value="processing">قيد المعالجة</SelectItem>
            <SelectItem value="confirmed">مؤكد</SelectItem>
            <SelectItem value="shipped">تم الشحن</SelectItem>
            <SelectItem value="delivered">تم التسليم</SelectItem>
            <SelectItem value="cancelled">ملغي</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <Card key={order.id} className="bg-glass-gradient border-accent/30">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-white">طلب #{order.id.substring(0, 8)}</CardTitle>
                  <CardDescription className="text-light-gray">
                    {new Date(order.created_at).toLocaleString('ar-SA')}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(order.status)}
                  <span className="text-accent-orange font-bold text-lg">
                    ${order.total_amount?.toFixed(2)}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-light-gray text-sm">العميل</p>
                  <p className="text-white">{order.customer_id.substring(0, 8)}</p>
                </div>
                <div>
                  <p className="text-light-gray text-sm">عدد المنتجات</p>
                  <p className="text-white">{order.items?.length || 0}</p>
                </div>
                <div>
                  <p className="text-light-gray text-sm">طريقة الدفع</p>
                  <p className="text-white">{order.payment_method || 'غير محدد'}</p>
                </div>
              </div>
              
              <div className="flex gap-2 mt-4">
                <Select
                  value={order.status}
                  onValueChange={(value) => updateOrderStatus(order.id, value)}
                >
                  <SelectTrigger className="w-48 bg-glass-bg border-accent/30 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-glass-bg border-accent/30 backdrop-blur-lg">
                    <SelectItem value="pending_payment">بانتظار الدفع</SelectItem>
                    <SelectItem value="processing">قيد المعالجة</SelectItem>
                    <SelectItem value="confirmed">مؤكد</SelectItem>
                    <SelectItem value="shipped">تم الشحن</SelectItem>
                    <SelectItem value="delivered">تم التسليم</SelectItem>
                    <SelectItem value="cancelled">ملغي</SelectItem>
                    <SelectItem value="refunded">مُرجع</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm" className="secondary-button">
                  <Eye className="w-3 h-3 mr-1" />
                  عرض التفاصيل
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <p className="text-light-gray">لا توجد طلبات</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Customer Management Component
const CustomerManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await axios.get(`${API}/customers`);
      setCustomers(response.data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8 text-light-gray">جاري تحميل العملاء...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-playfair text-white">إدارة العملاء</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {customers.map((customer) => (
          <Card key={customer.id} className="bg-glass-gradient border-accent/30">
            <CardHeader>
              <CardTitle className="text-white">
                {customer.first_name} {customer.last_name}
              </CardTitle>
              <CardDescription className="text-light-gray">
                {customer.email}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-light-gray">الفئة:</span>
                  <Badge variant="secondary">
                    {customer.segment === 'new' ? 'جديد' :
                     customer.segment === 'regular' ? 'عادي' :
                     customer.segment === 'vip' ? 'مميز' : customer.segment}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-light-gray">إجمالي الطلبات:</span>
                  <span className="text-white">{customer.total_orders || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-light-gray">إجمالي الإنفاق:</span>
                  <span className="text-accent-orange">${customer.total_spent?.toFixed(2) || '0.00'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-light-gray">تاريخ التسجيل:</span>
                  <span className="text-white">{new Date(customer.created_at).toLocaleDateString('ar-SA')}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {customers.length === 0 && (
          <div className="col-span-full text-center py-12">
            <p className="text-light-gray">لا يوجد عملاء مسجلون</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Product Management Component (Enhanced)
const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API}/products`);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (productId) => {
    if (!confirm('هل أنت متأكد من حذف هذا المنتج؟')) return;

    try {
      await axios.delete(`${API}/admin/products/${productId}`);
      fetchProducts(); // Refresh list
      alert('تم حذف المنتج بنجاح');
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('خطأ في حذف المنتج');
    }
  };

  if (loading) {
    return <div className="text-center py-8 text-light-gray">جاري تحميل المنتجات...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-playfair text-white">إدارة المنتجات</h2>
        <Button 
          onClick={() => setShowAddForm(true)}
          className="primary-button"
        >
          <Plus className="w-4 h-4 mr-2" />
          إضافة منتج
        </Button>
      </div>

      {/* Product List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="bg-glass-gradient border-accent/30">
            <CardHeader className="p-0">
              <div className="relative h-48 overflow-hidden rounded-t-lg">
                <img 
                  src={product.image_url} 
                  alt={product.translations?.ar?.name || product.translations?.en?.name || 'المنتج'} 
                  className="w-full h-full object-cover"
                />
                {product.featured && (
                  <Badge className="absolute top-2 left-2 bg-accent-gradient">
                    مميز
                  </Badge>
                )}
                <Badge 
                  className={`absolute top-2 right-2 ${product.in_stock ? 'bg-green-500' : 'bg-red-500'}`}
                >
                  {product.in_stock ? 'متوفر' : 'نفد'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-2">
                <h3 className="font-semibold text-white">
                  {product.translations?.ar?.name || product.translations?.en?.name || 'منتج بدون اسم'}
                </h3>
                <p className="text-light-gray text-sm">
                  {product.translations?.ar?.short_description || product.translations?.en?.short_description || 'بدون وصف'}
                </p>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="capitalize">
                    {product.category === 'performance' ? 'الأداء الجسدي' :
                     product.category === 'vitality' ? 'الحيوية والصحة' :
                     product.category === 'beauty' ? 'الجمال العملي' : product.category}
                  </Badge>
                  <div className="text-right">
                    <span className="text-accent-orange font-bold">
                      ${product.discounted_price || product.price}
                    </span>
                    {product.discounted_price && (
                      <span className="text-light-gray line-through text-sm block">
                        ${product.price}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-light-gray text-sm">المخزون: {product.stock_quantity}</span>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => setEditingProduct(product)}
                    className="flex-1"
                  >
                    <Edit className="w-3 h-3 mr-1" />
                    تعديل
                  </Button>
                  <Button 
                    size="sm" 
                    variant="destructive"
                    onClick={() => deleteProduct(product.id)}
                    className="flex-1"
                  >
                    <Trash2 className="w-3 h-3 mr-1" />
                    حذف
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add/Edit Product Modal */}
      {(showAddForm || editingProduct) && (
        <ProductForm 
          product={editingProduct}
          onClose={() => {
            setShowAddForm(false);
            setEditingProduct(null);
          }}
          onSave={() => {
            fetchProducts();
            setShowAddForm(false);
            setEditingProduct(null);
          }}
        />
      )}
    </div>
  );
};

// Product Form Component (Enhanced for Arabic)
const ProductForm = ({ product, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    sku: product?.sku || '',
    category: product?.category || 'performance',
    price: product?.price || '',
    discounted_price: product?.discounted_price || '',
    image_url: product?.image_url || '',
    gallery_images: product?.gallery_images || [],
    in_stock: product?.in_stock ?? true,
    stock_quantity: product?.stock_quantity || 0,
    featured: product?.featured || false,
    tags: product?.tags?.join(', ') || '',
    translations: {
      ar: {
        name: product?.translations?.ar?.name || '',
        description: product?.translations?.ar?.description || '',
        short_description: product?.translations?.ar?.short_description || '',
        benefits: product?.translations?.ar?.benefits?.join(', ') || '',
        ingredients: product?.translations?.ar?.ingredients?.join(', ') || '',
        usage_instructions: product?.translations?.ar?.usage_instructions || ''
      },
      en: {
        name: product?.translations?.en?.name || '',
        description: product?.translations?.en?.description || '',
        short_description: product?.translations?.en?.short_description || '',
        benefits: product?.translations?.en?.benefits?.join(', ') || '',
        ingredients: product?.translations?.en?.ingredients?.join(', ') || '',
        usage_instructions: product?.translations?.en?.usage_instructions || ''
      },
      fr: {
        name: product?.translations?.fr?.name || '',
        description: product?.translations?.fr?.description || '',
        short_description: product?.translations?.fr?.short_description || '',
        benefits: product?.translations?.fr?.benefits?.join(', ') || '',
        ingredients: product?.translations?.fr?.ingredients?.join(', ') || '',
        usage_instructions: product?.translations?.fr?.usage_instructions || ''
      }
    }
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Process form data
      const processedData = {
        ...formData,
        price: parseFloat(formData.price),
        discounted_price: formData.discounted_price ? parseFloat(formData.discounted_price) : null,
        stock_quantity: parseInt(formData.stock_quantity),
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        gallery_images: formData.gallery_images.filter(Boolean),
        translations: {
          ar: {
            ...formData.translations.ar,
            benefits: formData.translations.ar.benefits.split(',').map(b => b.trim()).filter(Boolean),
            ingredients: formData.translations.ar.ingredients.split(',').map(i => i.trim()).filter(Boolean)
          },
          en: {
            ...formData.translations.en,
            benefits: formData.translations.en.benefits.split(',').map(b => b.trim()).filter(Boolean),
            ingredients: formData.translations.en.ingredients.split(',').map(i => i.trim()).filter(Boolean)
          },
          fr: {
            ...formData.translations.fr,
            benefits: formData.translations.fr.benefits.split(',').map(b => b.trim()).filter(Boolean),
            ingredients: formData.translations.fr.ingredients.split(',').map(i => i.trim()).filter(Boolean)
          }
        }
      };

      if (product) {
        // Update existing product
        await axios.put(`${API}/admin/products/${product.id}`, processedData);
        alert('تم تحديث المنتج بنجاح');
      } else {
        // Create new product
        await axios.post(`${API}/products`, processedData);
        alert('تم إنشاء المنتج بنجاح');
      }

      onSave();
    } catch (error) {
      console.error('Error saving product:', error);
      alert('خطأ في حفظ المنتج: ' + (error.response?.data?.detail || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-glass-gradient border-accent/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            {product ? 'تعديل المنتج' : 'إضافة منتج جديد'}
            <Button variant="ghost" onClick={onClose} className="text-light-gray">
              ×
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-light-gray">رمز المنتج (SKU)</Label>
                <Input
                  value={formData.sku}
                  onChange={(e) => setFormData({...formData, sku: e.target.value})}
                  className="bg-glass-bg border-accent/30 text-white"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-light-gray">الفئة</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                  <SelectTrigger className="bg-glass-bg border-accent/30 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-glass-bg border-accent/30 backdrop-blur-lg">
                    <SelectItem value="performance">الأداء الجسدي</SelectItem>
                    <SelectItem value="vitality">الحيوية والصحة</SelectItem>
                    <SelectItem value="beauty">الجمال العملي</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-light-gray">السعر ($)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  className="bg-glass-bg border-accent/30 text-white"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-light-gray">السعر بعد الخصم ($)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.discounted_price}
                  onChange={(e) => setFormData({...formData, discounted_price: e.target.value})}
                  className="bg-glass-bg border-accent/30 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-light-gray">كمية المخزون</Label>
                <Input
                  type="number"
                  value={formData.stock_quantity}
                  onChange={(e) => setFormData({...formData, stock_quantity: e.target.value})}
                  className="bg-glass-bg border-accent/30 text-white"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-light-gray">الكلمات المفتاحية (مفصولة بفاصلة)</Label>
                <Input
                  value={formData.tags}
                  onChange={(e) => setFormData({...formData, tags: e.target.value})}
                  className="bg-glass-bg border-accent/30 text-white"
                  placeholder="مثال: فاخر، صحة، طبيعي"
                />
              </div>
            </div>

            {/* Images */}
            <div className="space-y-2">
              <Label className="text-light-gray">رابط الصورة الرئيسية</Label>
              <Input
                value={formData.image_url}
                onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                className="bg-glass-bg border-accent/30 text-white"
                required
              />
            </div>

            {/* Checkboxes */}
            <div className="flex gap-6">
              <label className="flex items-center gap-2 text-light-gray">
                <input
                  type="checkbox"
                  checked={formData.in_stock}
                  onChange={(e) => setFormData({...formData, in_stock: e.target.checked})}
                  className="rounded"
                />
                متوفر في المخزون
              </label>
              <label className="flex items-center gap-2 text-light-gray">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                  className="rounded"
                />
                منتج مميز
              </label>
            </div>

            {/* Translations */}
            <Tabs defaultValue="ar" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-glass-bg">
                <TabsTrigger value="ar">العربية</TabsTrigger>
                <TabsTrigger value="en">English</TabsTrigger>
                <TabsTrigger value="fr">Français</TabsTrigger>
              </TabsList>
              
              {[
                { code: 'ar', name: 'العربية' },
                { code: 'en', name: 'English' },
                { code: 'fr', name: 'Français' }
              ].map(lang => (
                <TabsContent key={lang.code} value={lang.code} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-light-gray">اسم المنتج</Label>
                      <Input
                        value={formData.translations[lang.code].name}
                        onChange={(e) => setFormData({
                          ...formData,
                          translations: {
                            ...formData.translations,
                            [lang.code]: {...formData.translations[lang.code], name: e.target.value}
                          }
                        })}
                        className="bg-glass-bg border-accent/30 text-white"
                        required={lang.code === 'ar'}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-light-gray">الوصف القصير</Label>
                      <Input
                        value={formData.translations[lang.code].short_description}
                        onChange={(e) => setFormData({
                          ...formData,
                          translations: {
                            ...formData.translations,
                            [lang.code]: {...formData.translations[lang.code], short_description: e.target.value}
                          }
                        })}
                        className="bg-glass-bg border-accent/30 text-white"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-light-gray">الوصف الكامل</Label>
                    <Textarea
                      value={formData.translations[lang.code].description}
                      onChange={(e) => setFormData({
                        ...formData,
                        translations: {
                          ...formData.translations,
                          [lang.code]: {...formData.translations[lang.code], description: e.target.value}
                        }
                      })}
                      className="bg-glass-bg border-accent/30 text-white"
                      rows={3}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-light-gray">الفوائد (مفصولة بفاصلة)</Label>
                      <Textarea
                        value={formData.translations[lang.code].benefits}
                        onChange={(e) => setFormData({
                          ...formData,
                          translations: {
                            ...formData.translations,
                            [lang.code]: {...formData.translations[lang.code], benefits: e.target.value}
                          }
                        })}
                        className="bg-glass-bg border-accent/30 text-white"
                        rows={2}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-light-gray">المكونات (مفصولة بفاصلة)</Label>
                      <Textarea
                        value={formData.translations[lang.code].ingredients}
                        onChange={(e) => setFormData({
                          ...formData,
                          translations: {
                            ...formData.translations,
                            [lang.code]: {...formData.translations[lang.code], ingredients: e.target.value}
                          }
                        })}
                        className="bg-glass-bg border-accent/30 text-white"
                        rows={2}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-light-gray">تعليمات الاستخدام</Label>
                    <Textarea
                      value={formData.translations[lang.code].usage_instructions}
                      onChange={(e) => setFormData({
                        ...formData,
                        translations: {
                          ...formData.translations,
                          [lang.code]: {...formData.translations[lang.code], usage_instructions: e.target.value}
                        }
                      })}
                      className="bg-glass-bg border-accent/30 text-white"
                      rows={2}
                    />
                  </div>
                </TabsContent>
              ))}
            </Tabs>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={loading} className="primary-button flex-1">
                {loading ? 'جاري الحفظ...' : (product ? 'تحديث المنتج' : 'إنشاء المنتج')}
              </Button>
              <Button type="button" onClick={onClose} variant="outline" className="secondary-button">
                إلغاء
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

// Main Admin Dashboard Layout
const DashboardLayout = () => {
  const { admin, setAdmin } = React.useContext(AdminContext);
  const [currentView, setCurrentView] = useState('dashboard');

  const handleLogout = () => {
    localStorage.removeItem('elyvra_admin');
    setAdmin(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-charcoal-black via-deep-navy to-charcoal-black" dir="rtl">
      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-64 bg-glass-gradient border-l border-accent/30 backdrop-blur-20">
        <div className="p-6">
          <h1 className="text-2xl font-playfair bg-accent-gradient bg-clip-text text-transparent">
            إدارة إليڤرا
          </h1>
          <p className="text-light-gray text-sm mt-1">مرحباً، {admin?.full_name}</p>
        </div>
        
        <nav className="px-4 space-y-2">
          <button 
            onClick={() => setCurrentView('dashboard')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all w-full text-right ${
              currentView === 'dashboard' 
                ? 'text-white bg-accent-gradient' 
                : 'text-light-gray hover:text-white hover:bg-glass-bg'
            }`}
          >
            <BarChart className="w-5 h-5" />
            لوحة التحكم
          </button>
          <button 
            onClick={() => setCurrentView('orders')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all w-full text-right ${
              currentView === 'orders' 
                ? 'text-white bg-accent-gradient' 
                : 'text-light-gray hover:text-white hover:bg-glass-bg'
            }`}
          >
            <ShoppingCart className="w-5 h-5" />
            الطلبات
          </button>
          <button 
            onClick={() => setCurrentView('customers')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all w-full text-right ${
              currentView === 'customers' 
                ? 'text-white bg-accent-gradient' 
                : 'text-light-gray hover:text-white hover:bg-glass-bg'
            }`}
          >
            <Users className="w-5 h-5" />
            العملاء
          </button>
          <button 
            onClick={() => setCurrentView('products')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all w-full text-right ${
              currentView === 'products' 
                ? 'text-white bg-accent-gradient' 
                : 'text-light-gray hover:text-white hover:bg-glass-bg'
            }`}
          >
            <Package className="w-5 h-5" />
            المنتجات
          </button>
          <a 
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-4 py-3 text-light-gray hover:text-white hover:bg-glass-bg rounded-lg transition-all text-right"
          >
            <Eye className="w-5 h-5" />
            عرض المتجر
          </a>
        </nav>
        
        <div className="absolute bottom-4 left-4 right-4">
          <Button 
            onClick={handleLogout}
            variant="outline" 
            className="w-full secondary-button"
          >
            <LogOut className="w-4 h-4 ml-2" />
            تسجيل الخروج
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="mr-64 p-8">
        {currentView === 'dashboard' && <DashboardStats />}
        {currentView === 'orders' && <OrderManagement />}
        {currentView === 'customers' && <CustomerManagement />}
        {currentView === 'products' && <ProductManagement />}
      </div>
    </div>
  );
};

// Main Admin Dashboard Component
const AdminDashboard = () => {
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    const savedAdmin = localStorage.getItem('elyvra_admin');
    if (savedAdmin) {
      setAdmin(JSON.parse(savedAdmin));
    }
  }, []);

  return (
    <AdminContext.Provider value={{ admin, setAdmin }}>
      {admin ? <DashboardLayout /> : <AdminLogin />}
    </AdminContext.Provider>
  );
};

export default AdminDashboard;