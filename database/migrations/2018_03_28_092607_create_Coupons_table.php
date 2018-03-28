<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateCouponsTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('Coupons', function(Blueprint $table)
		{
			$table->string('id', 50)->default('')->primary();
			$table->text('name', 65535)->nullable();
			$table->string('id_user', 50)->nullable()->index('coupons_users');
			$table->string('id_type', 50)->nullable()->index('coupons_couponstypes');
			$table->integer('limit_date')->nullable();
			$table->boolean('used')->nullable();
		});
	}


	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('Coupons');
	}

}
