<?php namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Category;
use App\Models\Post;
use App\Models\Thread;
use App\Support\Stats;

class RefreshStats extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'forum:refresh-stats';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Updates thread and post counts for categories and threads.';

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $totalThreadCount = 0;
        $categories = Category::all();

        foreach ($categories as $category) {
            $this->info("Updating counts for {$category->title}...");

            foreach ($category->threads as $thread) {
                $totalThreadCount++;
                Stats::updateThread($thread);
            }

            Stats::updateCategory($category);
        }

        $this->info("Updated counts on {$categories->count()} categories and {$totalThreadCount} threads.");
    }
}
