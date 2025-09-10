import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Plus, Edit, Trash2, Package, AlertTriangle, Calendar,
  Upload, Save, X, Eye, Star, Tag, Pill, FileText
} from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    sku: '',
    category: 'performance',
    price: '',
    discounted_price: '',
    image_url: '',
    gallery_images: [],
    in_stock: true,
    stock_quantity: '',
    featured: false,
    tags: [],
    certifications: [],
    expiry_date: '',
    manufacturing_date: '',
    batch_number: '',
    storage_conditions: '',
    translations: {
      en: {
        name: '',
        description: '',
        short_description: '',
        benefits: [],
        ingredients: [],
        usage_instructions: '',
        active_ingredients: '',
        recommended_dosage: '',
        usage_warnings: ''
      },
      ar: {
        name: '',
        description: '',
        short_description: '',
        benefits: [],
        ingredients: [],
        usage_instructions: '',
        active_ingredients: '',
        recommended_dosage: '',
        usage_warnings: ''
      },
      fr: {
        name: '',
        description: '',
        short_description: '',
        benefits: [],
        ingredients: [],
        usage_instructions: '',
        active_ingredients: '',
        recommended_dosage: '',
        usage_warnings: ''
      }
    }
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/products`);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        discounted_price: formData.discounted_price ? parseFloat(formData.discounted_price) : null,
        stock_quantity: parseInt(formData.stock_quantity),
        expiry_date: formData.expiry_date ? new Date(formData.expiry_date).toISOString() : null,
        manufacturing_date: formData.manufacturing_date ? new Date(formData.manufacturing_date).toISOString() : null
      };

      if (editingProduct) {
        await axios.put(`${API}/admin/products/${editingProduct.id}`, productData);
      } else {
        await axios.post(`${API}/products`, productData);
      }
      
      fetchProducts();
      resetForm();
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Error saving product: ' + (error.response?.data?.detail || error.message));
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      ...product,
      price: product.price.toString(),
      discounted_price: product.discounted_price ? product.discounted_price.toString() : '',
      stock_quantity: product.stock_quantity.toString(),
      expiry_date: product.expiry_date ? new Date(product.expiry_date).toISOString().split('T')[0] : '',
      manufacturing_date: product.manufacturing_date ? new Date(product.manufacturing_date).toISOString().split('T')[0] : ''
    });
    setShowForm(true);
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`${API}/admin/products/${productId}`);
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Error deleting product');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      sku: '',
      category: 'performance',
      price: '',
      discounted_price: '',
      image_url: '',
      gallery_images: [],
      in_stock: true,
      stock_quantity: '',
      featured: false,
      tags: [],
      certifications: [],
      expiry_date: '',
      manufacturing_date: '',
      batch_number: '',
      storage_conditions: '',
      translations: {
        en: {
          name: '',
          description: '',
          short_description: '',
          benefits: [],
          ingredients: [],
          usage_instructions: '',
          active_ingredients: '',
          recommended_dosage: '',
          usage_warnings: ''
        },
        ar: {
          name: '',
          description: '',
          short_description: '',
          benefits: [],
          ingredients: [],
          usage_instructions: '',
          active_ingredients: '',
          recommended_dosage: '',
          usage_warnings: ''
        },
        fr: {
          name: '',
          description: '',
          short_description: '',
          benefits: [],
          ingredients: [],
          usage_instructions: '',
          active_ingredients: '',
          recommended_dosage: '',
          usage_warnings: ''
        }
      }
    });
    setEditingProduct(null);
    setShowForm(false);
  };

  const updateTranslation = (lang, field, value) => {
    setFormData(prev => ({
      ...prev,
      translations: {
        ...prev.translations,
        [lang]: {
          ...prev.translations[lang],
          [field]: value
        }
      }
    }));
  };

  const updateArrayField = (lang, field, value) => {
    const array = value.split(',').map(item => item.trim()).filter(item => item);
    updateTranslation(lang, field, array);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading products...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-white">Product Management</h2>
          <p className="text-light-gray">إدارة منتجات Elyvra</p>
        </div>
        <Button 
          onClick={() => setShowForm(true)} 
          className="primary-button"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Product
        </Button>
      </div>

      {showForm && (
        <Card className="elyvra-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="w-5 h-5 mr-2" />
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </CardTitle>
            <CardDescription>
              {editingProduct ? 'Update product information' : 'Create a new product for Elyvra store'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="translations">Translations</TabsTrigger>
                  <TabsTrigger value="supplements">Supplement Data</TabsTrigger>
                  <TabsTrigger value="inventory">Inventory</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="sku">SKU</Label>
                      <Input
                        id="sku"
                        value={formData.sku}
                        onChange={(e) => setFormData({...formData, sku: e.target.value})}
                        placeholder="ELYVRA-PERF-001"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="performance">Physical Performance</SelectItem>
                          <SelectItem value="vitality">Sexual Vitality</SelectItem>
                          <SelectItem value="beauty">Functional Beauty</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="price">Price ($)</Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="discounted_price">Discounted Price ($)</Label>
                      <Input
                        id="discounted_price"
                        type="number"
                        step="0.01"
                        value={formData.discounted_price}
                        onChange={(e) => setFormData({...formData, discounted_price: e.target.value})}
                        placeholder="Optional"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="image_url">Main Image URL</Label>
                    <Input
                      id="image_url"
                      value={formData.image_url}
                      onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                      placeholder="https://images.unsplash.com/..."
                      required
                    />
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="featured"
                        checked={formData.featured}
                        onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                      />
                      <Label htmlFor="featured">Featured Product</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="in_stock"
                        checked={formData.in_stock}
                        onChange={(e) => setFormData({...formData, in_stock: e.target.checked})}
                      />
                      <Label htmlFor="in_stock">In Stock</Label>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="translations" className="space-y-4">
                  <Tabs defaultValue="en" className="w-full">
                    <TabsList>
                      <TabsTrigger value="en">English</TabsTrigger>
                      <TabsTrigger value="ar">العربية</TabsTrigger>
                      <TabsTrigger value="fr">Français</TabsTrigger>
                    </TabsList>

                    {['en', 'ar', 'fr'].map(lang => (
                      <TabsContent key={lang} value={lang} className="space-y-4">
                        <div>
                          <Label>Product Name</Label>
                          <Input
                            value={formData.translations[lang].name}
                            onChange={(e) => updateTranslation(lang, 'name', e.target.value)}
                            placeholder={`Product name in ${lang}`}
                          />
                        </div>
                        
                        <div>
                          <Label>Short Description</Label>
                          <Input
                            value={formData.translations[lang].short_description}
                            onChange={(e) => updateTranslation(lang, 'short_description', e.target.value)}
                            placeholder="Brief product description"
                          />
                        </div>

                        <div>
                          <Label>Full Description</Label>
                          <Textarea
                            value={formData.translations[lang].description}
                            onChange={(e) => updateTranslation(lang, 'description', e.target.value)}
                            placeholder="Detailed product description"
                            rows={4}
                          />
                        </div>

                        <div>
                          <Label>Benefits (comma-separated)</Label>
                          <Input
                            value={formData.translations[lang].benefits.join(', ')}
                            onChange={(e) => updateArrayField(lang, 'benefits', e.target.value)}
                            placeholder="Increased Energy, Better Focus, Enhanced Performance"
                          />
                        </div>

                        <div>
                          <Label>Ingredients (comma-separated)</Label>
                          <Input
                            value={formData.translations[lang].ingredients.join(', ')}
                            onChange={(e) => updateArrayField(lang, 'ingredients', e.target.value)}
                            placeholder="Creatine, Beta-Alanine, Caffeine"
                          />
                        </div>

                        <div>
                          <Label>Usage Instructions</Label>
                          <Textarea
                            value={formData.translations[lang].usage_instructions}
                            onChange={(e) => updateTranslation(lang, 'usage_instructions', e.target.value)}
                            placeholder="How to use this product"
                            rows={3}
                          />
                        </div>
                      </TabsContent>
                    ))}
                  </Tabs>
                </TabsContent>

                <TabsContent value="supplements" className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <Label htmlFor="batch_number">Batch Number</Label>
                      <Input
                        id="batch_number"
                        value={formData.batch_number}
                        onChange={(e) => setFormData({...formData, batch_number: e.target.value})}
                        placeholder="BT2024001"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="manufacturing_date">Manufacturing Date</Label>
                        <Input
                          id="manufacturing_date"
                          type="date"
                          value={formData.manufacturing_date}
                          onChange={(e) => setFormData({...formData, manufacturing_date: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="expiry_date">Expiry Date</Label>
                        <Input
                          id="expiry_date"
                          type="date"
                          value={formData.expiry_date}
                          onChange={(e) => setFormData({...formData, expiry_date: e.target.value})}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="storage_conditions">Storage Conditions</Label>
                      <Textarea
                        id="storage_conditions"
                        value={formData.storage_conditions}
                        onChange={(e) => setFormData({...formData, storage_conditions: e.target.value})}
                        placeholder="Store in a cool, dry place away from direct sunlight"
                        rows={2}
                      />
                    </div>

                    <Tabs defaultValue="en" className="w-full">
                      <TabsList>
                        <TabsTrigger value="en">English</TabsTrigger>
                        <TabsTrigger value="ar">العربية</TabsTrigger>
                        <TabsTrigger value="fr">Français</TabsTrigger>
                      </TabsList>

                      {['en', 'ar', 'fr'].map(lang => (
                        <TabsContent key={lang} value={lang} className="space-y-4">
                          <div>
                            <Label>Active Ingredients</Label>
                            <Textarea
                              value={formData.translations[lang].active_ingredients || ''}
                              onChange={(e) => updateTranslation(lang, 'active_ingredients', e.target.value)}
                              placeholder="List of active ingredients with concentrations"
                              rows={3}
                            />
                          </div>

                          <div>
                            <Label>Recommended Dosage</Label>
                            <Input
                              value={formData.translations[lang].recommended_dosage || ''}
                              onChange={(e) => updateTranslation(lang, 'recommended_dosage', e.target.value)}
                              placeholder="Take 2 capsules daily with meals"
                            />
                          </div>

                          <div>
                            <Label>Usage Warnings</Label>
                            <Textarea
                              value={formData.translations[lang].usage_warnings || ''}
                              onChange={(e) => updateTranslation(lang, 'usage_warnings', e.target.value)}
                              placeholder="Consult healthcare provider before use. Not suitable for pregnant women."
                              rows={3}
                            />
                          </div>
                        </TabsContent>
                      ))}
                    </Tabs>
                  </div>
                </TabsContent>

                <TabsContent value="inventory" className="space-y-4">
                  <div>
                    <Label htmlFor="stock_quantity">Stock Quantity</Label>
                    <Input
                      id="stock_quantity"
                      type="number"
                      value={formData.stock_quantity}
                      onChange={(e) => setFormData({...formData, stock_quantity: e.target.value})}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="tags">Tags (comma-separated)</Label>
                    <Input
                      id="tags"
                      value={formData.tags.join(', ')}
                      onChange={(e) => {
                        const tags = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag);
                        setFormData({...formData, tags});
                      }}
                      placeholder="pre-workout, energy, performance"
                    />
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={resetForm}>
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button type="submit" className="primary-button">
                  <Save className="w-4 h-4 mr-2" />
                  {editingProduct ? 'Update Product' : 'Create Product'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Products List */}
      <div className="grid gap-6">
        {products.map((product) => (
          <Card key={product.id} className="elyvra-card">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <img 
                  src={product.image_url} 
                  alt={product.translations.en.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {product.translations.en.name}
                      </h3>
                      <p className="text-light-gray text-sm">
                        SKU: {product.sku} | Category: {product.category}
                      </p>
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge variant={product.in_stock ? "default" : "destructive"}>
                          {product.in_stock ? 'In Stock' : 'Out of Stock'}
                        </Badge>
                        {product.featured && (
                          <Badge variant="secondary">
                            <Star className="w-3 h-3 mr-1" />
                            Featured
                          </Badge>
                        )}
                        {product.stock_quantity < 10 && (
                          <Badge variant="destructive">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            Low Stock ({product.stock_quantity})
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-accent">
                        ${product.discounted_price || product.price}
                      </div>
                      {product.discounted_price && (
                        <div className="text-sm text-light-gray line-through">
                          ${product.price}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center space-x-2 text-sm text-light-gray">
                      <Package className="w-4 h-4" />
                      <span>Stock: {product.stock_quantity}</span>
                      {product.batch_number && (
                        <>
                          <span>•</span>
                          <span>Batch: {product.batch_number}</span>
                        </>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(product)}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(product.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {products.length === 0 && (
        <Card className="elyvra-card">
          <CardContent className="p-12 text-center">
            <Package className="w-16 h-16 mx-auto text-light-gray mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Products Found</h3>
            <p className="text-light-gray mb-6">
              Start by adding your first product to the Elyvra store.
            </p>
            <Button onClick={() => setShowForm(true)} className="primary-button">
              <Plus className="w-4 h-4 mr-2" />
              Add First Product
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProductManagement;

