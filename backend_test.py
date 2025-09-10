import requests
import sys
import json
from datetime import datetime

class ElyvraAPITester:
    def __init__(self, base_url="https://shop-elyvra.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.tests_run = 0
        self.tests_passed = 0
        self.cart_id = None
        self.product_ids = []

    def run_test(self, name, method, endpoint, expected_status, data=None, params=None):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}" if endpoint else self.api_url
        headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, params=params)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    if isinstance(response_data, list):
                        print(f"   Response: List with {len(response_data)} items")
                    elif isinstance(response_data, dict):
                        if 'message' in response_data:
                            print(f"   Message: {response_data['message']}")
                        else:
                            print(f"   Response keys: {list(response_data.keys())}")
                    return True, response_data
                except:
                    return True, {}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                try:
                    error_data = response.json()
                    print(f"   Error: {error_data}")
                except:
                    print(f"   Error text: {response.text}")
                return False, {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_root_endpoint(self):
        """Test the root API endpoint"""
        success, response = self.run_test(
            "Root API Endpoint",
            "GET",
            "",
            200
        )
        return success

    def test_initialize_products(self):
        """Test initializing sample products"""
        success, response = self.run_test(
            "Initialize Sample Products",
            "POST",
            "init-products",
            200
        )
        return success

    def test_get_all_products(self):
        """Test getting all products"""
        success, response = self.run_test(
            "Get All Products",
            "GET",
            "products",
            200
        )
        if success and isinstance(response, list):
            self.product_ids = [product['id'] for product in response if 'id' in product]
            print(f"   Found {len(self.product_ids)} products")
            
            # Test product structure
            if response:
                product = response[0]
                required_fields = ['id', 'sku', 'category', 'price', 'translations', 'image_url']
                missing_fields = [field for field in required_fields if field not in product]
                if missing_fields:
                    print(f"   ⚠️  Missing fields in product: {missing_fields}")
                else:
                    print(f"   ✅ Product structure is valid")
                    
                # Check translations
                if 'translations' in product:
                    languages = list(product['translations'].keys())
                    print(f"   Available languages: {languages}")
                    expected_langs = ['en', 'ar', 'fr']
                    missing_langs = [lang for lang in expected_langs if lang not in languages]
                    if missing_langs:
                        print(f"   ⚠️  Missing translations: {missing_langs}")
        return success

    def test_get_products_with_filters(self):
        """Test product filtering"""
        filters = [
            ("performance", {"category": "performance"}),
            ("vitality", {"category": "vitality"}),
            ("beauty", {"category": "beauty"}),
            ("featured", {"featured": "true"}),
            ("price range", {"min_price": "50", "max_price": "150"})
        ]
        
        all_passed = True
        for filter_name, params in filters:
            success, response = self.run_test(
                f"Filter Products by {filter_name}",
                "GET",
                "products",
                200,
                params=params
            )
            if not success:
                all_passed = False
            elif isinstance(response, list):
                print(f"   Found {len(response)} products with {filter_name} filter")
        
        return all_passed

    def test_get_single_product(self):
        """Test getting a single product by ID"""
        if not self.product_ids:
            print("❌ No product IDs available for single product test")
            return False
            
        product_id = self.product_ids[0]
        success, response = self.run_test(
            "Get Single Product",
            "GET",
            f"products/{product_id}",
            200
        )
        
        if success and isinstance(response, dict):
            print(f"   Product: {response.get('translations', {}).get('en', {}).get('name', 'Unknown')}")
        
        return success

    def test_get_products_by_category(self):
        """Test getting products by category endpoint"""
        categories = ["performance", "vitality", "beauty"]
        all_passed = True
        
        for category in categories:
            success, response = self.run_test(
                f"Get Products by Category: {category}",
                "GET",
                f"products/category/{category}",
                200
            )
            if not success:
                all_passed = False
            elif isinstance(response, list):
                print(f"   Found {len(response)} {category} products")
        
        return all_passed

    def test_create_cart(self):
        """Test creating a new cart"""
        success, response = self.run_test(
            "Create Cart",
            "POST",
            "cart",
            200
        )
        
        if success and isinstance(response, dict) and 'id' in response:
            self.cart_id = response['id']
            print(f"   Cart ID: {self.cart_id}")
        
        return success

    def test_get_cart(self):
        """Test getting cart by ID"""
        if not self.cart_id:
            print("❌ No cart ID available for get cart test")
            return False
            
        success, response = self.run_test(
            "Get Cart",
            "GET",
            f"cart/{self.cart_id}",
            200
        )
        
        if success and isinstance(response, dict):
            items_count = len(response.get('items', []))
            print(f"   Cart has {items_count} items")
        
        return success

    def test_add_to_cart(self):
        """Test adding items to cart"""
        if not self.cart_id:
            print("❌ No cart ID available for add to cart test")
            return False
            
        if not self.product_ids:
            print("❌ No product IDs available for add to cart test")
            return False
            
        product_id = self.product_ids[0]
        cart_item = {
            "product_id": product_id,
            "quantity": 2
        }
        
        success, response = self.run_test(
            "Add Item to Cart",
            "POST",
            f"cart/{self.cart_id}/items",
            200,
            data=cart_item
        )
        
        if success and isinstance(response, dict):
            if 'cart' in response:
                items_count = len(response['cart'].get('items', []))
                print(f"   Cart now has {items_count} items")
        
        return success

    def test_invalid_endpoints(self):
        """Test invalid endpoints return proper errors"""
        invalid_tests = [
            ("Non-existent product", "GET", "products/invalid-id", 404),
            ("Non-existent cart", "GET", "cart/invalid-id", 404),
            ("Add to non-existent cart", "POST", "cart/invalid-id/items", 404)
        ]
        
        all_passed = True
        for test_name, method, endpoint, expected_status in invalid_tests:
            success, _ = self.run_test(
                test_name,
                method,
                endpoint,
                expected_status,
                data={"product_id": "test", "quantity": 1} if method == "POST" else None
            )
            if not success:
                all_passed = False
        
        return all_passed

def main():
    print("🚀 Starting Elyvra E-commerce API Tests")
    print("=" * 50)
    
    tester = ElyvraAPITester()
    
    # Run all tests in sequence
    test_results = []
    
    # Basic API tests
    test_results.append(("Root Endpoint", tester.test_root_endpoint()))
    test_results.append(("Initialize Products", tester.test_initialize_products()))
    
    # Product tests
    test_results.append(("Get All Products", tester.test_get_all_products()))
    test_results.append(("Product Filtering", tester.test_get_products_with_filters()))
    test_results.append(("Get Single Product", tester.test_get_single_product()))
    test_results.append(("Get Products by Category", tester.test_get_products_by_category()))
    
    # Cart tests
    test_results.append(("Create Cart", tester.test_create_cart()))
    test_results.append(("Get Cart", tester.test_get_cart()))
    test_results.append(("Add to Cart", tester.test_add_to_cart()))
    
    # Error handling tests
    test_results.append(("Invalid Endpoints", tester.test_invalid_endpoints()))
    
    # Print final results
    print("\n" + "=" * 50)
    print("📊 TEST RESULTS SUMMARY")
    print("=" * 50)
    
    passed_tests = []
    failed_tests = []
    
    for test_name, result in test_results:
        if result:
            passed_tests.append(test_name)
            print(f"✅ {test_name}")
        else:
            failed_tests.append(test_name)
            print(f"❌ {test_name}")
    
    print(f"\n📈 Overall: {tester.tests_passed}/{tester.tests_run} tests passed")
    
    if failed_tests:
        print(f"\n🔴 Failed Tests ({len(failed_tests)}):")
        for test in failed_tests:
            print(f"   - {test}")
    
    if passed_tests:
        print(f"\n🟢 Passed Tests ({len(passed_tests)}):")
        for test in passed_tests:
            print(f"   - {test}")
    
    return 0 if len(failed_tests) == 0 else 1

if __name__ == "__main__":
    sys.exit(main())