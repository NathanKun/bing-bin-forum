<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateForumTableFavoriteThreads extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('forum_favorite_threads', function (Blueprint $table)
        {
            //$table->increments('id');
            $table->integer('thread_id')->unsigned();
            $table->string('user_id', 50);
            $table->timestamps();
			$table->foreign('user_id')->references('id')->on('Users')->onUpdate('RESTRICT')->onDelete('RESTRICT');
			$table->foreign('thread_id')->references('id')->on('forum_threads')->onUpdate('RESTRICT')->onDelete('RESTRICT');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('forum_favorite_threads');
    }
}
