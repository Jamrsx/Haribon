<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ReviewVerificationMail extends Mailable
{
    use Queueable, SerializesModels;

    public $verificationUrl;
    public $review;

    public function __construct($verificationUrl, $review)
    {
        $this->verificationUrl = $verificationUrl;
        $this->review = $review;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Verify Your Review - Haribon Real Estate',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'mail.review-verification',
        );
    }

    public function getLogoDataUri()
    {
        $logoPath = storage_path('app/public/Hari/logo.png');
        if (file_exists($logoPath)) {
            $imageData = file_get_contents($logoPath);
            return 'data:image/png;base64,' . base64_encode($imageData);
        }
        return null;
    }

    public function attachments(): array
    {
        return [];
    }
}
