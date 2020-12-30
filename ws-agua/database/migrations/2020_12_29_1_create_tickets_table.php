<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTicketsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
       Schema::create('tickets', function (Blueprint $table) {
          $table->increments('id');
          $table->timestamps();
          $table->string('code',10)->nullable($value = true);
          $table->string('dispatcher_code',10)->nullable($value = true);
          $table->dateTime('start_time')->nullable($value = true);
          $table->dateTime('end_time')->nullable($value = true);
          $table->boolean('attended')->nullable($value = true);
          $table->integer('quantity')->nullable($value = true);
          $table->unsignedInteger('user_id');
          $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
       });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
       Schema::dropIfExists('tickets');
    }
}