<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class BingBinToken extends Model
{

    protected $table = 'BingBinTokens';
    public $incrementing = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'token_value', 'emit_date', 'expire_date'
    ];

    public function user()
    {
        return $this->belongsTo('App\User', 'id_user', 'id');
    }
}
