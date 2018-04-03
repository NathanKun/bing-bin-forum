<?php

namespace App\CoreExtensions;

use Illuminate\Contracts\Auth\UserProvider as IlluminateUserProvider;
use Illuminate\Contracts\Auth\Authenticatable;

use App\User;
use App\BingBinToken;

class UserProvider implements IlluminateUserProvider
{
    /**
     * @param  mixed  $identifier
     * @return \Illuminate\Contracts\Auth\Authenticatable|null
     */
    public function retrieveById($identifier)
    {
        // Get and return a user by their unique identifier
        error_log("retrieveById");
        return User::find($identifier);
    }

    /**
     * @param  mixed   $identifier
     * @param  string  $token
     * @return \Illuminate\Contracts\Auth\Authenticatable|null
     */
    public function retrieveByToken($identifier, $token)
    {
        error_log("retrieveByToken");
        $bbt = BingBinToken::where('token_value', $token)->first();
        return $bbt === null ? null : $bbt->user()->first();
    }

    /**
     * @param  \Illuminate\Contracts\Auth\Authenticatable  $user
     * @param  string  $token
     * @return void
     */
    public function updateRememberToken(Authenticatable $user, $token)
    { }

    /**
     * Retrieve a user by the given credentials.
     *
     * @param  array  $credentials
     * @return \Illuminate\Contracts\Auth\Authenticatable|null
     */
    public function retrieveByCredentials(array $credentials)
    {
        error_log("retrieveByCredentials");
        // Get and return a user by looking up the given credentials
        return User::where('email', $credentials['email'])->first();;
    }

    /**
     * Validate a user against the given credentials.
     *
     * @param  \Illuminate\Contracts\Auth\Authenticatable  $user
     * @param  array  $credentials
     * @return bool
     */
    public function validateCredentials(Authenticatable $user, array $credentials)
    {
        error_log("validateCredentials");
        // Check that given credentials belong to the given user
        return $user === null ? false : (password_verify($credentials['password'], $user->getAuthPassword()));
    }

}