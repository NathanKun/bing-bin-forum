<?php namespace App\Models;

use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Traits\HasAuthor;
use App\Support\Traits\CachesData;
use Fico7489\Laravel\Pivot\Traits\PivotEventTrait;

class Post extends BaseModel
{
    use SoftDeletes, HasAuthor, CachesData, PivotEventTrait;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'forum_posts';

	/**
	 * The attributes that are mass assignable.
	 *
	 * @var array
	 */
    protected $fillable = ['thread_id', 'author_id', 'post_id', 'content', 'read_by_op'];

    /**
     * Create a new post model instance.
     *
     * @param  array  $attributes
     */
    public function __construct(array $attributes = [])
    {
        parent::__construct($attributes);
        $this->setPerPage(config('forum.preferences.pagination.posts'));
    }
    
    public static function boot()
    {
        static::pivotAttached(function ($model, $relationName, $pivotIds, $pivotIdsAttributes) {
            error_log("post liked");
            $model->like_count++;
            $model->save();
            
            if($model->sequence === 1) {
                $t = $model->thread;
                $t->like_count++;
                $t->save();
            }
        });

        static::pivotDetached(function ($model, $relationName, $pivotIds) {
            error_log("post unliked");
            $model->like_count--;
            $model->save();
            
            if($model->sequence === 1) {
                $t = $model->thread;
                $t->like_count--;
                $t->save();
            }
        });
    }
    
    public function likesBy() {
        return $this->belongsToMany('App\User', 'forum_like_posts', 'post_id', 'user_id')->withTimestamps();
    }
    
    public function likeCount() {
        return $this->likesBy()->count();
    }
    
    public function markLike($user_id) {
        if($this->likesBy()
            ->where('user_id', $user_id)
            ->count() > 0)
            return false;
        $this->likesBy()
            ->attach($user_id);
        return true;
    }
    
    public function unmarkLike($user_id) {
        if($this->likesBy()
            ->where('user_id', $user_id)
            ->count() === 0)
            return false;
        $this->likesBy()
            ->withTimestamps()
            ->detach($user_id);
        return true;
    }

    /**
     * Relationship: Thread.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function thread()
    {
        return $this->belongsTo(Thread::class)/*->withTrashed()*/;
    }

    /**
     * Relationship: Parent post.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function parent()
    {
        return $this->belongsTo(Post::class, 'post_id');
    }

    /**
     * Relationship: Child posts.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function children()
    {
        return $this->hasMany(Post::class, 'post_id')->withTrashed();
    }

    /**
     * Attribute: First post flag.
     *
     * @return boolean
     */
    public function getIsFirstAttribute()
    {
        return $this->id == $this->thread->firstPost->id;
    }

    /**
     * Helper: Sequence number in thread.
     *
     * @return int
     */
    public function getSequenceNumber()
    {
        foreach ($this->thread->posts as $index => $post) {
            if ($post->id == $this->id) {
                return $index + 1;
            }
        }
    }
}
