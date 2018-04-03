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
        
        DB::table('Users')->insert(['id' => '001', 'name' => '001', 'firstname' => 'zero zero one', 'pseudo' => '001', 
    		'email' => '001@em.ail', 'eco_point' => 1, 'sun_point' => 1, 'id_usagi' => 1, 'id_leaf' => 1,
    		'password' => '$2y$10$pu5mzwNLCDaNlJsm/fJEkuhCxeafpu22J1NMbSt6Wb.28CIlFLoH.']); // 111111
        
        DB::table('Users')->insert(['id' => '002', 'name' => '002', 'firstname' => 'zero zero two', 'pseudo' => '002', 
    		'email' => '002@em.ail', 'eco_point' => 2, 'sun_point' => 2, 'id_usagi' => 2, 'id_leaf' => 2,
    		'password' => '$2y$10$eG4NKc92IfWY10OBWTjymu7B9UARWvzyPfqC.st.hbtgZEfhlyMBq']); // 222222
        
        DB::table('Users')->insert(['id' => '003', 'name' => '003', 'firstname' => 'zero zero three', 'pseudo' => '003', 
    		'email' => '003@em.ail', 'eco_point' => 3, 'sun_point' => 3, 'id_usagi' => 3, 'id_leaf' => 3,
    		'password' => '$2y$10$DtOUkI1gRpK54MXiDxing.kGa2XxvqrdWlqpe0uUA./tq8SFRA5XS']); // 333333
    }
}
