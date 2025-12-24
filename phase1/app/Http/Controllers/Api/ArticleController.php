<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Article;
use Illuminate\Http\Request;

class ArticleController extends Controller
{
    // GET /api/articles - Fetch all articles
    public function index()
    {
        return response()->json(Article::all(), 200);
    }

    // POST /api/articles - Store a new article (Used by Phase 2)
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string',
            'content' => 'required|string',
            'source_url' => 'required|url|unique:articles,source_url',
            'is_processed' => 'boolean'
        ]);

        $article = Article::create($validated);
        return response()->json($article, 201);
    }

    // GET /api/articles/{id} - Fetch a single article
    public function show(Article $article)
    {
        return response()->json($article, 200);
    }

    // PUT /api/articles/{id} - Update an article (Used by Phase 2 to save LLM output)
    public function update(Request $request, Article $article)
    {
        $validated = $request->validate([
            'title' => 'sometimes|string',
            'content' => 'sometimes|string',
            'is_processed' => 'sometimes|boolean'
        ]);

        $article->update($validated);
        return response()->json($article, 200);
    }

    // DELETE /api/articles/{id}
    public function destroy(Article $article)
    {
        $article->delete();
        return response()->json(null, 204);
    }

    // Custom Route for Phase 2: GET /api/articles/latest-unprocessed
    public function getLatestUnprocessed()
    {
        $article = Article::where('is_processed', false)
                          ->orderBy('created_at', 'desc')
                          ->first();

        if (!$article) {
            return response()->json(['message' => 'No unprocessed articles found'], 404);
        }
        
        return response()->json($article, $article ? 200 : 404);
    }
}