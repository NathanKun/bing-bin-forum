<?php

namespace App;

use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    use Notifiable;

    protected $table = 'Users';
    public $incrementing = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'firstname', 'email', 'eco_point', 'sun_point', 'id_usagi', 'id_leaf'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password',
    ];

    public function threads()
    {
        return $this->hasMany('App\Models\Thread');
    }

    public function likes()
    {
        return $this->belongsToMany('App\Models\Post', 'forum_like_posts', 'user_id', 'post_id');
    }

    public function favorites()
    {
        return $this->belongsToMany('App\Models\Thread', 'forum_favorite_threads', 'user_id', 'thread_id');
    }
}
