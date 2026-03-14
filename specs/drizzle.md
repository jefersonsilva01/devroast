# SPEC: Drizzle ORM + PostgreSQL

## 1. Visão Geral

- **Database**: PostgreSQL com Docker Compose
- **ORM**: Drizzle ORM
- **Persistência**: Completa (código, pontuação, feedback, líder público)

---

## 2. Docker Compose

```yaml
# docker-compose.yml
services:
  postgres:
    image: postgres:16-alpine
    container_name: devroast-db
    environment:
      POSTGRES_USER: devroast
      POSTGRES_PASSWORD: devroast
      POSTGRES_DB: devroast
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### Variáveis de Ambiente (.env)

```env
DATABASE_URL=postgresql://devroast:devroast@localhost:5432/devroast
```

---

## 3. Tabelas

### 3.1 submissions

Armazena as submissões de código.

| Coluna | Tipo | Constraints | Descrição |
|--------|------|-------------|-----------|
| id | uuid | PK, DEFAULT gen_random_uuid() | ID único |
| code | text | NOT NULL | Código submetido |
| language | varchar(50) | NOT NULL | Linguagem detectada/selecionada |
| roast_mode | boolean | NOT NULL, DEFAULT false | Modo roast (sarcástico) |
| score | decimal(3,1) | NOT NULL | Pontuação (0-10) |
| roast_message | text | NOT NULL | Mensagem de roast |
| issues | jsonb | DEFAULT '[]' | Array de issues encontradas |
| created_at | timestamptz | NOT NULL, DEFAULT now() | Data de criação |
| session_id | varchar(255) | NOT NULL, INDEX | ID de sessão anônima (cookie/localStorage) |

### 3.2 sessions

Armazena sessões anônimas para identificar usuários sem auth.

| Coluna | Tipo | Constraints | Descrição |
|--------|------|-------------|-----------|
| id | uuid | PK, DEFAULT gen_random_uuid() | ID único |
| session_token | varchar(255) | NOT NULL, UNIQUE | Token único para identificar browser |
| total_submissions | integer | NOT NULL, DEFAULT 0 | Total de códigos submetidos |
| average_score | decimal(3,1) | NOT NULL, DEFAULT 0 | Média de pontuação |
| best_score | decimal(3,1) | NOT NULL, DEFAULT 10 | Melhor pontuação (menor = pior) |
| created_at | timestamptz | NOT NULL, DEFAULT now() | Data de criação |
| updated_at | timestamptz | NOT NULL, DEFAULT now() | Última atualização |

---

## 4. Enums

### roast_mode

| Valor | Descrição |
|-------|-----------|
| honest | Feedback honesto |
| sarcastic | Modo roast máximo |

### score_category

| Valor | Descrição |
|-------|-----------|
| terrible | 0-2 |
| bad | 2-4 |
| okay | 4-6 |
| good | 6-8 |
| great | 8-10 |

---

## 5. Estrutura de Arquivos

```
src/
├── db/
│   ├── index.ts           # Conexão com banco
│   ├── schema.ts          # Definição de tabelas
│   ├── types.ts           # Tipos inferidos do Drizzle
│   └── migrations/        # Migrações do Drizzle
├── lib/
│   └── db.ts             # Singleton de conexão
```

---

## 6. To-Dos

### Setup

- [ ] Adicionar dependências (drizzle-orm, postgres, drizzle-kit)
- [ ] Criar docker-compose.yml com PostgreSQL
- [ ] Criar arquivo .env com DATABASE_URL
- [ ] Configurar Drizzle config (drizzle.config.ts)

### Schema

- [ ] Criar schema com tabelas submissions e sessions
- [ ] Definir enums roast_mode e score_category
- [ ] Criar índices em session_id e created_at

### Migrations

- [ ] Gerar migração inicial com drizzle-kit
- [ ] Executar migração

### Queries

- [ ] Criar repository functions:
  - `createSubmission(data)` → insert
  - `getLeaderboard(limit, offset)` → select ordered by score ASC
  - `getSubmissionById(id)` → select single
  - `getOrCreateSession(token)` → upsert
  - `updateSessionStats(sessionId)` → update aggregates

### Integração UI

- [ ] Substituir MOCK_CODE e dados mock por queries reais
- [ ] Adicionar Server Actions para submissão
- [ ] Implementar leaderboard com paginação

---

## 7. Dependencies

```bash
npm install drizzle-orm postgres dotenv
npm install -D drizzle-kit
```

---

## 8. Queries Comuns

### Criar submissão

```typescript
await db.insert(submissions).values({
  code,
  language,
  roastMode: false,
  score: 4.2,
  roastMessage: "...",
  issues: [],
  sessionId: session.id,
});
```

### Leaderboard (pior código primeiro)

```typescript
const leaderboard = await db
  .select()
  .from(submissions)
  .orderBy(asc(submissions.score))
  .limit(10);
```

### Estatísticas globais

```typescript
const stats = await db
  .select({
    total: count(),
    avgScore: avg(submissions.score),
  })
  .from(submissions);
```
