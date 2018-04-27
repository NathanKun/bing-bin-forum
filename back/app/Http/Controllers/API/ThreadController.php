<?php namespace App\Http\Controllers\API;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\DB;
use App\Models\Category;
use App\Models\Post;
use App\Models\Thread;
use App\User;

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

    /*
     * POST: Search threads which title or content contains some keywords
     *
     * @param Request   $request    request
     *
     * @return JsonResponse
     */
    public function searchThread(Request $request) {
      $this->validate($request, ['page' => 'integer|min:1', 'keystr' => 'required|string']);

      $keyStr = trim($request->keystr);
      if($keyStr === '') {
        $this->response(array());
      }

      $page = $request->input('page') ? $request->input('page') : 1;
      $catg2 = $request->input('catg2') ? $request->input('catg2') : false;
      $catg3 = $request->input('catg3') ? $request->input('catg3') : false;
      $catg4 = $request->input('catg4') ? $request->input('catg4') : false;

      $catgs = array();
      if($catg2) array_push($catgs, 2);
      if($catg3) array_push($catgs, 3);
      if($catg4) array_push($catgs, 4);

      // id of threads where content has keyword
      $ids_1 = $this->model()
        ->whereHas('posts', function ($query) use($keyStr) {
            $query->where("forum_posts.sequence", "1")
                  ->where('content', 'like', '%' . $keyStr . '%');
        })
        ->select(['id'])
        ->get()
        ->toArray();

      // id of threads where title has keyword
      $ids_2 = $this->model()
        ->where('title', 'like', '%' . $keyStr . '%')
        ->select(['id'])
        ->get()
        ->toArray();

      $ids = array();
      foreach ($ids_1 as $key => $value) {
        array_push($ids, $value['id']);
      }
      foreach ($ids_2 as $key => $value) {
        array_push($ids, $value['id']);
      }

      $ids = array_unique($ids);


      $threads = $this->model()
      ->with(['author' => function ($query) {
          $query->select(['id', 'firstname', 'id_usagi', 'id_leaf']);
      }])
      ->with(['posts' => function ($query) {
          $query->where("forum_posts.sequence", "1")
        ->select(DB::raw('id, thread_id, content, (CASE WHEN pivotpost.user_id IS NOT NULL THEN 1 ELSE 0 END) AS is_current_user_like'))
        ->leftJoin(
            DB::raw("(SELECT post_id, user_id FROM forum_like_posts) as `pivotpost`"),
            function ($join) {
                $join->where('user_id', $this->user->id)
                    ->on('pivotpost.post_id', '=', 'forum_posts.id');
            }
        );
      }])
      ->whereIn('category_id', $catgs)
      ->whereIn('id', $ids)
      ->latest()
      ->skip(BaseController::threadsByPage * ($page - 1))
      ->take(BaseController::threadsByPage)
      ->get()
      ->toArray();

      return $this->response($threads);
    }

    /*
     * PATCH: Mark all post of a thread read by it's op
     *
     * @param int       $id         thread id
     * @param Request   $request    request
     *
     * @return JsonResponse
     */
    public function markRead($id, Request $request)
    {
        $model = $this->model()->find($id);

        if (is_null($model) || !$model->exists) {
            return $this->notFoundResponse();
        }

        if ($model->author_id !== $this->user->id && $this->user->id !== "adminId") {
            return $this->errorResponse("No Permission", 403);
        }

        $model->markPostsReadByOp();

        return $this->response($model);
    }

    /*
     * PATCH: Mark favorite a thread by current user
     *
     * @param int       $id         thread id
     * @param Request   $request    request
     *
     * @return JsonResponse
     */
    public function favorite($id, Request $request)
    {
        return $this->doFavorite($id, $request, true);
    }

    /*
     * PATCH: Unmark favorite a thread by current user
     *
     * @param int       $id         thread id
     * @param Request   $request    request
     *
     * @return JsonResponse
     */
    public function unFavorite($id, Request $request)
    {
        return $this->doFavorite($id, $request, false);
    }

    /*
     * Internal functoin, mark/unmark favorite a thread by current user
     *
     * @return JsonResponse
     */
    private function doFavorite($id, Request $request, bool $favorite)
    {
        $model = $this->model()->find($id);

        if (is_null($model) || !$model->exists) {
            return $this->notFoundResponse();
        }

        if ($favorite) {
            $result = $model->markFavorite($this->user->id);
        } else {
            $result = $model->unmarkFavorite($this->user->id);
        }

        if ($result) {
            return $this->response($model);
        } else {
            return $this->errorResponse("Thread had already been " .
                                         ($favorite ? "favorited" : "unfavorited"), 400);
        }
    }

    /**
     * GET: return number of threads written by current user that have new response
     *
     * @return JsonResponse
     */
    public function countNotReadThreadsOfUser(Request $request)
    {
        $counter = 0;
        $threads = $this->user->threads()->with('posts')->get()->toArray();
        foreach ($threads as $t) {
            foreach ($t['posts'] as $p) {
                if ($p['read_by_op'] === 0) {
                    $counter++;
                    break;
                }
            }
        };

        return $this->response(array('not_read' => $counter));
    }

    /**
     * GET: return all favorited threads of current user
     *
     * @return JsonResponse
     */
    public function myFavorite(Request $request)
    {
        $this->validate($request, ['page' => 'integer|min:1']);

        $page = $request->input('page') ? $request->input('page') : 1;

        $threads = $this->model()
            ->withRequestScopes($request)
            ->whereNull('deleted_at')
            ->with(['author' => function ($query) {
                $query->select(['id', 'firstname', 'id_usagi', 'id_leaf']);
            }])
            ->with(['posts' => function ($query) {
                $query->where("forum_posts.sequence", "1")
              ->select(DB::raw('id, thread_id, content, (CASE WHEN pivotpost.user_id IS NOT NULL THEN 1 ELSE 0 END) AS is_current_user_like'))
              ->leftJoin(
                  DB::raw("(SELECT post_id, user_id FROM forum_like_posts) as `pivotpost`"),
                  function ($join) {
                      $join->where('user_id', $this->user->id)
                          ->on('pivotpost.post_id', '=', 'forum_posts.id');
                  }
              );
            }])
            ->join('forum_favorite_threads', 'forum_threads.id', '=', 'forum_favorite_threads.thread_id')
            ->where('user_id', $this->user->id)
            ->orderBy('forum_favorite_threads.created_at', 'DESC')
            ->skip(BaseController::threadsByPage * ($page - 1))
            ->take(BaseController::threadsByPage)
            ->get()
            ->toArray();

        // remove unwanted fields
        foreach ($threads as &$t) {
            $t['favorite'] = (!is_null($t['user_id']) && $t['user_id'] === $this->user->id);
            $t['like'] = $t['posts'][0]['is_current_user_like'] === 1;
            $t['content'] = $t['posts'][0]['content'];
            $t['post_id'] = $t['posts'][0]['id'];
            $t = array_except($t, ['pinned', 'locked', 'thread_id', 'deleted_at', 'user_id', 'posts']);
        }

        return $this->response($threads);
    }

    /**
     * GET: return all threads written by current user
     *
     * @return JsonResponse
     */
    public function myThreads(Request $request)
    {
        $this->validate($request, ['page' => 'integer|min:1']);

        $page = $request->input('page') ? $request->input('page') : 1;

        $threads = User::find($this->user->id)
            ->threads()
            ->with('posts')
            ->skip(BaseController::threadsByPage * ($page - 1))
            ->take(BaseController::threadsByPage)
            ->whereNull('deleted_at')
            ->latest()
            ->get()
            ->toArray();

        // remove unwanted fields
        foreach ($threads as &$t) {
            $t['content'] = $t['posts'][0]['content'];
            $t = array_except($t, ['pinned', 'locked', 'posts']);
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
        $this->validate($request, ['category_id' => 'integer',
                                    'page' => 'integer|min:1',
                                    'forum' => 'boolean']);

        $category_id = $request->input('category_id') ? $request->input('category_id') : 0;
        $page = $request->input('page') ? $request->input('page') : 1;
        $forum = $request->input('forum') ? $request->input('forum') : false; // mix catg2, 3, 4

        $builder = $this->model()
        ->whereNull('deleted_at')
        ->with(['author' => function ($query) {
            $query->select(['id', 'firstname', 'id_usagi', 'id_leaf']);
        }])
        ->with(['posts' => function ($query) {
            $query->where("forum_posts.sequence", "1")
          ->select(DB::raw('id, thread_id, content, (CASE WHEN pivotpost.user_id IS NOT NULL THEN 1 ELSE 0 END) AS is_current_user_like'))
          ->leftJoin(
              DB::raw("(SELECT post_id, user_id FROM forum_like_posts) as `pivotpost`"),
              function ($join) {
                  $join->where('user_id', $this->user->id)
                      ->on('pivotpost.post_id', '=', 'forum_posts.id');
              }
          );
        }]);

        if ($category_id != 0) {
            $builder = $builder->where('category_id', $category_id);
        } elseif ($forum) {
            $builder = $builder->where('category_id', 2)
                                ->orWhere('category_id', 3)
                                ->orWhere('category_id', 4);
        } else {
            $builder = $builder->where('category_id', 1); // fallback to event category
        }

        $threads = $builder
            // is current user favorite
            ->leftJoin(
                DB::raw("(SELECT thread_id, user_id FROM forum_favorite_threads) as `pivot1`"),
                function ($join) {
                    $join->where('user_id', $this->user->id)
                        ->on('pivot1.thread_id', '=', 'forum_threads.id');
                }
            )
            ->latest()
            ->skip(BaseController::threadsByPage * ($page - 1))
            ->take(BaseController::threadsByPage)
            ->get()
            ->toArray();

        // remove unwanted fields
        /*foreach ($threads as &$t) {
            $t['favorite'] = (!is_null($t['user_id']) && $t['user_id'] === $this->user->id);
            $t['like'] = $t['posts'][0]['is_current_user_like'] === 1;
            $t['content'] = $t['posts'][0]['content'];
            $t['post_id'] = $t['posts'][0]['id'];
            $t = array_except($t, ['pinned', 'locked', 'thread_id', 'deleted_at', 'user_id', 'posts']);
        }*/

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
        $thread = /*$request->input('include_deleted') ? $thread->withTrashed()->find($id) : */$thread->find($id);

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
            ->where('forum_threads.id', $id)
            ->with(['author' => function ($query) {
                $query->select(['id', 'firstname', 'id_usagi', 'id_leaf']);
            }])
            ->with(['posts' => function ($query) {
                $query->select(DB::raw('id, author_id, thread_id, content, (CASE WHEN pivotpost.user_id IS NOT NULL THEN 1 ELSE 0 END) AS is_current_user_like'))
              ->leftJoin(
                  DB::raw("(SELECT post_id, user_id FROM forum_like_posts) as `pivotpost`"),
                  function ($join) {
                      $join->where('user_id', $this->user->id)
                          ->on('pivotpost.post_id', '=', 'forum_posts.id');
                  }
              )
              ->with(['author' => function ($query) {
                  $query->select(['id', 'firstname', 'id_usagi', 'id_leaf']);
              }]);
            }])
            // simple leftJoin will cause timestamps null
            ->leftJoin(
                DB::raw("(SELECT thread_id, user_id FROM forum_favorite_threads) as `pivot1`"),
                function ($join) {
                    $join->where('user_id', $this->user->id)
                        ->on('pivot1.thread_id', '=', 'forum_threads.id');
                }
            )
            ->first()
            ->toArray();

        if($thread['deleted_at'] !== null && $this->user->id !== "adminId") {
          return $this->notFoundResponse();
        }

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
        if (is_null($category)) {
            return $this->errorResponse("Category id not exists", 404);
        }

        /*$this->authorize('createThreads', $category);*/

        if (!$this->isAdmin() && !$category->threadsEnabled) {
            return $this->buildFailedValidationResponse($request, trans('forum::validation.category_threads_enabled'));
        }

        $thread = $this->model()->create(['category_id' => $request->category_id,
                                         'author_id' => $this->user->id,
                                         'title' => $request->title,
                                         'summary' => $request->summary,
                                         'location' => $request->location,
                                         'main_image' => $request->main_image,
                                         'img1' => $request->img1,
                                         'img2' => $request->img2,
                                         'img3' => $request->img3,
                                         'img4' => $request->img4,
                                         'img5' => $request->img5,
                                         'img6' => $request->img6,
                                         'img7' => $request->img7,
                                         'img8' => $request->img8,
                                         'img9' => $request->img9]);
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
            $threads = $threads->filter(function ($thread) {
                return $thread->userReadStatus;
            });
        }

        // Filter the threads according to the user's permissions
        $threads = $threads->filter(function ($thread) {
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

        $threads->transform(function ($thread) use ($userID) {
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
