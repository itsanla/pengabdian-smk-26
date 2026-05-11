import axios from 'axios';

export const apiRequest = async ({
  endpoint,
  method = 'GET',
  data,
  token: providedToken,
  returnFullResponse = false,
}: {
  endpoint: string;
  method?: string;
  data?: any;
  token?: string;
  returnFullResponse?: boolean;
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

    return returnFullResponse ? res.data : res.data.data;
  } catch (error: any) {
    const apiError: any = new Error(
      error.response?.data?.message || error.response?.error || error.message || 'Failed to fetch'
    );
    apiError.response = error.response;
    throw apiError;
  }
};

export const fetchAllPages = async <T,>({
  endpoint,
  pageSize = 50,
  token,
}: {
  endpoint: string;
  pageSize?: number;
  token?: string;
}): Promise<T[]> => {
  const items: T[] = [];
  let page = 1;
  let totalPages = 1;

  while (page <= totalPages) {
    const separator = endpoint.includes("?") ? "&" : "?";
    const response = await apiRequest({
      endpoint: `${endpoint}${separator}page=${page}&pageSize=${pageSize}`,
      token,
      returnFullResponse: true,
    });

    const pageItems = Array.isArray(response?.data) ? response.data : [];
    items.push(...pageItems);

    if (!response?.meta) break;
    totalPages = Number(response.meta.totalPages ?? totalPages);
    page += 1;
  }

  return items;
};
