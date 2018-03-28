<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\User;
use App\BingBinToken;

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
        $tokenHeader = $request->header('Authorization');
        $internalUsageTokenHeader = 'Token token="' . config('forum.api.token') . '"';
        $externalUsageTokenHeaderStart = "BingBinToken ";
        
        if (auth()->check() || $tokenHeader === $internalUsageTokenHeader) {
            // user authed (session) or api internal usage
            return $next($request);
        } else if(substr( $tokenHeader, 0, 13 ) === $externalUsageTokenHeaderStart) {
            // external usage
            // get token
            $token = substr( $tokenHeader, 13, strlen($tokenHeader) );
            // check token
            $bbt = BingBinToken::where('token_value', $token)->first();
            if($bbt) {
                if($bbt->expire_date > time()) {
                    $user = $bbt->user()->get();
                    return $next($request);
                } else {
                    // token expired
                    return response()->json(['error' => "Authorization Failed, token expired"], 403);
                }
                
            } else {
                // token not exists
                return response()->json(['error' => "Authorization Failed, token not exists"], 403);
            }
        }
        else {
            // Auth error
            return response()->json(['error' => "Authorization Failed"], 403);
        }
    }
}