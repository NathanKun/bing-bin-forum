<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class AddForeignKeysToCouponsTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::table('Coupons', function(Blueprint $table)
		{
			$table->foreign('id_type', 'coupons_couponstypes')->references('id')->on('CouponsTypes')->onUpdate('RESTRICT')->onDelete('RESTRICT');
			$table->foreign('id_user', 'coupons_users')->references('id')->on('Users')->onUpdate('RESTRICT')->onDelete('RESTRICT');
		});
	}


	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::table('Coupons', function(Blueprint $table)
		{
			$table->dropForeign('coupons_couponstypes');
			$table->dropForeign('coupons_users');
		});
	}

}
