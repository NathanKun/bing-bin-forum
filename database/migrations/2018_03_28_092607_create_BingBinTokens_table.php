<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateBingBinTokensTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('BingBinTokens', function(Blueprint $table)
		{
			$table->string('id', 50)->default('')->primary();
			$table->text('token_value', 65535)->nullable();
			$table->string('id_user', 50)->nullable()->index('bingbingtokens_users');
			$table->integer('emit_date')->nullable();
			$table->integer('expire_date')->nullable();
		});
	}


	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('BingBinTokens');
	}

}
