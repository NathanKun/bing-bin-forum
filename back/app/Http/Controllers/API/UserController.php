<?php namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\User;

class UserController extends BaseController
{
  public function loginCheck(Request $request) {
    return $this->response(User::find($this->user->id));
  }

  protected function model()
  {
      return new User;
  }

  protected function translationFile()
  {
      return 'users';
  }
}
