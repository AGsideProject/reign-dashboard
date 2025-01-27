const fetchGlobal = async (endpoint, options = {}, resp = false) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}${endpoint}`,
    {
      cache: options.cache || "no-cache",
      method: options.method || "GET",
      headers: options.headers || {
        "Content-Type": "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ODM4NGUzLTY4OTAtODAwMy05YTNiLThjNjBjMmEyMTA1YSIsImVtYWlsIjoiYWxkb21hcmNlbGlubzAxQGdtYWlsLmNvbSIsImlhdCI6MTczNzk3MDcwMywiZXhwIjoxNzM3OTc0MzAzfQ.WdTSGDJgy8Z3u2ZQb7Xf8nrQGyC1QLx0f_givsDENX0",
      },
      body: options.body || null,
      next: options.next || undefined,
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw result;
  }

  if (resp) return result;
  return result.data;
};

export default fetchGlobal;
