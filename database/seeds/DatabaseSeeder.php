<?php

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $this->call(OriginalDataSeeder::class);
        DB::table('Users')->insert(['id' => 'adminId', 'name' => 'admin', 'firstname' => 'admin', 'pseudo' => 'admin', 
    		'email' => 'admin@em.ail', 'eco_point' => 666, 'sun_point' => 66, 'id_usagi' => 6, 'id_leaf' => 6,
    		'password' => '$2y$10$JgKw.NOUMBhvjNakQlgi3eRi4jlzv7014QaJD8L/SoAwrXN7b5eUK']);
    }
}
