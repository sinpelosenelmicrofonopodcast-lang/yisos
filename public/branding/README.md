# Brand Logo Placement

Place the official YISOS logo image at:

`/public/yisos-logo.png`

Place the official YISOS banner/wordmark at:

`/public/yisos-banner.png`

Recommended export:
- Transparent background PNG
- Minimum 512x512
- Square crop focused on emblem
- Use the skull + helmet artwork shown in the brand reference
- Keep the olive helmet, gold skull, bone-white lettering, and brown cigar intact

The site header/footer load this file automatically via `components/layout/brand-logo.tsx`.
The hero and brand wordmark load the banner automatically via `components/layout/brand-wordmark.tsx`.
Generated brand assets now use these source files for:
- `/icon`
- `/apple-icon`
- `/opengraph-image`
- `/twitter-image`
