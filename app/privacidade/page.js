export const metadata = {
  title: "Política de Privacidade — Karllos Design",
  description:
    "Política de privacidade do Karllos Design: quais dados coletamos pelo formulário de contato, como usamos e como você pode solicitar a remoção.",
};

export default function Privacidade() {
  return (
    <div className="legal-page">
      <a className="legal-back" href="/">
        ← Voltar
      </a>
      <h1>Política de Privacidade</h1>
      <p className="legal-updated">Última atualização: setembro de 2026</p>

      <p>
        Este site pertence ao estúdio <strong>Karllos Design</strong>, um estúdio de uma pessoa só.
        Esta página explica de forma simples quais dados são coletados aqui e para que servem.
      </p>

      <h2>Quem trata os seus dados</h2>
      <p>
        O responsável pelo tratamento dos dados coletados neste site (controlador, nos termos da
        LGPD) é <strong>Ruann Karllos</strong>, profissional autônomo, contato:{" "}
        <a href="mailto:ruannkarllos05@gmail.com">ruannkarllos05@gmail.com</a>.
      </p>

      <h2>Quais dados coletamos</h2>
      <p>Só coletamos o que você mesmo digita no formulário de contato, no rodapé do site:</p>
      <ul>
        <li>Nome</li>
        <li>WhatsApp ou e-mail (para eu poder te responder)</li>
        <li>Uma breve descrição do projeto, se você escrever</li>
      </ul>
      <p>
        Não usamos cookies de rastreamento, pixels de anúncio nem analytics de terceiros. O único
        dado salvo no seu navegador é uma marcação local (localStorage) dizendo que você já viu o
        aviso de cookies — isso nunca sai do seu dispositivo.
      </p>

      <h2>Como os dados são usados</h2>
      <p>
        As informações do formulário são usadas exclusivamente para eu entrar em contato sobre o
        seu projeto. Não vendo, alugo nem compartilho esses dados com terceiros para fins de
        marketing. A base legal para esse tratamento é o seu consentimento, dado ao preencher e
        enviar o formulário voluntariamente (art. 7º, inciso I, da LGPD).
      </p>

      <h2>Por quanto tempo guardamos os dados</h2>
      <p>
        Os dados enviados pelo formulário ficam guardados enquanto forem úteis para o contato
        sobre o seu projeto, ou até você pedir a exclusão — o que acontecer primeiro. Não há
        prazo automático de exclusão além disso.
      </p>

      <h2>Onde os dados ficam armazenados</h2>
      <p>
        Os envios do formulário são guardados no{" "}
        <a href="https://supabase.com" target="_blank" rel="noopener noreferrer">
          Supabase
        </a>
        , um serviço de banco de dados hospedado, protegido por políticas de acesso que impedem
        leitura pública dos dados enviados.
      </p>

      <h2>Serviços de terceiros usados neste site</h2>
      <ul>
        <li>
          <strong>Google Fonts</strong> — carrega as fontes do site; ao carregar a página, seu
          navegador faz uma requisição aos servidores do Google.
        </li>
        <li>
          <strong>Supabase</strong> — armazena os dados enviados pelo formulário de contato e a
          lista de trabalhos exibida no site.
        </li>
        <li>
          <strong>Vercel</strong> — hospeda o site.
        </li>
      </ul>

      <h2>Seus direitos</h2>
      <p>
        Conforme a LGPD, você pode a qualquer momento pedir para eu confirmar quais dados seus eu
        tenho, corrigir alguma informação ou excluir os dados que enviou pelo formulário. Basta me
        chamar por um dos canais abaixo. Veja também os{" "}
        <a href="/termos">Termos de Uso</a> do site.
      </p>

      <h2>Contato</h2>
      <p>
        Dúvidas sobre esta política ou pedidos de exclusão de dados:{" "}
        <a href="mailto:ruannkarllos05@gmail.com">ruannkarllos05@gmail.com</a> ou{" "}
        <a href="https://wa.me/5588988443624" target="_blank" rel="noopener noreferrer">
          WhatsApp
        </a>
        .
      </p>
    </div>
  );
}
