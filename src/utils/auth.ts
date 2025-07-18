// Simple client-side authentication utilities
export const authUtils = {
  hashPassword: async (password: string): Promise<string> => {
    // Simple hash using built-in crypto API
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  },

  comparePassword: async (password: string, hash: string): Promise<boolean> => {
    const hashedInput = await authUtils.hashPassword(password);
    return hashedInput === hash;
  },

  generateToken: (userId: string): string => {
    // Simple token generation
    const tokenData = {
      userId,
      timestamp: Date.now(),
      random: Math.random().toString(36)
    };
    return btoa(JSON.stringify(tokenData));
  },

  verifyToken: (token: string): any => {
    try {
      const decoded = JSON.parse(atob(token));
      // Check if token is less than 24 hours old
      const isValid = (Date.now() - decoded.timestamp) < (24 * 60 * 60 * 1000);
      return isValid ? decoded : null;
    } catch (error) {
      return null;
    }
  }
};