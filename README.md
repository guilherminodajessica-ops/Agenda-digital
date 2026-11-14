# Agenda Digital Escolar — versão demonstrativa

Primeira versão funcional, **sem banco de dados**, com dados fictícios e temporários.
Não há login real, senhas, cookies, `localStorage` nem `sessionStorage`. Ao atualizar a página, tudo volta ao estado inicial.

> ⚠️ Ambiente de demonstração. O acesso por perfil **não é seguro** e não deve ser usado em produção.

## Como executar

Requisitos: **Node.js 18.18 ou superior** (recomendado 20 ou 22) e npm.

```bash
cd agenda-digital-escolar
npm install
npm run dev
```

Abra **http://localhost:3000** no navegador.

Outros comandos:

| Comando | O que faz |
|---|---|
| `npm run dev` | servidor de desenvolvimento |
| `npm run build` e `npm start` | versão otimizada local |
| `npm run typecheck` | verificação de tipos do TypeScript |

## Como acessar as três áreas

Na tela inicial:

- **Sou aluno** → escolha um dos 8 alunos fictícios (ex.: *Ana Clara Souza*, 8º Ano A).
- **Sou professor** → escolha a matéria; cada matéria tem um professor fictício (ex.: Matemática — *Helena Duarte*).
- **Sou da administração** → entra direto como *Marta Albuquerque* (coordenação).

Outros recursos:
- **Sobre o projeto** (`/sobre`): objetivo, problema, processo, resultado, animação, conteúdos da disciplina, exportação em CSV, declaração de uso de IA e fontes. Preencha autor, equipamento e o endereço do vídeo em `src/data/project-info.ts`.
- **Modo explicação** (botão flutuante): muda as cores e explica cada elemento ao passar o mouse. Os textos ficam nos atributos `data-explain` dos componentes.

Use **Trocar perfil** no topo para alternar. Um bom roteiro de demonstração:
1. Professora de Matemática → escolha a sala **8º Ano A** → *Lançar compromisso*.
2. Trocar perfil → aluna Ana Clara → *Calendário*: a prova já aparece.
3. Criar um **Planejamento**: aparece para o professor (com cadeado), mas não para os alunos.

## Estrutura de pastas

```
src/
├── app/                      Páginas (Next.js App Router)
│   ├── page.tsx              Tela de acesso demonstrativo
│   ├── aluno/                Painel e calendário do estudante
│   ├── professor/            Painel, lista de compromissos e calendário
│   └── admin/                Painel administrativo
├── components/
│   ├── ui/                   Botões, cards, janelas, avisos, campos, ícones
│   ├── layout/               Estrutura das áreas (cabeçalho, navegação, marca)
│   ├── calendar/             Grade mensal, navegação, filtros, detalhes
│   ├── forms/                Formulário de compromisso
│   ├── student/ teacher/ admin/   Telas de cada perfil
├── data/mock-data.ts         Dados fictícios
├── services/                 Camada de dados (contratos + implementação em memória)
├── state/                    Estado compartilhado (sessão e dados)
├── lib/                      Regras de funcionamento, datas, validação
└── types/                    Tipos e interfaces TypeScript
```

## Como integrar um banco de dados no futuro

A interface nunca acessa os dados diretamente: ela usa os **contratos** em `src/services/contracts.ts`
(`EventRepository`, `SchoolRepository`, `CompletionRepository`). Hoje eles são implementados em memória
(`src/services/in-memory/`). Para usar um banco:

1. Criar a API/rotas de servidor (ex.: Route Handlers do Next.js) conectadas ao banco escolhido.
2. Criar novas implementações dos contratos que chamam essa API (ex.: `services/api/event-repository.ts`).
3. Trocar as implementações em `src/services/index.ts`.
4. Substituir a sessão demonstrativa (`src/state/session-context.tsx`) por autenticação real.

Os componentes, o calendário e as regras (`src/lib/event-rules.ts`) permanecem iguais. Os métodos já são
assíncronos (com latência simulada) justamente para facilitar essa troca.

## Limitações desta versão

- Dados somem ao atualizar a página (por decisão de projeto).
- Sem autenticação: qualquer pessoa pode escolher qualquer perfil.
- Datas dos dados fictícios são calculadas a partir do dia atual, para sempre existir uma prova próxima, uma atividade vencida etc.
- Administração permite apenas alterações demonstrativas (editar professores e alunos, mover aluno de turma, criar/remover vínculos, excluir compromissos); não cria usuários.
- Sem notificações, e-mails, notas, chat ou publicação na internet.
