<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateUsersTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('Users', function(Blueprint $table)
		{
			$table->string('id', 50)->default('')->primary();
			$table->text('name', 65535)->nullable(false);
			$table->text('firstname', 65535)->nullable(false);
			$table->text('email', 65535)->nullable(false);
			$table->text('img_url', 65535)->nullable();
			$table->integer('date_nais')->nullable();
			$table->integer('eco_point')->nullable(false)->default(0);
			$table->text('fb_id', 65535)->nullable();
			$table->text('google_id', 65535)->nullable();
			$table->text('pseudo', 65535)->nullable();
			$table->text('password', 65535)->nullable();
			$table->integer('id_usagi')->nullable(false)->default(1);
			$table->integer('id_leaf')->nullable(false)->default(1);
			$table->integer('sun_point')->nullable(false)->default(0);
		});
	}


	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('Users');
	}

}
