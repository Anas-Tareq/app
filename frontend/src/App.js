import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import axios from 'axios';
import AdminDashboard from './AdminDashboard';
import './App.css';
import { Button } from './components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './components/ui/card';
import { Badge } from './components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import { ShoppingCart, Star, Filter, Menu, X, Globe, Search, User, Heart } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Language Context
const LanguageContext = React.createContext();

// Cart Context
const CartContext = React.createContext();

// Language data
const translations = {
  en: {
    brand: 'Elyvra',
    tagline: 'Unlock Your Full Potential',
    description: 'Premium wellness products combining performance science with beauty excellence',
    shop: 'Shop',
    about: 'About',
    blog: 'The Source',
    contact: 'Contact',
    cart: 'Cart',
    search: 'Search products...',
    allProducts: 'All Products',
    performance: 'Performance',
    vitality: 'Vitality & Wellness',
    beauty: 'Functional Beauty',
    featured: 'Featured Products',
    addToCart: 'Add to Cart',
    viewDetails: 'View Details',
    outOfStock: 'Out of Stock',
    currency: '$',
    categories: {
      performance: 'Physical Performance',
      vitality: 'Sexual Vitality',
      beauty: 'Functional Beauty'
    },
    hero: {
      title: 'Elevate Your Performance',
      subtitle: 'Discover premium supplements and beauty products designed for the ambitious',
      cta: 'Explore Products'
    }
  },
  ar: {
    brand: 'إليفرا',
    tagline: 'اطلق إمكاناتك الكاملة',
    description: 'منتجات صحية فاخرة تجمع بين علوم الأداء وتميز الجمال',
    shop: 'التسوق',
    about: 'حولنا',
    blog: 'المصدر',
    contact: 'اتصل بنا',
    cart: 'السلة',
    search: 'البحث عن المنتجات...',
    allProducts: 'جميع المنتجات',
    performance: 'الأداء',
    vitality: 'الحيوية والصحة',
    beauty: 'الجمال العملي',
    featured: 'المنتجات المميزة',
    addToCart: 'أضف للسلة',
    viewDetails: 'عرض التفاصيل',
    outOfStock: 'نفد من المخزون',
    currency: 'د.إ',
    categories: {
      performance: 'الأداء الجسدي',
      vitality: 'الحيوية الجنسية',
      beauty: 'الجمال العملي'
    },
    hero: {
      title: 'ارفع مستوى أدائك',
      subtitle: 'اكتشف المكملات الغذائية ومنتجات الجمال الفاخرة المصممة للطموحين',
      cta: 'استكشف المنتجات'
    }
  },
  fr: {
    brand: 'Elyvra',
    tagline: 'Libérez Votre Plein Potentiel',
    description: 'Produits de bien-être premium combinant science de la performance et excellence beauté',
    shop: 'Boutique',
    about: 'À Propos',
    blog: 'La Source',
    contact: 'Contact',
    cart: 'Panier',
    search: 'Rechercher des produits...',
    allProducts: 'Tous les Produits',
    performance: 'Performance',
    vitality: 'Vitalité et Bien-être',
    beauty: 'Beauté Fonctionnelle',
    featured: 'Produits Vedettes',
    addToCart: 'Ajouter au Panier',
    viewDetails: 'Voir Détails',
    outOfStock: 'Épuisé',
    currency: '€',
    categories: {
      performance: 'Performance Physique',
      vitality: 'Vitalité Sexuelle',
      beauty: 'Beauté Fonctionnelle'
    },
    hero: {
      title: 'Élevez Votre Performance',
      subtitle: 'Découvrez des suppléments premium et produits de beauté conçus pour les ambitieux',
      cta: 'Explorer les Produits'
    }
  }
};

// Header Component
const Header = () => {
  const { language, setLanguage, t } = React.useContext(LanguageContext);
  const { cartCount } = React.useContext(CartContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="header-glass">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="brand-logo">
            <span className="brand-text">{t.brand}</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="nav-link">{t.shop}</Link>
            <Link to="/about" className="nav-link">{t.about}</Link>
            <Link to="/blog" className="nav-link">{t.blog}</Link>
            <Link to="/contact" className="nav-link">{t.contact}</Link>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Language Selector */}
            <div className="relative">
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="w-20 h-8 bg-glass-bg border-accent/30 text-light-gray">
                  <Globe className="w-4 h-4 mr-1" />
                  <span className="text-xs">{language.toUpperCase()}</span>
                </SelectTrigger>
                <SelectContent className="bg-glass-bg border-accent/30 backdrop-blur-lg">
                  <SelectItem value="en" className="text-light-gray hover:text-white">English</SelectItem>
                  <SelectItem value="ar" className="text-light-gray hover:text-white">العربية</SelectItem>
                  <SelectItem value="fr" className="text-light-gray hover:text-white">Français</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button variant="ghost" size="icon" className="text-light-gray">
              <Search className="w-5 h-5" />
            </Button>
            
            <Link to="/admin">
              <Button variant="ghost" size="icon" className="text-light-gray">
                <User className="w-5 h-5" />
              </Button>
            </Link>
            
            <Button variant="ghost" size="icon" className="text-light-gray relative">
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-charcoal text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Button>

            {/* Mobile Menu Button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden text-light-gray"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 py-4 border-t border-accent/20">
            <div className="flex flex-col space-y-4">
              <Link to="/" className="nav-link">{t.shop}</Link>
              <Link to="/about" className="nav-link">{t.about}</Link>
              <Link to="/blog" className="nav-link">{t.blog}</Link>
              <Link to="/contact" className="nav-link">{t.contact}</Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

// Hero Section Component
const HeroSection = () => {
  const { t } = React.useContext(LanguageContext);

  return (
    <section className="hero-section">
      <div className="container mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="hero-title">
                {t.hero.title}
              </h1>
              <p className="hero-subtitle">
                {t.hero.subtitle}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="primary-button">
                {t.hero.cta}
              </Button>
              <Button variant="outline" size="lg" className="secondary-button">
                {t.about}
              </Button>
            </div>
          </div>
          <div className="relative">
            <div className="product-showcase">
              <img 
                src="https://images.unsplash.com/photo-1729701792989-f517b77e7f49" 
                alt="Premium Wellness Products" 
                className="hero-image"
              />
              <div className="hero-overlay"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Product Card Component
const ProductCard = ({ product }) => {
  const { language, t } = React.useContext(LanguageContext);
  const { addToCart, cartCount } = React.useContext(CartContext);
  const productInfo = product.translations[language] || product.translations['en'];
  const [isAdding, setIsAdding] = useState(false);
  
  const isDiscounted = product.discounted_price && product.discounted_price < product.price;
  const displayPrice = isDiscounted ? product.discounted_price : product.price;

  const handleAddToCart = async () => {
    if (!product.in_stock || isAdding) return;
    
    setIsAdding(true);
    try {
      await addToCart(product.id, 1);
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Card className="product-card">
      <CardHeader className="p-0">
        <div className="product-image-container">
          <img 
            src={product.image_url} 
            alt={productInfo.name}
            className="product-image"
          />
          {product.featured && (
            <Badge className="featured-badge">
              <Star className="w-3 h-3 mr-1" />
              {t.featured}
            </Badge>
          )}
          {isDiscounted && (
            <Badge variant="destructive" className="discount-badge">
              SALE
            </Badge>
          )}
          <Button variant="ghost" size="icon" className="wishlist-button">
            <Heart className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-3">
          <div>
            <Badge variant="secondary" className="category-badge mb-2">
              {t.categories[product.category]}
            </Badge>
            <CardTitle className="product-title">{productInfo.name}</CardTitle>
            <CardDescription className="product-description">
              {productInfo.short_description}
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <span className="product-price">
              {t.currency}{displayPrice}
            </span>
            {isDiscounted && (
              <span className="original-price">
                {t.currency}{product.price}
              </span>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <div className="flex gap-2 w-full">
          <Button 
            className="flex-1 primary-button"
            disabled={!product.in_stock || isAdding}
            onClick={handleAddToCart}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            {isAdding ? "Adding..." : (product.in_stock ? t.addToCart : t.outOfStock)}
          </Button>
          <Button variant="outline" className="secondary-button">
            {t.viewDetails}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

// Products Section Component
const ProductsSection = () => {
  const { t } = React.useContext(LanguageContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

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

  const initializeProducts = async () => {
    try {
      await axios.post(`${API}/init-products`);
      fetchProducts();
    } catch (error) {
      console.error('Error initializing products:', error);
    }
  };

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  if (loading) {
    return (
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="section-title">{t.featured}</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="product-card animate-pulse">
                <div className="h-64 bg-gray-200 rounded-t-lg"></div>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="section-title">{t.featured}</h2>
          <p className="section-subtitle">
            {t.description}
          </p>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-light-gray mb-6">No products available. Initialize sample products?</p>
            <Button onClick={initializeProducts} className="primary-button">
              Initialize Sample Products
            </Button>
          </div>
        ) : (
          <>
            {/* Category Filter */}
            <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-12">
              <TabsList className="category-tabs">
                <TabsTrigger value="all">{t.allProducts}</TabsTrigger>
                <TabsTrigger value="performance">{t.categories.performance}</TabsTrigger>
                <TabsTrigger value="vitality">{t.categories.vitality}</TabsTrigger>
                <TabsTrigger value="beauty">{t.categories.beauty}</TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Products Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

// Main Home Component
const Home = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <ProductsSection />
    </div>
  );
};

// Cart Provider Component
const CartProvider = ({ children }) => {
  const [cartId, setCartId] = useState(null);
  const [cartCount, setCartCount] = useState(0);

  // Initialize cart on component mount
  useEffect(() => {
    const initializeCart = async () => {
      try {
        const response = await axios.post(`${API}/cart`);
        if (response.data && response.data.id) {
          setCartId(response.data.id);
          localStorage.setItem('elyvra_cart_id', response.data.id);
        }
      } catch (error) {
        console.error('Error creating cart:', error);
      }
    };

    // Check for existing cart ID in localStorage
    const existingCartId = localStorage.getItem('elyvra_cart_id');
    if (existingCartId) {
      setCartId(existingCartId);
      // Verify cart exists and get current items count
      fetchCartCount(existingCartId);
    } else {
      initializeCart();
    }
  }, []);

  const fetchCartCount = async (id) => {
    try {
      const response = await axios.get(`${API}/cart/${id}`);
      if (response.data && response.data.items) {
        const count = response.data.items.reduce((total, item) => total + item.quantity, 0);
        setCartCount(count);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    if (!cartId) {
      console.error('No cart ID available');
      return;
    }

    try {
      const response = await axios.post(`${API}/cart/${cartId}/items`, {
        product_id: productId,
        quantity: quantity
      });

      if (response.data && response.data.cart) {
        const count = response.data.cart.items.reduce((total, item) => total + item.quantity, 0);
        setCartCount(count);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  };

  return (
    <CartContext.Provider value={{ cartId, cartCount, addToCart }}>
      {children}
    </CartContext.Provider>
  );
};

// Main App Component
function App() {
  const [language, setLanguage] = useState('en');
  const t = translations[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      <CartProvider>
        <div className="App" dir={language === 'ar' ? 'rtl' : 'ltr'}>
          <BrowserRouter>
            <Header />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<div className="container mx-auto px-6 py-20"><h1 className="section-title">About Elyvra</h1></div>} />
                <Route path="/blog" element={<div className="container mx-auto px-6 py-20"><h1 className="section-title">The Source</h1></div>} />
                <Route path="/contact" element={<div className="container mx-auto px-6 py-20"><h1 className="section-title">Contact Us</h1></div>} />
                <Route path="/admin/*" element={<AdminDashboard />} />
              </Routes>
            </main>
          </BrowserRouter>
        </div>
      </CartProvider>
    </LanguageContext.Provider>
  );
}

export default App;