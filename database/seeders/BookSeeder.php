<?php

namespace Database\Seeders;

use App\Models\Author;
use Illuminate\Database\Seeder;
use App\Models\Book;


class BookSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Book::factory()
            ->count(10)
            ->create()->each(function ($book) {
                $authors = Author::inRandomOrder()->take(1)->pluck('id');
                $book->authors()->attach($authors);
            });

    }
}
