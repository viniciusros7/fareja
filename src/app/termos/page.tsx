import Link from "next/link";
import { Scale } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Termos de Uso | Fareja",
  description: "Leia os Termos de Uso da plataforma Fareja.",
};

const sections = [
  { id: "aceitacao",         label: "1. Aceitação dos Termos" },
  { id: "servico",           label: "2. Descrição do Serviço" },
  { id: "cadastro",          label: "3. Cadastro e Conta" },
  { id: "criadores",         label: "4. Regras para Criadores" },
  { id: "entusiastas",       label: "5. Regras para Entusiastas de Pet" },
  { id: "comunidade",        label: "6. Conteúdo da Comunidade" },
  { id: "pagamentos",        label: "7. Pagamentos e Assinaturas" },
  { id: "isencao",           label: "8. Isenção de Responsabilidade" },
  { id: "propriedade",       label: "9. Propriedade Intelectual" },
  { id: "modificacoes",      label: "10. Modificações dos Termos" },
  { id: "legislacao",        label: "11. Legislação Aplicável" },
];

export default function TermosPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-10 text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-100 text-brand-600 mb-4">
          <Scale className="w-7 h-7" />
        </div>
        <h1 className="font-display text-3xl font-semibold text-earth-900 mb-2">
          Termos de Uso
        </h1>
        <p className="text-sm text-earth-400">
          Vigência a partir de abril de 2026
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
      <div className="prose prose-sm max-w-none space-y-10 text-earth-700 leading-relaxed">

        <section id="aceitacao">
          <h2 className="font-display text-xl font-semibold text-earth-900 mb-3">1. Aceitação dos Termos</h2>
          <p>
            Ao acessar ou utilizar a plataforma Fareja, disponível em <strong>fareja.com.br</strong> e em seus aplicativos associados, você declara ter lido, compreendido e concordado integralmente com estes Termos de Uso. Caso não concorde com qualquer disposição, não utilize a plataforma.
          </p>
          <p className="mt-3">
            O uso da Fareja por menores de 18 anos é expressamente proibido. Ao se cadastrar, você confirma ter idade mínima de 18 anos e capacidade legal para aceitar estes termos.
          </p>
        </section>

        <section id="servico">
          <h2 className="font-display text-xl font-semibold text-earth-900 mb-3">2. Descrição do Serviço</h2>
          <p>
            A Fareja é uma plataforma digital brasileira de conexão entre criadores de cães verificados e entusiastas de pet. Nosso objetivo é promover transparência, rastreabilidade e boas práticas na criação responsável de animais de companhia.
          </p>
          <p className="mt-3">
            A plataforma oferece: listagem de canis verificados, busca por raça e localização, quiz de compatibilidade de raças, comunidade (feed e fórum), e ferramentas de gestão para criadores. A Fareja <strong>não realiza</strong> intermediação financeira, compra, venda ou transporte de animais.
          </p>
        </section>

        <section id="cadastro">
          <h2 className="font-display text-xl font-semibold text-earth-900 mb-3">3. Cadastro e Conta</h2>
          <p>
            Para acessar funcionalidades completas — como favoritos, comunidade e painel do criador — é necessário criar uma conta. O cadastro pode ser feito via e-mail e senha ou por autenticação com conta Google.
          </p>
          <p className="mt-3">Você é responsável por:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Manter a confidencialidade das suas credenciais de acesso.</li>
            <li>Garantir a veracidade de todos os dados informados no cadastro.</li>
            <li>Todas as atividades realizadas com sua conta.</li>
          </ul>
          <p className="mt-3">
            A Fareja reserva o direito de suspender ou excluir contas que violem estes termos, apresentem informações falsas ou tenham comportamento prejudicial à comunidade.
          </p>
        </section>

        <section id="criadores">
          <h2 className="font-display text-xl font-semibold text-earth-900 mb-3">4. Regras para Criadores</h2>
          <p>
            Para ser listado na Fareja, o criador deve passar pelo processo de verificação, que inclui apresentação de documentos válidos junto a entidade reconhecida (CBKC ou equivalente). Ao se cadastrar, o criador declara:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Que todos os documentos enviados são autênticos e estão atualizados.</li>
            <li>Que mantém condições adequadas de bem-estar animal em suas instalações.</li>
            <li>Que não pratica ou compactua com reprodução indiscriminada, maus-tratos ou venda de animais doentes sem disclosure.</li>
            <li>Que as informações publicadas no perfil do canil são verídicas.</li>
          </ul>
          <p className="mt-3">
            O descumprimento dessas obrigações acarreta a suspensão imediata do perfil e pode resultar em exclusão definitiva da plataforma, independentemente de plano contratado.
          </p>
        </section>

        <section id="entusiastas">
          <h2 className="font-display text-xl font-semibold text-earth-900 mb-3">5. Regras para Entusiastas de Pet</h2>
          <p>Ao utilizar a plataforma, o entusiasta de pet se compromete a:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Usar a plataforma de forma responsável e legal.</li>
            <li>Não publicar conteúdo impróprio, ofensivo, enganoso ou que viole direitos de terceiros.</li>
            <li>Não utilizar a plataforma para fins comerciais não autorizados ou spam.</li>
            <li>Não realizar engenharia reversa, scraping automatizado ou ataques à infraestrutura da plataforma.</li>
          </ul>
        </section>

        <section id="comunidade">
          <h2 className="font-display text-xl font-semibold text-earth-900 mb-3">6. Conteúdo da Comunidade</h2>
          <p>
            O feed e o fórum são espaços para troca de experiências, dúvidas e conhecimento sobre cães. Todo conteúdo publicado — incluindo posts, comentários e imagens — é de responsabilidade do usuário que o publicou.
          </p>
          <p className="mt-3">
            A Fareja não se responsabiliza pelo conteúdo gerado por usuários, mas reserva o direito de remover, sem aviso prévio, qualquer publicação que:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Viole estes Termos de Uso ou leis brasileiras.</li>
            <li>Contenha discurso de ódio, nudez, violência ou conteúdo adulto.</li>
            <li>Promova desinformação, fraude ou práticas prejudiciais ao bem-estar animal.</li>
            <li>Seja spam ou conteúdo publicitário não autorizado.</li>
          </ul>
          <p className="mt-3">
            Ao publicar na Fareja, o usuário concede à plataforma licença não exclusiva e gratuita para exibir, reproduzir e distribuir o conteúdo dentro da plataforma.
          </p>
        </section>

        <section id="pagamentos">
          <h2 className="font-display text-xl font-semibold text-earth-900 mb-3">7. Pagamentos e Assinaturas</h2>
          <p>
            Os planos para criadores (Verificado, Premium e Elite) são cobrados mensalmente. Os valores vigentes estão disponíveis em <Link href="/para-criadores" className="text-brand-600 hover:underline">/para-criadores</Link>. O plano é renovado automaticamente até cancelamento pelo criador.
          </p>
          <p className="mt-3">
            A Fareja <strong>não intermedeia financeiramente</strong> a aquisição de filhotes entre criadores e entusiastas. Qualquer negociação acontece diretamente entre as partes e é de inteira responsabilidade delas.
          </p>
          <p className="mt-3">
            O cancelamento do plano pode ser feito a qualquer momento. O acesso aos recursos premium permanece ativo até o fim do período já pago.
          </p>
        </section>

        <section id="isencao">
          <h2 className="font-display text-xl font-semibold text-earth-900 mb-3">8. Isenção de Responsabilidade</h2>
          <p>
            A Fareja conecta criadores verificados a entusiastas de pet, mas não garante o resultado de nenhuma negociação, transação ou acordo realizado fora da plataforma. Em especial:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>A Fareja não garante a saúde, temperamento ou características específicas de filhotes adquiridos de criadores listados.</li>
            <li>A verificação de documentos reduz riscos, mas não elimina a possibilidade de informações desatualizadas ou alteradas fraudulentamente.</li>
            <li>A Fareja não se responsabiliza por perdas financeiras resultantes de transações entre usuários.</li>
          </ul>
          <p className="mt-3">
            A plataforma é fornecida "no estado em que se encontra" (<em>as is</em>), sem garantia de disponibilidade ininterrupta. A Fareja poderá realizar manutenções programadas ou não, comunicando sempre que possível.
          </p>
        </section>

        <section id="propriedade">
          <h2 className="font-display text-xl font-semibold text-earth-900 mb-3">9. Propriedade Intelectual</h2>
          <p>
            Toda a identidade visual, marca, nome "Fareja", logotipo, textos, código-fonte e funcionalidades da plataforma são propriedade exclusiva da Fareja e estão protegidos pela legislação brasileira de propriedade intelectual.
          </p>
          <p className="mt-3">
            É proibida a reprodução, distribuição, modificação ou uso comercial de qualquer elemento da plataforma sem autorização prévia por escrito.
          </p>
        </section>

        <section id="modificacoes">
          <h2 className="font-display text-xl font-semibold text-earth-900 mb-3">10. Modificações dos Termos</h2>
          <p>
            A Fareja pode atualizar estes Termos de Uso periodicamente. Alterações relevantes serão comunicadas por e-mail ou notificação na plataforma com antecedência mínima de 15 dias. O uso continuado da plataforma após a entrada em vigor das alterações implica aceitação dos novos termos.
          </p>
        </section>

        <section id="legislacao">
          <h2 className="font-display text-xl font-semibold text-earth-900 mb-3">11. Legislação Aplicável</h2>
          <p>
            Estes Termos são regidos pelas leis da República Federativa do Brasil. Eventuais disputas serão resolvidas perante o foro da comarca de São Paulo — SP, com renúncia a qualquer outro, por mais privilegiado que seja.
          </p>
        </section>

      </div>

      {/* Bottom nav */}
      <div className="mt-12 pt-8 border-t border-earth-100 flex items-center justify-center gap-4 text-xs text-earth-400">
        <Link href="/suporte" className="hover:text-brand-600 transition-colors">Central de Ajuda</Link>
        <span>·</span>
        <Link href="/privacidade" className="hover:text-brand-600 transition-colors">Política de Privacidade</Link>
      </div>
    </div>
  );
}
