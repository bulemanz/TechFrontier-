import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';

async function fetchTechNews() {
    const res = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json');
    const ids = await res.json();
    const topIds = ids.slice(0, 5); // 抓取前5热门
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
    return `商业与技术洞见：关注该领域的底层架构创新与早期商业验证模式。`;
}

async function main() {
    console.log("正在扫描全球前沿科技动态...");
    const stories = await fetchTechNews();
    
    // 生成格式化的日期 YYYY-MM-DD
    const dateStr = new Date().toISOString().split('T')[0];
    
    let content = `---\ntitle: "前沿技术与创投洞察 (${dateStr})"\ndescription: "每日精选全球顶尖开发者与科技创投圈的最新动态"\npubDate: "${new Date().toISOString()}"\n---\n\n`;
    
    content += "## 🌐 全球前沿科技动态\n\n";
    for (let i = 0; i < stories.length; i++) {
        const story = stories[i];
        const aiSummary = await generateSummary(story.title, story.url);
        
        content += `### ${i + 1}. [${story.title}](${story.url || `https://news.ycombinator.com/item?id=${story.id}`})\n`;
        content += `- **关注度**: ${story.score} 点 | **讨论热度**: ${story.descendants} 条评论\n`;
        content += `- **💡 核心价值提炼**: ${aiSummary}\n\n`;
    }
    
    const filePath = path.join(process.cwd(), 'src', 'content', 'blog', `news-${Date.now()}.md`);
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`✅ 已生成今日科技简报: ${filePath}`);
}

main().catch(console.error);
