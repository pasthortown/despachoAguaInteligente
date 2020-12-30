<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
Use Exception;
use App\Models\Dispatcher;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class DispatcherController extends Controller
{
    function get(Request $data)
    {
       $id = $data['id'];
       if ($id == null) {
          return response()->json(Dispatcher::get(),200);
       } else {
          $dispatcher = Dispatcher::findOrFail($id);
          $attach = [];
          return response()->json(["Dispatcher"=>$dispatcher, "attach"=>$attach],200);
       }
    }

    function paginate(Request $data)
    {
       $size = $data['size'];
       return response()->json(Dispatcher::paginate($size),200);
    }

    function post(Request $data)
    {
       try{
          $result = $data->json()->all();
          DB::beginTransaction();
          $dispatcher = new Dispatcher();
          $lastDispatcher = Dispatcher::orderBy('id')->get()->last();
          if($lastDispatcher) {
             $dispatcher->id = $lastDispatcher->id + 1;
          } else {
             $dispatcher->id = 1;
          }
          $dispatcher->code = $result['code'];
          $dispatcher->save();
          DB::commit();
       } catch (Exception $e) {
          return response()->json($e,400);
       }
       return response()->json($dispatcher,200);
    }

    function put(Request $data)
    {
       try{
          $result = $data->json()->all();
          DB::beginTransaction();
          $dispatcher = Dispatcher::where('id',$result['id'])->update([
             'code' => $result['code'],
          ]);
          DB::commit();
       } catch (Exception $e) {
          return response()->json($e,400);
       }
       return response()->json($dispatcher,200);
    }

    function delete(Request $data)
    {
       $id = $data['id'];
       return response()->json(Dispatcher::destroy($id),200);
    }

    function backup(Request $data)
    {
       $dispatchers = Dispatcher::get();
       $toReturn = [];
       foreach( $dispatchers as $dispatcher) {
          $attach = [];
          array_push($toReturn, ["Dispatcher"=>$dispatcher, "attach"=>$attach]);
       }
       return response()->json($toReturn,200);
    }

    function masiveLoad(Request $data)
    {
      $incomming = $data->json()->all();
      $masiveData = $incomming['data'];
      try{
       DB::beginTransaction();
       foreach($masiveData as $row) {
         $result = $row['Dispatcher'];
         $exist = Dispatcher::where('id',$result['id'])->first();
         if ($exist) {
           Dispatcher::where('id', $result['id'])->update([
             'code' => $result['code'],
           ]);
         } else {
          $dispatcher = new Dispatcher();
          $dispatcher->id = $result['id'];
          $dispatcher->code = $result['code'];
          $dispatcher->save();
         }
       }
       DB::commit();
      } catch (Exception $e) {
         return response()->json($e,400);
      }
      return response()->json('Task Complete',200);
    }
}
