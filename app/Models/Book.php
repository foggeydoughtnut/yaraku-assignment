<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;


class Book extends Model
{
    use HasFactory;
    protected $table = 'books';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
      'title',
    ];

    //
    public function authors(): BelongsToMany
    {
        return $this->belongsToMany(Author::class, 'author_book', 'book_id', 'author_id')->withTimestamps();
    }
}
