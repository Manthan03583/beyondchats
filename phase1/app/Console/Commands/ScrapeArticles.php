<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use Symfony\Component\DomCrawler\Crawler;
use App\Models\Article;

class ScrapeArticles extends Command
{
    protected $signature = 'scrape:articles';
    protected $description = 'Scrapes the 5 oldest articles from BeyondChats blog';

    public function handle()
    {
        $baseUrl = 'https://beyondchats.com/blogs/';
        $this->info("Fetching blog index...");

        $response = Http::get($baseUrl);
        $crawler = new Crawler($response->body());

        // Find the Last Page Number
        $lastPage = 1;
        $crawler->filter('.page-numbers')->each(function (Crawler $node) use (&$lastPage) {
            $text = trim($node->text());
            if (is_numeric($text) && (int)$text > $lastPage) {
                $lastPage = (int)$text;
            }
        });

        $articlesSaved = 0;
        $currentPage = $lastPage;

        // LOOP: Keep going to previous pages until we have 5 articles
        while ($articlesSaved < 5 && $currentPage > 0) {
            $url = $currentPage === 1 ? $baseUrl : "{$baseUrl}page/{$currentPage}/";
            $this->info("Checking Page {$currentPage} for articles...");
            
            $pageResponse = Http::get($url);
            if (!$pageResponse->successful()) break;

            $pageCrawler = new Crawler($pageResponse->body());
            $articleLinks = $pageCrawler->filter('h2.entry-title a')->extract(['href']);
            
            // Reverse them so we process the absolute oldest on the page first
            foreach (array_reverse($articleLinks) as $link) {
                if ($articlesSaved >= 5) break;

                if ($this->scrapeSingleArticle($link)) {
                    $articlesSaved++;
                }
            }

            $currentPage--; // Move to the next "oldest" page
        }

        $this->info("Phase 1 Complete: Total $articlesSaved articles saved.");
    }

    private function scrapeSingleArticle($url)
    {
        $this->line("Scraping: $url");
        $response = Http::get($url);
        if (!$response->successful()) return;

        $crawler = new Crawler($response->body());

        // 1. Get Title (Try multiple common Blocksy/Elementor selectors)
        $title = $crawler->filter('h1.entry-title, h1.elementor-heading-title, .hero-title')->first()->text('Untitled');

        // 2. Get Content (Try multiple possible content containers)
        // We add .entry-content-single and generic article tags as fallbacks
        $contentNode = $crawler->filter('.entry-content, .elementor-widget-theme-post-content, article, .post-content');
        
        if ($contentNode->count() > 0) {
            // Use the first matching node that actually contains text
            $content = $contentNode->first()->html();
        } else {
            // Final fallback: Get the body but try to strip scripts/navs if possible
            $content = null;
        }

        if ($content && strlen(strip_tags($content)) > 100) {
            \App\Models\Article::updateOrCreate(
                ['source_url' => $url],
                ['title' => trim($title), 'content' => $content, 'is_processed' => false]
            );
            $this->info("Saved: $title");
            return true; // SUCCESS
        }
        
        return false; // FAILED OR SKIPPED
    }
}