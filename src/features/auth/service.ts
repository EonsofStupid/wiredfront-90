import type { AuthChangeEvent, Session, User } from '@supabase/supabase-js';
import { AuthApiClient } from './api/client';
import type { LoginCredentials } from './types';

export class AuthService {
  private static apiClient = new AuthApiClient();

  static async login(credentials: LoginCredentials): Promise<{ user: User; session: Session }> {
    return this.apiClient.signIn(credentials);
  }

  static async logout(): Promise<void> {
    return this.apiClient.signOut();
  }

  static async refreshSession(): Promise<Session | null> {
    return this.apiClient.refreshSession();
  }

  static async getCurrentSession(): Promise<Session | null> {
    return this.apiClient.getSession();
  }

  static onAuthStateChange(callback: (session: Session | null) => void) {
    const { data: { subscription } } = this.apiClient.onAuthStateChange(
      (_event: AuthChangeEvent, session: Session | null) => {
        callback(session);
      }
    );

    return () => subscription.unsubscribe();
  }

  static async resetPassword(email: string): Promise<void> {
    return this.apiClient.resetPassword(email);
  }

  static async updatePassword(newPassword: string): Promise<void> {
    return this.apiClient.updatePassword(newPassword);
  }

  static async updateProfile(updates: {
    email?: string;
    data?: { [key: string]: any };
  }): Promise<User> {
    return this.apiClient.updateProfile(updates);
  }
}
