import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';

async function fetchTechNews() {
    const res = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json');
    const ids = await res.json();
    const topIds = ids.slice(0, 5); 
    const stories = [];
    
    for (const id of topIds) {
        const itemRes = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
        stories.push(await itemRes.json());
    }
    return stories;
}

// 模拟AI调用(Gemini Flash), 稍后可以直接替换为API调用
async function generateSummary(title, url) {
    // 这里未来接 Gemini API
    return `Technical Insight: Monitor architectural innovations and early commercial validation signals in this sector.`;
}

async function main() {
    console.log("Scanning global tech trends...");
    const stories = await fetchTechNews();
    
    // 生成格式化的日期 YYYY-MM-DD
    const dateStr = new Date().toISOString().split('T')[0];
    
    // 改了标题: 去掉 Intelligence Brief 前缀
    let content = `---\ntitle: "Tech & Startup Insights (${dateStr})"\ndescription: "Daily curated insights tracking global developers and tech innovation."\npubDate: "${new Date().toISOString()}"\n---\n\n`;
    
    content += "## 🌐 Global Tech Trends\n\n";
    for (let i = 0; i < stories.length; i++) {
        const story = stories[i];
        const aiSummary = await generateSummary(story.title, story.url);
        
        content += `### ${i + 1}. [${story.title}](${story.url || `https://news.ycombinator.com/item?id=${story.id}`})\n`;
        content += `- **Interest Score**: ${story.score} points | **Discussion**: ${story.descendants} comments\n`;
        content += `- **💡 Core Takeaway**: ${aiSummary}\n\n`;
    }
    
    const filePath = path.join(process.cwd(), 'src', 'content', 'blog', `news-${Date.now()}.md`);
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`✅ Daily brief generated: ${filePath}`);
}

main().catch(console.error);
