import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import {   
  Search, 
  Copy, 
  ExternalLink, 
  Edit3, 
  Trash2,
  LogOut,
  ScissorsLineDashed,
  Globe,
  MousePointer,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { urlAPI } from '../../services/api';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [urls, setUrls] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUrl, setEditingUrl] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();

  useEffect(() => {
    fetchUrls();
    fetchAnalytics();
  }, []);

  const fetchUrls = async () => {
    try {
      const response = await urlAPI.getUserUrls();
      setUrls(response.data.urls);
    } catch (error) {
      console.error('Error fetching URLs:', error);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await urlAPI.getAnalytics();
      setAnalytics(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      if (editingUrl) {
        await urlAPI.updateUrl(editingUrl._id, data);
        toast.success('URL updated successfully!');
        setEditingUrl(null);
      } else {
        await urlAPI.createUrl(data);
        toast.success('URL shortened successfully!');
      }
      reset();
      fetchUrls();
      fetchAnalytics();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error processing request');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteUrl = async (id) => {
    if (window.confirm('Are you sure you want to delete this URL?')) {
      try {
        await urlAPI.deleteUrl(id);
        toast.success('URL deleted successfully!');
        fetchUrls();
        fetchAnalytics();
      } catch (error) {
        toast.error('Error deleting URL');
      }
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const filteredUrls = urls.filter(url =>
    url.originalUrl.toLowerCase().includes(searchTerm.toLowerCase()) ||
    url.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    url.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <ScissorsLineDashed className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">URL Trimmer</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <img
                  src={`https://ui-avatars.com/api/?name=${user?.name}&background=random` || user?.avatar}
                  alt={user?.name}
                  className="h-8 w-8 rounded-full"
                />
                <span className="text-sm font-medium text-gray-700">{user?.name}</span>
              </div>
              <button
                onClick={logout}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Analytics Cards */}
        {analytics && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          >
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Globe className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total URLs</p>
                  <p className="text-2xl font-bold text-gray-900">{analytics.totalUrls}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <MousePointer className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Clicks</p>
                  <p className="text-2xl font-bold text-gray-900">{analytics.totalClicks}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Avg. Clicks</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {analytics.totalUrls > 0 ? Math.round(analytics.totalClicks / analytics.totalUrls) : 0}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Create URL Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-8"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {editingUrl ? 'Edit URL' : 'Create New Short URL'}
            </h2>
            {editingUrl && (
              <button
                onClick={() => {
                  setEditingUrl(null);
                  reset();
                }}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Cancel
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Original URL *
                </label>
                <input
                  type="url"
                  {...register('originalUrl', { required: 'URL is required' })}
                  defaultValue={editingUrl?.originalUrl || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://example.com/very-long-url"
                />
                {errors.originalUrl && (
                  <p className="mt-1 text-sm text-red-600">{errors.originalUrl.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  {...register('title')}
                  defaultValue={editingUrl?.title || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Give your URL a title"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                {...register('description')}
                defaultValue={editingUrl?.description || ''}
                rows="2"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe what this URL is for"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                {...register('tags')}
                defaultValue={editingUrl?.tags?.join(', ') || ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="work, important, reference"
              />
            </div>

            <div className="flex justify-end">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {isLoading ? 'Processing...' : (editingUrl ? 'Update URL' : 'Create Short URL')}
              </motion.button>
            </div>
          </form>
        </motion.div>

        {/* URLs List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100"
        >
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
              <h2 className="text-xl font-semibold text-gray-900">Your URLs</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search URLs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {filteredUrls.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                {searchTerm ? 'No URLs found matching your search.' : 'No URLs created yet. Create your first short URL above!'}
              </div>
            ) : (
              filteredUrls.map((url) => (
                <motion.div
                  key={url._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-6 hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        {url.title && (
                          <h3 className="text-lg font-medium text-gray-900">{url.title}</h3>
                        )}
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {url.clicks} clicks
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-500 truncate mb-2">
                        {url.originalUrl}
                      </p>
                      
                      <p className="text-sm font-medium text-blue-600 mb-2">
                        {url.shortUrl}
                      </p>
                      
                      {url.description && (
                        <p className="text-sm text-gray-600 mb-2">{url.description}</p>
                      )}
                      
                      {url.tags && url.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-2">
                          {url.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      <p className="text-xs text-gray-400">
                        Created {new Date(url.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => copyToClipboard(url.shortUrl)}
                        className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                        title="Copy to clipboard"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                      
                      <a
                        href={url.shortUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                        title="Visit URL"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                      
                      <button
                        onClick={() => setEditingUrl(url)}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors duration-200"
                        title="Edit URL"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      
                      <button
                        onClick={() => deleteUrl(url._id)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors duration-200"
                        title="Delete URL"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;
