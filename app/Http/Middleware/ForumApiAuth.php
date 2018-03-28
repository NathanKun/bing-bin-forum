<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class ForumApiAuth
{
    /**
     * Handle an incoming request.
     *
     * @param  Request  $request
     * @param  Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        $tokenHeader = 'Token token="' . config('forum.api.token') . '"';
        if (auth()->check() || $request->header('Authorization') == $tokenHeader) {
            // User is authenticated or a valid API token was provided; continue the request
            return $next($request);
        } else {
            // Auth error
            return response()->json(['error' => "Authorization Failed"], 403);
        }
    }
}