# Elyvra E-commerce Platform

**Elyvra** is a premium e-commerce platform specializing in wellness products that combine performance science with beauty excellence. The platform focuses on three main categories: Physical Performance, Sexual Vitality, and Functional Beauty.

## 🌟 Features

### Core E-commerce Functionality
- **Multi-language Support**: English, Arabic, and French
- **Product Catalog**: Advanced product management with supplement-specific fields
- **Shopping Cart**: Persistent cart functionality
- **Order Management**: Complete order lifecycle tracking
- **User Management**: Customer profiles and segmentation

### Enhanced Admin Dashboard
- **Comprehensive Statistics**: Real-time analytics and KPIs
- **Product Management**: Enhanced with supplement-specific fields
  - Active ingredients tracking
  - Recommended dosage information
  - Usage warnings and contraindications
  - Batch numbers and expiry dates
  - Storage conditions
  - Quality certifications
- **Blog/Content Management**: Multi-language article publishing
- **Marketing Tools**: Coupon and promotion management
- **Inventory Alerts**: Low stock notifications
- **Abandoned Cart Tracking**: Customer retention insights

### Supplement-Specific Features
- **Detailed Product Information**: Complete supplement facts
- **Multi-language Ingredient Lists**: Transparent ingredient disclosure
- **Dosage Instructions**: Clear usage guidelines
- **Safety Warnings**: Comprehensive contraindication information
- **Quality Certifications**: Document management for quality assurance
- **Batch Tracking**: Manufacturing and expiry date management

### Marketing & Content
- **The Source Blog**: Educational content platform
- **SEO Optimization**: Multi-language meta descriptions
- **Featured Products**: Promotional highlighting
- **Customer Segmentation**: Targeted marketing capabilities

## 🏗️ Architecture

### Backend (FastAPI + MongoDB)
- **FastAPI**: Modern, fast web framework for building APIs
- **MongoDB**: NoSQL database for flexible document storage
- **Motor**: Async MongoDB driver
- **Pydantic**: Data validation and serialization
- **Multi-language Models**: Built-in internationalization support

### Frontend (React + Tailwind CSS)
- **React 18**: Modern React with hooks and context
- **Tailwind CSS**: Utility-first CSS framework
- **Shadcn/UI**: High-quality component library
- **Lucide Icons**: Beautiful icon set
- **Responsive Design**: Mobile-first approach

### Key Enhancements Made

#### 1. Enhanced Product Models
- Added supplement-specific fields (active ingredients, dosage, warnings)
- Implemented batch tracking and expiry date management
- Added quality certification document support
- Enhanced multi-language support for all product fields

#### 2. Improved Admin Dashboard
- Comprehensive statistics with charts and KPIs
- Low stock alerts and inventory management
- Abandoned cart tracking for better customer retention
- Enhanced product management interface with tabs for different data categories

#### 3. Content Management System
- Full blog management with multi-language support
- Static page management for legal and informational content
- SEO optimization tools
- Featured content highlighting

#### 4. Advanced Marketing Tools
- Coupon and discount management
- Customer segmentation (New, Regular, VIP)
- Promotional campaign support
- Featured product management

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm
- Python 3.8+
- MongoDB 4.4+

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Anas-Tareq/app.git
   cd app
   ```

2. **Backend Setup**
   ```bash
   cd backend
   pip install -r requirements.txt
   
   # Create .env file
   echo "MONGO_URL=mongodb://localhost:27017" > .env
   echo "DB_NAME=elyvra_db" >> .env
   echo "CORS_ORIGINS=*" >> .env
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   
   # Create .env file
   echo "REACT_APP_BACKEND_URL=http://localhost:8000" > .env
   ```

4. **Start MongoDB**
   ```bash
   # Ubuntu/Debian
   sudo systemctl start mongod
   
   # macOS with Homebrew
   brew services start mongodb-community
   ```

5. **Run the Application**
   ```bash
   # Terminal 1: Backend
   cd backend
   uvicorn server:app --host 0.0.0.0 --port 8000 --reload
   
   # Terminal 2: Frontend
   cd frontend
   npm start
   ```

### Initial Setup

1. **Create Default Admin**
   - Visit: `http://localhost:3000/admin`
   - Click "Initialize Default Admin" if no admin exists
   - Default credentials: `admin` / `elyvra123`

2. **Initialize Sample Data**
   - Use the admin dashboard to create sample products
   - Add blog content through the content management system

## 📱 Usage

### Customer Interface
- Browse products by category (Performance, Vitality, Beauty)
- Multi-language product information
- Add to cart and checkout
- View detailed supplement information including ingredients and dosage

### Admin Interface
- Access at `/admin`
- Comprehensive dashboard with analytics
- Product management with supplement-specific fields
- Blog and content management
- Order and customer management
- Marketing tools and promotions

## 🌍 Multi-language Support

The platform supports three languages:
- **English (en)**: Primary language
- **Arabic (ar)**: RTL support included
- **French (fr)**: Secondary European market

All product information, blog content, and UI elements are fully translatable.

## 🔒 Security Features

- Password hashing with SHA-256
- Admin authentication system
- Role-based permissions (extensible)
- Input validation and sanitization
- CORS configuration for secure API access

## 📊 Analytics & Reporting

The admin dashboard provides:
- Real-time sales analytics
- Product performance metrics
- Customer behavior insights
- Inventory management alerts
- Abandoned cart recovery tools

## 🛠️ Development

### Project Structure
```
app/
├── backend/
│   ├── server.py          # Main FastAPI application
│   ├── models.py          # Pydantic models
│   ├── routes/            # API route modules
│   └── requirements.txt   # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── AdminDashboard.js
│   │   └── App.js
│   └── package.json       # Node.js dependencies
└── README.md
```

### API Endpoints

#### Public API
- `GET /api/products` - List products with filtering
- `POST /api/cart` - Create shopping cart
- `POST /api/orders` - Create order

#### Admin API
- `POST /admin/login` - Admin authentication
- `GET /admin/stats` - Dashboard statistics
- `POST /admin/products` - Create product
- `PUT /admin/products/{id}` - Update product
- `POST /admin/blog` - Create blog post
- `GET /admin/blog` - List blog posts

## 🚀 Deployment

The application is designed for easy deployment:

### Backend Deployment
- FastAPI with Uvicorn server
- MongoDB Atlas for cloud database
- Environment variables for configuration

### Frontend Deployment
- React build for static hosting
- Environment variables for API endpoints
- CDN-ready static assets

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is proprietary software developed for Elyvra.

## 📞 Support

For technical support or questions about the Elyvra platform, please contact the development team.

---

**Elyvra** - *Unlock Your Full Potential* 🌟
