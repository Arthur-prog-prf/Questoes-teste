-- =========== ATENÇÃO: FAÇA UM BACKUP ANTES DE EXECUTAR =============
-- Este script fará alterações estruturais e de segurança no seu banco de dados.

-- =========== PASSO 1: Adicionar colunas de propriedade do usuário ===========
-- Adiciona a coluna user_id para rastrear quem criou cada matéria.
ALTER TABLE public.subjects ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
-- Adiciona a coluna user_id para rastrear quem criou cada tópico.
ALTER TABLE public.topics ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;


-- =========== PASSO 2: Remover as políticas de RLS antigas e restritivas ===========
DROP POLICY IF EXISTS "users_manage_own_user_profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "public_can_read_subjects" ON public.subjects;
DROP POLICY IF EXISTS "admin_manage_subjects" ON public.subjects;
DROP POLICY IF EXISTS "public_can_read_topics" ON public.topics;
DROP POLICY IF EXISTS "admin_manage_topics" ON public.topics;
DROP POLICY IF EXISTS "users_manage_own_tasks" ON public.tasks;
DROP POLICY IF EXISTS "users_manage_own_study_sessions" ON public.study_sessions;
DROP POLICY IF EXISTS "users_manage_own_weekly_schedules" ON public.weekly_schedules;
DROP POLICY IF EXISTS "users_manage_own_daily_progress" ON public.daily_progress;
DROP POLICY IF EXISTS "users_view_own_task_history" ON public.task_history;
DROP POLICY IF EXISTS "users_manage_own_quick_templates" ON public.quick_task_templates;


-- =========== PASSO 3: Habilitar RLS em todas as tabelas (Garantia) ===========
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quick_task_templates ENABLE ROW LEVEL SECURITY;


-- =========== PASSO 4: Criar as novas políticas de segurança (RLS) corrigidas ===========

-- Tabela: user_profiles
-- Apenas o próprio usuário pode ver e editar seu perfil.
CREATE POLICY "Users can manage their own profile"
ON public.user_profiles FOR ALL
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Tabela: subjects
-- Permite que todos vejam as matérias, mas apenas o dono (ou quem não tem dono, se for público) pode gerenciar.
CREATE POLICY "Subjects are viewable by everyone"
ON public.subjects FOR SELECT
USING (true);

CREATE POLICY "Users can insert their own subjects"
ON public.subjects FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subjects"
ON public.subjects FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own subjects"
ON public.subjects FOR DELETE
USING (auth.uid() = user_id);

-- Tabela: topics
-- Mesma lógica da tabela de matérias.
CREATE POLICY "Topics are viewable by everyone"
ON public.topics FOR SELECT
USING (true);

CREATE POLICY "Users can insert their own topics"
ON public.topics FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own topics"
ON public.topics FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own topics"
ON public.topics FOR DELETE
USING (auth.uid() = user_id);

-- Tabela: tasks
-- Apenas o dono da tarefa pode gerenciá-la.
CREATE POLICY "Users can manage their own tasks"
ON public.tasks FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Tabela: study_sessions
-- Apenas o dono da sessão de estudo pode gerenciá-la.
CREATE POLICY "Users can manage their own study sessions"
ON public.study_sessions FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Tabela: weekly_schedules
CREATE POLICY "Users can manage their own weekly schedules"
ON public.weekly_schedules FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Tabela: daily_progress
CREATE POLICY "Users can manage their own daily progress"
ON public.daily_progress FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Tabela: task_history
CREATE POLICY "Users can view their own task history"
ON public.task_history FOR SELECT
USING (auth.uid() = user_id);

-- Tabela: quick_task_templates
CREATE POLICY "Users can manage their own quick templates"
ON public.quick_task_templates FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- =========== PASSO 5: Atualizar a função de criação de usuário para incluir o user_id ===========
-- É importante que as novas matérias e tópicos tenham o ID do usuário que as criou.
-- Vamos ajustar a função `createSubject` e `createTopic` no frontend, mas no banco
-- a função de novo usuário permanece a mesma, pois ela lida com a tabela `user_profiles`.

-- Recriar a função handle_new_user (sem alterações, mas para garantir que existe)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'student')::public.user_role
  );
  RETURN NEW;
END;
$$;

-- Recriar os triggers (garantindo que estão ativos)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Recriar os outros triggers...
DROP TRIGGER IF EXISTS on_task_change ON public.tasks;
CREATE TRIGGER on_task_change
  AFTER INSERT OR UPDATE OR DELETE ON public.tasks
  FOR EACH ROW EXECUTE FUNCTION public.update_daily_progress();

DROP TRIGGER IF EXISTS on_task_history ON public.tasks;
CREATE TRIGGER on_task_history
  AFTER INSERT OR UPDATE OR DELETE ON public.tasks
  FOR EACH ROW EXECUTE FUNCTION public.log_task_history();
