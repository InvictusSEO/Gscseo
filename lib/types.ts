export interface User {
  name: string;
  email: string;
  avatar: string;
}

export interface Property {
  siteUrl: string;
  permissionLevel: string;
}

export interface PageMetrics {
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface PageAnalysis extends PageMetrics {
  url: string;
  status: 'Indexed' | 'Not Indexed';
  classification: 'Unknown' | 'Not Indexed' | 'Indexed & Visible' | 'Indexed but Ignored';
  explanation: string;
  actions: string[];
  topQueries: {
    query: string;
    clicks: number;
    position: number;
  }[];
}

export interface AnalyzedPage extends PageAnalysis {
  id: string;
}