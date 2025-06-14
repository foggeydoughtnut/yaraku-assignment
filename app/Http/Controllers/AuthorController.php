<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Http\Requests\AuthorRequest;
use App\Models\Author;
use App\Services\AuthorService;

class AuthorController extends Controller
{
    public function __construct(private AuthorService $authorService)
    {
    }

    /**
     * Get a listing of the resource.
     */
    public function index(Request $request)
    {
        $limit = 1000;
        $limitFromQuery = $request->query('limit');
        if ($limitFromQuery) {
            if (is_array($limitFromQuery)) {
                $limit = intval($limitFromQuery[0]);
            } else {
                $limit = intval($limitFromQuery);
            }            
        }
        

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
    public function show(string $id)
    {
        $author = $this->authorService->show($id);
        if (!$author) {
            return response()->json([
                'message' => 'No author found',
                'status' => 'error',
            ], 404);
        }
        return $author;
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(AuthorRequest $request, string $id)
    {
        $newAuthor = $this->authorService->update($id, $request->name);
        if (!$newAuthor) {
            return response()->json([
                'message' => 'Failed to update author',
                'status' => 'error',
            ], 404);
        }
        return $newAuthor;
    }
}
