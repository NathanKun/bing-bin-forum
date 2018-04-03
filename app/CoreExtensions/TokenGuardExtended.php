<?php
namespace App\CoreExtensions;

use Illuminate\Http\Request;
use Illuminate\Contracts\Auth\Guard;
use Illuminate\Auth\GuardHelpers;
use Illuminate\Contracts\Auth\UserProvider;
use Illuminate\Support\Facades\Auth;

use App\User;
use App\BingBinToken;


class TokenGuardExtended implements Guard
{
    use GuardHelpers;

    /**
     * The request instance.
     *
     * @var \Illuminate\Http\Request
     */
    protected $request;
    
    private $internalUsageTokenHeader;
    private $externalUsageTokenHeaderStart;

    /**
     * Create a new authentication guard.
     *
     * @param  \Illuminate\Contracts\Auth\UserProvider  $provider
     * @param  \Illuminate\Http\Request  $request
     * @param  string  $inputKey
     * @param  string  $storageKey
     * @return void
     */
    public function __construct(UserProvider $provider, Request $request)
    {
        error_log("token guard");
            //error_log(print_r($request->all(), true));
        $this->request = $request;
        $this->provider = $provider;
        $this->internalUsageTokenHeader = 'Token token="' . config('forum.api.token') . '"';
        $this->externalUsageTokenHeaderStart = "BingBinToken ";
    }

    /**
     * Get the currently authenticated user.
     *
     * @return \Illuminate\Contracts\Auth\Authenticatable|null
     */
    public function user()
    {
        // If we've already retrieved the user for the current request we can just
        // return it back immediately. We do not want to fetch the user data on
        // every call to this method because that would be tremendously slow.
        if (!is_null($this->user)) {
            return $this->user;
        }
        
        if($this->validate()) {
            return $this->user;
        }
        
        return null;
    }

    /**
     * Get the token for the current request.
     *
     * @return string
     */
    public function getTokenForRequest()
    {
        $token = $this->request->header('Authorization');
error_log($token);
        return $token;
    }

    /**
     * Validate a user's credentials.
     *
     * @param  array  $credentials
     * @return bool
     */
    public function validate(array $credentials = [])
    {
        $token = $this->getTokenForRequest();
        if ($token === null) {
            return false;
        }

        if ($token === $this->internalUsageTokenHeader) {
            // internal usage
            $this->user = User::find(1);
            return true;
        } else if(substr( $token, 0, 13 ) === $this->externalUsageTokenHeaderStart) {
            // external usage
            // get token
            $token = substr( $token, 13, strlen($token) );
            // check token
            $bbt = BingBinToken::where('token_value', $token)->first();
            if($bbt) {
                if($bbt->expire_date > time()) {
                    $this->user = $user = $bbt->user()->first();
                    Auth::guard("web")->login($user);
                    return true;
                } else {
                    // token expired
                    return false;
                }
            } else {
                // token not exists
                return false;
            }
        } else {
            return false;
        }
    }

    /**
     * Set the current request instance.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return $this
     */
    public function setRequest(Request $request)
    {
        $this->request = $request;

        return $this;
    }
}
