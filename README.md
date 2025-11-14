# 📘 Catálogo de Vendas --- Google Sheets + HTML/JS

Um catálogo de produtos simples, rápido e funcional que consome dados
diretamente de uma planilha Google Sheets através de uma API criada com
Google Apps Script.\
O sistema exibe produtos, permite busca, filtro por marca e montagem de
carrinho, finalizando o pedido diretamente via WhatsApp.

## 🚀 Funcionalidades

### ✔️ Integração com Google Sheets

Os dados são lidos automaticamente da planilha usando um endpoint gerado
no Google Apps Script.

### ✔️ Catálogo de Produtos

-   Exibição dinâmica dos produtos\
-   Imagens carregadas automaticamente por código\
-   Preço de tabela, preço promocional e percentual de desconto\
-   Estoque e marca de cada item

### ✔️ Filtros e Busca

-   Filtro de produtos por marca\
-   Busca por descrição

### ✔️ Carrinho de Compras

-   Adicionar produtos\
-   Alterar quantidade\
-   Remover itens\
-   Exibição do total automático\
-   Limpar carrinho\
-   Enviar pedido via WhatsApp (mobile ou desktop)

### ✔️ Responsivo

Funciona perfeitamente em celulares, tablets e desktops.

## 🛠️ Tecnologias Utilizadas

-   HTML5\
-   CSS3\
-   JavaScript (Vanilla JS)\
-   Google Sheets\
-   Google Apps Script (API)

## 📂 Estrutura do Projeto

    📁 catalogo_vendas
    │
    ├── index.html      → Página principal do catálogo
    ├── style.css       → Estilos e layout
    ├── script.js       → Lógica de carregamento, filtros e carrinho
    └── README.md       → Documentação do projeto

## 🔗 Como Funciona a API do Google Sheets

O projeto utiliza um script no Google Apps Script para transformar a
planilha em uma API JSON.

### Exemplo de script:

``` javascript
function doGet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("Página1");
  const data = sheet.getDataRange().getValues();

  const headers = data.shift();
  const json = data.map(row => {
    let obj = {};
    headers.forEach((h, i) => obj[h] = row[i]);
    return obj;
  });

  return ContentService.createTextOutput(JSON.stringify(json))
                       .setMimeType(ContentService.MimeType.JSON);
}
```

Configure no `script.js`:

``` javascript
const urlGoogleSheets = "https://script.google.com/macros/s/SEU_LINK_AQUI/exec";
```

## ▶️ Como Executar

1.  Publique o script como Web App\
2.  Copie a URL gerada\
3.  Defina a URL no `script.js`\
4.  Abra o arquivo `index.html` no navegador

## 📱 Finalização do Pedido via WhatsApp

O sistema gera automaticamente uma mensagem com todos os itens do
carrinho, incluindo:\
- Código\
- Descrição\
- Quantidade\
- Preço unitário\
- Preço total

E abre o WhatsApp Web ou o app com o texto pronto.

## 📸 Imagens dos Produtos

O projeto tenta carregar imagens pelo caminho:

    images/{codigo}.jpg

Se não encontrar, utiliza a URL da planilha.

## 👨‍💻 Autor

**Leandro Lopes**

## 📄 Licença

Licença MIT.
