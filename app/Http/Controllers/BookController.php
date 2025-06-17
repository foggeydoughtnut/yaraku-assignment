<?php

namespace App\Http\Controllers;

use App\Http\Requests\BookRequest;
use App\Services\AuthorService;
use App\Services\BookService;
use Illuminate\Http\Request;

class BookController extends Controller
{
    public function __construct(private BookService $bookService, private AuthorService $authorService)
    {
    }

    /**
     * Display a listing of books.
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
        
        $books = $this->bookService->index($limit);
        return $books;
    }

    /**
     * Get the specified resource.
     */
    public function show(string $id)
    {
        $book = $this->bookService->show($id);
        if (!$book) {
            return response()->json(data: [
                'message' => 'No book found',
                'status' => 'error',
            ], status: 404);
        }
        return $book;
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
        

        $book = $this->bookService->store($request->title, [$author->id]);
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
