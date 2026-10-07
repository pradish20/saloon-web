import { isSupabaseConfigured, supabase } from '../lib/supabase';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'admin';
}

const LOCAL_ADMIN_KEY = 'aura_salon_admin_session';
const DEFAULT_LOCAL_ADMIN = {
  email: 'admin@aurasalon.in',
  password: 'AuraAdmin2026!',
  name: 'Salon Manager (Trichy)',
};

export const authService = {
  isSupabaseActive(): boolean {
    return isSupabaseConfigured();
  },

  getDefaultCredentials() {
    return {
      email: DEFAULT_LOCAL_ADMIN.email,
      password: DEFAULT_LOCAL_ADMIN.password,
    };
  },

  async getCurrentUser(): Promise<AdminUser | null> {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session && session.user) {
          return {
            id: session.user.id,
            email: session.user.email || 'admin@aurasalon.in',
            name: session.user.user_metadata?.full_name || 'Salon Admin',
            role: 'admin',
          };
        }
      } catch (err) {
        console.warn('Supabase auth getSession check error:', err);
      }
    }

    // Check local session
    try {
      const raw = sessionStorage.getItem(LOCAL_ADMIN_KEY);
      if (raw) {
        return JSON.parse(raw) as AdminUser;
      }
    } catch {
      // ignore
    }
    return null;
  },

  async login(email: string, password: string): Promise<{ user: AdminUser | null; error: string | null }> {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          return { user: null, error: error.message };
        }

        if (data.user) {
          const adminUser: AdminUser = {
            id: data.user.id,
            email: data.user.email || email,
            name: data.user.user_metadata?.full_name || 'Salon Administrator',
            role: 'admin',
          };
          return { user: adminUser, error: null };
        }
      } catch (err) {
        return {
          user: null,
          error: err instanceof Error ? err.message : 'Authentication failed with Supabase.',
        };
      }
    }

    // Local admin verification
    if (
      email.trim().toLowerCase() === DEFAULT_LOCAL_ADMIN.email.toLowerCase() &&
      password === DEFAULT_LOCAL_ADMIN.password
    ) {
      const adminUser: AdminUser = {
        id: 'admin-local-1',
        email: DEFAULT_LOCAL_ADMIN.email,
        name: DEFAULT_LOCAL_ADMIN.name,
        role: 'admin',
      };
      sessionStorage.setItem(LOCAL_ADMIN_KEY, JSON.stringify(adminUser));
      return { user: adminUser, error: null };
    }

    return {
      user: null,
      error: 'Invalid email or password. Use the provided administrator credentials.',
    };
  },

  async logout(): Promise<void> {
    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn('Supabase signOut error:', err);
      }
    }
    sessionStorage.removeItem(LOCAL_ADMIN_KEY);
  },
};
