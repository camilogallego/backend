export function paginateResults(results, limit, page) {
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
  
    const paginatedResults = {
      results: results.slice(startIndex, endIndex),
      totalPages: Math.ceil(results.length / limit),
      currentPage: page,
      hasNextPage: endIndex < results.length,
      hasPrevPage: startIndex > 0,
      nextPage: page + 1,
      prevPage: page - 1
    };
  
    return paginatedResults;
  }
  