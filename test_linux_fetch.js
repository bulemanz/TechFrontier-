import fetch from 'node-fetch';

async function fetchThread(url) {
    try {
        const res = await fetch(url, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
        });
        const html = await res.text();
        console.log("Status:", res.status);
        console.log("Content start:", html.substring(0, 300));
    } catch (e) {
        console.log(e);
    }
}

fetchThread('https://linux.do/');
