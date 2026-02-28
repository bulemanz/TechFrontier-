import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';

// Reddit block bypass (requires a slightly unique user-agent and .json)
async function fetchRedditSub(subreddit) {
    try {
        const url = `https://www.reddit.com/r/${subreddit}/top.json?t=week&limit=5`;
        const res = await fetch(url, {
            headers: { 'User-Agent': 'TechFrontierResearchBot/1.0 by /u/anonymous' }
        });
        const text = await res.text();
        const data = JSON.parse(text);
        
        return data.data.children.map(child => ({
            title: child.data.title,
            score: child.data.score,
            url: `https://www.reddit.com${child.data.permalink}`,
            text: (child.data.selftext || '').substring(0, 300)
        }));
    } catch (e) {
        console.log(`Fallback for r/${subreddit}`);
        return [];
    }
}

async function fetchDDG(query) {
    try {
        const url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
        const res = await fetch(url, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
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
        return [];
    }
}

async function main() {
    console.log("🚀 Initiating Self-Evolution Protocol...");
    
    // Attempt fetching
    const saasIdeas = await fetchRedditSub('SaaS');
    const openclawSearch = await fetchDDG('how people are making money with OpenClaw AI agents');
    const newsletterSearch = await fetchDDG('newsletter growth hacking 0 to 1000 subscribers zero cost');
    
    let report = `## [EVOLUTION RUN: ${new Date().toISOString().split('T')[0]}]\n`;
    
    report += `\n### Market Search Signals: OpenClaw Monetization:\n`;
    openclawSearch.forEach(snippet => { report += `- ${snippet}\n`; });

    report += `\n### Market Search Signals: Newsletter Growth Hacking:\n`;
    newsletterSearch.forEach(snippet => { report += `- ${snippet}\n`; });

    const outPath = path.join(process.cwd(), 'learning_raw.md');
    fs.writeFileSync(outPath, report, 'utf-8');
    console.log(`✅ Raw market data dumped to ${outPath}. Ready for AI synthesis.`);
}

main();
