<?php

namespace App\Http\Controllers;

use App\Http\Requests\AuthorRequest;
use App\Models\Author;
use App\Services\AuthorService;
use Illuminate\Database\Eloquent\Collection;

class AuthorController extends Controller
{
    public function __construct(private AuthorService $authorService)
    {
    }

    /**
     * Get a listing of the resource.
     */
    public function index(int $limit=1000): Collection
    {
        $authors = $this->authorService->index($limit);
        return $authors; 
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(AuthorRequest $request): Author
    {
        $newAuthor = $this->authorService->store($request->name);
        return $newAuthor;
    }

    /**
     * Get the specified resource.
     */
    public function show(string $id): Author
    {
        $author = $this->authorService->show($id);
        return $author;  
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(AuthorRequest $request, string $id): Author
    {
        $newAuthor = $this->authorService->update($id, $request->name);
        return $newAuthor;
    }
}
