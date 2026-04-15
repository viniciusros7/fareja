import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Política de Privacidade — Fareja",
  description:
    "Política de privacidade e proteção de dados da plataforma Fareja, em conformidade com a LGPD (Lei nº 13.709/2018).",
};

export default function PrivacidadePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-brand-100 mb-4">
          <ShieldCheck className="w-6 h-6 text-brand-600" />
        </div>
        <h1 className="font-display text-3xl font-semibold text-brand-900 mb-2">
          Política de Privacidade
        </h1>
        <p className="text-sm text-earth-500">
          Última atualização: 15 de abril de 2026 — Em conformidade com a LGPD (Lei nº 13.709/2018)
        </p>
      </div>

      <div className="prose prose-sm max-w-none space-y-8 text-earth-700">
        <section>
          <h2 className="font-display text-lg font-semibold text-earth-900 mb-3">
            1. Quem somos (Controlador de Dados)
          </h2>
          <p className="leading-relaxed">
            A <strong>Fareja</strong> é o controlador dos dados pessoais coletados nesta
            Plataforma. Para questões relacionadas a dados pessoais, entre em contato com
            nosso Encarregado de Proteção de Dados (DPO) pelo e-mail:{" "}
            <a href="mailto:privacidade@fareja.com.br" className="text-brand-600 hover:underline">
              privacidade@fareja.com.br
            </a>
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-earth-900 mb-3">
            2. Dados que coletamos
          </h2>
          <p className="leading-relaxed mb-2">Coletamos as seguintes categorias de dados:</p>
          <ul className="list-disc pl-5 space-y-2 leading-relaxed">
            <li>
              <strong>Dados de cadastro:</strong> nome completo, endereço de e-mail, foto
              de perfil (quando fornecida via login social).
            </li>
            <li>
              <strong>Dados de canil (criadores):</strong> nome do canil, CNPJ/CPF,
              endereço, registros no Kennel Club (CBKC/SOBRACI), fotos das instalações,
              laudos veterinários e testes genéticos enviados para verificação.
            </li>
            <li>
              <strong>Conteúdo publicado:</strong> fotos, vídeos e textos postados no feed
              e no fórum da comunidade.
            </li>
            <li>
              <strong>Dados de navegação:</strong> endereço IP, tipo de dispositivo,
              navegador, páginas visitadas e tempo de sessão (via cookies de analytics).
            </li>
            <li>
              <strong>Dados de pagamento:</strong> informações de cobrança processadas
              por nossos parceiros de pagamento. A Fareja não armazena dados de cartão de
              crédito.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-earth-900 mb-3">
            3. Finalidade e base legal do tratamento
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-earth-100">
                  <th className="text-left p-3 border border-earth-200 font-semibold text-earth-800">
                    Finalidade
                  </th>
                  <th className="text-left p-3 border border-earth-200 font-semibold text-earth-800">
                    Base Legal (LGPD)
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Criar e gerenciar sua conta", "Execução de contrato (Art. 7º, V)"],
                  ["Verificar canis e documentação", "Execução de contrato (Art. 7º, V)"],
                  ["Enviar notificações da plataforma", "Legítimo interesse (Art. 7º, IX)"],
                  ["Melhorar a Plataforma via analytics", "Legítimo interesse (Art. 7º, IX)"],
                  ["Cumprir obrigações legais e fiscais", "Obrigação legal (Art. 7º, II)"],
                  ["Enviar comunicações de marketing", "Consentimento (Art. 7º, I)"],
                ].map(([fin, base]) => (
                  <tr key={fin} className="even:bg-earth-50">
                    <td className="p-3 border border-earth-200">{fin}</td>
                    <td className="p-3 border border-earth-200 text-earth-500">{base}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-earth-900 mb-3">
            4. Compartilhamento de dados
          </h2>
          <p className="leading-relaxed mb-2">
            Compartilhamos dados apenas nas seguintes situações:
          </p>
          <ul className="list-disc pl-5 space-y-2 leading-relaxed">
            <li>
              <strong>Operadores de serviço:</strong> Supabase (banco de dados e
              autenticação), Cloudflare R2 (armazenamento de arquivos), parceiros de
              pagamento — todos sob acordos de confidencialidade e conformidade com a LGPD.
            </li>
            <li>
              <strong>Outros usuários:</strong> dados públicos do perfil do canil (nome,
              fotos, avaliações) são visíveis para compradores cadastrados.
            </li>
            <li>
              <strong>Obrigação legal:</strong> quando exigido por autoridade competente,
              decisão judicial ou regulatória.
            </li>
          </ul>
          <p className="leading-relaxed mt-2">
            Não vendemos dados pessoais a terceiros.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-earth-900 mb-3">
            5. Cookies
          </h2>
          <p className="leading-relaxed">
            Utilizamos cookies essenciais (necessários para autenticação e funcionamento da
            Plataforma) e cookies de analytics (para entender como a Plataforma é utilizada).
            Você pode desativar cookies de analytics nas configurações do seu navegador,
            mas os cookies essenciais não podem ser desativados sem prejudicar o funcionamento
            da Plataforma.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-earth-900 mb-3">
            6. Seus direitos (LGPD — Art. 18)
          </h2>
          <p className="leading-relaxed mb-2">
            Como titular de dados, você tem direito a:
          </p>
          <ul className="list-disc pl-5 space-y-2 leading-relaxed">
            <li>Confirmar a existência de tratamento dos seus dados.</li>
            <li>Acessar os dados que temos sobre você.</li>
            <li>Corrigir dados incompletos, inexatos ou desatualizados.</li>
            <li>Solicitar a anonimização, bloqueio ou eliminação de dados desnecessários.</li>
            <li>
              Solicitar a portabilidade dos seus dados para outro serviço (mediante
              requisição formal).
            </li>
            <li>Revogar o consentimento para tratamentos baseados em consentimento.</li>
            <li>
              Solicitar a eliminação completa dos seus dados pessoais (conta e conteúdo),
              exceto dados que precisamos manter por obrigação legal.
            </li>
          </ul>
          <p className="leading-relaxed mt-3">
            Para exercer qualquer desses direitos, entre em contato com nosso DPO em{" "}
            <a href="mailto:privacidade@fareja.com.br" className="text-brand-600 hover:underline">
              privacidade@fareja.com.br
            </a>
            . Responderemos em até 15 dias úteis.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-earth-900 mb-3">
            7. Retenção de dados
          </h2>
          <p className="leading-relaxed">
            Mantemos seus dados enquanto sua conta estiver ativa. Após o encerramento da
            conta, dados pessoais são eliminados em até 90 dias, exceto aqueles que
            precisamos reter por exigência legal (ex.: dados fiscais por 5 anos, conforme
            legislação brasileira).
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-earth-900 mb-3">
            8. Segurança dos dados
          </h2>
          <p className="leading-relaxed">
            Adotamos medidas técnicas e organizacionais para proteger seus dados, incluindo
            criptografia em trânsito (HTTPS/TLS), autenticação segura via Supabase Auth,
            controle de acesso por perfil de usuário e backups regulares. Em caso de
            incidente de segurança que possa afetar seus direitos, notificaremos os
            titulares afetados e a ANPD dentro dos prazos legais.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-earth-900 mb-3">
            9. Transferência internacional de dados
          </h2>
          <p className="leading-relaxed">
            Alguns de nossos parceiros de infraestrutura (Supabase, Cloudflare) podem
            processar dados em servidores fora do Brasil. Essas transferências são
            realizadas com garantias adequadas de proteção, em conformidade com o Art. 33
            da LGPD.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-earth-900 mb-3">
            10. Alterações nesta Política
          </h2>
          <p className="leading-relaxed">
            Podemos atualizar esta Política periodicamente. Notificaremos sobre alterações
            significativas por e-mail ou notificação na Plataforma com antecedência mínima
            de 30 dias. O uso continuado da Plataforma após a vigência das novas regras
            implica aceitação das alterações.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-earth-900 mb-3">
            11. Contato e DPO
          </h2>
          <p className="leading-relaxed">
            Encarregado de Proteção de Dados (DPO):{" "}
            <a href="mailto:privacidade@fareja.com.br" className="text-brand-600 hover:underline">
              privacidade@fareja.com.br
            </a>
            <br />
            Para demais assuntos:{" "}
            <a href="mailto:contato@fareja.com.br" className="text-brand-600 hover:underline">
              contato@fareja.com.br
            </a>
          </p>
          <p className="leading-relaxed mt-2 text-earth-500">
            Você também pode registrar reclamações perante a Autoridade Nacional de
            Proteção de Dados (ANPD) em{" "}
            <a
              href="https://www.gov.br/anpd"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-600 hover:underline"
            >
              www.gov.br/anpd
            </a>
            .
          </p>
        </section>
      </div>

      <div className="mt-10 pt-6 border-t border-earth-200 flex items-center justify-between text-xs text-earth-400">
        <span>© {new Date().getFullYear()} Fareja. Todos os direitos reservados.</span>
        <Link href="/termos" className="text-brand-600 hover:underline">
          Termos de Uso
        </Link>
      </div>
    </div>
  );
}
