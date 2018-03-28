<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class AddForeignKeysToSunHistoriquesTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::table('Sun_Historiques', function(Blueprint $table)
		{
			$table->foreign('id_receiver_user', 'sunhistoriques_user_receive')->references('id')->on('Users')->onUpdate('RESTRICT')->onDelete('RESTRICT');
			$table->foreign('id_sending_user', 'sunhistoriques_user_send')->references('id')->on('Users')->onUpdate('RESTRICT')->onDelete('RESTRICT');
		});
	}


	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::table('Sun_Historiques', function(Blueprint $table)
		{
			$table->dropForeign('sunhistoriques_user_receive');
			$table->dropForeign('sunhistoriques_user_send');
		});
	}

}
