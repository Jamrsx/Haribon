<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class EmailVerificationMail extends Mailable
{
    use Queueable, SerializesModels;

    public $user;
    public $verificationCode;

    public function __construct(User $user, $verificationCode)
    {
        $this->user = $user;
        $this->verificationCode = $verificationCode;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Verify Your Email - Haribon Real Estate',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'mail.email-verification',
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
