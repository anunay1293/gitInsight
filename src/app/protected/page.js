'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Sidebar from '../../components/dashboard/Sidebar';
import { useToast, ToastContainer } from '../../components/Toast';

export default function ProtectedPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [apiKey, setApiKey] = useState('');
  const [validating, setValidating] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const { toasts, removeToast, showSuccess, showError } = useToast();

  const validateApiKey = useCallback(async (key) => {
    setValidating(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Validate API key format
      // API keys start with 'tvly-dev-' followed by 16 random characters
      const apiKeyPattern = /^tvly-dev-[A-Za-z0-9]{16}$/;
      
      if (apiKeyPattern.test(key)) {
        setIsValid(true);
        showSuccess('Valid API Key /protected can be accessed');
      } else {
        setIsValid(false);
        showError('invalid API key');
      }
    } catch (error) {
      setIsValid(false);
      showError('invalid API key');
    } finally {
      setValidating(false);
    }
  }, [showSuccess, showError]);

  useEffect(() => {
    const key = searchParams.get('key');
    
    if (!key) {
      // No API key in query params, redirect to playground
      router.push('/playground');
      return;
    }

    setApiKey(key);
    validateApiKey(key);
  }, [searchParams, router, validateApiKey]);

  if (!apiKey || validating) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-100 via-white to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Validating API key...</p>
        </div>
      </div>
    );
  }

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
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">Pages · Protected</p>
                  <h1 className="text-2xl font-bold text-gray-900">Protected Resource</h1>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href="/playground"
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to Playground
                </Link>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1">
            <div className="mx-auto w-full max-w-4xl px-6 py-12">
              {isValid ? (
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-8">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                        <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-green-900 mb-2">Access Granted</h2>
                      <p className="text-green-700 mb-6">
                        Your API key has been validated successfully. You now have access to protected resources.
                      </p>
                      
                      <div className="bg-white rounded-lg p-6 border border-green-200 mb-6">
                        <h3 className="text-sm font-semibold text-gray-900 mb-4">Protected Content</h3>
                        <div className="space-y-4">
                          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                            <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            <div>
                              <p className="font-medium text-gray-900">API Endpoints</p>
                              <p className="text-sm text-gray-600">Access to all available endpoints</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                            <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                            <div>
                              <p className="font-medium text-gray-900">Analytics Dashboard</p>
                              <p className="text-sm text-gray-600">View usage statistics and metrics</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                            <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            <div>
                              <p className="font-medium text-gray-900">Premium Features</p>
                              <p className="text-sm text-gray-600">Unlock advanced functionality</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-sm text-blue-800">
                          <strong>Next Steps:</strong> Explore the dashboard or check out the documentation to get started with our API.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gradient-to-br from-red-50 to-rose-50 border border-red-200 rounded-xl p-8">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                        <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-red-900 mb-2">Access Denied</h2>
                      <p className="text-red-700 mb-6">
                        The API key you provided is not valid. Please check your key and try again.
                      </p>
                      
                      <div className="bg-white rounded-lg p-6 border border-red-200 mb-6">
                        <h3 className="text-sm font-semibold text-gray-900 mb-4">What you can do:</h3>
                        <div className="space-y-3">
                          <div className="flex items-start gap-3">
                            <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <div>
                              <p className="font-medium text-gray-900">Verify your API key</p>
                              <p className="text-sm text-gray-600">Make sure you copied the complete API key without any extra spaces</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            <div>
                              <p className="font-medium text-gray-900">Create a new API key</p>
                              <p className="text-sm text-gray-600">Generate a fresh API key from your dashboard</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                            <div>
                              <p className="font-medium text-gray-900">Check your account status</p>
                              <p className="text-sm text-gray-600">Ensure your account is active and subscription is valid</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Link
                          href="/playground"
                          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                        >
                          Try Again
                        </Link>
                        <Link
                          href="/dashboards"
                          className="px-6 py-3 bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 font-medium rounded-lg transition-colors"
                        >
                          Go to Dashboard
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
}

