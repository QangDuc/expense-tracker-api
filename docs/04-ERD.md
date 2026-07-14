# Entity Relationship Diagram

```mermaid
erDiagram
 User ||--o{ Category : owns
 User ||--o{ Transaction : records
 User ||--o{ Budget : sets
 User ||--o{ RefreshToken : receives
 Category ||--o{ Transaction : classifies
 Category ||--o{ Budget : limits
```
