<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class AddForeignKeysToBingBinTokensTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::table('BingBinTokens', function(Blueprint $table)
		{
			$table->foreign('id_user', 'bingbingtokens_users')->references('id')->on('Users')->onUpdate('RESTRICT')->onDelete('RESTRICT');
		});
	}


	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::table('BingBinTokens', function(Blueprint $table)
		{
			$table->dropForeign('bingbingtokens_users');
		});
	}

}
