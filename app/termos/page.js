export const metadata = {
  title: "Termos de Uso — Karllos Design",
  description:
    "Termos de uso do site Karllos Design: direitos sobre o conteúdo exibido, uso do formulário de contato e responsabilidades.",
};

export default function Termos() {
  return (
    <div className="legal-page">
      <a className="legal-back" href="/">
        ← Voltar
      </a>
      <h1>Termos de Uso</h1>
      <p className="legal-updated">Última atualização: setembro de 2026</p>

      <p>
        Este site é um portfólio pessoal de <strong>Ruann Karllos</strong>, profissional autônomo
        que atua com edição de vídeo, design gráfico e identidade visual. Ao navegar neste site,
        você concorda com os termos abaixo.
      </p>

      <h2>Sobre o conteúdo do site</h2>
      <p>
        Os vídeos, imagens e artes exibidos na seção de trabalhos são amostras de projetos reais
        ou autorais, usados aqui apenas para fins de demonstração do meu trabalho. Os direitos
        autorais sobre esse material são meus ou dos clientes que autorizaram sua exibição — não
        é permitido copiar, reproduzir ou reutilizar esse conteúdo sem autorização.
      </p>

      <h2>Orçamentos e prazos</h2>
      <p>
        Valores, prazos e escopos mencionados em conversa (WhatsApp, e-mail, formulário) são
        estimativas que só se tornam compromisso formal depois de alinhados por escrito entre
        as partes. Este site não vende produtos nem fecha contratos automaticamente — ele existe
        para apresentar o trabalho e abrir contato.
      </p>

      <h2>Uso do formulário de contato</h2>
      <p>
        O formulário de contato deve ser usado apenas para tratar de projetos reais. Reservo o
        direito de não responder mensagens que pareçam spam, golpe ou completamente fora do
        escopo dos serviços oferecidos. Veja também a{" "}
        <a href="/privacidade">Política de Privacidade</a> para saber como os dados enviados são
        tratados.
      </p>

      <h2>Disponibilidade do site</h2>
      <p>
        Faço o possível para manter o site sempre no ar, mas não posso garantir disponibilidade
        contínua — o site é hospedado pela Vercel e depende também de serviços de terceiros
        (Supabase, Google Fonts) para funcionar por completo.
      </p>

      <h2>Alterações</h2>
      <p>
        Estes termos podem ser atualizados sem aviso prévio conforme o site evolui. A data no
        topo desta página sempre indica a versão mais recente.
      </p>

      <h2>Lei aplicável</h2>
      <p>Estes termos são regidos pelas leis brasileiras.</p>

      <h2>Contato</h2>
      <p>
        Dúvidas sobre estes termos:{" "}
        <a href="mailto:ruannkarllos05@gmail.com">ruannkarllos05@gmail.com</a> ou{" "}
        <a href="https://wa.me/5588988443624" target="_blank" rel="noopener noreferrer">
          WhatsApp
        </a>
        .
      </p>
    </div>
  );
}
