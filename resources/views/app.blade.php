<html>
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <link rel="icon" type="image/png" href="/storage/Hari/haribon-smile.png">
        @viteReactRefresh
        @vite('resources/js/app.jsx')
        <x-inertia::head />
    </head>
    <body>
        <x-inertia::app />
    </body>
</html>