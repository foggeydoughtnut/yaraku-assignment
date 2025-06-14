<?php

namespace App\Http\Controllers;

use App\Http\Requests\BookRequest;
use App\Services\AuthorService;
use App\Services\BookService;

class BookController extends Controller
{
    public function __construct(private BookService $bookService, private AuthorService $authorService)
    {
    }

    /**
     * Display a listing of books.
     */
    public function index(int $limit=1000)
    {
        $books = $this->bookService->index($limit);
        return $books;
    }

    /**
     * Store a newly created resource in storage.
     * Either
     */
    public function store(BookRequest $request)
    {
        // Create or get existing author
        $author = null;
        if ($request->authorId) {
            $author = $this->authorService->show($request->authorId);
            if (!$author){
                return response()->json([
                    'message' => 'No author with the given author id',
                    'status' => 'error',
                ], 404);
            }
        } else {
            $author = $this->authorService->store($request->authorName);
        }
        

        $book = $this->bookService->store($request->bookName, [$author->id]);
        return $book;
    }
    
    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $result = $this->bookService->destroy($id);
        if ($result === 1) {
            return response()->json([
                'message' => 'Success',
                'status' => 'success',
            ], 200);
        }
        return response()->json([
            'message' => 'Failed to delete book',
            'status' => 'error',
        ], 404);

    }
}
