import fetch from 'node-fetch';
import fs from 'fs';

async function main() {
    const res = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json');
    const ids = await res.json();
    const topIds = ids.slice(0, 5);
    const stories = [];
    
    for (const id of topIds) {
        const itemRes = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
        stories.push(await itemRes.json());
    }
    
    fs.writeFileSync('top5.json', JSON.stringify(stories, null, 2), 'utf-8');
    console.log("✅ Fetched top5.json. Ready for AI summarization.");
}

main().catch(console.error);
