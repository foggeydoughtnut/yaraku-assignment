<?php

namespace App\Services;

use App\Models\Book;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class BookService {

  /**
   * Summary of index
   * Gets up to LIMIT records of authors from the DB
   * @param int $limit SQL limit for the query
   * @return Collection<int, Book>
   */
  public function index(int $limit=1000): Collection {
    $books = Book::with('authors')->take($limit)->get();
    return $books;
  }

  /**
   * Summary of show
   * Gets a specific book record by id
   * @param string $id Id of book to get
   * @return Book
   */
  public function show(string $id): Book|null {
    $book = Book::with('authors')->find($id);
    return $book;
  }

  /**
   * Summary of update
   * @param string $id Id of book to update
   * @param string $title Updated title
   * @return Book
   */
  public function update(string $id, string $title): Book {
    $book = Book::find($id);
    $book->title = $title;
    $book->save();
    return $book;
  }
  /**
   * Summary of store
   * @param string $title Title of new book
   * @return Book
   */
  public function store(string $title, array $authorIds): Book {
    $book = new Book;
    $book->title = $title;
    $book->id = Str::uuid7();
    try {
      DB::beginTransaction();
      $book->save();
      $book->authors()->attach($authorIds);      
      DB::commit();
    } catch (\PDOException $e) {
      report($e);
      DB::rollBack();
    }

    return $book;
  }

  /**
   * Summary of destroy
   * @param string $id Book Id
   * @return int 1 for success, 0 for fail
   */
  public function destroy(string $id): int {
    $book = Book::find($id);
    if ($book) {
      try {
        DB::beginTransaction();
        $book->authors()->detach();
        Book::destroy($id);
        DB::commit();
      } catch (\PDOException $e) {
        report($e);
        DB::rollBack();
        return 0;
      }
      return 1;
    } else {
      return 0;
    }
  }
}