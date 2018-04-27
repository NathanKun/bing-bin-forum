<?php namespace App\Models;

use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Gate;
use App\Models\Category;
use App\Models\Post;
use App\Models\Traits\HasAuthor;
use App\Support\Traits\CachesData;
use Fico7489\Laravel\Pivot\Traits\PivotEventTrait;
use SahusoftCom\EloquentImageMutator\EloquentImageMutatorTrait;

class Thread extends BaseModel
{
    use SoftDeletes, HasAuthor, CachesData, PivotEventTrait, EloquentImageMutatorTrait;

    /**
     * Eloquent attributes
     */
    protected $table = 'forum_threads';

    /**
     * The photo fields should be listed here.
     *
     * @var array
     */
    protected $image_fields = ['main_image', 'img1', 'img2', 'img3', 'img4', 'img5', 'img6', 'img7', 'img8', 'img9'];

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['category_id', 'author_id', 'title', 'locked', 'pinned', 'reply_count', 'summary', 'location',
                            'main_image', 'img1', 'img2', 'img3', 'img4', 'img5', 'img6', 'img7', 'img8', 'img9'];

    /**
     * @var string
     */
    const STATUS_UNREAD = 'unread';

    /**
     * @var string
     */
    const STATUS_UPDATED = 'updated';

    /**
     * Create a new thread model instance.
     *
     * @param  array  $attributes
     */
    public function __construct(array $attributes = [])
    {
        parent::__construct($attributes);
        $this->perPage = config('forum.preferences.pagination.threads');
    }


    public static function boot()
    {
        static::pivotAttached(function ($model, $relationName, $pivotIds, $pivotIdsAttributes) {
            $model->favorite_count++;
            $model->save();
        });

        static::pivotDetached(function ($model, $relationName, $pivotIds) {
            $model->favorite_count--;
            $model->save();
        });
    }

    public function favoritesBy() {
        return $this->belongsToMany('App\User', 'forum_favorite_threads')
            ->withTimestamps();
    }

    public function favoriteCount() {
        return $this->favoritesBy()
            ->count();
    }

    public function markFavorite($user_id) {
        if($this->favoritesBy()
            ->where('user_id', $user_id)
            ->count() > 0)
            return false;
        $this->favoritesBy()
            ->attach($user_id);
        return true;
    }

    public function unmarkFavorite($user_id) {
        if($this->favoritesBy()
            ->where('user_id', $user_id)
            ->count() === 0)
            return false;
        $this->favoritesBy()
            ->withTimestamps()
            ->detach($user_id);
        return true;
    }

    public function markPostsReadByOp() {
        $this->posts()->each(function ($post) {
            $post->read_by_op = true;
            $post->save();
        });
    }

    /**
     * Relationship: Category.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * Relationship: Readers.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function readers()
    {
        return $this->belongsToMany(
            config('forum.integration.user_model'),
            'forum_threads_read',
            'thread_id',
            'user_id'
        )->withTimestamps();
    }

    /**
     * Relationship: Posts.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function posts()
    {
        //$withTrashed = config('forum.preferences.display_trashed_posts') || Gate::allows('viewTrashedPosts');
        $query = $this->hasMany(Post::class);
        //return $withTrashed ? $query->withTrashed() : $query;
        return $query;
    }

    /**
     * Scope: Recent threads.
     *
     * @param  \Illuminate\Database\Query\Builder  $query
     * @return \Illuminate\Database\Query\Builder
     */
    public function scopeRecent($query)
    {
        $time = time();
        $age = strtotime(config('forum.preferences.old_thread_threshold'), 0);
        $cutoff = $time - $age;

        return $query->where('updated_at', '>', date('Y-m-d H:i:s', $cutoff))->orderBy('updated_at', 'desc');
    }

    /**
     * Attribute: Paginated posts.
     *
     * @return \Illuminate\Pagination\LengthAwarePaginator
     */
    public function getPostsPaginatedAttribute()
    {
        return $this->posts()->paginate(config('forum.preferences.pagination.posts'));
    }

    /**
     * Attribute: The last page number of the thread.
     *
     * @return int
     */
    public function getLastPageAttribute()
    {
        return $this->postsPaginated->lastPage();
    }

    /**
     * Attribute: The first post in the thread.
     *
     * @return Post
     */
    public function getFirstPostAttribute()
    {
        return $this->posts()->orderBy('created_at', 'asc')->first();
    }

    /**
     * Attribute: The last post in the thread.
     *
     * @return Post
     */
    public function getLastPostAttribute()
    {
        return $this->posts()->orderBy('created_at', 'desc')->first();
    }

    /**
     * Attribute: Creation time of the last post in the thread.
     *
     * @return \Carbon\Carbon
     */
    public function getLastPostTimeAttribute()
    {
        return $this->lastPost->created_at;
    }


    /**
     * Attribute: 'Old' flag.
     *
     * @return boolean
     */
    public function getOldAttribute()
    {
        $age = config('forum.preferences.old_thread_threshold');
        return (!$age || $this->updated_at->timestamp < (time() - strtotime($age, 0)));
    }

    /**
     * Attribute: Currently authenticated reader.
     *
     * @return mixed
     */
    public function getReaderAttribute()
    {
        if (auth()->check()) {
            $reader = $this->readers()->where('forum_threads_read.user_id', auth()->user()->getKey())->first();

            return (!is_null($reader)) ? $reader->pivot : null;
        }

        return null;
    }

    /**
     * Attribute: Read/unread/updated status for current reader.
     *
     * @return mixed
     */
    public function getUserReadStatusAttribute()
    {
        if (!$this->old && auth()->check()) {
            if (is_null($this->reader)) {
                return self::STATUS_UNREAD;
            }

            return ($this->updatedSince($this->reader)) ? self::STATUS_UPDATED : false;
        }

        return false;
    }

    /**
     * Helper: Mark this thread as read for the given user ID.
     *
     * @param  int  $userID
     * @return void
     */
    public function markAsRead($userID)
    {
        if (!$this->old) {
            if (is_null($this->reader)) {
                $this->readers()->attach($userID);
            } elseif ($this->updatedSince($this->reader)) {
                $this->reader->touch();
            }
        }

        return $this;
    }
}
