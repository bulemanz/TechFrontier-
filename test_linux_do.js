import fetch from 'node-fetch';

async function fetchDDG(query) {
    try {
        const url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
        const res = await fetch(url, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' }
        });
        const html = await res.text();
        const results = [];
        const snippetRegex = /<a class="result__snippet[^>]*>([\s\S]*?)<\/a>/g;
        let match;
        while ((match = snippetRegex.exec(html)) !== null && results.length < 5) {
            const cleanSnippet = match[1].replace(/<\/?[^>]+(>|$)/g, "").trim();
            if (cleanSnippet) results.push(cleanSnippet);
        }
        return results;
    } catch (e) {
        return [e.toString()];
    }
}

fetchDDG('site:linux.do openclaw').then(console.log);
