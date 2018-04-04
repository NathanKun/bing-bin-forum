<?php namespace App\Http\Controllers\API;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use App\Models\Category;
use App\Models\Post;
use App\Models\Thread;

class ThreadController extends BaseController
{
    /**
     * Return the model to use for this controller.
     *
     * @return Thread
     */
    protected function model()
    {
        return new Thread;
    }

    /**
     * Return the translation file name to use for this controller.
     *
     * @return string
     */
    protected function translationFile()
    {
        return 'threads';
    }
    
    public function markRead($id, Request $request) {
        
        $model = $this->model()->find($id);
        
        if (is_null($model) || !$model->exists) {
            return $this->notFoundResponse();
        }
        
        if($model->author_id !== $this->user->id && $this->user->id !== "adminId") {
            return $this->errorResponse("No Permission", 403);
        }
        
        $model->markPostsReadByOp();
        
        return $this->response($model);
    }
    
    public function favorite($id, Request $request) {
        return $this->doFavorite($id, $request, true);
    }
    
    public function unFavorite($id, Request $request) {
        return $this->doFavorite($id, $request, false);
    }
    
    private function doFavorite($id, Request $request, bool $favorite) {
        
        $model = $this->model()->find($id);
        
        if (is_null($model) || !$model->exists) {
            return $this->notFoundResponse();
        }
        
        if($favorite) 
            $result = $model->markFavorite($this->user->id); 
        else 
            $result = $model->unmarkFavorite($this->user->id);
        
        if($result) return $this->response($model);
        else return $this->errorResponse("Thread had already been " . 
                                         ($favorite ? "favorited" : "unfavorited"), 400);
    }
    
    public function countNotReadThreadsOfUser(Request $request) {
        $counter = 0;
        $threads = $this->user->threads()->with('posts')->get()->toArray();
        foreach($threads as $t) {
            foreach($t['posts'] as $p) {
                if($p['read_by_op'] === 0) {
                    $counter++;
                    break;
                }
            }
        };
        
        return $this->response(array('not_read' => $counter));
    }
    
    public function myFavorite(Request $request) {
        $threads = $this->model()
            ->withRequestScopes($request)
            ->join('forum_favorite_threads', 'forum_threads.id', '=', 'forum_favorite_threads.thread_id')
            ->where('user_id', $this->user->id)
            ->get()
            ->toArray();
        
        // remove unwanted fields
        foreach($threads as &$t) {
            $t = array_except($t, ['pinned', 'locked', 'thread_id', 'deleted_at', 'user_id']);
        }

        return $this->response($threads);
    }

    /**
     * GET: return an index of threads by category ID.
     *
     * @param  Request  $request
     * @return JsonResponse|Response
     */
    public function index(Request $request)
    {
        $this->validate($request, ['category_id' => ['required']]);

        $threads = $this->model()
            ->withRequestScopes($request)
            ->where('category_id', $request->input('category_id'))
            ->leftJoin('forum_favorite_threads', 'forum_threads.id', '=', 'forum_favorite_threads.thread_id')
            ->get()
            ->toArray();
        
        // remove unwanted fields
        foreach($threads as &$t) {
            $t['favorite'] = !is_null($t['user_id']);
            $t = array_except($t, ['pinned', 'locked', 'thread_id', 'deleted_at', 'user_id']);
        }

        return $this->response($threads);
    }

    /**
     * GET: Return a thread by ID.
     *
     * @param  int  $id
     * @param  Request  $request
     * @return JsonResponse|Response
     */
    public function fetch($id, Request $request)
    {
        $thread = $this->model();
        $thread = $request->input('include_deleted') ? $thread->withTrashed()->find($id) : $thread->find($id);

        if (is_null($thread) || !$thread->exists) {
            return $this->notFoundResponse();
        }

        /*if ($thread->trashed()) {
            $this->authorize('delete', $thread);
            $this->checkPermission();
        }

        if ($thread->category->private) {
            $this->authorize('view', $thread->category);
            $this->checkPermission();
        }*/
        
        $thread = $this->model()
            ->where('id', $id)
            ->leftJoin('forum_favorite_threads', 'forum_threads.id', '=', 'forum_favorite_threads.thread_id')
            ->first()
            ->toArray();
        
        $thread['favorite'] = !is_null($thread['user_id']);
        $thread = array_except($thread, ['pinned', 'locked', 'thread_id', 'deleted_at', 'user_id']);

        return $this->response($thread);
    }

    /**
     * POST: Create a new thread.
     *
     * @param  Request  $request
     * @return JsonResponse|Response
     */
    public function store(Request $request)
    {        
        $this->validate($request, [
            //'author_id' => ['required', 'string'],
            'title'     => ['required'],
            'content'   => ['required']
        ]);

        $category = Category::find($request->input('category_id'));
        if(is_null($category)) {
            return $this->errorResponse("Category id not exists", 404);
        }

        /*$this->authorize('createThreads', $category);*/

        if (!$this->isAdmin() && !$category->threadsEnabled) {
            return $this->buildFailedValidationResponse($request, trans('forum::validation.category_threads_enabled'));
        }

        $thread = $this->model()->create(['category_id' => $request->category_id,
                                         'author_id' => $this->user->id, 
                                         'title' => $request->title]);
        Post::create(['thread_id' => $thread->id,
                     'author_id' => $this->user->id,
                     'content' => $request->content]);

        return $this->response($thread, 201);
    }

    /**
     * PATCH: Restore a thread.
     *
     * @param  int  $id
     * @param  Request  $request
     * @return JsonResponse|Response
     */
    public function restore($id, Request $request)
    {
        $this->checkPermission();
        
        $thread = $this->model()->withTrashed()->find($id);

        /*$this->authorize('deleteThreads', $thread->category);*/

        return parent::restore($id, $request);
    }

    /**
     * GET: Return an index of new/updated threads for the current user, optionally filtered by category ID.
     *
     * @param  Request  $request
     * @return JsonResponse|Response
     */
    public function indexNew(Request $request)
    {
        $this->validate($request);

        $threads = $this->model()->recent();

        if ($request->has('category_id')) {
            $threads = $threads->where('category_id', $request->input('category_id'));
        }

        $threads = $threads->get();

        // If the user is logged in, filter the threads according to read status
        if (auth()->check()) {
            $threads = $threads->filter(function ($thread)
            {
                return $thread->userReadStatus;
            });
        }

        // Filter the threads according to the user's permissions
        $threads = $threads->filter(function ($thread)
        {
            return (!$thread->category->private || Gate::allows('view', $thread->category));
        });

        return $this->response($threads);
    }

    /**
     * PATCH: Mark the current user's new/updated threads as read, optionally limited by category ID.
     *
     * @param  Request  $request
     * @return JsonResponse|Response
     */
    public function markNew(Request $request)
    {
        /*$this->authorize('markNewThreadsAsRead');*/

        $threads = $this->indexNew($request)->getOriginalContent();

        $primaryKey = auth()->user()->getKeyName();
        $userID = auth()->user()->{$primaryKey};

        $threads->transform(function ($thread) use ($userID)
        {
            return $thread->markAsRead($userID);
        });

        return $this->response($threads, $this->trans('marked_read'));
    }

    /**
     * PATCH: Move a thread.
     *
     * @param  int  $id
     * @param  Request  $request
     * @return JsonResponse|Response
     */
    public function move($id, Request $request)
    {
        $this->validate($request, ['category_id' => ['required']]);

        $thread = $this->model()->find($id);

        $category = Category::find($request->input('category_id'));

        if (!$category->threadsEnabled) {
            return $this->buildFailedValidationResponse($request, trans('forum::validation.category_threads_enabled'));
        }

        return $this->updateModel($thread, ['category_id' => $category->id], ['moveThreadsTo', $category]);
    }

    /**
     * PATCH: Lock a thread.
     *
     * @param  int  $id
     * @param  Request  $request
     * @return JsonResponse|Response
     */
    public function lock($id, Request $request)
    {
        $this->checkPermission();
        
        $thread = $this->model()->where('locked', 0)->find($id);

        $category = !is_null($thread) ? $thread->category : [];

        return $this->updateModel($thread, ['locked' => 1], ['lockThreads', $category]);
    }

    /**
     * PATCH: Unlock a thread.
     *
     * @param  int  $id
     * @param  Request  $request
     * @return JsonResponse|Response
     */
    public function unlock($id, Request $request)
    {
        $this->checkPermission();
        
        $thread = $this->model()->where('locked', 1)->find($id);

        $category = !is_null($thread) ? $thread->category : [];

        return $this->updateModel($thread, ['locked' => 0], ['lockThreads', $category]);
    }

    /**
     * PATCH: Pin a thread.
     *
     * @param  int  $id
     * @param  Request  $request
     * @return JsonResponse|Response
     */
    public function pin($id, Request $request)
    {
        $this->checkPermission();
        
        $thread = $this->model()->where('pinned', 0)->find($id);

        $category = !is_null($thread) ? $thread->category : [];

        return $this->updateModel($thread, ['pinned' => 1], ['pinThreads', $category]);
    }

    /**
     * PATCH: Unpin a thread.
     *
     * @param  int  $id
     * @param  Request  $request
     * @return JsonResponse|Response
     */
    public function unpin($id, Request $request)
    {
        $this->checkPermission();
        
        $thread = $this->model()->where('pinned', 1)->find($id);

        $category = ($thread) ? $thread->category : [];

        return $this->updateModel($thread, ['pinned' => 0], ['pinThreads', $category]);
    }

    /**
     * PATCH: Rename a thread.
     *
     * @param  int  $id
     * @param  Request  $request
     * @return JsonResponse|Response
     */
    public function rename($id, Request $request)
    {
        $this->checkPermission();
        
        $this->validate($request, ['title' => ['required']]);

        $thread = $this->model()->find($id);

        return $this->updateModel($thread, ['title' => $request->input('title')], 'rename');
    }

    /**
     * PATCH: Move threads in bulk.
     *
     * @param  Request  $request
     * @return JsonResponse|Response
     */
    public function bulkMove(Request $request)
    {
        return $this->bulk($request, 'move', 'updated', $request->only('category_id'));
    }

    /**
     * PATCH: Lock threads in bulk.
     *
     * @param  Request  $request
     * @return JsonResponse|Response
     */
    public function bulkLock(Request $request)
    {
        return $this->bulk($request, 'lock', 'updated');
    }

    /**
     * PATCH: Unlock threads in bulk.
     *
     * @param  Request  $request
     * @return JsonResponse|Response
     */
    public function bulkUnlock(Request $request)
    {
        return $this->bulk($request, 'unlock', 'updated');
    }

    /**
     * PATCH: Pin threads in bulk.
     *
     * @param  Request  $request
     * @return JsonResponse|Response
     */
    public function bulkPin(Request $request)
    {
        return $this->bulk($request, 'pin', 'updated');
    }

    /**
     * PATCH: Unpin threads in bulk.
     *
     * @param  Request  $request
     * @return JsonResponse|Response
     */
    public function bulkUnpin(Request $request)
    {
        return $this->bulk($request, 'unpin', 'updated');
    }
}
