-- Location: supabase/migrations/20251005040545_task_management_system.sql
-- Schema Analysis: No existing schema found - creating complete task management system
-- Integration Type: New module implementation with authentication
-- Dependencies: Authentication system required

-- 1. Types and Enums
CREATE TYPE public.task_status AS ENUM ('todo', 'in_progress', 'completed', 'paused', 'cancelled');
CREATE TYPE public.task_priority AS ENUM ('baixa', 'media', 'alta', 'urgente');
CREATE TYPE public.user_role AS ENUM ('admin', 'student', 'teacher');
CREATE TYPE public.subject_area AS ENUM ('matematica', 'portugues', 'direito', 'informatica', 'atualidades', 'fisica', 'quimica', 'biologia', 'historia', 'geografia');

-- 2. Core Tables (no foreign keys)
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    role public.user_role DEFAULT 'student'::public.user_role,
    total_study_hours DECIMAL(10,2) DEFAULT 0,
    weekly_goal_hours DECIMAL(5,2) DEFAULT 20,
    preferred_study_time TIME DEFAULT '09:00:00',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    area public.subject_area NOT NULL,
    description TEXT,
    color_code TEXT DEFAULT '#3B82F6',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.topics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    difficulty_level INTEGER DEFAULT 1 CHECK (difficulty_level >= 1 AND difficulty_level <= 5),
    estimated_hours DECIMAL(5,2) DEFAULT 2.0,
    prerequisites TEXT[],
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(subject_id, name)
);

-- 3. Dependent Tables (with foreign keys)
CREATE TABLE public.tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
    topic_id UUID REFERENCES public.topics(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    task_status public.task_status DEFAULT 'todo'::public.task_status,
    priority public.task_priority DEFAULT 'media'::public.task_priority,
    estimated_duration DECIMAL(5,2) NOT NULL DEFAULT 1.0,
    actual_duration DECIMAL(5,2) DEFAULT 0,
    scheduled_date DATE,
    scheduled_start_time TIME,
    scheduled_end_time TIME,
    due_date DATE,
    completion_percentage INTEGER DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMPTZ
);

CREATE TABLE public.study_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ,
    duration_minutes INTEGER,
    productivity_score INTEGER CHECK (productivity_score >= 1 AND productivity_score <= 10),
    notes TEXT,
    break_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.weekly_schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    week_start_date DATE NOT NULL,
    total_planned_hours DECIMAL(5,2) DEFAULT 0,
    total_completed_hours DECIMAL(5,2) DEFAULT 0,
    weekly_goal_hours DECIMAL(5,2) DEFAULT 20,
    completion_rate DECIMAL(5,2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, week_start_date)
);

CREATE TABLE public.daily_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    progress_date DATE NOT NULL,
    planned_hours DECIMAL(5,2) DEFAULT 0,
    completed_hours DECIMAL(5,2) DEFAULT 0,
    completed_tasks INTEGER DEFAULT 0,
    total_tasks INTEGER DEFAULT 0,
    productivity_score DECIMAL(3,2) DEFAULT 0 CHECK (productivity_score >= 0 AND productivity_score <= 10),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, progress_date)
);

CREATE TABLE public.task_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    action_type TEXT NOT NULL, -- 'created', 'updated', 'scheduled', 'completed', 'deleted'
    old_values JSONB,
    new_values JSONB,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.quick_task_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
    topic_id UUID REFERENCES public.topics(id) ON DELETE SET NULL,
    default_duration DECIMAL(5,2) DEFAULT 1.0,
    default_priority public.task_priority DEFAULT 'media'::public.task_priority,
    description_template TEXT,
    is_favorite BOOLEAN DEFAULT false,
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 4. Create immutable date extraction function
CREATE OR REPLACE FUNCTION public.extract_date_immutable(timestamptz)
RETURNS DATE
LANGUAGE SQL
IMMUTABLE STRICT PARALLEL SAFE
AS $$
    SELECT $1::DATE;
$$;

-- 5. Indexes
CREATE INDEX idx_user_profiles_role ON public.user_profiles(role);
CREATE INDEX idx_subjects_area ON public.subjects(area, is_active);
CREATE INDEX idx_topics_subject_id ON public.topics(subject_id, is_active);
CREATE INDEX idx_tasks_user_id ON public.tasks(user_id);
CREATE INDEX idx_tasks_subject_id ON public.tasks(subject_id);
CREATE INDEX idx_tasks_status ON public.tasks(task_status);
CREATE INDEX idx_tasks_scheduled_date ON public.tasks(scheduled_date);
CREATE INDEX idx_tasks_due_date ON public.tasks(due_date);
CREATE INDEX idx_study_sessions_user_id ON public.study_sessions(user_id);
CREATE INDEX idx_study_sessions_date ON public.study_sessions(public.extract_date_immutable(start_time));
CREATE INDEX idx_weekly_schedules_user_week ON public.weekly_schedules(user_id, week_start_date);
CREATE INDEX idx_daily_progress_user_date ON public.daily_progress(user_id, progress_date);
CREATE INDEX idx_task_history_task_id ON public.task_history(task_id);
CREATE INDEX idx_task_history_user_id ON public.task_history(user_id);
CREATE INDEX idx_quick_templates_user_id ON public.quick_task_templates(user_id);

-- 6. Functions (MUST BE BEFORE RLS POLICIES)
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

CREATE OR REPLACE FUNCTION public.update_daily_progress()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
DECLARE
    target_date DATE;
    total_planned DECIMAL(5,2);
    total_completed DECIMAL(5,2);
    total_tasks_count INTEGER;
    completed_tasks_count INTEGER;
BEGIN
    -- Determine target date
    target_date := CASE 
        WHEN TG_OP = 'DELETE' THEN OLD.scheduled_date
        ELSE NEW.scheduled_date
    END;
    
    IF target_date IS NULL THEN
        target_date := CURRENT_DATE;
    END IF;
    
    -- Calculate metrics for the user and date
    SELECT 
        COALESCE(SUM(estimated_duration), 0),
        COALESCE(SUM(CASE WHEN task_status = 'completed' THEN actual_duration ELSE 0 END), 0),
        COUNT(*),
        COUNT(CASE WHEN task_status = 'completed' THEN 1 END)
    INTO total_planned, total_completed, total_tasks_count, completed_tasks_count
    FROM public.tasks
    WHERE user_id = COALESCE(NEW.user_id, OLD.user_id)
    AND scheduled_date = target_date;
    
    -- Insert or update daily progress
    INSERT INTO public.daily_progress (user_id, progress_date, planned_hours, completed_hours, total_tasks, completed_tasks)
    VALUES (
        COALESCE(NEW.user_id, OLD.user_id),
        target_date,
        total_planned,
        total_completed,
        total_tasks_count,
        completed_tasks_count
    )
    ON CONFLICT (user_id, progress_date)
    DO UPDATE SET
        planned_hours = EXCLUDED.planned_hours,
        completed_hours = EXCLUDED.completed_hours,
        total_tasks = EXCLUDED.total_tasks,
        completed_tasks = EXCLUDED.completed_tasks,
        productivity_score = CASE 
            WHEN EXCLUDED.planned_hours > 0 
            THEN (EXCLUDED.completed_hours / EXCLUDED.planned_hours) * 10
            ELSE 0
        END,
        updated_at = CURRENT_TIMESTAMP;
        
    RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE OR REPLACE FUNCTION public.log_task_history()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
DECLARE
    action_desc TEXT;
    old_vals JSONB;
    new_vals JSONB;
BEGIN
    -- Determine action type and description
    IF TG_OP = 'INSERT' THEN
        action_desc := 'Tarefa criada';
        old_vals := NULL;
        new_vals := to_jsonb(NEW);
    ELSIF TG_OP = 'UPDATE' THEN
        IF OLD.task_status != NEW.task_status THEN
            action_desc := 'Status alterado de ' || OLD.task_status || ' para ' || NEW.task_status;
        ELSE
            action_desc := 'Tarefa atualizada';
        END IF;
        old_vals := to_jsonb(OLD);
        new_vals := to_jsonb(NEW);
    ELSIF TG_OP = 'DELETE' THEN
        action_desc := 'Tarefa excluída';
        old_vals := to_jsonb(OLD);
        new_vals := NULL;
    END IF;
    
    -- Insert history record
    INSERT INTO public.task_history (task_id, user_id, action_type, old_values, new_values, description)
    VALUES (
        COALESCE(NEW.id, OLD.id),
        COALESCE(NEW.user_id, OLD.user_id),
        TG_OP,
        old_vals,
        new_vals,
        action_desc
    );
    
    RETURN COALESCE(NEW, OLD);
END;
$$;

-- 7. Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quick_task_templates ENABLE ROW LEVEL SECURITY;

-- 8. RLS Policies
-- Pattern 1: Core user table (user_profiles)
CREATE POLICY "users_manage_own_user_profiles"
ON public.user_profiles
FOR ALL
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Pattern 4: Public read, private write for subjects and topics
CREATE POLICY "public_can_read_subjects"
ON public.subjects
FOR SELECT
TO public
USING (is_active = true);

CREATE POLICY "admin_manage_subjects"
ON public.subjects
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.user_profiles up
        WHERE up.id = auth.uid() AND up.role = 'admin'
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.user_profiles up
        WHERE up.id = auth.uid() AND up.role = 'admin'
    )
);

CREATE POLICY "public_can_read_topics"
ON public.topics
FOR SELECT
TO public
USING (is_active = true);

CREATE POLICY "admin_manage_topics"
ON public.topics
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.user_profiles up
        WHERE up.id = auth.uid() AND up.role = 'admin'
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.user_profiles up
        WHERE up.id = auth.uid() AND up.role = 'admin'
    )
);

-- Pattern 2: Simple user ownership for all user-specific tables
CREATE POLICY "users_manage_own_tasks"
ON public.tasks
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "users_manage_own_study_sessions"
ON public.study_sessions
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "users_manage_own_weekly_schedules"
ON public.weekly_schedules
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "users_manage_own_daily_progress"
ON public.daily_progress
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "users_view_own_task_history"
ON public.task_history
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "users_manage_own_quick_templates"
ON public.quick_task_templates
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- 9. Triggers
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TRIGGER on_task_change
  AFTER INSERT OR UPDATE OR DELETE ON public.tasks
  FOR EACH ROW EXECUTE FUNCTION public.update_daily_progress();

CREATE TRIGGER on_task_history
  AFTER INSERT OR UPDATE OR DELETE ON public.tasks
  FOR EACH ROW EXECUTE FUNCTION public.log_task_history();

-- 10. Mock Data
DO $$
DECLARE
    admin_uuid UUID := gen_random_uuid();
    student_uuid UUID := gen_random_uuid();
    mat_subject_id UUID := gen_random_uuid();
    port_subject_id UUID := gen_random_uuid();
    dir_subject_id UUID := gen_random_uuid();
    inf_subject_id UUID := gen_random_uuid();
    atu_subject_id UUID := gen_random_uuid();
    mat_topic1_id UUID := gen_random_uuid();
    mat_topic2_id UUID := gen_random_uuid();
    port_topic1_id UUID := gen_random_uuid();
    dir_topic1_id UUID := gen_random_uuid();
    inf_topic1_id UUID := gen_random_uuid();
    atu_topic1_id UUID := gen_random_uuid();
BEGIN
    -- Create auth users with required fields
    INSERT INTO auth.users (
        id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
        created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
        is_sso_user, is_anonymous, confirmation_token, confirmation_sent_at,
        recovery_token, recovery_sent_at, email_change_token_new, email_change,
        email_change_sent_at, email_change_token_current, email_change_confirm_status,
        reauthentication_token, reauthentication_sent_at, phone, phone_change,
        phone_change_token, phone_change_sent_at
    ) VALUES
        (admin_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'admin@estudos.com', crypt('admin123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Admin Sistema", "role": "admin"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (student_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'aluno@estudos.com', crypt('aluno123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Aluno Estudioso", "role": "student"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null);

    -- Insert subjects
    INSERT INTO public.subjects (id, name, area, description, color_code) VALUES
        (mat_subject_id, 'Matemática', 'matematica', 'Disciplina de raciocínio lógico e cálculos', '#3B82F6'),
        (port_subject_id, 'Português', 'portugues', 'Língua portuguesa e literatura', '#10B981'),
        (dir_subject_id, 'Direito', 'direito', 'Ciências jurídicas e legislação', '#8B5CF6'),
        (inf_subject_id, 'Informática', 'informatica', 'Tecnologia da informação e computação', '#F59E0B'),
        (atu_subject_id, 'Atualidades', 'atualidades', 'Eventos atuais e conhecimentos gerais', '#EF4444');

    -- Insert topics
    INSERT INTO public.topics (id, subject_id, name, description, difficulty_level, estimated_hours) VALUES
        (mat_topic1_id, mat_subject_id, 'Equações do 2º grau', 'Resolução e análise de equações quadráticas', 3, 2.5),
        (mat_topic2_id, mat_subject_id, 'Funções logarítmicas', 'Propriedades e gráficos de funções logarítmicas', 4, 3.0),
        (port_topic1_id, port_subject_id, 'Análise sintática', 'Estrutura e análise de períodos compostos', 3, 2.0),
        (dir_topic1_id, dir_subject_id, 'Direito Constitucional', 'Princípios e normas constitucionais', 4, 3.5),
        (inf_topic1_id, inf_subject_id, 'Algoritmos e Estruturas de Dados', 'Lógica de programação e estruturas', 4, 4.0),
        (atu_topic1_id, atu_subject_id, 'Política Nacional', 'Cenário político brasileiro atual', 2, 1.5);

    -- Insert sample tasks
    INSERT INTO public.tasks (user_id, subject_id, topic_id, title, description, task_status, priority, estimated_duration, scheduled_date, scheduled_start_time, scheduled_end_time) VALUES
        (student_uuid, mat_subject_id, mat_topic1_id, 'Resolver exercícios de equações quadráticas', 'Praticar resolução de 20 exercícios do capítulo 5', 'todo', 'alta', 2.0, CURRENT_DATE + INTERVAL '1 day', '08:00', '10:00'),
        (student_uuid, port_subject_id, port_topic1_id, 'Estudar análise sintática', 'Revisar conceitos e fazer exercícios práticos', 'in_progress', 'media', 1.5, CURRENT_DATE, '14:00', '15:30'),
        (student_uuid, dir_subject_id, dir_topic1_id, 'Ler capítulo sobre princípios constitucionais', 'Leitura e resumo do capítulo 3', 'completed', 'alta', 2.5, CURRENT_DATE - INTERVAL '1 day', '19:00', '21:30'),
        (student_uuid, inf_subject_id, inf_topic1_id, 'Implementar algoritmo de busca', 'Codificar busca binária em Python', 'todo', 'media', 3.0, CURRENT_DATE + INTERVAL '2 days', '10:00', '13:00'),
        (student_uuid, atu_subject_id, atu_topic1_id, 'Revisar notícias da semana', 'Ler principais notícias políticas', 'todo', 'baixa', 1.0, CURRENT_DATE + INTERVAL '1 day', '16:00', '17:00');

    -- Insert quick task templates
    INSERT INTO public.quick_task_templates (user_id, name, subject_id, topic_id, default_duration, default_priority, description_template, is_favorite) VALUES
        (student_uuid, 'Revisão Rápida - Matemática', mat_subject_id, null, 1.0, 'media', 'Revisão de conceitos fundamentais de %subject%', true),
        (student_uuid, 'Leitura de Texto - Português', port_subject_id, null, 1.5, 'media', 'Leitura e interpretação de texto sobre %topic%', true),
        (student_uuid, 'Exercícios Práticos', mat_subject_id, mat_topic1_id, 2.0, 'alta', 'Resolução de exercícios práticos', false),
        (student_uuid, 'Simulado Rápido', inf_subject_id, null, 0.5, 'baixa', 'Teste rápido de conhecimentos', false);

EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Mock data insertion error: %', SQLERRM;
END $$;