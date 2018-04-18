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
            $table->string('main_image', '1000')->nullable(true);
            $table->string('img1', '1000')->nullable(true);
            $table->string('img2', '1000')->nullable(true);
            $table->string('img3', '1000')->nullable(true);
            $table->string('img4', '1000')->nullable(true);
            $table->string('img5', '1000')->nullable(true);
            $table->string('img6', '1000')->nullable(true);
            $table->string('img7', '1000')->nullable(true);
            $table->string('img8', '1000')->nullable(true);
            $table->string('img9', '1000')->nullable(true);
            $table->string('summary', '1000')->nullable(true);
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
