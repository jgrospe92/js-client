function paginate(fetchFunc) {
    return function (url, options = {}) {
      // Check if pagination options are already included
      if (options.body && typeof options.body === 'string') {
        const bodyParams = new URLSearchParams(options.body);
        if (bodyParams.has('page') && bodyParams.has('limit')) {
          // Pagination options already included, just call the original fetch function
          return fetchFunc(url, options);
        }
      }
  
      // Parse current URL to extract any existing search params
      const currentUrl = new URL(url);
      const currentSearchParams = new URLSearchParams(currentUrl.search);
  
      // Set default pagination options
      const page = currentSearchParams.get('page') || 1;
      const limit = currentSearchParams.get('limit') || 10;
  
      // Modify the request options to include pagination parameters
      const newBodyParams = new URLSearchParams(options.body);
      newBodyParams.set('page', page);
      newBodyParams.set('limit', limit);
      options.body = newBodyParams.toString();
  
      // Call the original fetch function with the modified url and options
      return fetchFunc(url, options)
        .then(response => {
          // Perform middleware logic here, such as modifying the response
          return response.json();
        });
    }
  }
  
  // Usage:
  const enhancedFetch = paginate(fetch);
  
  enhancedFetch('https://example.com/api/data')
    .then(data => {
      // Handle the modified response data
    });