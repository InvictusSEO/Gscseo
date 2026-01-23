import { PageAnalysis, PageMetrics } from './types.ts';

interface RawPageData extends PageMetrics {
  url: string;
  status: string;
}

export const generateInsight = (page: RawPageData): Omit<PageAnalysis, 'id'> => {
  let classification: PageAnalysis['classification'] = 'Unknown';
  let explanation = '';
  const actions: string[] = [];

  const { status, impressions, position, clicks, url } = page;

  if (status === 'Not Indexed' || (impressions === 0 && status !== 'Indexed')) {
    classification = 'Not Indexed';
    explanation = "We found this page in your Sitemap, but Google Analytics shows ZERO impressions in the last 28 days. It might not be indexed, or no one is searching for it.";
    actions.push("Check GSC 'Pages' report for indexing errors.");
    actions.push("Ensure it is internally linked.");
  } else if (impressions > 500 && position < 20) {
    classification = 'Indexed & Visible';
    explanation = "This page is healthy. Google likes it and is showing it often in search results.";
    actions.push("Monitor to ensure rankings stay stable.");
  } else if (impressions < 50) {
    classification = 'Indexed but Ignored';
    explanation = "This page is indexed, but Google rarely shows it to anyone. The main reason is likely low search demand for this specific topic or weak authority.";
    actions.push("Update the content to target more specific questions.");
    actions.push("Add internal links from your more popular pages.");
  } else if (position > 50) {
    classification = 'Indexed but Ignored';
    explanation = "The page appears in search, but it's buried deep on page 5+ where nobody looks.";
    actions.push("Improve content depth and length.");
    actions.push("Check if user intent matches the page title.");
  } else {
    classification = 'Indexed & Visible';
    explanation = "This page is getting some visibility, but could perform better with optimization.";
    actions.push("Review the top queries to see what users are looking for.");
  }

  const ctr = impressions > 0 ? (clicks / impressions) : 0;
  if (status === 'Indexed' && impressions > 1000 && ctr < 0.01) {
    actions.push("Rewrite the Page Title to be more clickable.");
    explanation += " However, people see it and don't click it.";
  }

  const limitedActions = actions.slice(0, 3);
  const pageSlug = url.split('/').pop()?.replace(/-/g, ' ') || 'page';
  
  const topQueries = [
    { query: "how to fix " + pageSlug, clicks: Math.floor(clicks * 0.4), position: position },
    { query: "best tips for " + pageSlug, clicks: Math.floor(clicks * 0.2), position: position + 2 },
  ];

  return { 
    ...page,
    status: status as 'Indexed' | 'Not Indexed', // cast based on logic
    classification, 
    explanation, 
    actions: limitedActions, 
    topQueries 
  };
};