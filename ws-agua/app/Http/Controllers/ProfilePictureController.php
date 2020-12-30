<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
Use Exception;
use App\Models\ProfilePicture;
use App\Models\User;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class ProfilePictureController extends Controller
{
    function get(Request $data)
    {
       $user_id = $data['user_id'];
       $profilepicture = ProfilePicture::where('id_user', $user_id)->first();
       if ($profilepicture) {
         return response()->json($profilepicture,200);
       }else {
         return response()->json(['id'=>0, 'file_type'=>'', 'file_name'=>'', 'file'=>''],200);
       }
    }

    function paginate(Request $data)
    {
       $size = $data['size'];
          return response()->json(ProfilePicture::paginate($size),200);
    }

    function post(Request $data)
    {
       try{
          $result = $data->json()->all();
          DB::beginTransaction();
          $profilepicture = new ProfilePicture();
          $profilepicture->file_type = $result['file_type'];
          $profilepicture->file_name = $result['file_name'];
          $profilepicture->file = $result['file'];
          $profilepicture->id_user = $result['user_id'];
          $profilepicture->save();
          DB::commit();
          return response()->json($profilepicture,200);
       } catch (Exception $e) {
          return response()->json($e,400);
       }
    }

    function put(Request $data)
    {
       try{
          $result = $data->json()->all();
          DB::beginTransaction();
          $profilepicture = ProfilePicture::where('id',$result['id'])->update([
             'file_type'=>$result['file_type'],
             'file_name'=>$result['file_name'],
             'file'=>$result['file'],
          ]);
          DB::commit();
          return response()->json($profilepicture,200);
       } catch (Exception $e) {
          return response()->json($e,400);
       }
    }

    function delete(Request $data)
    {
       $result = $data->json()->all();
       $id = $result['id'];
       return response()->json(ProfilePicture::destroy($id), 200);
    }
}
