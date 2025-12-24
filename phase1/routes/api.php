<?php

use App\Http\Controllers\Api\ArticleController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;



Route::get('/articles/latest-unprocessed', [ArticleController::class, 'getLatestUnprocessed']);

// Standard CRUD Resource
Route::apiResource('articles', ArticleController::class);
