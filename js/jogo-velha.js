// Estado da Aplicação
// Aqui vão todas as variáveis que serão modificadas durante o andamento do jogo

const tabuleiro = [
  [ ' ', ' ', ' ' ],
  [ ' ', ' ', ' ' ],
  [ ' ', ' ', ' ' ],
];
let ultimaJogada;

// Lógica da Aplicação
// Aqui vão todas as rotinas que modificam o estado da aplicação SEM efeitos colaterais (mudanças visuais, por exemplo)

const limparTabuleiro = () => {
  tabuleiro[0] = [ ' ', ' ', ' ' ];
  tabuleiro[1] = [ ' ', ' ', ' ' ];
  tabuleiro[2] = [ ' ', ' ', ' ' ];
};

const marcar = (i, j, jogada) => {
  tabuleiro[i][j] = jogada;
  ultimaJogada = jogada;
};

const calcularVencedor = () => {
  // Linha cheia
  for (let i = 0; i <= 2; ++i) {
    if (tabuleiro[i][0] === tabuleiro[i][1] && tabuleiro[i][1] === tabuleiro[i][2] && tabuleiro[i][0] !== ' ') {
      return tabuleiro[i][0];
    }
  }

  // Coluna cheia
  for (let j = 0; j <= 2; ++j) {
    if (tabuleiro[0][j] === tabuleiro[1][j] && tabuleiro[1][j] === tabuleiro[2][j] && tabuleiro[0][j] !== ' ') {
      return tabuleiro[0][j];
    }
  }

  // Diagonal principal cheia
  if (tabuleiro[0][0] === tabuleiro[1][1] && tabuleiro[1][1] === tabuleiro[2][2] && tabuleiro[0][0] !== ' ') {
    return tabuleiro[0][0];
  }

  // Diagonal inversa cheia
  if (tabuleiro[0][2] === tabuleiro[1][1] && tabuleiro[1][1] === tabuleiro[2][0] && tabuleiro[0][2] !== ' ') {
    return tabuleiro[0][2];
  }

  // Empate
  let preenchidos = 0;

  for (let i = 0; i <= 2; ++i) {
    for (let j = 0; j <= 2; ++j) {
      if (tabuleiro[i][j] !== ' ') {
        ++preenchidos;
      }
    }
  }

  if (preenchidos === 9) {
    return 'empate';
  }

  return 'nenhum';
};

// Apresentação da Aplicação
// Aqui vai tudo responsável por exibir a aplicação para o usuário, bem como reagir às ações dele

window.onload = function () {
  const jogo = document.getElementById('jogo');

  const gatilhos = [
    document.getElementById('gatilho-0-0'),
    document.getElementById('gatilho-0-1'),
    document.getElementById('gatilho-0-2'),
    document.getElementById('gatilho-1-0'),
    document.getElementById('gatilho-1-1'),
    document.getElementById('gatilho-1-2'),
    document.getElementById('gatilho-2-0'),
    document.getElementById('gatilho-2-1'),
    document.getElementById('gatilho-2-2')
  ];

  const criarHandlerParaMarcar = (i, j) => function () {
    if (this.disabled) {
      return;
    }

    this.disabled = true;
    marcar(i, j, ultimaJogada === 'x' ? 'o' : 'x');
    exibirTabuleiro();
    atualizarTabuleiro();
  };

  gatilhos[0].addEventListener('click', criarHandlerParaMarcar(0, 0), false);
  gatilhos[1].addEventListener('click', criarHandlerParaMarcar(0, 1), false);
  gatilhos[2].addEventListener('click', criarHandlerParaMarcar(0, 2), false);
  gatilhos[3].addEventListener('click', criarHandlerParaMarcar(1, 0), false);
  gatilhos[4].addEventListener('click', criarHandlerParaMarcar(1, 1), false);
  gatilhos[5].addEventListener('click', criarHandlerParaMarcar(1, 2), false);
  gatilhos[6].addEventListener('click', criarHandlerParaMarcar(2, 0), false);
  gatilhos[7].addEventListener('click', criarHandlerParaMarcar(2, 1), false);
  gatilhos[8].addEventListener('click', criarHandlerParaMarcar(2, 2), false);

  const mudarEstadoDosGatilhos = estaoHabilitados => {
    gatilhos.forEach(gatilho => {
      gatilho.disabled = !estaoHabilitados;
    });
  };

  const atualizarTabuleiro = () => {
    const vencedor = calcularVencedor();
    if (vencedor !== 'nenhum') {
      mudarEstadoDosGatilhos(false);
    }
  };

  // Botão de novo jogo
  const botaoNovoJogo = document.getElementById('btn-novo-jogo');

  botaoNovoJogo.addEventListener('click', function () {
    limparTabuleiro();
    exibirTabuleiro();
    mudarEstadoDosGatilhos(true);

    document.getElementById('jogo').classList.remove('empate');
    document.getElementById('jogo').classList.remove('vencedor');
  }, false);

  // Tela do tabuleiro
  const telaTabuleiro = document.getElementById('svg-tabuleiro');

  const exibirTabuleiro = () => {
    for (let i = 0; i < tabuleiro.length; i++) {
      for (let j = 0; j < tabuleiro[i].length; j++) {
        const x = [16, 49, 82][j];
        const y = [16, 49, 82][i];

        const marcacaoAtual = document.querySelector("#marcacao-" + i + "-" + j);

        if (tabuleiro[i][j] === "x" && !marcacaoAtual) {
          const marcacao = document.createElementNS("http://www.w3.org/2000/svg","use");
          marcacao.setAttributeNS("http://www.w3.org/1999/xlink", "href", "#x");
          marcacao.setAttribute("x", x);
          marcacao.setAttribute("y", y);
          marcacao.setAttribute("id", "marcacao-" + i + "-" + j);

          telaTabuleiro.appendChild(marcacao);
        } else if (tabuleiro[i][j] === "o" && !marcacaoAtual) {
          const marcacao = document.createElementNS("http://www.w3.org/2000/svg","use");
          marcacao.setAttributeNS("http://www.w3.org/1999/xlink", "href", "#o");
          marcacao.setAttribute("x", x);
          marcacao.setAttribute("y", y);
          marcacao.setAttribute("id", "marcacao-" + i + "-" + j);

          telaTabuleiro.appendChild(marcacao);
        } else if (tabuleiro[i][j] === " " && marcacaoAtual) {
          telaTabuleiro.removeChild(marcacaoAtual);
        }
      }
    }

    // Verifica vencedor ou empate
    const vencedor = calcularVencedor();

    if (vencedor !== 'nenhum') {
      if (vencedor === 'empate') {
        jogo.classList.add("empate");
      }
      else{
        if (vencedor === 'x') {
          jogo.classList.add("vencedor");
        }
        else{
          jogo.classList.add("vencedor");
        }
      }
    }
  }

  exibirTabuleiro();
}
