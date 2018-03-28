<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class OriginalDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $sql = file_get_contents(app_path('../database/seeds/bingbin-dataonly.sql'));
        DB::unprepared($sql);
    }
}