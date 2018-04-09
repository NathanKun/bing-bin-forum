<?php

namespace App\Exceptions;

use Exception;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\MethodNotAllowedHttpException;

use App\Exceptions\NoPermissionException;

class Handler extends ExceptionHandler
{
    /**
     * A list of the exception types that are not reported.
     *
     * @var array
     */
    protected $dontReport = [
        //
    ];

    /**
     * A list of the inputs that are never flashed for validation exceptions.
     *
     * @var array
     */
    protected $dontFlash = [
        'password',
        'password_confirmation',
    ];

    /**
     * Report or log an exception.
     *
     * @param  \Exception  $exception
     * @return void
     */
    public function report(Exception $exception)
    {
        parent::report($exception);
    }

    /**
     * Render an exception into an HTTP response.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Exception  $exception
     * @return \Illuminate\Http\Response
     */
    public function render($request, Exception $exception)
    {
        if ($exception instanceof ValidationException) {
            return response()->json(array(
                        'valid' => false,
                        'error' => $exception->errors()
            ), 400);
        } else if ($exception instanceof NoPermissionException) {
            return response()->json(array(
                        'valid' => false,
                        'error' => 'No Permission'
            ), 403);
        } else if ($exception instanceof MethodNotAllowedHttpException) {
            return response()->json(array(
                        'valid' => false,
                        'error' => 'Method not allow'
            ), 405);
        }
        
        return parent::render($request, $exception);
    }
}
