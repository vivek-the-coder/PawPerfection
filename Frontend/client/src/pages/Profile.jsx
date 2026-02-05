import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import PaymentHistory from "../components/payment/PaymentHistory";
import { PaidCourses } from '../components/paidCourses/PaidCourses';
import LoadingSpinner from "../components/common/LoadingSpinner";
import { logout } from '../features/auth/loginSlice'; // Importing logout action correctly

export const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('profile');

  const { user, loading } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      navigate('/login');
    } catch (error) {
      console.error("Logout failed", error);
      // Force navigation even if API fail
      navigate('/login');
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-white">
          <LoadingSpinner size="lg" />
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen py-8 mt-12 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 bg-sky-500 rounded-full flex items-center justify-center shadow-lg border-4 border-sky-50">
                <span className="text-white text-2xl font-bold">
                  {user?.name?.charAt(0)?.toUpperCase() ||
                    user?.email?.charAt(0)?.toUpperCase() ||
                    'U'}
                </span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                  {user?.name || user?.email?.split('@')[0] || 'U'}
                </h1>
                <p className="text-lg text-gray-500 font-medium">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 mb-8 overflow-hidden">
            <div className="border-b border-gray-100">
              <nav className="flex space-x-8 px-8">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`py-4 px-2 border-b-2 font-bold text-sm transition-colors ${
                    activeTab === 'profile'
                      ? 'border-sky-500 text-sky-600'
                      : 'border-transparent text-gray-400 hover:text-gray-600 hover:border-gray-200'
                  }`}
                >
                  Profile Information
                </button>
                <button
                  onClick={() => setActiveTab('payments')}
                  className={`py-4 px-2 border-b-2 font-bold text-sm transition-colors ${
                    activeTab === 'payments'
                      ? 'border-sky-500 text-sky-600'
                      : 'border-transparent text-gray-400 hover:text-gray-600 hover:border-gray-200'
                  }`}
                >
                  Payment History
                </button>
                <button
                  onClick={() => setActiveTab('purchases')}
                  className={`py-4 px-2 border-b-2 font-bold text-sm transition-colors ${
                    activeTab === 'purchases'
                      ? 'border-sky-500 text-sky-600'
                      : 'border-transparent text-gray-400 hover:text-gray-600 hover:border-gray-200'
                  }`}
                >
                  Purchases
                </button>
              </nav>
            </div>

            <div className="p-8">
              {activeTab === 'profile' && (
                <div className="space-y-8">
                  <h2 className="text-2xl font-bold text-gray-900">Profile Information</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-2">
                        Full Name
                      </label>
                      <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-gray-700 font-medium">
                        {user?.name || user?.email?.split('@')[0] || 'Not provided'}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-2">
                        Email Address
                      </label>
                      <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-gray-700 font-medium">
                        {user?.email}
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-4 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => navigate('/course')}
                      className="bg-gray-900 text-white px-8 py-3 rounded-xl hover:bg-black transition-all shadow-md hover:shadow-lg font-bold transform hover:-translate-y-0.5"
                    >
                      Browse Courses
                    </button>
                    <button
                      onClick={handleLogout}
                      className="bg-gray-100 text-gray-600 px-8 py-3 rounded-xl hover:bg-gray-200 hover:text-gray-900 transition-colors font-bold"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'payments' && <PaymentHistory />}

              {activeTab === 'purchases' && <PaidCourses />}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};
