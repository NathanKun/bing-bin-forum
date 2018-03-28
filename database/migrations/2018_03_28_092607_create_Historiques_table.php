<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateHistoriquesTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('Historiques', function(Blueprint $table)
		{
			$table->string('id', 50)->default('')->primary();
			$table->string('id_user', 50)->nullable()->index('historiques_users');
			$table->string('id_trashe', 50)->nullable()->index('historiques_trashes');
			$table->integer('date_of_scan')->nullable();
			$table->float('latitude', 10, 0)->nullable();
			$table->float('longitude', 10, 0)->nullable();
		});
	}


	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('Historiques');
	}

}
