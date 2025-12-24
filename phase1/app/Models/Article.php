<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Article extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     * * title: The headline of the blog post.
     * content: The main text/HTML of the article.
     * source_url: The original link to the blog (used for uniqueness).
     * is_processed: A flag to track if the article has been updated by the NodeJS LLM script.
     */
    protected $fillable = [
        'title',
        'content',
        'source_url',
        'is_processed',
    ];

    /**
     * The attributes that should be cast.
     * Useful for Phase 2 and 3 to handle the boolean flag properly.
     */
    protected $casts = [
        'is_processed' => 'boolean',
    ];
}