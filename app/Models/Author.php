<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Author extends Model
{
    use HasFactory;
    
    protected $table = 'authors';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
      'name',
    ];

    public function books(): BelongsToMany
    {
        return $this->belongsToMany(Book::class, 'author_book', 'author_id', 'book_id')->withTimestamps();
    }
}
