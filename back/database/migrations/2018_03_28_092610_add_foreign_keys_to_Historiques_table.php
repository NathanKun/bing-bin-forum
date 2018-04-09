<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class AddForeignKeysToHistoriquesTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::table('Historiques', function(Blueprint $table)
		{
			$table->foreign('id_trashe', 'historiques_trashes')->references('id')->on('Trashes')->onUpdate('RESTRICT')->onDelete('RESTRICT');
			$table->foreign('id_user', 'historiques_users')->references('id')->on('Users')->onUpdate('RESTRICT')->onDelete('RESTRICT');
		});
	}


	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::table('Historiques', function(Blueprint $table)
		{
			$table->dropForeign('historiques_trashes');
			$table->dropForeign('historiques_users');
		});
	}

}
