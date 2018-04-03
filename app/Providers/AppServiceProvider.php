<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Auth\EloquentUserProvider;
use Illuminate\Support\Facades\Auth;

use App\CoreExtensions\SessionGuardExtended;
use App\CoreExtensions\TokenGuardExtended;
use App\CoreExtensions\UserProvider as BingBinUserProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        Auth::extend('tokenExtended', 
            function($app, $name, array $config) {
                $provider = new BingBinUserProvider();
                return new TokenGuardExtended($provider, $app['request']);
            }
        );
        
        Auth::extend(
            'sessionExtended',
            function ($app) {
                $provider = new BingBinUserProvider();
                return new SessionGuardExtended('sessionExtended', $provider, app()->make('session.store'), request());
            }
        );
    }

    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        if ($this->app->environment() !== 'production') {
            $this->app->register(\Way\Generators\GeneratorsServiceProvider::class);
            $this->app->register(\Xethron\MigrationsGenerator\MigrationsGeneratorServiceProvider::class);
        }
        // ...
    }
}
