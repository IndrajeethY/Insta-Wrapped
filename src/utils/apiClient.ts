const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export interface ShareResponse {
  shareId: string;
  shareUrl: string;
  message: string;
}

export async function createShareableLink(stats: Record<string, unknown>): Promise<ShareResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/share`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ stats }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Failed to create shareable link:', error);
    throw error;
  }
}


export async function getSharedData(shareId: string): Promise<Record<string, unknown>> {
  try {
    const response = await fetch(`${API_BASE_URL}/share/${shareId}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Failed to get shared data:', error);
    throw error;
  }
}


