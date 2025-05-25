export default {
  async fetch(request) {
    const url = new URL(request.url)
    const path = url.pathname.slice(1) // hapus slash depan

    if (!path || !path.startsWith("https://")) {
      // Tampilkan HTML halaman jika tidak ada path valid
      return new Response(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <title>CORS Proxy</title>
          <style>
            body { font-family: sans-serif; padding: 2rem; max-width: 600px; margin: auto; }
            code { background: #eee; padding: 2px 4px; border-radius: 4px; }
          </style>
        </head>
        <body>
          <h1>🌐 CORS Proxy via Cloudflare Worker</h1>
          <p>This proxy allows bypassing CORS for all sites.</p>
          <h3>Usage:</h3>
          <pre><code>https://workers.workers.dev/https://google.com</code></pre>
          <p>Example:</p>
          <pre><code>https://workers.workers.dev/https://google.com</code></pre>
          <p>Source code available on <a href="https://github.com/findme-19/corsproxy">GitHub</a> 💻</p>
        </body>
        </html>
      `, {
        headers: {
          "Content-Type": "text/html",
        },
      })
    }

    // Valid target, jalankan proxy
    try {
      const response = await fetch(path, {
        headers: {
          "User-Agent": "Mozilla/5.0",
        }
      })

      const body = await response.text()

      return new Response(body, {
        status: response.status,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": response.headers.get("content-type") || "text/plain",
        },
      })
    } catch (e) {
      return new Response(`Fetch error: ${e.message}`, { status: 500 })
    }
  }
}
