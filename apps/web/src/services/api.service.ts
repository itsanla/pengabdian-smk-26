import axios from 'axios';

export const apiRequest = async ({
  endpoint,
  method = 'GET',
  data,
  token: providedToken,
}: {
  endpoint: string;
  method?: string;
  data?: any;
  token?: string;
}) => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  const isFormData = typeof FormData !== 'undefined' && data instanceof FormData;

  // Use provided token first, then check cookie, then local storage
  var token = providedToken || 
    (typeof window !== 'undefined' ? document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1] : undefined) ||
    (typeof window !== 'undefined' ? localStorage.getItem('authToken') : undefined);

  const headers = {
    ...(token && { Authorization: `Bearer ${token}` }),
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
  };

  // console.log(`Making API request...`);
  // console.log(`  URL     : ${baseUrl}${endpoint}`);
  // console.log(`  Method  : ${method}`);
  // console.log(`  Token   : ${token}`);
  // console.log(`  Payload :`, data);

  try {
    const res = await axios({
      url: `${baseUrl}${endpoint}`,
      method,
      headers,
      data,
    });

    return res.data.data;
  } catch (error: any) {
    console.log("error", error.response?.data.errors)
    throw new Error(
      error.response?.data?.message || error.response?.error || error.message || 'Failed to fetch'
    );
  }
};
