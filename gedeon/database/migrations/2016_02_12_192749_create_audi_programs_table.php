<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateAudiProgramsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('audi_programs', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name');
            $table->string('objective');
            $table->integer('weight');
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
        Schema::drop('audi_programs');
    }
}
