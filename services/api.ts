import { Property, User } from "../lib/types";

export class ApiService {
  baseUrl: string;

  constructor() { 
    this.baseUrl = window.location.origin; 
  }

  async getMe(): Promise<User | null> { 
    try { 
      const res = await fetch(`${this.baseUrl}/auth/me`, { credentials: 'include' }); 
      
      if (!res.ok) return null;
      
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        // This likely means the backend functions aren't running
        return null;
      }

      const data = await res.json();
      return data.user || null;
    } catch (e) { 
      console.warn("Backend not detected or session inactive:", e);
      return null; 
    } 
  }

  async getProperties(): Promise<Property[]> { 
    try { 
      const res = await fetch(`${this.baseUrl}/api/properties`, { credentials: 'include' }); 
      if (!res.ok) return [];
      
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) return [];

      return await res.json(); 
    } catch { 
      return []; 
    } 
  }
  
  async analyzeSite(siteUrl: string, sitemapUrl: string): Promise<any[]> {
      const res = await fetch(`${this.baseUrl}/api/analyze`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ siteUrl, sitemapUrl })
      });
      if (!res.ok) {
          const err = await res.text();
          throw new Error(err || "Analysis failed");
      }
      return await res.json();
  }

  async logout(): Promise<void> {
    try {
       await fetch(`${this.baseUrl}/auth/logout`, { method: 'POST', credentials: 'include' });
    } catch(e) { 
      console.error("Logout error:", e); 
    }
  }
}

export const MOCK_PROPERTIES: Property[] = [
  { siteUrl: 'https://example-saas.com', permissionLevel: 'siteOwner' },
  { siteUrl: 'https://growth-blog.io', permissionLevel: 'siteFullUser' },
];

export const mockAuth = async (): Promise<{user: User, properties: Property[]}> => 
  new Promise(r => setTimeout(() => r({
    user: { name: "Demo User", email: "demo@visibility.ai", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" },
    properties: MOCK_PROPERTIES
  }), 800));