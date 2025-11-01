'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  getApiKeys, 
  createApiKey, 
  updateApiKey, 
  deleteApiKey, 
  revokeApiKey 
} from '../../lib/apiKeys';
import { useToast, ToastContainer } from '../Toast';
import Sidebar from './Sidebar';

export default function DashboardClient() {
  const [apiKeys, setApiKeys] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingKey, setEditingKey] = useState(null);
  const [showKey, setShowKey] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'dev',
    limitUsage: false,
    usageLimit: 1000
  });

  // Toast notifications
  const { toasts, removeToast, showSuccess, showError, showWarning } = useToast();

  // Load API keys from Supabase on component mount
  useEffect(() => {
    loadApiKeys();
  }, []);

  const loadApiKeys = async () => {
    setLoading(true);
    setError(null);
    
    const result = await getApiKeys();
    
    if (result.success) {
      setApiKeys(result.data);
    } else {
      setError(result.error);
      console.error('Failed to load API keys:', result.error);
    }
    
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingKey) {
        // Update existing key
        const result = await updateApiKey(editingKey.id, formData);
        
        if (result.success) {
          await loadApiKeys(); // Refresh the list
          setIsModalOpen(false);
          setEditingKey(null);
          setFormData({ name: '', description: '', type: 'dev', limitUsage: false, usageLimit: 1000 });
          showSuccess('API key updated successfully!');
        } else {
          setError(result.error);
          showError(`Failed to update API key: ${result.error}`);
        }
      } else {
        // Create new key
        const result = await createApiKey(formData);
        
        if (result.success) {
          await loadApiKeys(); // Refresh the list
          setIsModalOpen(false);
          setFormData({ name: '', description: '', type: 'dev', limitUsage: false, usageLimit: 1000 });
          showSuccess('API key created successfully!');
        } else {
          setError(result.error);
          showError(`Failed to create API key: ${result.error}`);
        }
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setError('An unexpected error occurred');
      showError('An unexpected error occurred');
    }
  };

  const handleEdit = (key) => {
    setEditingKey(key);
    setFormData({
      name: key.name,
      description: key.description || '',
      type: key.type,
      limitUsage: key.limit_usage || false,
      usageLimit: key.usage_limit || 1000
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this API key?')) {
      try {
        const result = await deleteApiKey(id);
        
        if (result.success) {
          await loadApiKeys(); // Refresh the list
          showSuccess('API key deleted successfully!');
        } else {
          setError(result.error);
          showError(`Failed to delete API key: ${result.error}`);
        }
      } catch (error) {
        console.error('Error deleting API key:', error);
        setError('Failed to delete API key');
        showError('Failed to delete API key');
      }
    }
  };

  const handleRevoke = async (id) => {
    if (confirm('Are you sure you want to revoke this API key?')) {
      try {
        const result = await revokeApiKey(id);
        
        if (result.success) {
          await loadApiKeys(); // Refresh the list
          showWarning('API key revoked successfully!');
        } else {
          setError(result.error);
          showError(`Failed to revoke API key: ${result.error}`);
        }
      } catch (error) {
        console.error('Error revoking API key:', error);
        setError('Failed to revoke API key');
        showError('Failed to revoke API key');
      }
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    showSuccess('API key copied to clipboard!');
  };

  const toggleKeyVisibility = (id) => {
    setShowKey(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const maskKey = (key) => {
    return key.substring(0, 8) + '****************';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 via-white to-gray-100">
      <div className="flex min-h-screen">
        <Sidebar active="overview" isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="border-b border-gray-200 bg-white/80 backdrop-blur">
              <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-6 lg:flex-nowrap">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="text-gray-500 transition hover:text-gray-700 lg:hidden"
                    aria-label="Toggle sidebar"
                  >
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {sidebarOpen ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                      )}
                    </svg>
                  </button>
                  <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="hidden text-gray-500 transition hover:text-gray-700 lg:block"
                    aria-label="Toggle sidebar"
                  >
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                  <Link
                    href="/"
                    className="text-gray-500 transition hover:text-gray-700"
                  >
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                  </Link>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">Pages · Overview</p>
                    <h1 className="text-2xl font-bold text-gray-900">Overview</h1>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1 text-sm font-medium text-gray-600 shadow-sm">
                    <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                    Operational
                  </div>
                  <button className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 transition hover:text-gray-700">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                  </button>
                  <button className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 transition hover:text-gray-700">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                    </svg>
                  </button>
                </div>
              </div>
            </header>

            {/* Main Content */}
        <main className="flex-1">
          <div className="mx-auto w-full max-w-6xl px-6 py-8">
        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
                <div className="mt-4">
                  <button
                    onClick={() => setError(null)}
                    className="bg-red-50 px-2 py-1.5 rounded-md text-sm font-medium text-red-800 hover:bg-red-100"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading API keys...</span>
          </div>
        )}

        {!loading && (
          <div className="space-y-8">
          {/* Current Plan Section */}
          <div className="bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 rounded-xl p-8 text-white">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-sm font-medium text-white/80 mb-2">CURRENT PLAN</div>
                <h2 className="text-3xl font-bold mb-6">Researcher</h2>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm">API Usage</span>
                  </div>
                  <div className="text-sm">Monthly plan</div>
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm">Pay as you go</span>
                    <div className="w-8 h-4 bg-white/20 rounded-full p-0.5">
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end space-y-4">
                <button className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z" />
                  </svg>
                  <span>Manage Plan</span>
                </button>
                <div className="text-right">
                  <div className="text-sm mb-1">0/1,000 Credits</div>
                  <div className="w-32 h-2 bg-white/20 rounded-full">
                    <div className="w-1 h-2 bg-white rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* API Keys Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                  API Keys
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  The key is used to authenticate your requests to the{' '}
                  <a href="#" className="text-blue-600 underline">Research API</a>. To learn more, see the{' '}
                  <a href="#" className="text-blue-600 underline">documentation page</a>.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Add Key</span>
              </button>
            </div>

            {/* API Keys Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NAME</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TYPE</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">USAGE</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">KEY</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">OPTIONS</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {apiKeys.map((key) => (
                    <tr key={key.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {key.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {key.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {key.usage || 0}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                        {showKey[key.id] ? key.key : maskKey(key.key)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => toggleKeyVisibility(key.id)}
                            className="text-gray-400 hover:text-gray-600"
                            title="View key"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => copyToClipboard(key.key)}
                            className="text-gray-400 hover:text-gray-600"
                            title="Copy key"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleEdit(key)}
                            className="text-gray-400 hover:text-gray-600"
                            title="Edit key"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          {!key.revoked && (
                            <button
                              onClick={() => handleRevoke(key.id)}
                              className="text-gray-400 hover:text-orange-600"
                              title="Revoke key"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
                              </svg>
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(key.id)}
                            className="text-gray-400 hover:text-red-600"
                            title="Delete key"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        )}
          </div>
      </main>
      </div>
      </div>

    {/* Modal */}
    {isModalOpen && (
      <div className="fixed inset-0 z-50 h-full w-full overflow-y-auto bg-gray-600 bg-opacity-50">
        <div className="relative top-20 mx-auto w-full max-w-md rounded-lg border bg-white p-6 shadow-lg">
          <div className="mt-3">
            <h3 className="mb-2 text-xl font-semibold text-gray-900">
              Create a new API key
            </h3>
            <p className="mb-6 text-sm text-gray-600">
              Enter a name and limit for the new API key.
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Key Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Key Name — A unique name to identify this key
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Key Name"
                  />
                </div>

                {/* Key Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Key Type — Choose the environment for this key
                  </label>
                  <div className="space-y-3">
                    {/* Development Option */}
                    <div 
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        formData.type === 'dev' 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setFormData({ ...formData, type: 'dev' })}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          formData.type === 'dev' 
                            ? 'border-blue-500 bg-blue-500' 
                            : 'border-gray-300'
                        }`}>
                          {formData.type === 'dev' && (
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                            </svg>
                            <span className={`font-medium ${
                              formData.type === 'dev' ? 'text-gray-900' : 'text-gray-500'
                            }`}>
                              Development
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            Rate limited to 100 requests/minute
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Production Option */}
                    <div 
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        formData.type === 'prod' 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setFormData({ ...formData, type: 'prod' })}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          formData.type === 'prod' 
                            ? 'border-blue-500 bg-blue-500' 
                            : 'border-gray-300'
                        }`}>
                          {formData.type === 'prod' && (
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            <span className={`font-medium ${
                              formData.type === 'prod' ? 'text-gray-900' : 'text-gray-500'
                            }`}>
                              Production
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            Rate limited to 1,000 requests/minute
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Monthly Usage Limit */}
                <div>
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="limitUsage"
                      checked={formData.limitUsage}
                      onChange={(e) => setFormData({ ...formData, limitUsage: e.target.checked })}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="limitUsage" className="text-sm font-medium text-gray-700">
                      Limit monthly usage*
                    </label>
                  </div>
                  {formData.limitUsage && (
                    <div className="mt-3">
                      <input
                        type="number"
                        value={formData.usageLimit}
                        onChange={(e) => setFormData({ ...formData, usageLimit: parseInt(e.target.value) || 1000 })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="1000"
                        min="1"
                      />
                    </div>
                  )}
                </div>

                {/* Disclaimer */}
                <div className="text-xs text-gray-600">
                  <p>
                    * If the combined usage of all your keys exceeds your account's allocated usage limit (plan, add-ons, and any pay-as-you-go limit), all requests will be rejected.
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setEditingKey(null);
                      setFormData({ name: '', description: '', type: 'dev', limitUsage: false, usageLimit: 1000 });
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                  >
                    Create
                  </button>
                </div>
            </form>
          </div>
        </div>
      </div>
    )}

    {/* Toast Notifications */}
    <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
);
}