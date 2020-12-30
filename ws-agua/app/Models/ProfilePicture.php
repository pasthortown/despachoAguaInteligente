<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;


class ProfilePicture extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'file_type','file_name','file',
    ];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */
    protected $hidden = [

    ];

function user()
    {
       return $this->hasOne('App\Models\User');
    }

}
