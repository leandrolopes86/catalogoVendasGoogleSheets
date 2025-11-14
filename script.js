const url = urlGoogleSheets;

let produtosOriginais = [];
let carrinho = [];

function atualizarContador() {
  const contador = document.getElementById('contador-carrinho');
  const totalItens = carrinho.reduce((acc, item) => acc + item.quantidade, 0);
  contador.textContent = totalItens;
}

function toggleCarrinho() {
  const popup = document.getElementById('popup-carrinho');
  popup.classList.toggle('hidden');
}

function carregarProdutos() {
  fetch(url)
    .then(response => response.json())
    .then(data => {
      produtosOriginais = data.filter(p => Number(p.qtde) > 0);
      preencherFiltroMarcas(produtosOriginais);
      exibirProdutos(produtosOriginais);
    })
    .catch(err => {
      console.error('Erro ao carregar produtos:', err);
    });
}

function preencherFiltroMarcas(produtos) {
  const select = document.getElementById('marcaSelect');
  const marcasUnicas = [...new Set(produtos.map(p => p.marca).filter(Boolean))].sort();

  select.innerHTML = '<option value="todas">Todas as Marcas</option>';

  marcasUnicas.forEach(marca => {
    const option = document.createElement('option');
    option.value = marca;
    option.textContent = marca;
    select.appendChild(option);
  });

  select.addEventListener('change', filtrarPorMarca);
}

function filtrarPorMarca() {
  const marcaSelecionada = document.getElementById('marcaSelect').value;

  if (marcaSelecionada === 'todas') {
    exibirProdutos(produtosOriginais);
  } else {
    const filtrados = produtosOriginais.filter(p => p.marca === marcaSelecionada);
    exibirProdutos(filtrados);
  }
}

function exibirProdutos(produtos) {
  const container = document.getElementById('produtos');
  container.innerHTML = '';

  produtos.forEach(item => {
    const div = document.createElement('div');
    div.className = 'produto';
    div.innerHTML = `
      <img src="images/${item.codigo}.jpg" alt="${item.descricao}" 
       onerror="this.onerror=null; this.src='${item.imagem}';" />
      <h3>${item.descricao}</h3>
      <div class="precos-destaque">
        <span class="de">De: R$ ${Number(item.precoTabela).toFixed(2)}</span>
        <span class="por">Por: R$ ${Number(item.precoVenda).toFixed(2)}</span>
        <span class="desconto"><strong>${item.percentualDesconto.toFixed(2)}% OFF</strong></span>
      </div>
      <span class="codigo"><strong>Código: ${item.codigo}</strong></span>
      <p class="marca-estoque">
        <span class="marca">Marca: ${item.marca}</span>
        <span class="estoque">Estoque: ${item.qtde}</span>
      </p>
      <button class="btn-adicionar" onclick="adicionarAoCarrinho('${item.codigo}', '${item.descricao}', ${Number(item.precoVenda)})">
        Adicionar ao Carrinho
      </button>
    `;
    container.appendChild(div);
  });
}

function adicionarAoCarrinho(codigo, descricao, precoVenda) {
  const index = carrinho.findIndex(item => item.codigo === codigo);
  if (index > -1) {
    carrinho[index].quantidade += 1;
  } else {
    carrinho.push({ codigo, descricao, precoVenda, quantidade: 1 });
  }
  atualizarCarrinho();
  atualizarContador();
}

function alterarQuantidade(index, novaQtd) {
  novaQtd = parseInt(novaQtd);
  if (novaQtd <= 0) {
    if (confirm('Quantidade zero. Deseja remover este produto do carrinho?')) {
      carrinho.splice(index, 1);
    }
  } else {
    carrinho[index].quantidade = novaQtd;
  }
  atualizarCarrinho();
  atualizarContador();
}

function removerDoCarrinho(index) {
  if (confirm('Tem certeza que deseja remover este produto do carrinho?')) {
    carrinho.splice(index, 1);
    atualizarCarrinho();
    atualizarContador();
  }
}

function atualizarCarrinho() {
  const lista = document.getElementById('lista-carrinho');
  lista.innerHTML = '';

  carrinho.forEach((item, i) => {
    const li = document.createElement('li');

    li.innerHTML = `
      <span class="codigo-produto">${item.codigo}</span>
      <span class="descricao-produto">${item.descricao}</span>
      <input type="number" min="1" value="${item.quantidade}" onchange="alterarQuantidade(${i}, this.value)" />
      <span class="preco-unitario">R$ ${item.precoVenda.toFixed(2)}</span>
      <span class="preco-total">R$ ${(item.precoVenda * item.quantidade).toFixed(2)}</span>
      <button class="excluir-item" onclick="removerDoCarrinho(${i})">×</button>
    `;

    lista.appendChild(li);
  });

  const total = carrinho.reduce((acc, item) => acc + item.precoVenda * item.quantidade, 0);
  document.getElementById('total-carrinho').textContent = `Total: R$ ${total.toFixed(2)}`;
}

function finalizarCompra() {
  const carrinhoItens = document.querySelectorAll('#lista-carrinho li');
  if (carrinhoItens.length === 0) {
    alert('Seu carrinho está vazio!');
    return;
  }

  let mensagem = '🛒 *Pedido via site*\n\n';

  carrinhoItens.forEach((item) => {
    const codigo = item.querySelector('.codigo-produto')?.textContent?.trim() || '';
    const descricao = item.querySelector('.descricao-produto')?.textContent?.trim() || '';
    const quantidade = item.querySelector('input[type="number"]')?.value || '1';
    const precoUnit = item.querySelector('.preco-unitario')?.textContent?.trim() || '';
    const precoTotal = item.querySelector('.preco-total')?.textContent?.trim() || '';

    mensagem += `• Cod. ${codigo} - ${descricao}\n  Qtde: ${quantidade} | Unitário: ${precoUnit} | Total: ${precoTotal}\n`;
  });

  const total = document.getElementById('total-carrinho')?.textContent || '';
  mensagem += `\n📦 *Total do Pedido:* ${total}`;

  const textoFinal = encodeURIComponent(mensagem);
  const isMobile = /iPhone|Android|iPad/i.test(navigator.userAgent);

  const whatsappUrl = isMobile
    ? `https://wa.me/?text=${textoFinal}`
    : `https://web.whatsapp.com/send?text=${textoFinal}`;

  window.open(whatsappUrl, '_blank');
}

function limparCarrinho() {
  const confirmar = window.confirm("Tem certeza que deseja limpar o carrinho?");
  if (confirmar) {
    carrinho = [];
    atualizarCarrinho();
    atualizarContador();
  }
}

// Iniciar carregamento ao abrir a página
window.onload = () => {
  carregarProdutos();
  atualizarContador();
};
function filtrarPorBusca() {
  const termo = document.getElementById('buscaInput').value.toLowerCase().trim();

  const marcaSelecionada = document.getElementById('marcaSelect')?.value || 'todas';
  let produtosFiltrados = [...produtosOriginais];

  if (marcaSelecionada !== 'todas') {
    produtosFiltrados = produtosFiltrados.filter(p => p.marca === marcaSelecionada);
  }

  if (termo !== '') {
    produtosFiltrados = produtosFiltrados.filter(p =>
      p.descricao.toLowerCase().includes(termo)
    );
  }

  exibirProdutos(produtosFiltrados);
}