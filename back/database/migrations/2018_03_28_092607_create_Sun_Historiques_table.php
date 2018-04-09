<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateSunHistoriquesTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('Sun_Historiques', function(Blueprint $table)
		{
			$table->string('id', 50)->default('')->primary();
			$table->string('id_sending_user', 50)->nullable()->index('sunhistoriques_user_send');
			$table->string('id_receiver_user', 50)->nullable()->index('sunhistoriques_user_receive');
			$table->integer('sending_date')->nullable();
		});
	}


	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('Sun_Historiques');
	}

}
