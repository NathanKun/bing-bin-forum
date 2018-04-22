<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

use App\Models\Category;
use App\Models\Thread;
use App\Models\Post;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        Artisan::call('backup:run');
        $this->call(BingBinTrashDataSeeder::class);
        $this->truncateForum();
        $this->truncateUsers();
        $this->seedObligData();
        $this->seedTestData();
    }

    private function truncateUsers()
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0');
        DB::table('Users')->truncate();
        DB::table('BingBinTokens')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1');
    }

    private function truncateForum()
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0');
        DB::table('forum_categories')->truncate();
        DB::table('forum_threads')->truncate();
        DB::table('forum_posts')->truncate();
        DB::table('forum_like_posts')->truncate();
        DB::table('forum_favorite_threads')->truncate();
        DB::table('forum_threads_read')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1');
    }

    private function seedObligData()
    {
        DB::table('Users')->insert(['id' => 'adminId', 'name' => 'admin', 'firstname' => 'admin', 'pseudo' => 'admin',
            'email' => 'admin@em.ail', 'eco_point' => 666, 'sun_point' => 66, 'id_usagi' => 6, 'id_leaf' => 6,
            'password' => '$2y$10$JgKw.NOUMBhvjNakQlgi3eRi4jlzv7014QaJD8L/SoAwrXN7b5eUK']);

        DB::table('BingBinTokens')->insert(['id' => 'admintoken', 'id_user' => 'adminId',
                                           'token_value' => 'admintoken',
                                           'emit_date' => '1500000000', 'expire_date' => '1600000000']);

        Category::create(['category_id' => 0, 'title' => 'Event', 'description' => 'Event category, threads disabled',
                                  'weight' => 0, 'enable_threads' => false, 'private' => false,
                                  'thread_count' => 0, 'post_count' => 0]);

        Category::create(['category_id' => 0, 'title' => 'Recycle', 'description' => 'Recycle category, threads enabled',
                                  'weight' => 0, 'enable_threads' => true, 'private' => false,
                                  'thread_count' => 0, 'post_count' => 0]);

        Category::create(['category_id' => 0, 'title' => 'Exchange', 'description' => 'Exchange category, threads enabled',
                                  'weight' => 0, 'enable_threads' => true, 'private' => false,
                                  'thread_count' => 0, 'post_count' => 0]);

        Category::create(['category_id' => 0, 'title' => 'Blabla', 'description' => 'Blable category, threads enabled',
                                  'weight' => 0, 'enable_threads' => true, 'private' => false,
                                  'thread_count' => 0, 'post_count' => 0]);
    }

    private function seedTestData()
    {
        DB::table('Users')->insert(['id' => '001', 'name' => '001', 'firstname' => 'zero zero one', 'pseudo' => '001',
            'email' => '001@em.ail', 'eco_point' => 1, 'sun_point' => 1, 'id_usagi' => 1, 'id_leaf' => 1,
            'password' => '$2y$10$pu5mzwNLCDaNlJsm/fJEkuhCxeafpu22J1NMbSt6Wb.28CIlFLoH.']); // 111111

        DB::table('Users')->insert(['id' => '002', 'name' => '002', 'firstname' => 'zero zero two', 'pseudo' => '002',
            'email' => '002@em.ail', 'eco_point' => 2, 'sun_point' => 2, 'id_usagi' => 2, 'id_leaf' => 2,
            'password' => '$2y$10$eG4NKc92IfWY10OBWTjymu7B9UARWvzyPfqC.st.hbtgZEfhlyMBq']); // 222222

        DB::table('Users')->insert(['id' => '003', 'name' => '003', 'firstname' => 'zero zero three', 'pseudo' => '003',
            'email' => '003@em.ail', 'eco_point' => 3, 'sun_point' => 3, 'id_usagi' => 3, 'id_leaf' => 3,
            'password' => '$2y$10$DtOUkI1gRpK54MXiDxing.kGa2XxvqrdWlqpe0uUA./tq8SFRA5XS']); // 333333

        DB::table('BingBinTokens')->insert(['id' => '001token', 'id_user' => '001',
                                           'token_value' => '001token',
                                           'emit_date' => '1500000000', 'expire_date' => '1600000000']);

        DB::table('BingBinTokens')->insert(['id' => '002token', 'id_user' => '002',
                                           'token_value' => '002token',
                                           'emit_date' => '1500000000', 'expire_date' => '1600000000']);

        DB::table('BingBinTokens')->insert(['id' => '003token', 'id_user' => '003',
                                           'token_value' => '003token',
                                           'emit_date' => '1500000000', 'expire_date' => '1600000000']);


        Thread::create(['category_id' => 1, 'author_id' => 'adminId', 'title' => 'Imaginarium Festival',
                        'locked' => false, 'pinned' => false, 'reply_count' => 0, 'summary' => 'Le Tigre,Margny 19/05/2018-20/05/2018']);

        DB::statement("UPDATE forum_threads SET forum_threads.main_image = '{
            \"original\": {
                \"url\": \"assets/imgs/IF.png\",
                \"height\": null,
                \"width\": null
            }
        }' where forum_threads.id = 1");

        Post::create(['thread_id' => 1, 'author_id' => 'adminId', 'post_id' => null, 'read_by_op' => false, 'sequence' => 1,
                      'content' => "
                                     <p text-wrap> Bing Bin assisste l’équipe imaginarium et participe au festival avec vous. Je reconnais tes déchets et te propose la solution appropriée.
                                     Tous ensemble, on rend la musique plus durable~
                                     </p>
                                     <h2>
                                       Badge IF
                                     </h2>
                                     <p text-wrap> En triant correctement, vous gagnez des badges spéciales de l’IF.
                                     </p>
                                     <h2>
                                       Bière EcoGo
                                     </h2>
                                     <p text-wrap> Tu peux prendre avoir une bière gratuite si tes éco points dépassent 500.
                                     </p>
                                     <h2>
                                       Top 20 trieurs
                                     </h2>
                                     <p text-wrap> Nous avons préparé les merveilleux cadeaux pour les 20 meilleurs tieurs. L'activité s'arrête à 16h Dimanche.
                                        Viens chercher ton cadeau au stand OVD de 16h à 19h 20 mai.
                                     </p>"]);



        Thread::create(['category_id' => 2, 'author_id' => 'adminId', 'title' => 'event fq gqdf gfd',
                        'locked' => false, 'pinned' => false, 'reply_count' => 0, 'location' => 'Paris']);

        DB::statement("UPDATE forum_threads SET forum_threads.main_image = '{
                      \"original\": {
                          \"url\": \"https://pre00.deviantart.net/7f85/th/pre/f/2017/273/9/9/flandre_scarlet_by_squchan-dbp1x46.png\",
                          \"height\": null,
                          \"width\": null
                      }
                  }' where forum_threads.id = 2");

        Post::create(['thread_id' => 2, 'author_id' => 'adminId', 'post_id' => null, 'read_by_op' => false, 'sequence' => 1,
                      'content' => 'azdqs dfds fsdfq']);

        Post::create(['thread_id' => 2, 'author_id' => 'adminId', 'post_id' => null, 'read_by_op' => false, 'sequence' => 2,
                      'content' => 'in 8102/12/25']);

        Post::create(['thread_id' => 2, 'author_id' => '001', 'post_id' => 1, 'read_by_op' => false, 'sequence' => 3,
                      'content' => 'lol']);

        Post::create(['thread_id' => 2, 'author_id' => 'adminId', 'post_id' => null, 'read_by_op' => false, 'sequence' => 4,
                      'content' => '2333333']);



        Thread::create(['category_id' => 2, 'author_id' => 'adminId', 'title' => 'zezeat sdfsq raezt',
                        'locked' => false, 'pinned' => false, 'reply_count' => 0, 'location' => 'Lille']);

        DB::statement("UPDATE forum_threads SET forum_threads.main_image = '{
                      \"original\": {
                          \"url\": \"http://www.gangqinpu.com/pu/2016/8/27/324055_201682785947_4403_9210_625303.jpg\",
                          \"height\": null,
                          \"width\": null
                      }
                  }' where forum_threads.id = 3");

        Post::create(['thread_id' => 3, 'author_id' => 'adminId', 'post_id' => null, 'read_by_op' => false, 'sequence' => 1,
                      'content' => 'zezeat sdfsq raezt']);



        Thread::create(['category_id' => 3, 'author_id' => 'adminId', 'title' => 'iuo pio oip',
                        'locked' => false, 'pinned' => false, 'reply_count' => 0, 'location' => 'Foshan']);

        DB::statement("UPDATE forum_threads SET forum_threads.main_image = '{
                      \"original\": {
                          \"url\": \"http://reinformation.tv/wp-content/uploads/2017/12/Chine-ic%C3%B4nes-virtuelles-chanteuse-Luo-Tianyi-jeunesse-pens%C3%A9e-correcte-e1512833264567.jpg\",
                          \"height\": null,
                          \"width\": null
                      }
                  }' where forum_threads.id = 4");

        Post::create(['thread_id' => 4, 'author_id' => 'adminId', 'post_id' => null, 'read_by_op' => false, 'sequence' => 1,
                      'content' => 'iuo pio oip']);



        Thread::create(['category_id' => 4, 'author_id' => 'adminId', 'title' => 'vbnvcbbv c',
                        'locked' => false, 'pinned' => false, 'reply_count' => 0, 'location' => 'Rouen']);

        DB::statement("UPDATE forum_threads SET forum_threads.main_image = '{
                      \"original\": {
                          \"url\": \"http://images6.fanpop.com/image/photos/39800000/Luo-Tianyi-cheng_cheng-39808825-500-281.jpg\",
                          \"height\": null,
                          \"width\": null
                      }
                  }' where forum_threads.id = 5");

        Post::create(['thread_id' => 5, 'author_id' => 'adminId', 'post_id' => null, 'read_by_op' => false, 'sequence' => 1,
                      'content' => '123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 ']);
    }
}
