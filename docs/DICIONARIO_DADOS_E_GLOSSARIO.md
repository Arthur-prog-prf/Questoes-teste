# 📖 Dicionário de Dados e Glossário
## Sistema de Gestão de Estudos para Concursos

---

## 🎯 **VISÃO GERAL DO APLICATIVO**

### **Propósito Principal**
Sistema completo para organização de estudos voltados para **concursos públicos** e **vestibulares**, com foco em:
- Planejamento de cronogramas de estudo
- Controle de progresso por matéria/tópico
- Análise de desempenho e estatísticas
- Gamificação através de conquistas

---

## 🏗️ **ESTRUTURA PRINCIPAL DO APP**

### **6 Módulos Principais:**

| Módulo | Finalidade | Complexidade |
|--------|------------|--------------|
| **📅 Painel de Hoje** | Dashboard diário com timer e tarefas | ⭐⭐ Simples |
| **📋 Planejamento** | Agenda semanal/diária de estudos | ⭐⭐⭐ Médio |
| **📚 Gerenciador de Edital** | Controle de tópicos do edital | ⭐⭐⭐⭐ Complexo |
| **⚙️ Central de Tarefas** | Workspace avançado de gerenciamento | ⭐⭐⭐⭐⭐ Muito Complexo |
| **📊 Análise** | Gráficos e estatísticas de desempenho | ⭐⭐⭐ Médio |
| **🏆 Conquistas** | Sistema de gamificação e medalhas | ⭐⭐ Simples |

---

## 📊 **DICIONÁRIO DE DADOS**

### **ENTIDADES PRINCIPAIS**

#### **1. TAREFAS (Tasks)**
```
📝 Tarefa/Task
├── id: Identificador único
├── título: Nome da tarefa de estudo
├── matéria: Disciplina (matemática, português, direito, etc.)
├── tópico: Assunto específico dentro da matéria
├── descrição: Detalhes do que será estudado
├── status: Estado atual
│   ├── "todo" = A fazer
│   ├── "in_progress" = Em andamento  
│   ├── "completed" = Concluída
│   └── "cancelled" = Cancelada
├── prioridade: Urgência/Importância
│   ├── "baixa" = Pode aguardar
│   ├── "media" = Importante
│   └── "alta" = Urgente/Crítica
├── duração_estimada: Tempo previsto (em horas)
├── duração_real: Tempo efetivamente gasto
├── data_criação: Quando foi criada
├── data_vencimento: Prazo limite
├── porcentagem_conclusão: 0-100%
├── dificuldade: Nível de 1-5
└── tags: Etiquetas para organização
```

#### **2. MATÉRIAS/DISCIPLINAS (Subjects)**
```
📖 Matéria
├── id: Identificador único
├── nome: Nome da disciplina
├── tópicos: Lista de assuntos
├── progresso_geral: 0-100%
├── tempo_total_estudado: Horas acumuladas
├── última_sessão: Data do último estudo
└── status_dominio: 
    ├── "iniciante" = 0-25%
    ├── "básico" = 26-50%
    ├── "intermediário" = 51-75%
    └── "avançado" = 76-100%
```

#### **3. TÓPICOS DO EDITAL (Topics)**
```
📑 Tópico
├── id: Identificador único
├── nome: Nome do tópico
├── matéria_id: Qual disciplina pertence
├── status: Estado de aprendizado
│   ├── "not-studied" = Não estudado
│   ├── "studying" = Estudando
│   ├── "review" = Em revisão
│   └── "mastered" = Dominado
├── porcentagem_dominio: 0-100%
├── última_estudada: Data do último estudo
├── notas: Anotações pessoais
└── erros_frequentes: Lista de dificuldades
```

#### **4. SESSÕES DE ESTUDO (Study Sessions)**
```
⏱️ Sessão de Estudo
├── id: Identificador único
├── data_início: Quando começou
├── data_fim: Quando terminou
├── duração: Tempo total
├── matéria: Disciplina estudada
├── tópico: Assunto específico
├── tipo_sessão:
│   ├── "leitura" = Estudo teórico
│   ├── "exercicios" = Resolução de questões
│   ├── "revisao" = Revisão de conteúdo
│   └── "simulado" = Prova simulada
├── produtividade: Avaliação 1-5
├── dificuldades: Problemas encontrados
└── próximos_passos: O que fazer depois
```

#### **5. ESTATÍSTICAS (Analytics)**
```
📈 Estatística
├── data: Dia da medição
├── tempo_total_estudo: Horas estudadas
├── matérias_estudadas: Lista de disciplinas
├── tarefas_concluídas: Quantidade finalizada
├── média_notas: Score médio das avaliações
├── frequência_estudo: Dias por semana
├── horário_mais_produtivo: Melhor período
└── pontos_fracos: Matérias com dificuldade
```

---

## 🔤 **GLOSSÁRIO DE TERMOS**

### **TERMOS GERAIS**

| Termo | Significado | Exemplo |
|-------|-------------|---------|
| **Edital** | Documento oficial com todos os tópicos do concurso | "Edital do INSS 2024" |
| **Cronograma** | Planejamento de estudos por tempo | "2 horas de matemática segunda-feira" |
| **Ciclo de Estudos** | Sequência de matérias que se repete | "Português → Matemática → Direito" |
| **Revisão Espaçada** | Técnica de revisar em intervalos crescentes | "Reviso hoje, 3 dias, 1 semana, 1 mês" |
| **Meta** | Objetivo a ser alcançado | "80% de acerto em matemática" |
| **Sessão** | Período contínuo de estudo | "Estudei 2 horas corridas" |
| **Pomodoro** | Técnica de 25min estudo + 5min pausa | "Fiz 4 pomodoros de português" |

### **TERMOS DO SISTEMA**

| Termo | O que significa | Onde aparece |
|-------|-----------------|--------------|
| **Dashboard/Painel** | Tela principal com resumo | "Painel de Hoje" |
| **Widget** | Pequeno componente na tela | "Widget de progresso" |
| **Timeline** | Linha do tempo/cronologia | "Timeline de estudos" |
| **Radar Chart** | Gráfico circular de habilidades | "Radar de domínio por matéria" |
| **Bulk Actions** | Ações em massa/lote | "Marcar várias tarefas como concluídas" |
| **Filtro** | Ferramenta para mostrar apenas alguns itens | "Mostrar só tarefas de matemática" |
| **Tag** | Etiqueta para categorizar | "Tag: #exercicios #revisao" |
| **Progress Bar** | Barra de progresso visual | "75% concluído" |

### **FUNCIONALIDADES POR TELA**

#### **🏠 PAINEL DE HOJE** *(Tela inicial - SIMPLES)*
- **Timer de Estudo**: Cronômetro para sessões
- **Progresso Diário**: Quanto já estudou hoje
- **Tarefas de Hoje**: O que precisa fazer
- **Ações Rápidas**: Botões para iniciar estudos
- **Revisões Programadas**: Conteúdos para revisar

#### **📅 PLANEJAMENTO** *(Agenda de estudos - MÉDIO)*
- **Visão Semanal**: Calendário da semana
- **Visão Diária**: Horários do dia (24h)
- **Biblioteca de Tarefas**: Lista de pendências
- **Drag & Drop**: Arrastar tarefas para horários
- **Ações Rápidas**: 
  - Copiar semana
  - Limpar agenda
  - Exportar cronograma

#### **📚 GERENCIADOR DE EDITAL** *(Controle de tópicos - COMPLEXO)*
- **Lista de Matérias**: Disciplinas do concurso
- **Tópicos por Matéria**: Assuntos específicos
- **Status de Domínio**:
  - 🔴 Não estudado
  - 🟡 Estudando  
  - 🟠 Revisando
  - 🟢 Dominado
- **Bulk Actions**: Alterar vários tópicos juntos
- **Filtros**: Por matéria, status, data
- **Notas**: Anotações por tópico

#### **⚙️ CENTRAL DE TAREFAS** *(Workspace avançado - MUITO COMPLEXO)*
- **Biblioteca Avançada**: Lista completa de tarefas
- **Motor de Busca**: Encontrar tarefas específicas
- **Operações em Lote**: Ações múltiplas
- **Otimização de Estudos**: IA para sugestões
- **Histórico Completo**: Log de todas as ações
- **Dicas Inteligentes**: Recomendações automáticas

#### **📊 ANÁLISE/ESTATÍSTICAS** *(Relatórios - MÉDIO)*
- **Métricas Resumo**: Números principais
- **Gráfico Tempo**: Horas por dia/semana
- **Evolução Notas**: Progresso ao longo tempo
- **Radar Matérias**: Domínio por disciplina
- **Pontos Fracos**: Onde precisa melhorar
- **Insights Automáticos**: Sugestões baseadas em dados

#### **🏆 CONQUISTAS** *(Gamificação - SIMPLES)*
- **Medalhas**: Premiações por objetivos
- **Streaks**: Sequências de dias estudando
- **Progresso Geral**: Avanço nas metas
- **Compartilhamento**: Publicar conquistas
- **Categorias**: Tipos diferentes de prêmios

---

## ⚡ **AÇÕES E BOTÕES PRINCIPAIS**

### **Botões que você vai usar SEMPRE:**
- **"+ Nova Tarefa"** → Criar nova atividade de estudo
- **"Iniciar Timer"** → Começar sessão de estudo
- **"Marcar como Concluído"** → Finalizar tarefa
- **"Agendar"** → Colocar tarefa na agenda
- **"Filtrar"** → Mostrar apenas alguns itens

### **Botões para uso OCASIONAL:**
- **"Copiar Semana"** → Repetir agenda atual
- **"Exportar"** → Salvar relatórios
- **"Bulk Actions"** → Alterar várias coisas juntas
- **"Otimizar"** → Deixar o sistema sugerir melhorias

---

## 🎯 **FLUXO TÍPICO DE USO** 

### **📱 USO DIÁRIO (5-10 minutos):**
1. Abrir **"Painel de Hoje"**
2. Ver tarefas do dia
3. **Iniciar timer** para estudar
4. **Marcar tarefas como concluídas**
5. Verificar progresso diário

### **📅 PLANEJAMENTO SEMANAL (15-30 minutos):**
1. Ir para **"Planejamento"** 
2. Arrastar tarefas para horários específicos
3. Equilibrar matérias na semana
4. Salvar/exportar cronograma

### **📊 ANÁLISE MENSAL (10-15 minutos):**
1. Acessar **"Análise/Estatísticas"**
2. Ver gráficos de evolução
3. Identificar pontos fracos
4. Ajustar estratégias de estudo

---

## 🚨 **SUGESTÕES DE SIMPLIFICAÇÃO**

### **❌ REMOVER/OCULTAR** *(Para simplificar)*:
- **Central de Tarefas** → Muito complexa, usar só o básico
- **Bulk Actions** → Ações em massa confundem
- **Otimização IA** → Recursos avançados desnecessários
- **Múltiplas visualizações** → Manter só uma por tela
- **Histórico detalhado** → Simplificar logs

### **✅ MANTER/PRIORIZAR** *(Essencial)*:
- **Painel de Hoje** → Core do app
- **Timer de estudos** → Funcionalidade principal  
- **Lista simples de tarefas** → Básico e útil
- **Calendário simples** → Apenas semanal
- **Progresso visual** → Motivação importante

### **🔄 SIMPLIFICAR** *(Manter mas reduzir)*:
- **Edital** → Apenas lista simples, sem complexidade
- **Estatísticas** → Só gráficos básicos
- **Filtros** → Apenas por matéria
- **Configurações** → Reduzir opções

---

## 📋 **RESUMO EXECUTIVO**

### **O QUE O APP FAZ:**
- ✅ **Organiza** seus estudos por matéria e tópico
- ✅ **Agenda** horários específicos para cada assunto  
- ✅ **Cronometra** tempo de estudo com timer
- ✅ **Acompanha** progresso e evolução
- ✅ **Analisa** desempenho com gráficos
- ✅ **Motiva** através de conquistas e metas

### **PARA QUE SERVE:**
- 🎯 **Concursos públicos** (principal foco)
- 🎓 **Vestibulares e ENEM** 
- 📚 **Estudos organizados** em geral
- ⏰ **Gestão de tempo** de estudos
- 📈 **Acompanhamento de progresso**

### **PÚBLICO-ALVO:**
- 👨‍🎓 **Concurseiros** (principal)
- 👩‍🎓 **Vestibulandos**
- 📖 **Estudantes autodidatas**
- 💼 **Profissionais estudando**

---

*Este dicionário deve ser sua referência sempre que tiver dúvidas sobre qualquer funcionalidade do sistema. Use-o para entender cada tela e botão antes de utilizar.*

**💡 DICA:** Comece usando apenas o **"Painel de Hoje"** e vá descobrindo as outras funcionalidades gradualmente!