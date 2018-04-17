<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddImageFieldsAndSummaryToThreadsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('forum_threads', function (Blueprint $table) {
            $table->string('main_image')->nullable(true);
            $table->string('img1')->nullable(true);
            $table->string('img2')->nullable(true);
            $table->string('img3')->nullable(true);
            $table->string('img4')->nullable(true);
            $table->string('img5')->nullable(true);
            $table->string('img6')->nullable(true);
            $table->string('img7')->nullable(true);
            $table->string('img8')->nullable(true);
            $table->string('img9')->nullable(true);
            $table->string('summary')->nullable(true);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('forum_threads', function (Blueprint $table) {
            $table->dropColumn('main_image');
            $table->dropColumn('img1');
            $table->dropColumn('img2');
            $table->dropColumn('img3');
            $table->dropColumn('img4');
            $table->dropColumn('img5');
            $table->dropColumn('img6');
            $table->dropColumn('img7');
            $table->dropColumn('img8');
            $table->dropColumn('img9');
            $table->dropColumn('summary');
        });
    }
}