function buildUrl(baseUrl, queryParams) {
  if (!queryParams || Object.keys(queryParams).length === 0) {
    return baseUrl;
  }
  const queryString = Object.entries(queryParams).filter(([, value]) => value !== void 0).map(
    ([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
  ).join("&");
  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
}

export { buildUrl };
//# sourceMappingURL=UrlUtils.esm.js.map
