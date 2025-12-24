import express from 'express';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { GoogleGenerativeAI } from '@google/generative-ai';
import cors from 'cors';
import 'dotenv/config';

const app = express();

app.use(cors({
    origin: 'http://localhost:3001', 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.options(/(.*)/, cors()); 

app.use(express.json());

const CONFIG = {
    GOOGLE_SEARCH_KEY: process.env.GOOGLE_SEARCH_KEY,
    GOOGLE_CX: process.env.GOOGLE_CX,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    LARAVEL_API_BASE: process.env.LARAVEL_API_URL || 'http://localhost:8000/api'
};

const genAI = new GoogleGenerativeAI(CONFIG.GEMINI_API_KEY);

async function scrapeUrl(url) {
    try {
        const { data } = await axios.get(url, {
            timeout: 8000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.9',
            }
        });
        const $ = cheerio.load(data);
        
        $('script, style, nav, footer, header, ad').remove();
        
        const text = $('p').text().trim().substring(0, 4000);
        return text.length > 100 ? text : null;
    } catch (error) {
        console.error(` Skipping URL ${url}: ${error.message}`);
        return null;
    }
}

app.post('/api/process-article/:id', async (req, res) => {
    const { id } = req.params;
    
    try {
        console.log(`Starting AI Processing for Article ID: ${id}`);

        
        const articleRes = await axios.get(`${CONFIG.LARAVEL_API_BASE}/articles/${id}`);
        const article = articleRes.data;

        const searchQuery = `${article.title} technical guide blog`;
        const searchUrl = `https://www.googleapis.com/customsearch/v1?key=${CONFIG.GOOGLE_SEARCH_KEY}&cx=${CONFIG.GOOGLE_CX}&q=${encodeURIComponent(searchQuery)}`;
        
        const searchRes = await axios.get(searchUrl);
        
        if (!searchRes.data.items || searchRes.data.items.length < 2) {
            throw new Error("Could not find enough reference articles on Google.");
        }

        const links = searchRes.data.items
            .map(item => item.link)
            .filter(link => !link.includes('reddit.com') && !link.includes('youtube.com'))
            .slice(0, 3);
        
        console.log(`🔗 Found ${links.length} potential references.`);

        const scrapedResults = await Promise.all(links.map(url => scrapeUrl(url)));
        const referenceStyles = scrapedResults.filter(content => content !== null);

        if (referenceStyles.length === 0) {
            throw new Error("Reference sites blocked our scraping attempts (403/Timeout).");
        }


        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        
        const prompt = `
            Task: Rewrite the "Original Content" using the tone, formatting, and professional writing style found in the "Reference Styles".
            
            Original Content: ${article.content}
            
            Reference Styles: ${referenceStyles.join('\n\n')}
            
            Strict Instructions:
            1. Use HTML tags (<b>, <p>, <ul>) for formatting.
            2. Maintain all factual data from the original content.
            3. At the end, add a section: "References used for style transfer:" followed by the links: ${links.join(', ')}.
        `;

        const result = await model.generateContent(prompt);
        const rewrittenText = result.response.text();

        await axios.put(`${CONFIG.LARAVEL_API_BASE}/articles/${id}`, { is_processed: true });

        const newArticle = await axios.post(`${CONFIG.LARAVEL_API_BASE}/articles`, {
            title: `[AI] ${article.title}`, 
            content: rewrittenText,
            source_url: links[0],
            is_processed: true
        });

        console.log(`Successfully created AI version with ID: ${newArticle.data.id}`);
        
        res.status(200).json({ 
            success: true, 
            message: "Article processed and styled successfully.",
            data: newArticle.data 
        });

    } catch (error) {
        console.error("Processing Error:", error.message);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`
    Phase 2 Server Running
    URL: http://localhost:${PORT}
    CORS: Allowed for http://localhost:3001
    `);
});