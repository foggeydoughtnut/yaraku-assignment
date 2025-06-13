<?php
use App\Models\Author;
use App\Services\AuthorService;
use Illuminate\Foundation\Testing\RefreshDatabase;
 
uses(RefreshDatabase::class);

test('can create a new author', function () {
    $service = new AuthorService();
    $result = $service->store('testing');
    // Test that the result returned matches what we expect
    expect($result)->toBeTruthy();
    expect($result->name)->toBe('testing');

    // Check that the database was updated
    $dbAuthor = Author::all()->first();
    expect($dbAuthor)->toBeTruthy();
    expect($dbAuthor->name)->toBe('testing');
});

test('can update an authors name', function () {
    $service = new AuthorService();
    $result = $service->store('testing');

    $result = $service->update($result->id, 'new name');
    // Test that the result returned matches what we expect
    expect($result)->toBeTruthy();
    expect($result->name)->toBe('new name');

    // Check that the database was updated
    $dbAuthor = Author::all()->first();
    expect($dbAuthor)->toBeTruthy();
    expect($dbAuthor->name)->toBe('new name'); 
});

test('index returns the authors that we expect', function () {
    $service = new AuthorService();
    $author1 = $service->store('testing 1');
    $author2 = $service->store('testing 2');

    $listResult = $service->index();
    // Test that the result returned matches what we expect
    expect($listResult->find($author1->id))->toBeTruthy();
    expect($listResult->find($author1->id)->name)->toBe('testing 1');
    expect($listResult->find($author2->id))->toBeTruthy();
    expect($listResult->find($author2->id)->name)->toBe('testing 2');
});

test('show returns the author that we expect', function () {
    $service = new AuthorService();
    $service->store('testing 1');
    $author2 = $service->store('testing 2');

    $result = $service->show($author2->id);
    // Test that the result returned matches what we expect
    expect($result->id)->toBeTruthy();
    expect($result->name)->toBe('testing 2');
});