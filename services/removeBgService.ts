// Specific API Key requested by user
const REMOVE_BG_API_KEY = 'GgtySePZiWAwqM16su3MxLgn';
const API_URL = 'https://api.remove.bg/v1.0/removebg';

export const removeBackground = async (imageFile: File): Promise<Blob> => {
  const formData = new FormData();
  formData.append('image_file', imageFile);
  formData.append('size', 'auto');

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'X-Api-Key': REMOVE_BG_API_KEY,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.errors?.[0]?.title || `API Error: ${response.statusText}`);
    }

    return await response.blob();
  } catch (error) {
    console.error('Remove.bg API Error:', error);
    throw error;
  }
};