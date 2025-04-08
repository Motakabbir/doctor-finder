<?php

namespace Tests\Feature\Api;

use App\Models\Setting;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SettingControllerTest extends TestCase
{
    use RefreshDatabase, \Tests\Traits\WithAuthentication;

    protected function setUp(): void
    {
        parent::setUp();
        $this->authenticateUser();
    }

    public function test_can_list_settings()
    {
        Setting::create([
            'key' => 'site_name',
            'value' => 'Doctor Finder',
            'group' => 'general'
        ]);

        $response = $this->getJson('/api/settings');

        $response->assertStatus(200)
            ->assertJsonStructure(['site_name']);
    }

    public function test_can_filter_settings_by_group()
    {
        Setting::create([
            'key' => 'site_name',
            'value' => 'Doctor Finder',
            'group' => 'general'
        ]);
        Setting::create([
            'key' => 'smtp_host',
            'value' => 'smtp.example.com',
            'group' => 'email'
        ]);

        $response = $this->getJson('/api/settings?group=general');

        $response->assertStatus(200)
            ->assertJsonFragment(['site_name' => 'Doctor Finder'])
            ->assertJsonMissing(['smtp_host' => 'smtp.example.com']);
    }

    public function test_can_get_setting_by_key()
    {
        Setting::create([
            'key' => 'site_name',
            'value' => 'Doctor Finder',
            'group' => 'general'
        ]);

        $response = $this->getJson('/api/settings/site_name');

        $response->assertStatus(200)
            ->assertJsonPath('key', 'site_name')
            ->assertJsonPath('value', 'Doctor Finder');
    }

    public function test_can_store_setting()
    {
        $response = $this->postJson('/api/settings', [
            'key' => 'contact_email',
            'value' => 'contact@example.com',
            'group' => 'contact'
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('settings', [
            'key' => 'contact_email',
            'group' => 'contact'
        ]);
    }

    public function test_can_batch_update_settings()
    {
        Setting::create([
            'key' => 'site_name',
            'value' => 'Old Name',
            'group' => 'general'
        ]);

        $response = $this->postJson('/api/settings/batch', [
            'settings' => [
                [
                    'key' => 'site_name',
                    'value' => 'New Name',
                    'group' => 'general'
                ],
                [
                    'key' => 'site_description',
                    'value' => 'New Description',
                    'group' => 'general'
                ]
            ]
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('settings', [
            'key' => 'site_name',
            'value' => json_encode('New Name')
        ]);
        $this->assertDatabaseHas('settings', [
            'key' => 'site_description',
            'value' => json_encode('New Description')
        ]);
    }

    public function test_can_delete_setting()
    {
        $setting = Setting::create([
            'key' => 'test_key',
            'value' => 'test_value',
            'group' => 'test'
        ]);

        $response = $this->deleteJson("/api/settings/{$setting->key}");

        $response->assertStatus(200);
        $this->assertDatabaseMissing('settings', ['key' => 'test_key']);
    }
}
