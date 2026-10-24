# Firestore data model (starter)

Use `/users/{uid}` for the owner profile. Store user-owned collections below that document to make ownership checks direct:

| Path | Suggested fields |
|---|---|
| `users/{uid}` | `displayName`, `username`, `country`, `language`, `timezone`, `dateOfBirth` (private), `roles[]`, `goals[]`, `createdAt`, `updatedAt` |
| `users/{uid}/avatars/current` | `skinTone`, `hairStyle`, `hairColor`, `eyeColor`, `clothing[]`, `accessories[]`, `animationPack`, `updatedAt` |
| `users/{uid}/quests/{questId}` | `title`, `description`, `category`, `difficulty`, `xp`, `coins`, `dueAt`, `reminder`, `recurrence`, `notes`, `status`, `createdAt` |
| `users/{uid}/chores/{choreId}` | `title`, `description`, `difficulty`, `xp`, `coins`, `reminder`, `repeatRules`, `imagePath`, `status` |
| `users/{uid}/campaigns/{campaignId}` | `title`, `duration`, `milestones[]`, `rewards[]`, `badgeId`, `status`, `createdAt` |
| `users/{uid}/userStats/current` | `health`, `strength`, `intelligence`, `discipline`, `relationships`, `xp`, `coins`, `level`, `updatedAt` |
| `users/{uid}/settings/private` | `systems{}`, `theme`, `locale`, `units`, `privacy`, `notifications` |
| `users/{uid}/notifications/{notificationId}` | `type`, `title`, `body`, `readAt`, `createdAt` |
| `users/{uid}/relationships/{relationshipId}` | `participants[]`, `milestones[]`, `privacy`, `createdAt` — avoid sensitive journal text in shared records |
| `publicCatalog/{collection}/{itemId}` | Admin-managed quest/campaign/achievement/store/avatar templates; public reads only |
| `guilds/{guildId}` | `name`, `type`, `ownerUid`, `memberUids[]`, aggregate `xp`, `level`, `privacy` |
| `guilds/{guildId}/messages/{messageId}` | `authorUid`, `body`, `createdAt`; apply membership and moderation checks before enabling chat |
| `adminReports/{reportId}` | Restricted server-side moderation records |

This is a starter model, not a scale-tested schema. Guild membership arrays and counters need sharding/transaction design at high volume. Do not store health, faith, relationship journals, or children's personal data in public documents. Never trust client-supplied XP, coin balances, admin role, or parent-child relationship claims; enforce rewards and guardian consent in trusted server code before launch.
