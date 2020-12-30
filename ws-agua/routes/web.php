<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It is a breeze. Simply tell Lumen the URIs it should respond to
| and give it the Closure to call when that URI is requested.
|
*/

$router->get('/', function () use ($router) {
   return 'Web Wervice Realizado con LSCodeGenerator';
});

$router->group(['middleware' => []], function () use ($router) {
   $router->post('/login', ['uses' => 'AuthController@login']);
   $router->post('/register', ['uses' => 'AuthController@register']);
   $router->post('/password_recovery_request', ['uses' => 'AuthController@passwordRecoveryRequest']);
   $router->get('/password_recovery', ['uses' => 'AuthController@passwordRecovery']);
});

$router->group(['middleware' => []], function () use ($router) {
   $router->post('/user/password_change', ['uses' => 'AuthController@passwordChange']);


   //DespachoAguaInteligente

   //CRUD ProfilePicture
   $router->post('/profilepicture', ['uses' => 'ProfilePictureController@post']);
   $router->get('/profilepicture', ['uses' => 'ProfilePictureController@get']);
   $router->get('/profilepicture/paginate', ['uses' => 'ProfilePictureController@paginate']);
   $router->put('/profilepicture', ['uses' => 'ProfilePictureController@put']);
   $router->delete('/profilepicture', ['uses' => 'ProfilePictureController@delete']);

   //CRUD User
   $router->post('/user', ['uses' => 'UserController@post']);
   $router->get('/user', ['uses' => 'UserController@get']);
   $router->get('/user/paginate', ['uses' => 'UserController@paginate']);
   $router->put('/user', ['uses' => 'UserController@put']);
   $router->delete('/user', ['uses' => 'UserController@delete']);

   //CRUD Ticket
   $router->post('/ticket', ['uses' => 'TicketController@post']);
   $router->get('/ticket', ['uses' => 'TicketController@get']);
   $router->get('/ticket/statistics', ['uses' => 'TicketController@statistics']);
   $router->get('/ticket/get_my_requests', ['uses' => 'TicketController@get_my_requests']);
   $router->get('/ticket/check_ticket', ['uses' => 'TicketController@check_ticket']);
   $router->get('/ticket/get_ticket_by_code', ['uses' => 'TicketController@get_ticket_by_code']);
   $router->get('/ticket/get_ticket_by_dispatcher_code', ['uses' => 'TicketController@get_ticket_by_dispatcher_code']);
   $router->get('/ticket/paginate', ['uses' => 'TicketController@paginate']);
   $router->get('/ticket/backup', ['uses' => 'TicketController@backup']);
   $router->put('/ticket', ['uses' => 'TicketController@put']);
   $router->delete('/ticket', ['uses' => 'TicketController@delete']);
   $router->post('/ticket/masive_load', ['uses' => 'TicketController@masiveLoad']);

   //CRUD Dispatcher
   $router->post('/dispatcher', ['uses' => 'DispatcherController@post']);
   $router->get('/dispatcher', ['uses' => 'DispatcherController@get']);
   $router->get('/dispatcher/paginate', ['uses' => 'DispatcherController@paginate']);
   $router->get('/dispatcher/backup', ['uses' => 'DispatcherController@backup']);
   $router->put('/dispatcher', ['uses' => 'DispatcherController@put']);
   $router->delete('/dispatcher', ['uses' => 'DispatcherController@delete']);
   $router->post('/dispatcher/masive_load', ['uses' => 'DispatcherController@masiveLoad']);
});
