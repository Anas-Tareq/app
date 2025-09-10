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
  Activity
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
            Admin Dashboard Login
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-light-gray">Username</Label>
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
              <Label htmlFor="password" className="text-light-gray">Password</Label>
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
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
          
          <div className="mt-6 pt-4 border-t border-accent/20 text-center">
            <p className="text-light-gray text-sm mb-3">Need admin access?</p>
            <Button 
              onClick={initDefaultAdmin}
              variant="outline"
              className="secondary-button text-sm"
            >
              Create Default Admin
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Dashboard Stats Component
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
        {[...Array(4)].map((_, i) => (
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-glass-gradient border-accent/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-light-gray">Total Products</CardTitle>
            <Package className="h-4 w-4 text-accent-orange" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats?.total_products || 0}</div>
          </CardContent>
        </Card>

        <Card className="bg-glass-gradient border-accent/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-light-gray">Total Carts</CardTitle>
            <ShoppingCart className="h-4 w-4 text-accent-orange" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats?.total_carts || 0}</div>
          </CardContent>
        </Card>

        <Card className="bg-glass-gradient border-accent/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-light-gray">Active Carts</CardTitle>
            <TrendingUp className="h-4 w-4 text-accent-orange" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats?.active_carts || 0}</div>
          </CardContent>
        </Card>

        <Card className="bg-glass-gradient border-accent/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-light-gray">Categories</CardTitle>
            <BarChart className="h-4 w-4 text-accent-orange" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {Object.keys(stats?.products_by_category || {}).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Breakdown & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-glass-gradient border-accent/30">
          <CardHeader>
            <CardTitle className="text-white">Products by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(stats?.products_by_category || {}).map(([category, count]) => (
                <div key={category} className="flex justify-between items-center">
                  <Badge variant="secondary" className="capitalize">
                    {category.replace('_', ' ')}
                  </Badge>
                  <span className="text-white font-semibold">{count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-glass-gradient border-accent/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {stats?.recent_activity?.map((activity, index) => (
                <div key={index} className="flex items-start gap-3 p-2 rounded bg-glass-bg/50">
                  <div className="flex-1">
                    <p className="text-white text-sm">{activity.message}</p>
                    <p className="text-light-gray text-xs">
                      {activity.timestamp ? new Date(activity.timestamp).toLocaleString() : 'Unknown time'}
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

// Product Management Component
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
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      await axios.delete(`${API}/admin/products/${productId}`);
      fetchProducts(); // Refresh list
      alert('Product deleted successfully');
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error deleting product');
    }
  };

  if (loading) {
    return <div className="text-center py-8 text-light-gray">Loading products...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-playfair text-white">Product Management</h2>
        <Button 
          onClick={() => setShowAddForm(true)}
          className="primary-button"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Product
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
                  alt={product.translations?.en?.name || 'Product'} 
                  className="w-full h-full object-cover"
                />
                {product.featured && (
                  <Badge className="absolute top-2 left-2 bg-accent-gradient">
                    Featured
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-2">
                <h3 className="font-semibold text-white">
                  {product.translations?.en?.name || 'Unnamed Product'}
                </h3>
                <p className="text-light-gray text-sm">
                  {product.translations?.en?.short_description || 'No description'}
                </p>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="capitalize">
                    {product.category.replace('_', ' ')}
                  </Badge>
                  <span className="text-accent-orange font-bold">
                    ${product.discounted_price || product.price}
                  </span>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => setEditingProduct(product)}
                    className="flex-1"
                  >
                    <Edit className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                  <Button 
                    size="sm" 
                    variant="destructive"
                    onClick={() => deleteProduct(product.id)}
                    className="flex-1"
                  >
                    <Trash2 className="w-3 h-3 mr-1" />
                    Delete
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

// Product Form Component
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
      en: {
        name: product?.translations?.en?.name || '',
        description: product?.translations?.en?.description || '',
        short_description: product?.translations?.en?.short_description || '',
        benefits: product?.translations?.en?.benefits?.join(', ') || '',
        ingredients: product?.translations?.en?.ingredients?.join(', ') || '',
        usage_instructions: product?.translations?.en?.usage_instructions || ''
      },
      ar: {
        name: product?.translations?.ar?.name || '',
        description: product?.translations?.ar?.description || '',
        short_description: product?.translations?.ar?.short_description || '',
        benefits: product?.translations?.ar?.benefits?.join(', ') || '',
        ingredients: product?.translations?.ar?.ingredients?.join(', ') || '',
        usage_instructions: product?.translations?.ar?.usage_instructions || ''
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
          en: {
            ...formData.translations.en,
            benefits: formData.translations.en.benefits.split(',').map(b => b.trim()).filter(Boolean),
            ingredients: formData.translations.en.ingredients.split(',').map(i => i.trim()).filter(Boolean)
          },
          ar: {
            ...formData.translations.ar,
            benefits: formData.translations.ar.benefits.split(',').map(b => b.trim()).filter(Boolean),
            ingredients: formData.translations.ar.ingredients.split(',').map(i => i.trim()).filter(Boolean)
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
        alert('Product updated successfully');
      } else {
        // Create new product
        await axios.post(`${API}/products`, processedData);
        alert('Product created successfully');
      }

      onSave();
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Error saving product: ' + (error.response?.data?.detail || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-glass-gradient border-accent/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            {product ? 'Edit Product' : 'Add New Product'}
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
                <Label className="text-light-gray">SKU</Label>
                <Input
                  value={formData.sku}
                  onChange={(e) => setFormData({...formData, sku: e.target.value})}
                  className="bg-glass-bg border-accent/30 text-white"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-light-gray">Category</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                  <SelectTrigger className="bg-glass-bg border-accent/30 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="performance">Physical Performance</SelectItem>
                    <SelectItem value="vitality">Sexual Vitality</SelectItem>
                    <SelectItem value="beauty">Functional Beauty</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-light-gray">Price ($)</Label>
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
                <Label className="text-light-gray">Discounted Price ($)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.discounted_price}
                  onChange={(e) => setFormData({...formData, discounted_price: e.target.value})}
                  className="bg-glass-bg border-accent/30 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-light-gray">Stock Quantity</Label>
                <Input
                  type="number"
                  value={formData.stock_quantity}
                  onChange={(e) => setFormData({...formData, stock_quantity: e.target.value})}
                  className="bg-glass-bg border-accent/30 text-white"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-light-gray">Tags (comma separated)</Label>
                <Input
                  value={formData.tags}
                  onChange={(e) => setFormData({...formData, tags: e.target.value})}
                  className="bg-glass-bg border-accent/30 text-white"
                  placeholder="e.g., premium, wellness, organic"
                />
              </div>
            </div>

            {/* Images */}
            <div className="space-y-2">
              <Label className="text-light-gray">Main Image URL</Label>
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
                In Stock
              </label>
              <label className="flex items-center gap-2 text-light-gray">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                  className="rounded"
                />
                Featured Product
              </label>
            </div>

            {/* Translations */}
            <Tabs defaultValue="en" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-glass-bg">
                <TabsTrigger value="en">English</TabsTrigger>
                <TabsTrigger value="ar">العربية</TabsTrigger>
                <TabsTrigger value="fr">Français</TabsTrigger>
              </TabsList>
              
              {['en', 'ar', 'fr'].map(lang => (
                <TabsContent key={lang} value={lang} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-light-gray">Product Name</Label>
                      <Input
                        value={formData.translations[lang].name}
                        onChange={(e) => setFormData({
                          ...formData,
                          translations: {
                            ...formData.translations,
                            [lang]: {...formData.translations[lang], name: e.target.value}
                          }
                        })}
                        className="bg-glass-bg border-accent/30 text-white"
                        required={lang === 'en'}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-light-gray">Short Description</Label>
                      <Input
                        value={formData.translations[lang].short_description}
                        onChange={(e) => setFormData({
                          ...formData,
                          translations: {
                            ...formData.translations,
                            [lang]: {...formData.translations[lang], short_description: e.target.value}
                          }
                        })}
                        className="bg-glass-bg border-accent/30 text-white"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-light-gray">Full Description</Label>
                    <Textarea
                      value={formData.translations[lang].description}
                      onChange={(e) => setFormData({
                        ...formData,
                        translations: {
                          ...formData.translations,
                          [lang]: {...formData.translations[lang], description: e.target.value}
                        }
                      })}
                      className="bg-glass-bg border-accent/30 text-white"
                      rows={3}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-light-gray">Benefits (comma separated)</Label>
                      <Textarea
                        value={formData.translations[lang].benefits}
                        onChange={(e) => setFormData({
                          ...formData,
                          translations: {
                            ...formData.translations,
                            [lang]: {...formData.translations[lang], benefits: e.target.value}
                          }
                        })}
                        className="bg-glass-bg border-accent/30 text-white"
                        rows={2}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-light-gray">Ingredients (comma separated)</Label>
                      <Textarea
                        value={formData.translations[lang].ingredients}
                        onChange={(e) => setFormData({
                          ...formData,
                          translations: {
                            ...formData.translations,
                            [lang]: {...formData.translations[lang], ingredients: e.target.value}
                          }
                        })}
                        className="bg-glass-bg border-accent/30 text-white"
                        rows={2}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-light-gray">Usage Instructions</Label>
                    <Textarea
                      value={formData.translations[lang].usage_instructions}
                      onChange={(e) => setFormData({
                        ...formData,
                        translations: {
                          ...formData.translations,
                          [lang]: {...formData.translations[lang], usage_instructions: e.target.value}
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
                {loading ? 'Saving...' : (product ? 'Update Product' : 'Create Product')}
              </Button>
              <Button type="button" onClick={onClose} variant="outline" className="secondary-button">
                Cancel
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
    <div className="min-h-screen bg-gradient-to-br from-charcoal-black via-deep-navy to-charcoal-black">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-glass-gradient border-r border-accent/30 backdrop-blur-20">
        <div className="p-6">
          <h1 className="text-2xl font-playfair bg-accent-gradient bg-clip-text text-transparent">
            Elyvra Admin
          </h1>
          <p className="text-light-gray text-sm mt-1">Welcome, {admin?.full_name}</p>
        </div>
        
        <nav className="px-4 space-y-2">
          <button 
            onClick={() => setCurrentView('dashboard')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all w-full text-left ${
              currentView === 'dashboard' 
                ? 'text-white bg-accent-gradient' 
                : 'text-light-gray hover:text-white hover:bg-glass-bg'
            }`}
          >
            <BarChart className="w-5 h-5" />
            Dashboard
          </button>
          <button 
            onClick={() => setCurrentView('products')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all w-full text-left ${
              currentView === 'products' 
                ? 'text-white bg-accent-gradient' 
                : 'text-light-gray hover:text-white hover:bg-glass-bg'
            }`}
          >
            <Package className="w-5 h-5" />
            Products
          </button>
          <a 
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-4 py-3 text-light-gray hover:text-white hover:bg-glass-bg rounded-lg transition-all"
          >
            <Eye className="w-5 h-5" />
            View Store
          </a>
        </nav>
        
        <div className="absolute bottom-4 left-4 right-4">
          <Button 
            onClick={handleLogout}
            variant="outline" 
            className="w-full secondary-button"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-8">
        {currentView === 'dashboard' && <DashboardStats />}
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