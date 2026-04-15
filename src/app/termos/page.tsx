import Link from "next/link";
import { PawPrint } from "lucide-react";

export const metadata = {
  title: "Termos de Uso — Fareja",
  description: "Termos e condições de uso da plataforma Fareja.",
};

export default function TermosPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-brand-100 mb-4">
          <PawPrint className="w-6 h-6 text-brand-600" />
        </div>
        <h1 className="font-display text-3xl font-semibold text-brand-900 mb-2">
          Termos de Uso
        </h1>
        <p className="text-sm text-earth-500">
          Última atualização: 15 de abril de 2026
        </p>
      </div>

      <div className="prose prose-sm max-w-none space-y-8 text-earth-700">
        <section>
          <h2 className="font-display text-lg font-semibold text-earth-900 mb-3">
            1. Aceitação dos Termos
          </h2>
          <p className="leading-relaxed">
            Ao acessar ou utilizar a plataforma Fareja (&quot;Plataforma&quot;), você concorda
            com estes Termos de Uso. Se não concordar com qualquer parte destes termos,
            não utilize a Plataforma. A Fareja se reserva o direito de atualizar estes
            termos a qualquer momento, com aviso prévio de 30 dias por e-mail ou notificação
            na plataforma.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-earth-900 mb-3">
            2. Descrição do Serviço
          </h2>
          <p className="leading-relaxed">
            A Fareja é uma plataforma de conexão entre compradores e criadores verificados
            de cães no Brasil. A Plataforma permite que criadores cadastrem seus canis,
            filhotes e reprodutores, e que compradores busquem e entrem em contato com
            criadores verificados.
          </p>
          <p className="leading-relaxed mt-2">
            A Fareja não é parte das transações realizadas entre compradores e criadores.
            A Plataforma é apenas um canal de divulgação e conexão, não se responsabilizando
            por negociações, pagamentos ou entrega de animais.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-earth-900 mb-3">
            3. Cadastro e Conta
          </h2>
          <ul className="list-disc pl-5 space-y-2 leading-relaxed">
            <li>
              Para utilizar funcionalidades completas da Plataforma, o usuário deve se
              cadastrar com informações verdadeiras e atualizadas.
            </li>
            <li>
              O usuário é responsável pela confidencialidade de suas credenciais de acesso.
            </li>
            <li>
              É proibido criar contas falsas, duplicadas ou com dados de terceiros sem
              autorização.
            </li>
            <li>
              A Fareja pode suspender ou encerrar contas que violem estes Termos.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-earth-900 mb-3">
            4. Verificação de Canis
          </h2>
          <p className="leading-relaxed">
            O processo de verificação da Fareja é baseado em documentação fornecida pelo
            criador. O selo &quot;Verificado Fareja&quot; indica que os documentos apresentados
            foram analisados pela equipe Fareja, mas não constitui garantia absoluta sobre
            a qualidade ou saúde dos animais.
          </p>
          <p className="leading-relaxed mt-2">
            Criadores verificados se comprometem a manter suas informações atualizadas e
            a fornecer documentação válida. A falsificação de documentos resultará em
            banimento permanente da Plataforma.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-earth-900 mb-3">
            5. Conteúdo do Usuário
          </h2>
          <p className="leading-relaxed">
            Ao publicar fotos, vídeos, textos ou qualquer outro conteúdo na Plataforma,
            o usuário concede à Fareja licença não exclusiva para exibir esse conteúdo.
            É proibido publicar:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-2 leading-relaxed">
            <li>Conteúdo enganoso, falso ou fraudulento.</li>
            <li>Imagens ou vídeos de maus-tratos a animais.</li>
            <li>Conteúdo que viole direitos autorais de terceiros.</li>
            <li>Spam, publicidade não autorizada ou conteúdo malicioso.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-earth-900 mb-3">
            6. Planos e Pagamentos
          </h2>
          <p className="leading-relaxed">
            Os planos pagos (Canil Verificado, Canil Premium e Canil Elite) são cobrados
            mensalmente. O cancelamento pode ser feito a qualquer momento, com efeito ao
            final do período pago. Não há reembolso de períodos parciais.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-earth-900 mb-3">
            7. Limitação de Responsabilidade
          </h2>
          <p className="leading-relaxed">
            A Fareja não se responsabiliza por danos diretos, indiretos, incidentais ou
            consequentes decorrentes do uso da Plataforma, incluindo, mas não se limitando
            a, problemas em transações entre usuários, saúde dos animais ou informações
            incorretas fornecidas por criadores.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-earth-900 mb-3">
            8. Lei Aplicável
          </h2>
          <p className="leading-relaxed">
            Estes Termos são regidos pelas leis da República Federativa do Brasil. Quaisquer
            disputas serão resolvidas no foro da Comarca de São Paulo, SP, com renúncia
            a qualquer outro foro, por mais privilegiado que seja.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-earth-900 mb-3">
            9. Contato
          </h2>
          <p className="leading-relaxed">
            Para dúvidas sobre estes Termos, entre em contato pelo e-mail:{" "}
            <a
              href="mailto:contato@fareja.app.br"
              className="text-brand-600 hover:underline"
            >
              contato@fareja.app.br
            </a>
          </p>
        </section>
      </div>

      <div className="mt-10 pt-6 border-t border-earth-200 flex items-center justify-between text-xs text-earth-400">
        <span>© {new Date().getFullYear()} Fareja. Todos os direitos reservados.</span>
        <Link href="/privacidade" className="text-brand-600 hover:underline">
          Política de Privacidade
        </Link>
      </div>
    </div>
  );
}
