<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateTrashesTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('Trashes', function(Blueprint $table)
		{
			$table->string('id', 50)->default('')->primary();
			$table->text('name', 65535)->nullable();
			$table->string('id_type', 50)->nullable();
			$table->text('img_url', 65535)->nullable();
		});
	}


	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('Trashes');
	}

}
