<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('author_book', function (Blueprint $table) {
            $table->foreignUuid('book_id')->constrained()->cascadeOnDelete();
            $table->foreignUuid('author_id')->constrained()->cascadeOnDelete();
            $table->primary(['book_id', 'author_id']);
            $table->timestampsTz(precision: 0); // Adds updated_at and created_at fields
            $table->softDeletesTz('deleted_at', precision: 0);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('author_book');
    }
};
