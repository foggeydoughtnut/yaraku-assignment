<?php

namespace Database\Seeders;
use Illuminate\Support\Facades\DB;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\{
    Book,
    Author
};
use Illuminate\Support\Arr;


class AuthorBookSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $books = Book::all();
        foreach($books as $book){
            $book->authors()->attach(Author::inRandomOrder()->first()->id);
        }
    }
}
