<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
Use Exception;
use App\Models\Ticket;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class TicketController extends Controller
{
    function get(Request $data)
    {
       $id = $data['id'];
       if ($id == null) {
          return response()->json(Ticket::get(),200);
       } else {
          $ticket = Ticket::findOrFail($id);
          $attach = [];
          return response()->json(["Ticket"=>$ticket, "attach"=>$attach],200);
       }
    }

    function statistics(Request $data)
    {
        $result = DB::table('tickets')
        ->select(DB::raw('user_id, attended as activo, sum(quantity) as quantity_of_wather, count(*) as num_requests'))
        ->groupBy('user_id', 'activo')
        ->get();
        return response()->json($result,200);
    }

    function get_my_requests(Request $data)
    {
       $user_id = $data['user_id'];
       return response()->json(Ticket::where('user_id', $user_id)->orderBy('id', 'DESC')->get(),200);
    }

    function get_ticket_by_dispatcher_code(Request $data)
    {
       $dispatcher_code = $data['dispatcher_code'];
       $ticket = Ticket::where('dispatcher_code', $dispatcher_code)->where('attended', false)->first();
       if ($ticket) {
         DB::beginTransaction();
         $output = Ticket::where('id',$ticket->id)->update([
            'attended' => True,
         ]);
         DB::commit();
        return response()->json(['quantity'=>$ticket->quantity],200);
       } else {
        return response()->json(['quantity'=>0],200);
       }
    }

    function get_ticket_by_code(Request $data)
    {
       $code = $data['code'];
       return response()->json(Ticket::where('code', $code)->where('attended',false)->get(),200);
    }

    function paginate(Request $data)
    {
       $size = $data['size'];
       return response()->json(Ticket::paginate($size),200);
    }

    function check_ticket(Request $data)
    {
        $code = $data['code'];
        $user_id = $data['user_id'];
        $ticket = Ticket::where('code', $code)->where('user_id', $user_id)->first();
        if (!$ticket) {
            return response()->json(["response"=>'no existe'],200);
        } else {
            if ($ticket->attended) {
                return response()->json(["response"=>'utilizado'],200);
            }
            $now = strtotime(date("Y-m-d H:i:s"));
            $end_time = strtotime($ticket->end_time);
            if ($end_time < $now) {
                return response()->json(["response"=>'expirado'],200);
            }
            return response()->json(["response"=>'ok'],200);
        }
    }

    function post(Request $data)
    {
       try{
          $result = $data->json()->all();
          DB::beginTransaction();
          $ticket = new Ticket();
          $lastTicket = Ticket::orderBy('id')->get()->last();
          if($lastTicket) {
             $ticket->id = $lastTicket->id + 1;
          } else {
             $ticket->id = 1;
          }
          $ticket->code = $result['code'];
          $ticket->dispatcher_code = $result['dispatcher_code'];
          $ticket->start_time = date("Y-m-d H:i:s");
          $ticket->end_time = date('Y-m-d H:i:s',strtotime('+10 minutes',strtotime(date('Y-m-d H:i:s'))));
          $ticket->attended = $result['attended'];
          $ticket->quantity = $result['quantity'];
          $ticket->user_id = $result['user_id'];
          $ticket->save();
          DB::commit();
       } catch (Exception $e) {
          return response()->json($e,400);
       }
       return response()->json($ticket,200);
    }

    function put(Request $data)
    {
       try{
          $result = $data->json()->all();
          DB::beginTransaction();
          $ticket = Ticket::where('id',$result['id'])->update([
             'code' => $result['code'],
             'dispatcher_code' => $result['dispatcher_code'],
             'start_time' => $result['start_time'],
             'end_time' => $result['end_time'],
             'attended' => $result['attended'],
             'quantity' => $result['quantity'],
             'user_id' => $result['user_id'],
          ]);
          DB::commit();
       } catch (Exception $e) {
          return response()->json($e,400);
       }
       return response()->json($ticket,200);
    }

    function delete(Request $data)
    {
       $id = $data['id'];
       return response()->json(Ticket::destroy($id),200);
    }

    function backup(Request $data)
    {
       $tickets = Ticket::get();
       $toReturn = [];
       foreach( $tickets as $ticket) {
          $attach = [];
          array_push($toReturn, ["Ticket"=>$ticket, "attach"=>$attach]);
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
         $result = $row['Ticket'];
         $exist = Ticket::where('id',$result['id'])->first();
         if ($exist) {
           Ticket::where('id', $result['id'])->update([
             'code' => $result['code'],
             'dispatcher_code' => $result['dispatcher_code'],
             'start_time' => $result['start_time'],
             'end_time' => $result['end_time'],
             'attended' => $result['attended'],
             'quantity' => $result['quantity'],
             'user_id' => $result['user_id'],
           ]);
         } else {
          $ticket = new Ticket();
          $ticket->id = $result['id'];
          $ticket->code = $result['code'];
          $ticket->dispatcher_code = $result['dispatcher_code'];
          $ticket->start_time = $result['start_time'];
          $ticket->end_time = $result['end_time'];
          $ticket->attended = $result['attended'];
          $ticket->quantity = $result['quantity'];
          $ticket->user_id = $result['user_id'];
          $ticket->save();
         }
       }
       DB::commit();
      } catch (Exception $e) {
         return response()->json($e,400);
      }
      return response()->json('Task Complete',200);
    }
}
