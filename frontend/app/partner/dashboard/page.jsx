'use client';

import React, { useState, useEffect } from 'react';
import HeaderWrapper from '@/components/HeaderWrapper';
import Footer from '@/components/Footer';
import { useAuth } from '@/hooks/useAuth';
import { productsApi, ordersApi } from '@/services/api';
import {
  Store,
  Package,
  ShoppingBag,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  Truck,
  AlertCircle,
  RefreshCw,
  Search,
  Tag
} from 'lucide-react';
import Link from 'next/link';

export default function ShopkeeperDashboardPage() {
  const { user, loading: authLoading } = useAuth();

  const [activeTab, setActiveTab] = useState('products'); // 'products' | 'orders' | 'profile'
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Search & Filter
  const [productSearch, setProductSearch] = useState('');

  // Modal State for Add/Edit Product
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: 'Vegetables',
    price: '',
    originalPrice: '',
    discount: '',
    image: '',
    stock: 100,
    unit: '1 item',
    description: '',
    storeName: ''
  });
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Fetch Merchant Products
  const fetchMerchantProducts = async () => {
    setLoadingProducts(true);
    try {
      const data = await productsApi.getMerchantProducts();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load merchant products:', err);
    } finally {
      setLoadingProducts(false);
    }
  };

  // Fetch Store Orders
  const fetchStoreOrders = async () => {
    setLoadingOrders(true);
    try {
      const data = await ordersApi.getStoreOrders();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load store orders:', err);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    if (user && (user.role === 'shopkeeper' || user.role === 'admin')) {
      fetchMerchantProducts();
      fetchStoreOrders();
    }
  }, [user]);

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      category: 'Vegetables',
      price: '',
      originalPrice: '',
      discount: '0',
      image: '',
      stock: 100,
      unit: '1 item',
      description: 'Fresh and high quality local produce.',
      storeName: user?.name ? `${user.name}'s Kirana Store` : ''
    });
    setFormError('');
    setShowProductModal(true);
  };

  const handleOpenEditModal = (prod) => {
    setEditingProduct(prod);
    setFormData({
      name: prod.name || '',
      category: prod.category || 'Vegetables',
      price: prod.price || '',
      originalPrice: prod.originalPrice || prod.price || '',
      discount: prod.discount || '0',
      image: prod.image || '',
      stock: prod.stock !== undefined ? prod.stock : 100,
      unit: prod.unit || '1 item',
      description: prod.description || '',
      storeName: prod.storeName || ''
    });
    setFormError('');
    setShowProductModal(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);

    try {
      if (editingProduct) {
        await productsApi.update(editingProduct._id, formData);
      } else {
        await productsApi.create(formData);
      }

      setShowProductModal(false);
      fetchMerchantProducts();
    } catch (err) {
      setFormError(err.message || 'Failed to save product');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productsApi.delete(id);
        fetchMerchantProducts();
      } catch (err) {
        alert(err.message || 'Failed to delete product');
      }
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await ordersApi.updateStatus(orderId, newStatus);
      fetchStoreOrders();
    } catch (err) {
      alert(err.message || 'Failed to update order status');
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <RefreshCw className="animate-spin text-emerald-400" size={32} />
      </div>
    );
  }

  // Restrict access if not logged in as shopkeeper or admin
  if (!user || (user.role !== 'shopkeeper' && user.role !== 'admin')) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex flex-col justify-between font-sans">
        <HeaderWrapper />
        <main className="max-w-md w-full mx-auto px-4 py-16 text-center">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-gray-200 dark:border-slate-800 shadow-xl">
            <Store size={48} className="mx-auto text-emerald-600 mb-4" />
            <h1 className="text-xl font-black text-slate-900 dark:text-white mb-2">Merchant Access Required</h1>
            <p className="text-xs text-slate-500 mb-6 font-medium">
              Please sign in with a registered Shopkeeper or Merchant account to access the Shopkeeper Control Panel.
            </p>
            <Link
              href="/partner/login"
              className="inline-block w-full bg-[#0e3e26] hover:bg-emerald-800 text-white font-black py-3 rounded-2xl text-xs uppercase tracking-wider transition"
            >
              Partner Sign In
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.category.toLowerCase().includes(productSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 flex flex-col font-sans">
      <HeaderWrapper />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 md:px-6 py-8">
        {/* Merchant Dashboard Header */}
        <div className="bg-gradient-to-r from-[#0e3e26] via-[#124d30] to-[#072415] text-white rounded-3xl p-6 md:p-8 shadow-xl mb-8 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 text-xs font-black uppercase tracking-wider px-3.5 py-1 rounded-full mb-3">
              <Store size={14} /> Shopkeeper Merchant Dashboard
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight">
              Welcome back, {user.name}!
            </h1>
            <p className="text-xs text-emerald-100/90 font-medium mt-1">
              Manage inventory, prices, and instantly fulfill live customer orders.
            </p>
          </div>

          <div className="flex items-center gap-3 relative z-10">
            <button
              onClick={handleOpenAddModal}
              className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-black text-xs uppercase tracking-wider px-5 py-3 rounded-2xl shadow-lg transition cursor-pointer"
            >
              <Plus size={16} /> Add New Product
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-3 border-b border-gray-200 dark:border-slate-800 mb-6 pb-2">
          <button
            onClick={() => setActiveTab('products')}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl font-extrabold text-xs tracking-wider transition ${
              activeTab === 'products'
                ? 'bg-[#0e3e26] text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-900'
            }`}
          >
            <Package size={16} /> My Store Products ({products.length})
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl font-extrabold text-xs tracking-wider transition ${
              activeTab === 'orders'
                ? 'bg-[#0e3e26] text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-900'
            }`}
          >
            <ShoppingBag size={16} /> Live Customer Orders ({orders.length})
          </button>
        </div>

        {/* TAB 1: PRODUCTS MANAGEMENT */}
        {activeTab === 'products' && (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="relative w-full md:w-80">
                <Search size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search products by name..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl text-xs text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
                />
              </div>

              <button
                onClick={fetchMerchantProducts}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition"
              >
                <RefreshCw size={14} className={loadingProducts ? 'animate-spin' : ''} /> Refresh Catalog
              </button>
            </div>

            {loadingProducts ? (
              <div className="py-16 text-center text-slate-500">
                <RefreshCw className="animate-spin mx-auto mb-2 text-emerald-600" size={28} />
                <p className="text-xs font-bold">Syncing catalog with MongoDB backend...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-10 border border-gray-100 dark:border-slate-800 text-center shadow-sm">
                <Package size={40} className="mx-auto text-slate-400 mb-3" />
                <h3 className="text-base font-black text-slate-800 dark:text-white mb-1">No Products Found</h3>
                <p className="text-xs text-slate-500 font-medium mb-6">
                  You have not added any products yet. Products you add here immediately become available to local customers!
                </p>
                <button
                  onClick={handleOpenAddModal}
                  className="inline-flex items-center gap-2 bg-[#0e3e26] text-white text-xs font-black px-5 py-3 rounded-2xl shadow-md uppercase tracking-wider"
                >
                  <Plus size={16} /> Add Your First Product
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredProducts.map((p) => (
                  <div
                    key={p._id}
                    className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-md transition overflow-hidden flex flex-col justify-between"
                  >
                    <div className="p-5 flex flex-col gap-3">
                      <div className="flex items-start gap-4">
                        <img
                          src={p.image || 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?q=80&w=200'}
                          alt={p.name}
                          className="w-20 h-20 rounded-2xl object-cover border border-gray-100 dark:border-slate-800 flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0 text-left">
                          <span className="inline-block bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full mb-1">
                            {p.category}
                          </span>
                          <h4 className="text-sm font-black text-slate-900 dark:text-white truncate">
                            {p.name}
                          </h4>
                          <p className="text-xs font-black text-emerald-600 dark:text-emerald-400 mt-1">
                            ₹{p.price}{' '}
                            {p.originalPrice && p.originalPrice > p.price && (
                              <span className="text-[10px] text-slate-400 line-through font-normal ml-1">
                                ₹{p.originalPrice}
                              </span>
                            )}
                          </p>
                          <p className="text-[10px] text-slate-500 font-semibold mt-0.5">
                            Stock: {p.stock} | Unit: {p.unit}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-slate-850 px-5 py-3 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between">
                      <button
                        onClick={() => handleOpenEditModal(p)}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-emerald-600 transition cursor-pointer"
                      >
                        <Edit size={14} /> Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(p._id)}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:text-rose-700 transition cursor-pointer"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: LIVE STORE ORDERS */}
        {activeTab === 'orders' && (
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <ShoppingBag size={18} className="text-emerald-600" /> Incoming Customer Orders
              </h2>
              <button
                onClick={fetchStoreOrders}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-emerald-600 transition"
              >
                <RefreshCw size={14} className={loadingOrders ? 'animate-spin' : ''} /> Refresh Orders
              </button>
            </div>

            {loadingOrders ? (
              <div className="py-16 text-center text-slate-500">
                <RefreshCw className="animate-spin mx-auto mb-2 text-emerald-600" size={28} />
                <p className="text-xs font-bold">Fetching store order stream...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-10 border border-gray-100 dark:border-slate-800 text-center shadow-sm">
                <ShoppingBag size={40} className="mx-auto text-slate-400 mb-3" />
                <h3 className="text-base font-black text-slate-800 dark:text-white mb-1">No Orders Yet</h3>
                <p className="text-xs text-slate-500 font-medium">
                  When local customers place orders from your store, they will automatically appear here in real time.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {orders.map((ord) => (
                  <div
                    key={ord._id}
                    className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col gap-4 text-left"
                  >
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-gray-100 dark:border-slate-800 pb-4 gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-slate-900 dark:text-white">
                            Order #{ord._id.substring(ord._id.length - 8).toUpperCase()}
                          </span>
                          <span className="text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 px-2.5 py-0.5 rounded-full">
                            {ord.paymentMethod}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1 font-medium">
                          Customer: {ord.user?.name || 'Local Customer'} ({ord.user?.phone || 'N/A'})
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <label className="text-[10px] font-black uppercase text-slate-400">Order Status:</label>
                        <select
                          value={ord.deliveryStatus}
                          onChange={(e) => handleUpdateOrderStatus(ord._id, e.target.value)}
                          className="bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-xs font-bold px-3 py-1.5 rounded-xl text-slate-800 dark:text-white focus:ring-2 focus:ring-emerald-500"
                        >
                          <option value="Placed">Placed</option>
                          <option value="Processing">Processing</option>
                          <option value="Out for Delivery">Out for Delivery</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="flex flex-col gap-2">
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Ordered Items:</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {ord.orderItems?.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-3 bg-gray-50 dark:bg-slate-800 p-2.5 rounded-2xl">
                            <img src={item.image} alt={item.name} className="w-10 h-10 rounded-xl object-cover" />
                            <div className="text-left">
                              <p className="text-xs font-bold text-slate-900 dark:text-white">{item.name}</p>
                              <p className="text-[10px] text-slate-500">Qty: {item.qty} × ₹{item.price}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-gray-100 dark:border-slate-800 pt-3 text-xs">
                      <span className="text-slate-500 font-medium">Address: {ord.deliveryAddress}</span>
                      <span className="font-black text-slate-900 dark:text-white text-sm">Total: ₹{ord.totalPrice}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* ADD / EDIT PRODUCT MODAL */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl p-6 md:p-8 border border-gray-100 dark:border-slate-800 shadow-2xl max-h-[90vh] overflow-y-auto text-left">
            <h3 className="text-lg font-black text-slate-900 dark:text-white mb-4">
              {editingProduct ? 'Edit Product Details' : 'Add New Product to Catalog'}
            </h3>

            {formError && (
              <div className="bg-rose-50 dark:bg-rose-950/40 text-rose-600 text-xs font-bold p-3 rounded-2xl mb-4">
                {formError}
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Product Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Fresh Organic Tomatoes"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full mt-1 px-4 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl text-xs text-slate-800 dark:text-white focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full mt-1 px-4 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl text-xs text-slate-800 dark:text-white focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Vegetables">Vegetables</option>
                    <option value="Fruits">Fruits</option>
                    <option value="Dairy & Eggs">Dairy & Eggs</option>
                    <option value="Meat & Fish">Meat & Fish</option>
                    <option value="Fresh Bread">Fresh Bread</option>
                    <option value="Snacks">Snacks</option>
                    <option value="Beverages">Beverages</option>
                    <option value="Personal Care">Personal Care</option>
                    <option value="Home Care">Home Care</option>
                    <option value="Organics">Organics</option>
                    <option value="Cloth">Cloth</option>
                    <option value="Electronic">Electronic</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Unit / Quantity</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 1 kg or 500g"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full mt-1 px-4 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl text-xs text-slate-800 dark:text-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Price (₹)</label>
                  <input
                    type="number"
                    required
                    placeholder="40"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full mt-1 px-4 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl text-xs text-slate-800 dark:text-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Original Price (₹)</label>
                  <input
                    type="number"
                    placeholder="50"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                    className="w-full mt-1 px-4 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl text-xs text-slate-800 dark:text-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Stock Qty</label>
                  <input
                    type="number"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full mt-1 px-4 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl text-xs text-slate-800 dark:text-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Image URL</label>
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/..."
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full mt-1 px-4 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl text-xs text-slate-800 dark:text-white focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full mt-1 px-4 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl text-xs text-slate-800 dark:text-white focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="px-5 py-2.5 rounded-2xl text-xs font-bold text-slate-500 hover:bg-gray-100 dark:hover:bg-slate-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider bg-[#0e3e26] hover:bg-emerald-800 text-white transition shadow-md"
                >
                  {submitting ? 'Saving...' : editingProduct ? 'Update Product' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
