<?php

namespace App\Services;

use App\Models\Author;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Str;

class AuthorService {

  /**
   * Summary of index
   * Gets up to LIMIT records of authors from the DB
   * @param int $limit SQL limit for the query
   * @return Collection<int, Author>
   */
  public function index(int $limit=1000): Collection {
    $authors = Author::all()->take($limit);
    return $authors;
  }

  /**
   * Summary of show
   * Gets a specific author record by id
   * @param string $id Id of author to get
   * @return Author
   */
  public function show(string $id): Author|null {
    $author = Author::find($id);
    return $author;
  }

  /**
   * Summary of update
   * @param string $id Id of author to update
   * @param string $name Updated name
   * @return Author
   */
  public function update(string $id, string $name): Author {
    $author = Author::find($id);
    $author->name = $name;
    $author->save();
    return $author;
  }
  /**
   * Summary of store
   * @param string $name Name of new author
   * @return Author
   */
  public function store(string $name): Author {
    $author = new Author;
    $author->name = $name;
    $author->id = Str::uuid7();
    $author->save();
    return $author;
  }
}