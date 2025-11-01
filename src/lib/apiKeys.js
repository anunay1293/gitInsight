import { supabase, isSupabaseConfigured } from './supabase'

// Generate a random API key
export const generateApiKey = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < 16; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return 'tvly-dev-' + result
}

// Get current user ID (for demo purposes, we'll use a mock user)
const getCurrentUserId = () => {
  // In a real app, this would come from authentication
  // For now, we'll use a mock user ID
  return 'demo-user-123'
}

// API Keys CRUD Operations

// Create a new API key
export const createApiKey = async (keyData) => {
  try {
    const { name, description, type, limitUsage, usageLimit } = keyData
    
    const newKey = {
      name,
      description: description || '',
      key: generateApiKey(),
      type: type || 'dev',
      usage: 0,
      limit_usage: limitUsage || false,
      usage_limit: usageLimit || 1000,
      user_id: getCurrentUserId(),
      revoked: false,
      created_at: new Date().toISOString()
    }

    // If Supabase is not configured, return mock data
    if (!isSupabaseConfigured()) {
      return {
        success: true,
        data: { ...newKey, id: Date.now() },
        warning: 'Supabase not configured - using mock data'
      }
    }

    const { data, error } = await supabase
      .from('api_keys')
      .insert([newKey])
      .select()
      .single()

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('Error creating API key:', error)
    return { success: false, error: error.message }
  }
}

// Get all API keys for the current user
export const getApiKeys = async () => {
  try {
    // If Supabase is not configured, return mock data
    if (!isSupabaseConfigured()) {
      return {
        success: true,
        data: [
          {
            id: 1,
            name: 'Demo API Key',
            description: 'This is a demo key for testing',
            key: 'tvly-dev-demo123456789',
            type: 'dev',
            usage: 25,
            limit_usage: true,
            usage_limit: 1000,
            user_id: getCurrentUserId(),
            revoked: false,
            created_at: new Date().toISOString()
          }
        ],
        warning: 'Supabase not configured - using mock data'
      }
    }

    const { data, error } = await supabase
      .from('api_keys')
      .select('*')
      .eq('user_id', getCurrentUserId())
      .order('created_at', { ascending: false })

    if (error) throw error
    return { success: true, data: data || [] }
  } catch (error) {
    console.error('Error fetching API keys:', error)
    return { success: false, error: error.message, data: [] }
  }
}

// Update an API key
export const updateApiKey = async (id, updates) => {
  try {
    // If Supabase is not configured, return mock success
    if (!isSupabaseConfigured()) {
      return {
        success: true,
        data: { id, ...updates },
        warning: 'Supabase not configured - using mock data'
      }
    }

    const { data, error } = await supabase
      .from('api_keys')
      .update({
        name: updates.name,
        description: updates.description,
        type: updates.type,
        limit_usage: updates.limitUsage,
        usage_limit: updates.usageLimit,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('user_id', getCurrentUserId())
      .select()
      .single()

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('Error updating API key:', error)
    return { success: false, error: error.message }
  }
}

// Delete an API key
export const deleteApiKey = async (id) => {
  try {
    // If Supabase is not configured, return mock success
    if (!isSupabaseConfigured()) {
      return {
        success: true,
        warning: 'Supabase not configured - using mock data'
      }
    }

    const { error } = await supabase
      .from('api_keys')
      .delete()
      .eq('id', id)
      .eq('user_id', getCurrentUserId())

    if (error) throw error
    return { success: true }
  } catch (error) {
    console.error('Error deleting API key:', error)
    return { success: false, error: error.message }
  }
}

// Revoke an API key
export const revokeApiKey = async (id) => {
  try {
    // If Supabase is not configured, return mock success
    if (!isSupabaseConfigured()) {
      return {
        success: true,
        data: { id, revoked: true },
        warning: 'Supabase not configured - using mock data'
      }
    }

    const { data, error } = await supabase
      .from('api_keys')
      .update({
        revoked: true,
        revoked_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('user_id', getCurrentUserId())
      .select()
      .single()

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('Error revoking API key:', error)
    return { success: false, error: error.message }
  }
}

// Update API key usage (for tracking)
export const updateApiKeyUsage = async (id, usage) => {
  try {
    const { data, error } = await supabase
      .from('api_keys')
      .update({
        usage: usage,
        last_used: new Date().toISOString()
      })
      .eq('id', id)
      .eq('user_id', getCurrentUserId())
      .select()
      .single()

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('Error updating API key usage:', error)
    return { success: false, error: error.message }
  }
}
