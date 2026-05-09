<?php

namespace App\Http\Controllers;

use App\Models\Conversation;
use App\Models\Message;
use App\Models\Property;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class MessageController extends Controller
{
    /**
     * List all conversations the current user is part of (as buyer or seller).
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        $conversations = $this->loadConversationsFor($user->id);
        $activeConversation = null;

        Log::info('[Messages] index opened', [
            'user_id' => $user->id,
            'count' => $conversations->count(),
        ]);

        return Inertia::render('Messages/MessagesPage', [
            'conversations' => $conversations,
            'activeConversation' => $activeConversation,
            'currentUserId' => $user->id,
        ]);
    }

    /**
     * Open a specific thread. Marks unread incoming messages as read.
     */
    public function show(Request $request, Conversation $conversation): Response|RedirectResponse
    {
        $user = $request->user();
        $this->authorizeParticipant($conversation, $user->id);

        $this->markAsRead($conversation, $user->id);

        $conversation->load([
            'property:id,title,price_total,type',
            'property.images' => function ($q) {
                $q->orderBy('sort_order')->limit(1);
            },
            'buyer:id,name,profile_picture',
            'seller:id,name,profile_picture',
            'messages.sender:id,name,profile_picture',
        ]);

        $conversations = $this->loadConversationsFor($user->id);

        Log::info('[Messages] thread opened', [
            'user_id' => $user->id,
            'conversation_id' => $conversation->id,
        ]);

        return Inertia::render('Messages/MessagesPage', [
            'conversations' => $conversations,
            'activeConversation' => $conversation,
            'currentUserId' => $user->id,
        ]);
    }

    /**
     * Send a reply in an existing conversation.
     */
    public function send(Request $request, Conversation $conversation): RedirectResponse
    {
        $user = $request->user();
        $this->authorizeParticipant($conversation, $user->id);

        $validated = $request->validate([
            'body' => 'required|string|max:2000',
        ]);

        $message = Message::create([
            'conversation_id' => $conversation->id,
            'sender_id' => $user->id,
            'body' => trim($validated['body']),
        ]);

        $conversation->update(['last_message_at' => $message->created_at]);

        Log::info('[Messages] message sent', [
            'user_id' => $user->id,
            'conversation_id' => $conversation->id,
            'message_id' => $message->id,
        ]);

        return back();
    }

    /**
     * Buyer-side entry point: inquire about a property.
     * Finds-or-creates the conversation, sends the first message, opens the thread.
     */
    public function inquire(Request $request, Property $property): RedirectResponse
    {
        $user = $request->user();

        if (! $property->is_active) {
            abort(404);
        }

        if ($property->user_id === $user->id) {
            return back()->with('error', 'You cannot message yourself about your own property.');
        }

        $validated = $request->validate([
            'body' => 'required|string|max:2000',
        ]);

        $conversation = Conversation::firstOrCreate(
            [
                'buyer_id' => $user->id,
                'seller_id' => $property->user_id,
                'property_id' => $property->id,
            ],
            [
                'last_message_at' => now(),
            ]
        );

        $message = Message::create([
            'conversation_id' => $conversation->id,
            'sender_id' => $user->id,
            'body' => trim($validated['body']),
        ]);

        $conversation->update(['last_message_at' => $message->created_at]);

        Log::info('[Messages] inquiry created', [
            'user_id' => $user->id,
            'property_id' => $property->id,
            'conversation_id' => $conversation->id,
        ]);

        // The inquirer is always a buyer, so route to the buyer-namespaced URL.
        return redirect()
            ->route('buyer.messages.show', $conversation)
            ->with('success', 'Your inquiry has been sent.');
    }

    /**
     * Lightweight JSON endpoint polled by the active thread (every ~3s).
     */
    public function poll(Request $request, Conversation $conversation): JsonResponse
    {
        $user = $request->user();
        $this->authorizeParticipant($conversation, $user->id);

        $this->markAsRead($conversation, $user->id);

        $messages = $conversation->messages()
            ->with('sender:id,name,profile_picture')
            ->orderBy('created_at')
            ->get(['id', 'conversation_id', 'sender_id', 'body', 'read_at', 'created_at']);

        $otherUserId = $conversation->buyer_id === $user->id
            ? $conversation->seller_id
            : $conversation->buyer_id;

        $isOtherTyping = (bool) Cache::get($this->typingKey($conversation->id, $otherUserId), false);

        return response()->json([
            'messages' => $messages,
            'last_message_at' => $conversation->last_message_at,
            'is_other_typing' => $isOtherTyping,
        ]);
    }

    /**
     * Marks the current user as actively typing in this conversation.
     * Stored in cache with a short TTL so the indicator naturally fades
     * if the user stops sending pings.
     */
    public function typing(Request $request, Conversation $conversation): JsonResponse
    {
        $user = $request->user();
        $this->authorizeParticipant($conversation, $user->id);

        Cache::put($this->typingKey($conversation->id, $user->id), true, now()->addSeconds(5));

        return response()->json(['ok' => true]);
    }

    private function typingKey(int $conversationId, int $userId): string
    {
        return "typing:conv:{$conversationId}:user:{$userId}";
    }

    /**
     * Lightweight JSON endpoint polled by sidebar / conversation list (every ~10-15s).
     */
    public function pollList(Request $request): JsonResponse
    {
        $user = $request->user();

        $conversations = $this->loadConversationsFor($user->id);

        return response()->json([
            'conversations' => $conversations,
            'unread_count' => $user->unreadMessagesCount(),
        ]);
    }

    /**
     * Centralised loader so index() and pollList() return identical shape.
     */
    private function loadConversationsFor(int $userId)
    {
        return Conversation::query()
            ->where(function ($q) use ($userId) {
                $q->where('buyer_id', $userId)->orWhere('seller_id', $userId);
            })
            ->with([
                'property:id,title,price_total,type',
                'property.images' => function ($q) {
                    $q->orderBy('sort_order')->limit(1);
                },
                'buyer:id,name,profile_picture',
                'seller:id,name,profile_picture',
                'latestMessage',
            ])
            ->withCount(['messages as unread_count' => function ($q) use ($userId) {
                $q->whereNull('read_at')->where('sender_id', '!=', $userId);
            }])
            ->orderByDesc('last_message_at')
            ->orderByDesc('created_at')
            ->get();
    }

    private function authorizeParticipant(Conversation $conversation, int $userId): void
    {
        if ($conversation->buyer_id !== $userId && $conversation->seller_id !== $userId) {
            abort(403, 'You are not a participant in this conversation.');
        }
    }

    private function markAsRead(Conversation $conversation, int $userId): void
    {
        $conversation->messages()
            ->whereNull('read_at')
            ->where('sender_id', '!=', $userId)
            ->update(['read_at' => now()]);
    }
}
