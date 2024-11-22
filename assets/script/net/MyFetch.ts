/**
 * fetch简单封装
 */

class MyFetch {
    private static baseUrl: string = 'https://jsonplaceholder.typicode.com';
  
    private static async handleResponse(response: Response): Promise<any> {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    }
  
    public static async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
        const url = new URL(this.baseUrl + endpoint);
        if (params) {
            Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
        }
        const response = await fetch(url.toString());
        return this.handleResponse(response);
    }
  
    public static async post<T>(endpoint: string, body: Record<string, any>): Promise<T> {
        const response = await fetch(this.baseUrl + endpoint, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        return this.handleResponse(response);
    }
  }
  
  export default MyFetch;
  
  // MyFetch.get('/posts/1').then(res => {
  //     console.log('fetch get',res);
  // }).catch(e => {
  //     console.log('fetch get error',e);
  // });
  
  // MyFetch.post('/posts', {title: 'foo', body: 'bar', userId: 1}).then(res => {
  //     console.log('fetch post',res);
  // }).catch(e => {
  //     console.log('fetch post error',e);
  // });