<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateTrashesTypesTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('TrashesTypes', function(Blueprint $table)
		{
			$table->string('id', 50)->default('')->primary();
			$table->text('name', 65535)->nullable();
			$table->integer('eco_point')->nullable();
			$table->text('degradation', 65535)->nullable();
		});
	}


	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('TrashesTypes');
	}

}
