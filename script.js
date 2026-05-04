const palavras = [
  "caixa","sacos","latas","potes","tubos",
  "filme","blist","papel","vidro","metal"
];

let fase = 1;
let palavrasAtuais = [];
let resolvidas = [];
let tentativa = "";
let linhaAtual = 0;
let maxTentativas = 6;

const jogosDiv = document.getElementById("jogos");
const teclado = document.getElementById("teclado");
const faseTexto = document.getElementById("fase");
const msg = document.getElementById("mensagem");

/* iniciar */
function comecarJogo() {
  document.getElementById("inicio").style.display = "none";
  document.getElementById("jogo").style.display = "block";
  iniciar();
}

function iniciar() {
  criarTeclado();
  novaFase();
}

/* embaralhar */
function embaralhar(array) {
  return array.sort(() => Math.random() - 0.5);
}

/* nova fase */
function novaFase() {
  linhaAtual = 0;
  tentativa = "";

  let copia = [...palavras];
  embaralhar(copia);

  palavrasAtuais = copia.slice(0, fase);
  resolvidas = Array(fase).fill(false);

  criarGrids(fase);
  faseTexto.innerText = "Fase " + fase;
  msg.innerText = "";
}

/* grids */
let grids = [];
function criarGrids(qtd) {
  jogosDiv.innerHTML = "";
  grids = [];

  for (let g = 0; g < qtd; g++) {
    let grid = document.createElement("div");
    grid.classList.add("grid");

    for (let i = 0; i < 30; i++) {
      let c = document.createElement("div");
      c.classList.add("celula");
      grid.appendChild(c);
    }

    jogosDiv.appendChild(grid);
    grids.push(grid);
  }
}

/* teclado */
function criarTeclado() {
  teclado.innerHTML = "";
  const linhas = ["qwertyuiop","asdfghjkl","zxcvbnm"];

  linhas.forEach(l => {
    let div = document.createElement("div");
    div.classList.add("linha");

    l.split("").forEach(letra => {
      let t = document.createElement("div");
      t.innerText = letra.toUpperCase();
      t.classList.add("tecla");
      t.onclick = () => digitar(letra);
      div.appendChild(t);
    });

    teclado.appendChild(div);
  });

  /* botão apagar */
  let apagar = document.createElement("div");
  apagar.innerText = "⌫";
  apagar.classList.add("tecla");
  apagar.onclick = apagarLetra;
  teclado.appendChild(apagar);

  /* botão enter */
  let enter = document.createElement("div");
  enter.innerText = "ENTER";
  enter.classList.add("tecla");
  enter.onclick = enviar;
  teclado.appendChild(enter);
}

/* apagar */
function apagarLetra() {
  tentativa = tentativa.slice(0, -1);
  atualizar();
}

/* digitar */
function digitar(l) {
  if (tentativa.length < 5) {
    tentativa += l;
    atualizar();
  }
}

/* atualizar */
function atualizar() {
  grids.forEach(grid => {
    let inicio = linhaAtual * 5;
    for (let i = 0; i < 5; i++) {
      grid.children[inicio + i].innerText = tentativa[i] || "";
    }
  });
}

/* avaliar */
function avaliar(palavra, tentativa) {
  let res = Array(5).fill("");
  let resto = palavra.split("");

  for (let i = 0; i < 5; i++) {
    if (tentativa[i] === palavra[i]) {
      res[i] = "correto";
      resto[i] = null;
    }
  }

  for (let i = 0; i < 5; i++) {
    if (res[i] === "") {
      let idx = resto.indexOf(tentativa[i]);
      if (idx !== -1) {
        res[i] = "presente";
        resto[idx] = null;
      } else {
        res[i] = "errado";
      }
    }
  }

  return res;
}

/* enviar */
function enviar() {
  if (tentativa.length !== 5) return;

  grids.forEach((grid, index) => {
    if (resolvidas[index]) return;

    let palavra = palavrasAtuais[index];
    let resultado = avaliar(palavra, tentativa);

    let inicio = linhaAtual * 5;

    for (let i = 0; i < 5; i++) {
      grid.children[inicio + i].classList.add(resultado[i]);
    }

    if (tentativa === palavra) {
      resolvidas[index] = true;
    }
  });

  if (resolvidas.every(r => r)) {
    msg.innerText = "Boa";
    fase++;

    if (fase > 3) {
      msg.innerText = "Para-bens";
      return;
    }

    setTimeout(novaFase, 1500);
    return;
  }

  linhaAtual++;

  if (linhaAtual === maxTentativas) {
    msg.innerText = "💀 Você perdeu!";
    setTimeout(novaFase, 2000);
    return;
  }

  tentativa = "";
}

/* teclado físico */
document.addEventListener("keydown", e => {
  if (e.key === "Enter") enviar();
  else if (e.key === "Backspace") {
    tentativa = tentativa.slice(0, -1);
    atualizar();
  }
  else if (/^[a-zA-Z]$/.test(e.key)) {
    digitar(e.key.toLowerCase());
  }
});