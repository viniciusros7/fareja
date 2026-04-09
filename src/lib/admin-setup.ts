/**
 * Utilitários para configuração inicial de roles admin.
 *
 * ATENÇÃO: As funções abaixo requerem a service_role key do Supabase
 * (não a anon key) para bypassar o RLS e alterar roles de outros usuários.
 * Use apenas no SQL Editor do Supabase ou em scripts server-side seguros.
 *
 * Comandos SQL para setar roles manualmente no Supabase SQL Editor:
 *
 * -- Promover usuário a super_admin:
 * UPDATE public.profiles SET role = 'super_admin' WHERE email = 'seu@email.com';
 *
 * -- Promover usuário a approver:
 * UPDATE public.profiles SET role = 'approver' WHERE email = 'aprovador@email.com';
 *
 * -- Promover usuário a kennel (dono de canil):
 * UPDATE public.profiles SET role = 'kennel' WHERE email = 'criador@email.com';
 *
 * -- Verificar roles atuais:
 * SELECT id, email, full_name, role, created_at FROM public.profiles ORDER BY created_at DESC;
 *
 * -- Rebaixar usuário para client:
 * UPDATE public.profiles SET role = 'client' WHERE email = 'usuario@email.com';
 */

import type { UserRole } from "@/types";

export type AdminSetupResult = { success: boolean; error: string | null };

/**
 * Retorna o SQL necessário para alterar o role de um usuário.
 * Cole o resultado no SQL Editor do Supabase (Dashboard > SQL Editor).
 */
export function getRoleUpdateSQL(email: string, role: UserRole): string {
  return `UPDATE public.profiles SET role = '${role}' WHERE email = '${email}';`;
}

/**
 * Retorna o SQL para consultar todos os usuários e seus roles.
 */
export function getListUsersSQL(): string {
  return `SELECT id, email, full_name, role, created_at FROM public.profiles ORDER BY created_at DESC;`;
}
