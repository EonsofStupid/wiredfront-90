import { supabase } from '@/lib/supabase';
import type { AuthChangeEvent, Session, User } from '@supabase/supabase-js';
import type { LoginCredentials } from './types';

export class AuthService {
  static async login(credentials: LoginCredentials): Promise<{ user: User; session: Session }> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) throw error;
    if (!data.session) throw new Error('No session returned after login');

    return {
      user: data.user,
      session: data.session
    };
  }

  static async logout(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  static async refreshSession(): Promise<Session | null> {
    const { data, error } = await supabase.auth.refreshSession();
    if (error) throw error;
    return data.session;
  }

  static async getCurrentSession(): Promise<Session | null> {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  }

  static onAuthStateChange(callback: (session: Session | null) => void) {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, session: Session | null) => {
        callback(session);
      }
    );

    return () => subscription.unsubscribe();
  }

  static async resetPassword(email: string): Promise<void> {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) throw error;
  }

  static async updatePassword(newPassword: string): Promise<void> {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });
    if (error) throw error;
  }

  static async updateProfile(updates: {
    email?: string;
    data?: { [key: string]: any };
  }): Promise<User> {
    const { data: { user }, error } = await supabase.auth.updateUser(updates);
    if (error) throw error;
    if (!user) throw new Error('No user returned after update');
    return user;
  }
}
