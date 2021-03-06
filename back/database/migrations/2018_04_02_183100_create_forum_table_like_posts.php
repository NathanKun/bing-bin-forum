<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateForumTableLikePosts extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('forum_like_posts', function (Blueprint $table)
        {
            //$table->increments('id');
            $table->integer('post_id')->unsigned();
            $table->string('user_id', 50);
            $table->timestamps();
			$table->foreign('user_id')->references('id')->on('Users')->onUpdate('RESTRICT')->onDelete('RESTRICT');
			$table->foreign('post_id')->references('id')->on('forum_posts')->onUpdate('RESTRICT')->onDelete('RESTRICT');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('forum_like_posts');
    }
}
