import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';

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
    
    // Auto-generate Twitter Thread Template for Social Distribution (Growth Engine)
    let threadContent = `🔥 The Top 5 Tech Shifts You Missed Today\nA thread 🧵👇\n\n`;
    stories.forEach((s, i) => {
        threadContent += `${i+1}/ ${s.title}\n🔗 ${s.url || `https://news.ycombinator.com/item?id=${s.id}`}\n\n`;
    });
    threadContent += `Subscribe to TechFrontier for daily deep-dives on the architecture behind the hype.\n🔗 https://techfrontier.vercel.app`;
    
    const threadPath = path.join(process.cwd(), 'social', `thread-${Date.now()}.txt`);
    fs.mkdirSync(path.join(process.cwd(), 'social'), { recursive: true });
    fs.writeFileSync(threadPath, threadContent, 'utf-8');
    console.log(`✅ Pre-generated Twitter thread template: ${threadPath}`);
}

main().catch(console.error);
