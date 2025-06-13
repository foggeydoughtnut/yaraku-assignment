<?php
use App\Models\Book;
use App\Services\AuthorService;
use App\Services\BookService;
use Illuminate\Foundation\Testing\RefreshDatabase;
 
uses(RefreshDatabase::class);

test('can create a new book', function () {
    $service = new BookService();
    $authorServie = new AuthorService();
    $author = $authorServie->store('testing author');
    $authorIds = [$author->id];
    $result = $service->store('testing', $authorIds);
    // Test that the result returned matches what we expect
    expect($result)->toBeTruthy();
    expect($result->title)->toBe('testing');

    // Check that the database was updated
    $dbBook = Book::all()->first();
    expect($dbBook)->toBeTruthy();
    expect($dbBook->title)->toBe('testing');

    // Check that the author_book table has new record
    $hasAuthorBookRecord = $dbBook->authors()->where('author_id', $author->id)->exists();
    expect($hasAuthorBookRecord)->toBeTrue();
});

test('can update an book', function () {
    $service = new BookService();
    $authorServie = new AuthorService();
    $author = $authorServie->store('testing author');
    $result = $service->store('testing', [$author->id]);

    $result = $service->update($result->id, 'new name');
    // Test that the result returned matches what we expect
    expect($result)->toBeTruthy();
    expect($result->title)->toBe('new name');

    // Check that the database was updated
    $dbBook = Book::all()->first();
    expect($dbBook)->toBeTruthy();
    expect($dbBook->title)->toBe('new name'); 
});

test('index returns the books that have authors', function () {
    $service = new BookService();
    $authorServie = new AuthorService();
    $author = $authorServie->store('testing author');
    $book1 = $service->store('testing 1', [$author->id]);
    $book2 = $service->store('testing 2', [$author->id]);

    $listResult = $service->index();

    // Test that the result returned matches what we expect
    expect($listResult->find($book1->id))->toBeTruthy();
    expect($listResult->find($book1->id)->title)->toBe('testing 1');
    expect($listResult->find($book1->id)->authors[0]->name)->toBe('testing author');
    expect($listResult->find($book2->id))->toBeTruthy();
    expect($listResult->find($book2->id)->title)->toBe('testing 2');
    expect($listResult->find($book2->id)->authors[0]->name)->toBe('testing author');
});

test('show returns the book that we expect', function () {
    $service = new BookService();
    $authorServie = new AuthorService();
    $author = $authorServie->store('testing author');
    $service->store('testing 1', [$author->id]);
    $book2 = $service->store('testing 2', [$author->id]);

    $result = $service->show($book2->id);
    // Test that the result returned matches what we expect
    expect($result->id)->toBeTruthy();
    expect($result->title)->toBe('testing 2');
    expect($result->authors[0]->name)->toBe('testing author');
});

test('can delete an book', function () {
    $service = new BookService();
    $authorServie = new AuthorService();
    $author = $authorServie->store('testing author');
    $book = $service->store('testing', [$author->id]);
    $beforeDeleteBook = Book::find($book->id);
    expect($beforeDeleteBook)->toBeTruthy();

    $deleteResult = $service->destroy($book->id);
    expect($deleteResult)->toBe(1);

    $afterDeleteBook = Book::find($book->id);
    expect($afterDeleteBook)->toBeFalsy();

    $hasAuthorBookRecord = $book->authors()->where('book_id', $book->id)->exists();
    expect($hasAuthorBookRecord)->toBeFalse();
});