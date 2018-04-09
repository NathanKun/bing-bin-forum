<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class BingBinTrashDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $sql = file_get_contents(app_path('../database/seeds/bingbin-dataonly.sql'));
        DB::statement('SET FOREIGN_KEY_CHECKS=0');
        DB::table('Trashes')->truncate();
        DB::table('TrashesTypes')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1');
        DB::unprepared($sql);
    }
}