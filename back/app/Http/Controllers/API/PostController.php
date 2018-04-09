<?php namespace App\Http\Controllers\API;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Post;
use App\Models\Thread;

class PostController extends BaseController
{
    /**
     * Return the model to use for this controller.
     *
     * @return Post
     */
    protected function model()
    {
        return new Post;
    }

    /**
     * Return the translation file name to use for this controller.
     *
     * @return string
     */
    protected function translationFile()
    {
        return 'posts';
    }
    
    /*
     * PATCH: Mark favorite a thread by current user
     * 
     * @param int       $id         thread id
     * @param Request   $request    request
     * 
     * @return JsonResponse
     */
    public function like($id, Request $request) {
        return $this->doLike($id, $request, true);
    }
    
    /*
     * PATCH: Unmark favorite a thread by current user
     * 
     * @param int       $id         thread id
     * @param Request   $request    request
     * 
     * @return JsonResponse
     */
    public function unLike($id, Request $request) {
        return $this->doLike($id, $request, false);
    }
    
    /*
     * Internal functoin, mark/unmark favorite a thread by current user
     *
     * @return JsonResponse
     */
    private function doLike($id, Request $request, bool $like) {
        
        $model = $this->model()->find($id);
        
        if (is_null($model) || !$model->exists) {
            return $this->notFoundResponse();
        }
        
        if($like) 
            $result = $model->markLike($this->user->id); 
        else 
            $result = $model->unmarkLike($this->user->id);
        
        if($result) return $this->response($model);
        else return $this->errorResponse("Post had already been " . 
                                         ($like ? "liked" : "unliked"), 400);
    }

    /**
     * GET: Return an index of posts by thread ID.
     *
     * @param  Request  $request
     * @return JsonResponse|Response
     */
    public function index(Request $request)
    {
        $this->validate($request, ['thread_id' => ['required'], 'page' => 'integer|min:1']);
        
        $page = $request->input('page') ? $request->input('page') : 1;
        
        $posts = $this->model()
            ->where('thread_id', $request->input('thread_id'))
            // is current user like
            ->leftJoin(
                DB::raw("(SELECT post_id, user_id FROM forum_like_posts) as `pivot1`"), 
                function($join) {
                    $join->where('user_id', $this->user->id)
                        ->on('pivot1.post_id', '=', 'forum_posts.id');
            })
            ->skip(BaseController::postsByPage * ($page - 1))
            ->take(BaseController::postsByPage)
            ->get()
            ->toArray();
        
        // remove unwanted fields
        foreach($posts as &$p) {
            $p['like'] = (!is_null($p['user_id']) && $p['user_id'] === $this->user->id); 
            
            $p = array_except($p, ['read_by_op', 'deleted_at', 'user_id']);
        }

        return $this->response($posts);
    }

    /**
     * GET: Return a post.
     *
     * @param  int  $id
     * @param  Request  $request
     * @return JsonResponse|Response
     */
    public function fetch($id, Request $request)
    {
        $post = $this->model()->find($id);

        if (is_null($post) || !$post->exists) {
            return $this->notFoundResponse();
        }
        
        $post = $this->model()
            ->where('forum_posts.id', $id)
            ->leftJoin('forum_like_posts', 'forum_posts.id', '=', 'forum_like_posts.post_id')
            ->first()
            ->toArray();
        
        $post['like'] = !is_null($post['user_id']);
        $post = array_except($post, ['post_id', 'deleted_at', 'user_id']);

        return $this->response($post);
    }

    /**
     * POST: Create a new post.
     *
     * @param  Request  $request
     * @return JsonResponse|Response
     */
    public function store(Request $request)
    {
        $this->validate($request, ['thread_id' => ['required'], 'content' => ['required']]);

        $thread = Thread::find($request->input('thread_id'));
        if(is_null($thread)) {
            return $this->notFoundResponse();
        }
        
        if($request->has('post_id')) {
            $post = Post::find($request->input('post_id'));
            if(is_null($post)) {
                return $this->notFoundResponse();
            }
        }

        $post = $this->model()->create([
            'thread_id' => $request->thread_id, 
            'post_id' => $request->post_id, 
            'author_id' => $this->user->id, 
            'content' => $request->content]);
        $post->load('thread');

        return $this->response($post, $this->trans('created'), 201);
    }
}
