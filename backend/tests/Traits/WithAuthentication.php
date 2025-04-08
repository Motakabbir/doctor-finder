<?php

namespace Tests\Traits;

use App\Models\User;
use Laravel\Sanctum\Sanctum;

trait WithAuthentication
{
    protected function authenticateUser()
    {
        $user = User::factory()->create();
        return $this->actingAs($user, 'sanctum');
    }
}
