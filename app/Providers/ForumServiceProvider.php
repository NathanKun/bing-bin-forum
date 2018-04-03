<?php
namespace App\Providers;

use Carbon\Carbon;
use Illuminate\Auth\Access\Gate;
use Illuminate\Contracts\Auth\Access\Gate as GateContract;
use Illuminate\Foundation\AliasLoader;
use Illuminate\Routing\Router;
use Illuminate\Support\ServiceProvider;
use App\Console\Commands\RefreshStats;
use App\Http\Middleware\ForumApiAuth;
use App\Models\Post;
use App\Models\Thread;
use App\Models\Observers\PostObserver;
use App\Models\Observers\ThreadObserver;

class ForumServiceProvider extends ServiceProvider
{
    /**
     * Register the service provider.
     *
     * @return void
     */
    public function register()
    {
        $this->commands([RefreshStats::class]);
    }

    /**
     * Bootstrap the application events.
     *
     * @param  Router  $router
     * @param  GateContract  $gate
     * @return void
     */
    public function boot(Router $router, GateContract $gate)
    {
        $this->loadStaticFiles();

        $this->observeModels();

        //$this->registerPolicies($gate);

        if (config('forum.routing.enabled')) {
            $this->registerMiddleware($router);
            $this->loadRoutes($router);
        }

        // Make sure Carbon's locale is set to the application locale
        Carbon::setLocale($this->app->getLocale());
    }

    /**
     * Returns the package's base directory path.
     *
     * @return string
     */
    protected function baseDir()
    {
        return __DIR__ . '/../';
    }

    /**
     * Load config, views and translations (including application-overridden versions).
     *
     * @return void
     */
    protected function loadStaticFiles()
    {
        // Merge config
        /*foreach (['api', 'integration', 'preferences', 'routing', 'validation'] as $name) {
            $this->mergeConfigFrom("{$this->baseDir()}config/{$name}.php", "forum.{$name}");
        }*/

        // Load translations
        $this->loadTranslationsFrom("{$this->baseDir()}translations", 'forum');
    }

    /**
     * Initialise model observers.
     *
     * @return void
     */
    protected function observeModels()
    {
        Thread::observe(new ThreadObserver);
        Post::observe(new PostObserver);
    }

    /**
     * Register the package policies.
     *
     * @param  GateContract  $gate
     * @return void
     */
    public function registerPolicies(GateContract $gate)
    {
        $forumPolicy = config('forum.integration.policies.forum');
        foreach (get_class_methods(new $forumPolicy()) as $method) {
            $gate->define($method, "{$forumPolicy}@{$method}");
        }

        foreach (config('forum.integration.policies.model') as $model => $policy) {
            $gate->policy($model, $policy);
        }
    }

    /**
     * Load routes.
     *
     * @param  Router  $router
     * @return void
     */
    protected function loadRoutes(Router $router)
    {
        $dir = $this->baseDir();
        $router->group([
            'namespace' => 'App\Http\Controllers',
            'as' => config('forum.routing.as'),
            'prefix' => config('forum.routing.root')
        ], function ($r) use ($dir) {
            require "{$dir}routes.php";
        });
    }

    /**
     * Register middleware.
     *
     * @return void
     */
    public function registerMiddleware(Router $router)
    {
        //$router->aliasMiddleware('forum.api.auth', ForumApiAuth::class);
    }
}
