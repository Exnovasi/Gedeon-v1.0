<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CrateAudiDevelopmentPlanCreate extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('audi_development_plan', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name');
            $table->string('title'); 
            $table->string('image');
            $table->longText('description');
            $table->integer('id_user');
            $table->string('tipo_audi');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('audi_development_plan');
    }
}
