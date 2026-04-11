import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidade | Fareja",
  description: "Saiba como a Fareja coleta, usa e protege seus dados pessoais conforme a LGPD.",
};

const sections = [
  { id: "dados-coletados",  label: "1. Dados que Coletamos" },
  { id: "uso-dados",        label: "2. Como Usamos os Dados" },
  { id: "compartilhamento", label: "3. Compartilhamento de Dados" },
  { id: "cookies",          label: "4. Cookies e Tecnologias Similares" },
  { id: "seguranca",        label: "5. Armazenamento e Segurança" },
  { id: "direitos",         label: "6. Direitos do Titular" },
  { id: "retencao",         label: "7. Retenção de Dados" },
  { id: "menores",          label: "8. Dados de Menores" },
  { id: "alteracoes",       label: "9. Alterações na Política" },
  { id: "contato",          label: "10. Contato do Encarregado (DPO)" },
];

export default function PrivacidadePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-10 text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-100 text-brand-600 mb-4">
          <ShieldCheck className="w-7 h-7" />
        </div>
        <h1 className="font-display text-3xl font-semibold text-earth-900 mb-2">
          Política de Privacidade
        </h1>
        <p className="text-sm text-earth-400">
          Vigência a partir de abril de 2026 · Em conformidade com a LGPD (Lei n.º 13.709/2018)
        </p>
      </div>

      {/* Intro */}
      <div className="mb-8 p-5 rounded-xl bg-forest-50 border border-forest-100">
        <p className="text-sm text-forest-800 leading-relaxed">
          A Fareja respeita sua privacidade e está comprometida com a proteção dos seus dados pessoais. Esta Política descreve quais informações coletamos, como as utilizamos e quais são os seus direitos como titular, em conformidade com a <strong>Lei Geral de Proteção de Dados (LGPD)</strong>.
        </p>
      </div>

      {/* Index */}
      <nav className="mb-10 rounded-xl border border-earth-200 bg-white p-5">
        <p className="text-xs font-semibold text-earth-500 uppercase tracking-wide mb-3">Índice</p>
        <ol className="space-y-1.5">
          {sections.map((s) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                className="text-sm text-brand-600 hover:text-brand-800 hover:underline transition-colors"
              >
                {s.label}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      {/* Body */}
      <div className="space-y-10 text-earth-700 leading-relaxed text-sm">

        <section id="dados-coletados">
          <h2 className="font-display text-xl font-semibold text-earth-900 mb-3">1. Dados que Coletamos</h2>
          <p>Coletamos informações pessoais nas seguintes situações:</p>

          <h3 className="font-semibold text-earth-800 mt-4 mb-2">Dados fornecidos por você</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Cadastro:</strong> nome completo, endereço de e-mail e, opcionalmente, foto de perfil.</li>
            <li><strong>Criadores:</strong> nome do canil, endereço, telefone, documentos de registro, fotos das instalações e informações de contato.</li>
            <li><strong>Comunidade:</strong> conteúdo de posts, comentários, respostas no fórum e imagens publicadas.</li>
          </ul>

          <h3 className="font-semibold text-earth-800 mt-4 mb-2">Dados coletados automaticamente</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Navegação:</strong> páginas visitadas, tempo de permanência, cliques e fluxo de navegação.</li>
            <li><strong>Dispositivo:</strong> tipo de dispositivo, sistema operacional, navegador e resolução de tela.</li>
            <li><strong>Localização aproximada:</strong> inferida a partir do endereço IP para personalização de resultados de busca.</li>
          </ul>
        </section>

        <section id="uso-dados">
          <h2 className="font-display text-xl font-semibold text-earth-900 mb-3">2. Como Usamos os Dados</h2>
          <p>Utilizamos seus dados pessoais para as seguintes finalidades, com as respectivas bases legais da LGPD:</p>
          <ul className="list-disc pl-5 mt-3 space-y-2">
            <li><strong>Execução do contrato:</strong> criar e gerenciar sua conta, processar planos de criador, exibir seu perfil de canil.</li>
            <li><strong>Legítimo interesse:</strong> personalizar a experiência de busca, recomendar raças compatíveis, exibir canis próximos à sua localização.</li>
            <li><strong>Comunicação:</strong> enviar notificações transacionais (confirmação de cadastro, aprovação de canil, respostas de suporte).</li>
            <li><strong>Melhoria do serviço:</strong> analisar métricas de uso para identificar problemas e aprimorar funcionalidades.</li>
            <li><strong>Conformidade legal:</strong> cumprir obrigações legais, como atendimento a requisições de autoridades competentes.</li>
          </ul>
          <p className="mt-3">
            Não utilizamos seus dados para tomada de decisões totalmente automatizadas com impacto jurídico relevante, nem para criação de perfis para fins publicitários de terceiros.
          </p>
        </section>

        <section id="compartilhamento">
          <h2 className="font-display text-xl font-semibold text-earth-900 mb-3">3. Compartilhamento de Dados</h2>
          <p>
            <strong>Não vendemos seus dados pessoais</strong> a terceiros. Compartilhamos informações apenas com os seguintes prestadores de serviço, estritamente necessários para o funcionamento da plataforma:
          </p>
          <ul className="list-disc pl-5 mt-3 space-y-2">
            <li>
              <strong>Supabase (banco de dados e autenticação):</strong> armazena dados de contas, perfis e conteúdo da comunidade. Os servidores estão localizados nos EUA, com mecanismos de transferência adequados conforme a LGPD.
            </li>
            <li>
              <strong>Cloudflare R2 (armazenamento de mídia):</strong> armazena imagens e vídeos enviados por usuários. O acesso é restrito à plataforma.
            </li>
          </ul>
          <p className="mt-3">
            Podemos divulgar dados pessoais quando exigido por lei, ordem judicial ou autoridade competente, limitando a divulgação ao mínimo necessário.
          </p>
        </section>

        <section id="cookies">
          <h2 className="font-display text-xl font-semibold text-earth-900 mb-3">4. Cookies e Tecnologias Similares</h2>
          <p>A Fareja utiliza cookies e tecnologias similares para:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><strong>Sessão de autenticação:</strong> manter você logado entre visitas (essencial para o funcionamento).</li>
            <li><strong>Preferências:</strong> lembrar configurações como filtros de busca.</li>
            <li><strong>Análise de desempenho:</strong> entender como as páginas são utilizadas para melhorar a experiência.</li>
          </ul>
          <p className="mt-3">
            Cookies essenciais não podem ser desativados sem comprometer o funcionamento da plataforma. Você pode gerenciar cookies não essenciais pelas configurações do seu navegador.
          </p>
        </section>

        <section id="seguranca">
          <h2 className="font-display text-xl font-semibold text-earth-900 mb-3">5. Armazenamento e Segurança</h2>
          <p>Adotamos medidas técnicas e organizacionais para proteger seus dados pessoais, incluindo:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Criptografia em trânsito (HTTPS/TLS) em todas as comunicações.</li>
            <li>Autenticação segura gerenciada pelo Supabase Auth, com suporte a MFA.</li>
            <li>Controle de acesso por função (<em>Row Level Security</em> no banco de dados).</li>
            <li>Backups regulares com acesso restrito à equipe técnica.</li>
          </ul>
          <p className="mt-3">
            Embora empenhemos todos os esforços razoáveis, nenhum sistema é 100% seguro. Em caso de incidente de segurança que possa causar risco significativo, notificaremos a ANPD e os titulares afetados nos prazos previstos pela LGPD.
          </p>
        </section>

        <section id="direitos">
          <h2 className="font-display text-xl font-semibold text-earth-900 mb-3">6. Direitos do Titular</h2>
          <p>
            Conforme a LGPD (art. 18), você tem os seguintes direitos em relação aos seus dados pessoais:
          </p>
          <ul className="list-disc pl-5 mt-3 space-y-2">
            <li><strong>Acesso:</strong> saber quais dados pessoais tratamos sobre você.</li>
            <li><strong>Correção:</strong> solicitar a atualização de dados incompletos, inexatos ou desatualizados.</li>
            <li><strong>Exclusão:</strong> pedir a eliminação dos seus dados, quando não houver obrigação legal de retenção.</li>
            <li><strong>Portabilidade:</strong> receber seus dados em formato estruturado e de uso comum.</li>
            <li><strong>Revogação do consentimento:</strong> retirar consentimentos fornecidos anteriormente.</li>
            <li><strong>Oposição:</strong> opor-se a tratamentos realizados com base em legítimo interesse.</li>
            <li><strong>Informação:</strong> ser informado sobre entidades com quem compartilhamos seus dados.</li>
          </ul>
          <p className="mt-3">
            Para exercer seus direitos, entre em contato pelo e-mail <a href="mailto:privacidade@fareja.com.br" className="text-brand-600 hover:underline">privacidade@fareja.com.br</a>. Respondemos em até 15 dias, conforme o prazo legal.
          </p>
        </section>

        <section id="retencao">
          <h2 className="font-display text-xl font-semibold text-earth-900 mb-3">7. Retenção de Dados</h2>
          <p>
            Mantemos seus dados pessoais pelo tempo necessário para cumprir as finalidades descritas nesta Política, salvo quando a lei exigir prazo maior. Em geral:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Dados de conta ativa: mantidos durante toda a vigência da conta.</li>
            <li>Dados de conta encerrada: excluídos em até 90 dias após a exclusão da conta, exceto dados exigidos por obrigação legal.</li>
            <li>Logs de acesso: retidos por 6 meses, conforme o Marco Civil da Internet (Lei n.º 12.965/2014).</li>
            <li>Dados fiscais de criadores: retidos pelo prazo mínimo exigido pela legislação tributária.</li>
          </ul>
        </section>

        <section id="menores">
          <h2 className="font-display text-xl font-semibold text-earth-900 mb-3">8. Dados de Menores</h2>
          <p>
            A plataforma Fareja é destinada exclusivamente a maiores de 18 anos. Não coletamos intencionalmente dados pessoais de menores de idade. Se você acredita que um menor forneceu dados à nossa plataforma, entre em contato conosco para que possamos tomar as medidas adequadas de exclusão.
          </p>
        </section>

        <section id="alteracoes">
          <h2 className="font-display text-xl font-semibold text-earth-900 mb-3">9. Alterações na Política</h2>
          <p>
            Esta Política de Privacidade pode ser atualizada periodicamente para refletir mudanças na legislação, nas práticas de tratamento de dados ou nos serviços oferecidos. Alterações relevantes serão comunicadas por e-mail ou por notificação destacada na plataforma com antecedência mínima de 15 dias.
          </p>
          <p className="mt-3">
            A data de vigência no topo desta página indica a versão mais recente em vigor.
          </p>
        </section>

        <section id="contato">
          <h2 className="font-display text-xl font-semibold text-earth-900 mb-3">10. Contato do Encarregado (DPO)</h2>
          <p>
            O encarregado pelo tratamento de dados pessoais (<em>Data Protection Officer</em>) da Fareja pode ser contatado para dúvidas, solicitações ou reclamações relacionadas à privacidade:
          </p>
          <div className="mt-4 p-4 rounded-xl bg-earth-50 border border-earth-200">
            <p className="text-sm font-medium text-earth-800">Encarregado de Dados — Fareja</p>
            <a
              href="mailto:privacidade@fareja.com.br"
              className="text-sm text-brand-600 hover:underline mt-1 block"
            >
              privacidade@fareja.com.br
            </a>
            <p className="text-xs text-earth-400 mt-1">
              Respondemos em até 15 dias úteis.
            </p>
          </div>
          <p className="mt-4">
            Você também pode registrar reclamação diretamente junto à <strong>Autoridade Nacional de Proteção de Dados (ANPD)</strong> em <a href="https://www.gov.br/anpd" target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:underline">gov.br/anpd</a>.
          </p>
        </section>

      </div>

      {/* Bottom nav */}
      <div className="mt-12 pt-8 border-t border-earth-100 flex items-center justify-center gap-4 text-xs text-earth-400">
        <Link href="/suporte" className="hover:text-brand-600 transition-colors">Central de Ajuda</Link>
        <span>·</span>
        <Link href="/termos" className="hover:text-brand-600 transition-colors">Termos de Uso</Link>
      </div>
    </div>
  );
}
