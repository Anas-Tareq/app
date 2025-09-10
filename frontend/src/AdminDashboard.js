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
  RefreshCw,
  Award,
  AlertTriangle,
  Pill,
  BookOpen,
  PieChart,
  LineChart
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
    <div className="min-h-screen bg-gradient-to-br from-charcoal-black via-dark-charcoal to-medium-gray flex items-center justify-center p-6">
      <Card className="w-full max-w-md elyvra-card">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl brand-logo">
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
                className="elyvra-input"
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
                className="elyvra-input"
                required
              />
            </div>
            {error && (
              <div className="text-red-400 text-sm text-center">{error}</div>
            )}
            <Button 
              type="submit" 
              className="w-full elyvra-button-primary"
              disabled={loading}
            >
              {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
            </Button>
          </form>
          
          <div className="mt-6 pt-4 border-t border-glass-border text-center">
            <p className="text-light-gray text-sm mb-3">تحتاج صلاحية الوصول؟</p>
            <Button 
              onClick={initDefaultAdmin}
              className="elyvra-button-secondary text-sm"
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
          <Card key={i} className="elyvra-card animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-medium-gray rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-medium-gray rounded w-1/2"></div>
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
        <Card className="elyvra-stats-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-light-gray">إجمالي الإيرادات</CardTitle>
            <DollarSign className="h-4 w-4 elyvra-text-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">${stats?.total_revenue?.toFixed(2) || '0.00'}</div>
            <p className="text-xs text-light-gray">من جميع الطلبات</p>
          </CardContent>
        </Card>

        <Card className="elyvra-stats-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-light-gray">إجمالي الطلبات</CardTitle>
            <ShoppingCart className="h-4 w-4 elyvra-text-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats?.total_orders || 0}</div>
            <p className="text-xs text-light-gray">جميع الطلبات</p>
          </CardContent>
        </Card>

        <Card className="elyvra-stats-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-light-gray">إجمالي العملاء</CardTitle>
            <Users className="h-4 w-4 elyvra-text-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats?.total_customers || 0}</div>
            <p className="text-xs text-light-gray">عملاء مسجلون</p>
          </CardContent>
        </Card>

        <Card className="elyvra-stats-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-light-gray">إجمالي المنتجات</CardTitle>
            <Package className="h-4 w-4 elyvra-text-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats?.total_products || 0}</div>
            <p className="text-xs text-light-gray">منتجات متاحة</p>
          </CardContent>
        </Card>

        <Card className="elyvra-stats-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-light-gray">السلات النشطة</CardTitle>
            <TrendingUp className="h-4 w-4 elyvra-text-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats?.active_carts || 0}</div>
            <p className="text-xs text-light-gray">من إجمالي {stats?.total_carts || 0}</p>
          </CardContent>
        </Card>

        <Card className="elyvra-stats-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-light-gray">الفئات</CardTitle>
            <BarChart className="h-4 w-4 elyvra-text-gold" />
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
        <Card className="elyvra-card">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <PieChart className="h-5 w-5 elyvra-text-gold" />
              المنتجات حسب الفئة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(stats?.products_by_category || {}).map(([category, count]) => (
                <div key={category} className="flex justify-between items-center p-2 rounded elyvra-card">
                  <Badge className="elyvra-bg-gold text-charcoal-black">
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
        <Card className="elyvra-card">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <LineChart className="h-5 w-5 elyvra-text-gold" />
              الطلبات حسب الحالة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(stats?.orders_by_status || {}).map(([status, count]) => (
                <div key={status} className="flex justify-between items-center p-2 rounded elyvra-card">
                  <div className="flex items-center gap-2">
                    {status === 'pending_payment' && <Clock className="w-4 h-4 text-yellow-500" />}
                    {status === 'processing' && <RefreshCw className="w-4 h-4 text-blue-500" />}
                    {status === 'shipped' && <Truck className="w-4 h-4 text-green-500" />}
                    {status === 'delivered' && <CheckCircle className="w-4 h-4 text-green-600" />}
                    {status === 'cancelled' && <AlertCircle className="w-4 h-4 text-red-500" />}
                    <Badge variant="outline" className="elyvra-border-gold text-white">
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
        <Card className="elyvra-card">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Award className="h-5 w-5 elyvra-text-gold" />
              المنتجات الأكثر مبيعاً
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {stats?.top_selling_products?.map((product, index) => (
                <div key={product.product_id} className="flex items-center justify-between p-3 rounded elyvra-card">
                  <div className="flex items-center gap-3">
                    <span className="elyvra-text-gold font-bold text-sm">#{index + 1}</span>
                    <div>
                      <p className="text-white text-sm font-medium">{product.name}</p>
                      <p className="text-light-gray text-xs">مبيع: {product.quantity_sold} قطعة</p>
                    </div>
                  </div>
                  <span className="elyvra-text-gold font-bold">${product.revenue?.toFixed(2)}</span>
                </div>
              ))}
              {(!stats?.top_selling_products || stats.top_selling_products.length === 0) && (
                <p className="text-light-gray text-center">لا توجد مبيعات بعد</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="elyvra-card">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Activity className="h-5 w-5 elyvra-text-gold" />
              النشاط الحديث
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {stats?.recent_activity?.map((activity, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded elyvra-card">
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

// Enhanced Order Management Component
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
      setOrders([]); // Fallback to empty array
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
        <h2 className="text-2xl font-bold text-white brand-logo">إدارة الطلبات</h2>
        <Button className="elyvra-button-primary">
          <Plus className="w-4 h-4 mr-2" />
          طلب جديد
        </Button>
      </div>

      {/* Enhanced Filters */}
      <Card className="elyvra-card">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex-1">
              <Input
                placeholder="البحث بالرقم أو معرف العميل أو رقم الهاتف..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="elyvra-input"
              />
            </div>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="elyvra-input">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="elyvra-card">
                <SelectItem value="all">جميع الطلبات</SelectItem>
                <SelectItem value="pending_payment">بانتظار الدفع</SelectItem>
                <SelectItem value="processing">قيد المعالجة</SelectItem>
                <SelectItem value="confirmed">مؤكد</SelectItem>
                <SelectItem value="shipped">تم الشحن</SelectItem>
                <SelectItem value="delivered">تم التسليم</SelectItem>
                <SelectItem value="cancelled">ملغي</SelectItem>
              </SelectContent>
            </Select>
            <Button className="elyvra-button-secondary">
              <Download className="w-4 h-4 mr-2" />
              تصدير التقرير
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <Card key={order.id} className="elyvra-card">
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
                  <span className="elyvra-text-gold font-bold text-lg">
                    ${order.total_amount?.toFixed(2)}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                <div>
                  <p className="text-light-gray text-sm">رقم التتبع</p>
                  <p className="text-white">{order.tracking_number || 'غير متاح'}</p>
                </div>
              </div>
              
              <div className="flex gap-2 mt-4">
                <Select
                  value={order.status}
                  onValueChange={(value) => updateOrderStatus(order.id, value)}
                >
                  <SelectTrigger className="w-48 elyvra-input">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="elyvra-card">
                    <SelectItem value="pending_payment">بانتظار الدفع</SelectItem>
                    <SelectItem value="processing">قيد المعالجة</SelectItem>
                    <SelectItem value="confirmed">مؤكد</SelectItem>
                    <SelectItem value="shipped">تم الشحن</SelectItem>
                    <SelectItem value="delivered">تم التسليم</SelectItem>
                    <SelectItem value="cancelled">ملغي</SelectItem>
                    <SelectItem value="refunded">مُرجع</SelectItem>
                  </SelectContent>
                </Select>
                <Button className="elyvra-button-secondary">
                  <Eye className="w-3 h-3 mr-1" />
                  عرض التفاصيل
                </Button>
                <Button className="elyvra-button-secondary">
                  <Download className="w-3 h-3 mr-1" />
                  طباعة بوليصة
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {filteredOrders.length === 0 && (
          <Card className="elyvra-card">
            <CardContent className="text-center py-12">
              <p className="text-light-gray">لا توجد طلبات تطابق معايير البحث</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

// Enhanced Customer Management Component
const CustomerManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await axios.get(`${API}/customers`);
      setCustomers(response.data);
    } catch (error) {
      console.error('Error fetching customers:', error);
      setCustomers([]); // Fallback to empty array
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter(customer => 
    customer.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="text-center py-8 text-light-gray">جاري تحميل العملاء...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white brand-logo">إدارة العملاء</h2>
        <Button className="elyvra-button-primary">
          <Download className="w-4 h-4 mr-2" />
          تصدير قائمة العملاء
        </Button>
      </div>

      {/* Search Bar */}
      <Card className="elyvra-card">
        <CardContent className="pt-6">
          <Input
            placeholder="البحث بالاسم، البريد الإلكتروني، أو رقم الهاتف..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="elyvra-input"
          />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCustomers.map((customer) => (
          <Card key={customer.id} className="elyvra-stats-card">
            <CardHeader>
              <CardTitle className="text-white">
                {customer.first_name} {customer.last_name}
              </CardTitle>
              <CardDescription className="text-light-gray">
                {customer.email}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-light-gray">الفئة:</span>
                  <Badge className={`${
                    customer.segment === 'vip' ? 'elyvra-bg-gold text-charcoal-black' :
                    customer.segment === 'regular' ? 'bg-blue-500' : 'bg-green-500'
                  } text-white`}>
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
                  <span className="elyvra-text-gold font-semibold">${customer.total_spent?.toFixed(2) || '0.00'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-light-gray">تاريخ التسجيل:</span>
                  <span className="text-white">{new Date(customer.created_at).toLocaleDateString('ar-SA')}</span>
                </div>
                <div className="pt-2">
                  <Button className="w-full elyvra-button-secondary">
                    <Eye className="w-3 h-3 mr-1" />
                    عرض التفاصيل
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {filteredCustomers.length === 0 && (
          <div className="col-span-full">
            <Card className="elyvra-card">
              <CardContent className="text-center py-12">
                <p className="text-light-gray">لا يوجد عملاء يطابقون معايير البحث</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

// Enhanced Product Management Component
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
        <h2 className="text-2xl font-bold text-white brand-logo">إدارة المنتجات</h2>
        <Button 
          onClick={() => setShowAddForm(true)}
          className="elyvra-button-primary"
        >
          <Plus className="w-4 h-4 mr-2" />
          إضافة منتج
        </Button>
      </div>

      {/* Product List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="elyvra-stats-card">
            <CardHeader className="p-0">
              <div className="relative h-48 overflow-hidden rounded-t-lg">
                <img 
                  src={product.image_url} 
                  alt={product.translations?.ar?.name || product.translations?.en?.name || 'المنتج'} 
                  className="w-full h-full object-cover"
                />
                {product.featured && (
                  <Badge className="absolute top-2 left-2 elyvra-bg-gold text-charcoal-black">
                    <Award className="w-3 h-3 mr-1" />
                    مميز
                  </Badge>
                )}
                <Badge 
                  className={`absolute top-2 right-2 ${product.in_stock ? 'bg-green-500' : 'bg-red-500'} text-white`}
                >
                  {product.in_stock ? 'متوفر' : 'نفد'}
                </Badge>
                {product.stock_quantity <= 5 && product.in_stock && (
                  <Badge className="absolute bottom-2 right-2 bg-yellow-500 text-charcoal-black">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    مخزون منخفض
                  </Badge>
                )}
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
                  <Badge className="elyvra-bg-gold text-charcoal-black">
                    {product.category === 'performance' ? 'الأداء الجسدي' :
                     product.category === 'vitality' ? 'الحيوية والصحة' :
                     product.category === 'beauty' ? 'الجمال العملي' : product.category}
                  </Badge>
                  <div className="text-right">
                    <span className="elyvra-text-gold font-bold">
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
                    className="elyvra-button-secondary flex-1"
                    onClick={() => setEditingProduct(product)}
                  >
                    <Edit className="w-3 h-3 mr-1" />
                    تعديل
                  </Button>
                  <Button 
                    size="sm" 
                    variant="destructive"
                    onClick={() => deleteProduct(product.id)}
                    className="flex-1 bg-red-600 hover:bg-red-700"
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
        <EnhancedProductForm 
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

// Enhanced Product Form Component with supplement-specific fields
const EnhancedProductForm = ({ product, onClose, onSave }) => {
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
    // Enhanced supplement fields
    certifications: product?.certifications || [],
    expiry_date: product?.expiry_date || '',
    manufacturing_date: product?.manufacturing_date || '',
    batch_number: product?.batch_number || '',
    storage_conditions: product?.storage_conditions || '',
    translations: {
      ar: {
        name: product?.translations?.ar?.name || '',
        description: product?.translations?.ar?.description || '',
        short_description: product?.translations?.ar?.short_description || '',
        benefits: product?.translations?.ar?.benefits?.join(', ') || '',
        ingredients: product?.translations?.ar?.ingredients?.join(', ') || '',
        usage_instructions: product?.translations?.ar?.usage_instructions || '',
        // New supplement fields
        active_ingredients: product?.translations?.ar?.active_ingredients || '',
        recommended_dosage: product?.translations?.ar?.recommended_dosage || '',
        usage_warnings: product?.translations?.ar?.usage_warnings || ''
      },
      en: {
        name: product?.translations?.en?.name || '',
        description: product?.translations?.en?.description || '',
        short_description: product?.translations?.en?.short_description || '',
        benefits: product?.translations?.en?.benefits?.join(', ') || '',
        ingredients: product?.translations?.en?.ingredients?.join(', ') || '',
        usage_instructions: product?.translations?.en?.usage_instructions || '',
        // New supplement fields
        active_ingredients: product?.translations?.en?.active_ingredients || '',
        recommended_dosage: product?.translations?.en?.recommended_dosage || '',
        usage_warnings: product?.translations?.en?.usage_warnings || ''
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
        certifications: formData.certifications,
        expiry_date: formData.expiry_date ? formData.expiry_date : null,
        manufacturing_date: formData.manufacturing_date ? formData.manufacturing_date : null,
        batch_number: formData.batch_number || null,
        storage_conditions: formData.storage_conditions || null,
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
          }
        }
      };

      if (product) {
        await axios.put(`${API}/admin/products/${product.id}`, processedData);
        alert('تم تحديث المنتج بنجاح');
      } else {
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
      <Card className="w-full max-w-5xl max-h-[90vh] overflow-y-auto elyvra-card">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <span className="brand-logo">
              {product ? 'تعديل المنتج' : 'إضافة منتج جديد'}
            </span>
            <Button variant="ghost" onClick={onClose} className="text-light-gray hover:text-white">
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
                  className="elyvra-input"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-light-gray">الفئة</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                  <SelectTrigger className="elyvra-input">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="elyvra-card">
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
                  className="elyvra-input"
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
                  className="elyvra-input"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-light-gray">كمية المخزون</Label>
                <Input
                  type="number"
                  value={formData.stock_quantity}
                  onChange={(e) => setFormData({...formData, stock_quantity: e.target.value})}
                  className="elyvra-input"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-light-gray">الكلمات المفتاحية (مفصولة بفاصلة)</Label>
                <Input
                  value={formData.tags}
                  onChange={(e) => setFormData({...formData, tags: e.target.value})}
                  className="elyvra-input"
                  placeholder="مثال: فاخر، صحة، طبيعي"
                />
              </div>
            </div>

            {/* Enhanced Supplement Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-light-gray">رقم الدفعة</Label>
                <Input
                  value={formData.batch_number}
                  onChange={(e) => setFormData({...formData, batch_number: e.target.value})}
                  className="elyvra-input"
                  placeholder="مثال: BATCH2024001"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-light-gray">ظروف التخزين</Label>
                <Input
                  value={formData.storage_conditions}
                  onChange={(e) => setFormData({...formData, storage_conditions: e.target.value})}
                  className="elyvra-input"
                  placeholder="مثال: يحفظ في مكان بارد وجاف"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-light-gray">تاريخ الإنتاج</Label>
                <Input
                  type="date"
                  value={formData.manufacturing_date}
                  onChange={(e) => setFormData({...formData, manufacturing_date: e.target.value})}
                  className="elyvra-input"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-light-gray">تاريخ انتهاء الصلاحية</Label>
                <Input
                  type="date"
                  value={formData.expiry_date}
                  onChange={(e) => setFormData({...formData, expiry_date: e.target.value})}
                  className="elyvra-input"
                />
              </div>
            </div>

            {/* Images */}
            <div className="space-y-2">
              <Label className="text-light-gray">رابط الصورة الرئيسية</Label>
              <Input
                value={formData.image_url}
                onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                className="elyvra-input"
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
                  className="rounded elyvra-border-gold"
                />
                متوفر في المخزون
              </label>
              <label className="flex items-center gap-2 text-light-gray">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                  className="rounded elyvra-border-gold"
                />
                منتج مميز
              </label>
            </div>

            {/* Enhanced Language Tabs */}
            <Tabs defaultValue="ar" className="w-full">
              <TabsList className="grid w-full grid-cols-2 elyvra-card">
                <TabsTrigger value="ar" className="elyvra-nav-item">العربية</TabsTrigger>
                <TabsTrigger value="en" className="elyvra-nav-item">English</TabsTrigger>
              </TabsList>
              
              {[
                { code: 'ar', name: 'العربية' },
                { code: 'en', name: 'English' }
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
                        className="elyvra-input"
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
                        className="elyvra-input"
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
                      className="elyvra-input"
                      rows={3}
                    />
                  </div>

                  {/* New Enhanced Supplement Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-light-gray flex items-center gap-2">
                        <Pill className="w-4 h-4" />
                        المكونات النشطة
                      </Label>
                      <Textarea
                        value={formData.translations[lang.code].active_ingredients}
                        onChange={(e) => setFormData({
                          ...formData,
                          translations: {
                            ...formData.translations,
                            [lang.code]: {...formData.translations[lang.code], active_ingredients: e.target.value}
                          }
                        })}
                        className="elyvra-input"
                        rows={2}
                        placeholder={lang.code === 'ar' ? 'مثال: كرياتين مونوهيدرات 5000 مج، بيتا ألانين 3000 مج' : 'e.g. Creatine Monohydrate 5000mg, Beta Alanine 3000mg'}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-light-gray">الجرعة الموصى بها</Label>
                      <Textarea
                        value={formData.translations[lang.code].recommended_dosage}
                        onChange={(e) => setFormData({
                          ...formData,
                          translations: {
                            ...formData.translations,
                            [lang.code]: {...formData.translations[lang.code], recommended_dosage: e.target.value}
                          }
                        })}
                        className="elyvra-input"
                        rows={2}
                        placeholder={lang.code === 'ar' ? 'مثال: مغرفة واحدة يومياً قبل التمرين بـ 30 دقيقة' : 'e.g. One scoop daily 30 minutes before workout'}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-light-gray flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      تحذيرات الاستخدام
                    </Label>
                    <Textarea
                      value={formData.translations[lang.code].usage_warnings}
                      onChange={(e) => setFormData({
                        ...formData,
                        translations: {
                          ...formData.translations,
                          [lang.code]: {...formData.translations[lang.code], usage_warnings: e.target.value}
                        }
                      })}
                      className="elyvra-input"
                      rows={2}
                      placeholder={lang.code === 'ar' ? 'مثال: لا يُنصح للحوامل والمرضعات، استشر طبيبك قبل الاستخدام' : 'e.g. Not recommended for pregnant/nursing women, consult your doctor before use'}
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
                        className="elyvra-input"
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
                        className="elyvra-input"
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
                      className="elyvra-input"
                      rows={2}
                    />
                  </div>
                </TabsContent>
              ))}
            </Tabs>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={loading} className="elyvra-button-primary flex-1">
                {loading ? 'جاري الحفظ...' : (product ? 'تحديث المنتج' : 'إنشاء المنتج')}
              </Button>
              <Button type="button" onClick={onClose} className="elyvra-button-secondary">
                إلغاء
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

// Content Management System Component
const ContentManagement = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = async () => {
    try {
      const response = await axios.get(`${API}/blog`);
      setBlogPosts(response.data);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      setBlogPosts([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8 text-light-gray">جاري تحميل المحتوى...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white brand-logo">إدارة المحتوى</h2>
        <Button 
          onClick={() => setShowAddForm(true)}
          className="elyvra-button-primary"
        >
          <Plus className="w-4 h-4 mr-2" />
          مقال جديد
        </Button>
      </div>

      {/* CMS Tabs */}
      <Tabs defaultValue="blog" className="w-full">
        <TabsList className="grid w-full grid-cols-2 elyvra-card">
          <TabsTrigger value="blog" className="elyvra-nav-item">
            <BookOpen className="w-4 h-4 mr-2" />
            المدونة
          </TabsTrigger>
          <TabsTrigger value="pages" className="elyvra-nav-item">
            <FileText className="w-4 h-4 mr-2" />
            الصفحات الثابتة
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="blog" className="space-y-4">
          {blogPosts.length === 0 ? (
            <Card className="elyvra-card">
              <CardContent className="text-center py-12">
                <BookOpen className="w-12 h-12 elyvra-text-gold mx-auto mb-4" />
                <p className="text-light-gray">لا توجد مقالات بعد</p>
                <Button 
                  onClick={() => setShowAddForm(true)}
                  className="elyvra-button-primary mt-4"
                >
                  إنشاء أول مقال
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogPosts.map((post) => (
                <Card key={post.id} className="elyvra-stats-card">
                  <CardHeader>
                    <CardTitle className="text-white">
                      {post.title?.ar || post.title?.en || 'بدون عنوان'}
                    </CardTitle>
                    <CardDescription className="text-light-gray">
                      بواسطة {post.author} - {new Date(post.created_at).toLocaleDateString('ar-SA')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-light-gray text-sm mb-4">
                      {post.excerpt?.ar || post.excerpt?.en || 'بدون مقدمة'}
                    </p>
                    <div className="flex justify-between items-center">
                      <Badge className={post.published ? 'bg-green-500' : 'bg-yellow-500'}>
                        {post.published ? 'منشور' : 'مسودة'}
                      </Badge>
                      <div className="flex gap-2">
                        <Button size="sm" className="elyvra-button-secondary">
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="destructive">
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="pages" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {['من نحن', 'سياسة الخصوصية', 'الأسئلة الشائعة', 'اتصل بنا', 'الشروط والأحكام'].map((page, index) => (
              <Card key={index} className="elyvra-stats-card">
                <CardHeader>
                  <CardTitle className="text-white">{page}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <span className="text-light-gray text-sm">آخر تحديث: {new Date().toLocaleDateString('ar-SA')}</span>
                    <Button size="sm" className="elyvra-button-secondary">
                      <Edit className="w-3 h-3 mr-1" />
                      تعديل
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Marketing & Promotions Component
const MarketingManagement = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const response = await axios.get(`${API}/coupons`);
      setCoupons(response.data);
    } catch (error) {
      console.error('Error fetching coupons:', error);
      setCoupons([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8 text-light-gray">جاري تحميل العروض...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white brand-logo">التسويق والعروض</h2>
        <Button className="elyvra-button-primary">
          <Plus className="w-4 h-4 mr-2" />
          كوبون جديد
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {coupons.length === 0 ? (
          <div className="col-span-full">
            <Card className="elyvra-card">
              <CardContent className="text-center py-12">
                <Tag className="w-12 h-12 elyvra-text-gold mx-auto mb-4" />
                <p className="text-light-gray">لا توجد كوبونات حالياً</p>
                <Button className="elyvra-button-primary mt-4">
                  إنشاء أول كوبون
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          coupons.map((coupon) => (
            <Card key={coupon.id} className="elyvra-stats-card">
              <CardHeader>
                <CardTitle className="text-white elyvra-text-gold">{coupon.code}</CardTitle>
                <CardDescription className="text-light-gray">
                  {coupon.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-light-gray">النوع:</span>
                    <Badge className="elyvra-bg-gold text-charcoal-black">
                      {coupon.discount_type === 'percentage' ? 'نسبة مئوية' :
                       coupon.discount_type === 'fixed_amount' ? 'مبلغ ثابت' : 'شحن مجاني'}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-light-gray">القيمة:</span>
                    <span className="text-white">
                      {coupon.discount_type === 'percentage' ? `${coupon.discount_value}%` : 
                       coupon.discount_type === 'fixed_amount' ? `$${coupon.discount_value}` : 'مجاني'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-light-gray">الاستخدامات:</span>
                    <span className="text-white">{coupon.current_usage_count} / {coupon.max_usage_count || '∞'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-light-gray">الحالة:</span>
                    <Badge className={coupon.is_active ? 'bg-green-500' : 'bg-red-500'}>
                      {coupon.is_active ? 'نشط' : 'غير نشط'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
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
    <div className="min-h-screen bg-gradient-to-br from-charcoal-black via-dark-charcoal to-medium-gray" dir="rtl">
      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-64 elyvra-sidebar z-40">
        <div className="p-6">
          <h1 className="text-2xl brand-logo">
            إدارة Elyvra
          </h1>
          <p className="text-light-gray text-sm mt-1">مرحباً، {admin?.full_name}</p>
        </div>
        
        <nav className="px-4 space-y-2">
          <button 
            onClick={() => setCurrentView('dashboard')}
            className={`elyvra-nav-item flex items-center gap-3 px-4 py-3 w-full text-right ${
              currentView === 'dashboard' ? 'active' : ''
            }`}
          >
            <BarChart className="w-5 h-5" />
            لوحة التحكم
          </button>
          <button 
            onClick={() => setCurrentView('orders')}
            className={`elyvra-nav-item flex items-center gap-3 px-4 py-3 w-full text-right ${
              currentView === 'orders' ? 'active' : ''
            }`}
          >
            <ShoppingCart className="w-5 h-5" />
            الطلبات
          </button>
          <button 
            onClick={() => setCurrentView('customers')}
            className={`elyvra-nav-item flex items-center gap-3 px-4 py-3 w-full text-right ${
              currentView === 'customers' ? 'active' : ''
            }`}
          >
            <Users className="w-5 h-5" />
            العملاء
          </button>
          <button 
            onClick={() => setCurrentView('products')}
            className={`elyvra-nav-item flex items-center gap-3 px-4 py-3 w-full text-right ${
              currentView === 'products' ? 'active' : ''
            }`}
          >
            <Package className="w-5 h-5" />
            المنتجات
          </button>
          <button 
            onClick={() => setCurrentView('content')}
            className={`elyvra-nav-item flex items-center gap-3 px-4 py-3 w-full text-right ${
              currentView === 'content' ? 'active' : ''
            }`}
          >
            <BookOpen className="w-5 h-5" />
            المحتوى
          </button>
          <button 
            onClick={() => setCurrentView('marketing')}
            className={`elyvra-nav-item flex items-center gap-3 px-4 py-3 w-full text-right ${
              currentView === 'marketing' ? 'active' : ''
            }`}
          >
            <Tag className="w-5 h-5" />
            التسويق
          </button>
          <a 
            href="/"
            target="_blank"
            className="elyvra-nav-item flex items-center gap-3 px-4 py-3 text-right"
          >
            <Eye className="w-5 h-5" />
            عرض المتجر
          </a>
        </nav>
        
        <div className="absolute bottom-4 left-4 right-4">
          <Button 
            onClick={handleLogout}
            className="w-full elyvra-button-secondary"
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
        {currentView === 'content' && <ContentManagement />}
        {currentView === 'marketing' && <MarketingManagement />}
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