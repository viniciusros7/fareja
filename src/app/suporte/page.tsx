"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronDown, PawPrint, Store, UserCircle,
  Mail, HelpCircle,
} from "lucide-react";

type FAQItem = { q: string; a: string };
type FAQGroup = { icon: typeof PawPrint; label: string; items: FAQItem[] };

const faqGroups: FAQGroup[] = [
  {
    icon: PawPrint,
    label: "Para Entusiastas de Pet",
    items: [
      {
        q: "Como funciona a Fareja?",
        a: "A Fareja é uma plataforma brasileira que conecta entusiastas de pet a canis verificados. Todos os criadores passam por um processo de verificação de documentos e boas práticas antes de serem listados. Você pode buscar canis por raça, região ou plano, favoritar os que mais gostar e entrar em contato diretamente.",
      },
      {
        q: "Como faço o quiz de raças?",
        a: "Acesse /encontrar-raca e responda algumas perguntas sobre seu estilo de vida, espaço disponível e preferências. O quiz analisa suas respostas e indica as raças mais compatíveis com você, com fichas detalhadas de cada uma.",
      },
      {
        q: "Como encontro um canil verificado?",
        a: 'Vá em "Buscar canis" e filtre por raça, estado ou cidade. Todo canil exibido já passou pela verificação da Fareja. O selo de plano (Básico, Premium ou Elite) indica o nível de visibilidade e recursos que o criador contratou.',
      },
      {
        q: "Como funciona o sistema de favoritos?",
        a: "Após fazer login, você pode salvar raças e canis nos favoritos clicando no ícone de coração. Acesse todos os seus favoritos no painel em /painel/favoritos.",
      },
      {
        q: "Como participo da comunidade?",
        a: "Qualquer usuário logado pode participar da comunidade em /comunidade. Você pode curtir e comentar posts no feed e criar ou responder tópicos no fórum. Para publicar no feed, basta ter uma conta.",
      },
    ],
  },
  {
    icon: Store,
    label: "Para Criadores",
    items: [
      {
        q: "Como cadastro meu canil na Fareja?",
        a: "Acesse /para-criadores/cadastro, preencha o formulário com os dados do seu canil e envie os documentos necessários. Nossa equipe analisa a solicitação e retorna em até 5 dias úteis.",
      },
      {
        q: "Quais documentos são necessários?",
        a: "São necessários: registro no CBKC (ou entidade equivalente), número de registro do canil, e fotos das instalações. Dependendo da raça e do plano, documentos adicionais podem ser solicitados durante a análise.",
      },
      {
        q: "Quais são os planos disponíveis?",
        a: "Oferecemos três planos: Verificado (Básico) — listagem padrão com até 3 posts/dia no feed; Premium — destaque nas buscas, galeria ampliada e até 10 posts/dia; Elite (Super Premium) — topo das buscas, todos os recursos e posts ilimitados. Consulte /para-criadores para valores atualizados.",
      },
      {
        q: "Como publico no feed da comunidade?",
        a: "Após ter seu canil aprovado, acesse /comunidade/feed/novo para criar um post com fotos, vídeos ou texto. Os limites diários variam conforme o plano contratado.",
      },
      {
        q: "Como funciona a aprovação do meu canil?",
        a: "Após o envio do cadastro, nossa equipe de aprovadores analisa os documentos e as fotos. Você recebe um e-mail com o resultado. Se aprovado, seu canil aparece imediatamente nas buscas. Em caso de pendência, orientamos o que precisa ser ajustado.",
      },
    ],
  },
  {
    icon: UserCircle,
    label: "Conta e Acesso",
    items: [
      {
        q: "Como faço login?",
        a: "Acesse /login e entre com seu e-mail e senha ou com sua conta Google. Se ainda não tem cadastro, o próprio fluxo de login cria sua conta automaticamente.",
      },
      {
        q: "Como altero meus dados?",
        a: "Acesse /painel/perfil para atualizar nome, foto e outras informações da sua conta. Alterações de e-mail requerem confirmação pelo endereço atual.",
      },
      {
        q: "Como excluo minha conta?",
        a: 'Entre em contato pelo e-mail suporte@fareja.com.br com o assunto "Exclusão de conta" a partir do endereço cadastrado. Processamos solicitações em até 10 dias úteis, conforme a LGPD.',
      },
    ],
  },
];

function AccordionItem({ item }: { item: FAQItem }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-earth-100 last:border-0">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-start justify-between gap-4 py-4 text-left"
        aria-expanded={open}
      >
        <span className="text-sm font-medium text-earth-800">{item.q}</span>
        <ChevronDown
          className={`w-4 h-4 text-earth-400 shrink-0 mt-0.5 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {open && (
        <p className="text-sm text-earth-600 leading-relaxed pb-4 pr-6">
          {item.a}
        </p>
      )}
    </div>
  );
}

export default function SuportePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-10 text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-100 text-brand-600 mb-4">
          <HelpCircle className="w-7 h-7" />
        </div>
        <h1 className="font-display text-3xl font-semibold text-earth-900 mb-2">
          Central de Ajuda
        </h1>
        <p className="text-earth-500 max-w-md mx-auto text-sm leading-relaxed">
          Encontre respostas rápidas sobre como usar a Fareja.
        </p>
      </div>

      {/* FAQ Groups */}
      <div className="space-y-6">
        {faqGroups.map((group) => (
          <section key={group.label}>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
                <group.icon className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-semibold text-earth-700 uppercase tracking-wide">
                {group.label}
              </h2>
            </div>
            <div className="rounded-xl border border-earth-200 bg-white px-5 divide-y-0">
              {group.items.map((item) => (
                <AccordionItem key={item.q} item={item} />
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Contact */}
      <div className="mt-12 rounded-2xl bg-brand-50 border border-brand-100 p-8 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-brand-100 text-brand-600 mb-4">
          <Mail className="w-5 h-5" />
        </div>
        <h3 className="font-display text-lg font-semibold text-earth-900 mb-2">
          Ainda precisa de ajuda?
        </h3>
        <p className="text-sm text-earth-500 mb-5 leading-relaxed max-w-xs mx-auto">
          Nossa equipe responde em até 2 dias úteis.
        </p>
        <a
          href="mailto:suporte@fareja.com.br"
          className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 text-white text-sm font-semibold rounded-xl hover:bg-brand-700 transition-colors"
        >
          <Mail className="w-4 h-4" />
          suporte@fareja.com.br
        </a>
      </div>

      {/* Bottom nav */}
      <div className="mt-10 flex items-center justify-center gap-4 text-xs text-earth-400">
        <Link href="/termos" className="hover:text-brand-600 transition-colors">Termos de Uso</Link>
        <span>·</span>
        <Link href="/privacidade" className="hover:text-brand-600 transition-colors">Política de Privacidade</Link>
      </div>
    </div>
  );
}
