import { setToken } from '@/redux/slices/authSlice';
//import { store } from '@/redux/store';

export const returnAPICall: any = (url: string, method: string) => {
  return {
    query: (body: any) => {
      const { id } = body ?? {};
      if (method === 'GET') {
        return {
          url: url + (body ? body : ''),
          method,
        };
      } else {
        delete body.id;
        return {
          url: id ? `${url}/${id}` : body.url || url,
          method,
          body,
        };
      }
    },
    transformResponse: (response: { data: any }) => {
      return response;
    },
    onQueryError: (error: any, query: any) => {
      console.log('An error occurred in query', query);
      console.error(error);
    },
    transformErrorResponse: (response: any) => {
      console.log(response?.data?.message, '<--- Transform Error');
      if (response?.data?.message?.includes('Session has expired')) {
        // causes cycles
        //store.dispatch(setToken(''));
      } else {
        return response;
      }
    },
  };
};
