const listaTransacoes = document.querySelector('#lista-transacoes')
const nomeInput = document.querySelector('input[name="nome"]')
const valorInput = document.querySelector('input[name="valor"]')
const formTransacao = document.querySelector('#form-transacao')
const saldoValor = document.querySelector('#saldo-valor')

let transacoes = []


async function getTransacoes() {
    try {
        const response = await fetch('http://localhost:3000/transactions')
        const data = await response.json()
        transacoes = data
        mostrarTransacoes()
    } catch (error) {
        console.log(error.message)
        alert(error.message)
    }
}

// Essa função 'getTransacoes()' é responsável por obter as transações do servidor e exibi-las na página.

// O processo de obtenção das transações ocorre da seguinte maneira:

// A função utiliza o método fetch() para fazer uma requisição para o endereço 'http://localhost:3000/transactions' que é a URL do servidor onde as transações estão armazenadas.

// A resposta da requisição é armazenada na constante response.

// A resposta é então transformada em um objeto JavaScript usando o método json(), e o resultado é armazenado na constante data.

// A variável transacoes é atualizada com o valor de data, que contém todas as transações obtidas do servidor.

// Finalmente, a função mostrarTransacoes() é chamada para atualizar a exibição das transações na página.

// Se algum erro ocorrer durante o processo, o bloco catch captura a exceção, exibe a mensagem de erro no console e exibe um alerta na tela com a mensagem de erro.



async function criarTransacao(ev) {
    ev.preventDefault()

    const transacao = {
        nome: nomeInput.value,
        valor: Number(valorInput.value),
    }

    if (!transacao.nome || !transacao.valor) {
        alert('Preencha o nome e o valor da transação')
        return
    }

    try {
        const response = await fetch ('http://localhost:3000/transactions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(transacao),
        })
        const data = await response.json()
        transacoes.push(data)
        mostrarTransacoes()
        nomeInput.value = ''
        valorInput.value = ''
    } catch (error) {
        console.log(error.message)
        alert(error.message)
    }
}

// Essa função 'criarTransacao(ev)' é responsável por criar uma nova transação e enviá-la para o servidor utilizando o método POST. Ela recebe como parâmetro um evento "ev" e utiliza o método preventDefault() para evitar que o formulário seja enviado de forma padrão.

// Em seguida, a função cria um objeto "transacao" com as propriedades "nome" e "valor", que são obtidas dos campos de formulário "nomeInput" e "valorInput", respectivamente. O valor do campo "valorInput" é convertido para número utilizando a função Number().

// A função verifica se as propriedades "nome" e "valor" do objeto "transacao" são válidas. Se alguma delas não for preenchida, é exibido um alerta para o usuário e a função é encerrada com a palavra chave "return".

// Em seguida, é feita uma requisição para o servidor utilizando a função fetch(). É passado como primeiro parâmetro o endereço URL para o recurso "transactions" do servidor, e como segundo parâmetro um objeto com as opções da requisição: método "POST", cabeçalho com o tipo de conteúdo "application/json" e corpo da requisição no formato JSON, que é gerado a partir do objeto "transacao" usando a função JSON.stringify().

// Depois de enviar a requisição, a função aguarda a resposta do servidor usando a palavra chave "await" e armazena o resultado na variável "data". O objeto "data" é a transação recém-criada no servidor, que é adicionada ao final do array "transacoes" usando o método push(). Em seguida, a função "mostrarTransacoes()" é chamada para atualizar a lista de transações na página.

// Por fim, os campos do formulário são resetados para vazio para permitir que o usuário possa criar uma nova transação. Se houver algum erro na criação da transação, a função captura o erro com o bloco catch() e exibe uma mensagem de erro no console e para o usuário usando a função "alert()".


function mostrarTransacoes() {
  listaTransacoes.innerHTML = '';

  for (const transacao of transacoes) {
    const li = document.createElement('li');
    li.classList.add(transacao.valor > 0 ? 'entrada' : 'saida');
    li.innerHTML = `
      ${transacao.nome} <span>R$ ${transacao.valor.toFixed(2)}</span>
      <button class='btn-editar' onclick='editarTransacao(${JSON.stringify(transacao)})'>Editar</button>
      <button class="btn-excluir" onclick="excluirTransacao(${transacao.id})">Excluir</button>
    `
    listaTransacoes.appendChild(li);
  }
  
  atualizarSaldo();
}

// Este código acima é responsável por atualizar a lista de transações na página HTML com base nos dados armazenados em uma array chamada transacoes. Ele percorre cada elemento dessa array usando um loop for...of, cria um novo elemento li para cada transação e adiciona esse elemento na lista de transações usando o método appendChild.

// Para cada transação, o código também adiciona uma classe CSS de acordo com o valor da transação. Se a transação for uma entrada (ou seja, seu valor é maior que 0), ele adiciona a classe CSS 'entrada'. Caso contrário, adiciona a classe CSS 'saida'.

// Além disso, cada item de transação é exibido na lista de transações com seu nome e valor, e dois botões são adicionados para cada transação: um botão de "Editar" e um botão de "Excluir". O botão de "Editar" chama a função editarTransacao quando é clicado e passa os dados da transação como argumento usando JSON.stringify. O botão de "Excluir" chama a função excluirTransacao quando é clicado e passa o ID da transação como argumento.

// Por fim, a função atualizarSaldo() é chamada para atualizar o saldo na página HTML com base nas transações exibidas na lista.



async function editarTransacao(transacao) {
  const novoNome = prompt('Digite o novo nome da transação:', transacao.nome);
  const novoValor = prompt('Digite o novo valor da transação:', transacao.valor);

  if (!novoNome || !novoValor) {
    alert('Por favor, preencha nome e valor da transação.');
    return;
  }

  const dadosAtualizados = {
    nome: novoNome.trim(),
    valor: Number(novoValor.trim()),
  };

  try {
    const response = await fetch(`http://localhost:3000/transactions/${transacao.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dadosAtualizados),
    });
    
    const data = await response.json();
    const index = transacoes.findIndex((t) => t.id === transacao.id);
    transacoes[index] = data;
    mostrarTransacoes();
  } catch (error) {
    console.log(error.message);
    alert(error.message);
  }
}

// Esse código acima implementa uma função assíncrona editarTransacao que é responsável por editar uma transação existente na lista de transações. A função é chamada quando o usuário clica no botão "Editar" associado a uma transação na interface.

// Ao ser executada, a função solicita ao usuário um novo nome e valor para a transação através de dois prompts. Em seguida, verifica se o nome e o valor são válidos e não estão vazios. Se algum dos campos estiver vazio, a função exibe uma mensagem de alerta e retorna.

// Caso ambos os campos tenham sido preenchidos corretamente, a função cria um objeto dadosAtualizados contendo o novo nome e valor da transação. Em seguida, faz uma requisição PUT à API REST com a URL http://localhost:3000/transactions/${transacao.id} para atualizar a transação no servidor.

// Se a requisição for bem-sucedida, a função recebe uma resposta no formato JSON contendo a transação atualizada e armazena os dados atualizados na variável transacoes. Em seguida, chama a função mostrarTransacoes para atualizar a lista de transações na interface.

// Se ocorrer algum erro durante a requisição, a função exibe uma mensagem de alerta com a mensagem de erro retornada.



async function excluirTransacao(id) {
    try {
      await fetch(`http://localhost:3000/transactions/${id}`, {
        method: 'DELETE',
      });
      transacoes = transacoes.filter((t) => t.id !== id);
      mostrarTransacoes();
    } catch (error) {
      console.log(error.message);
      alert(error.message);
    }
  }

  // Esse código acima é uma função assíncrona chamada excluirTransacao, que recebe um parâmetro id como entrada. O objetivo dessa função é excluir uma transação existente da lista de transações e atualizar a exibição dessas transações na página.

  // Primeiro, a função faz uma solicitação HTTP DELETE usando o método fetch. A solicitação é feita para a URL http://localhost:3000/transactions/${id}, em que ${id} é o valor do parâmetro de entrada id. Essa solicitação tem como objetivo excluir a transação com o ID correspondente ao valor de id.
  
  // Se a solicitação for bem-sucedida, a transação é removida da lista de transações existente usando o método filter. Isso é feito criando uma nova lista de transações que exclui a transação que corresponde ao id passado como parâmetro. Em seguida, a função mostrarTransacoes() é chamada para atualizar a exibição da lista de transações na página.
  
  // Se a solicitação HTTP não for bem-sucedida, o erro é capturado e registrado no console e uma mensagem de alerta é exibida com o erro.


  // Funções auxiliares
  function atualizarSaldo() {
    const valores = transacoes.map((t) => t.valor);
    const saldo = valores.reduce((acc, curr) => acc + curr, 0);
    saldoValor.textContent = `R$ ${saldo.toFixed(2)}`;
  }
  
//   A função atualizarSaldo() é responsável por atualizar o valor exibido na tela correspondente ao saldo atual. Para fazer isso, a função segue os seguintes passos:
// Cria um array chamado valores contendo todos os valores de todas as transações, utilizando o método map().
// Calcula o saldo atual, somando todos os valores contidos no array valores, utilizando o método reduce(). O valor inicial do acumulador é 0.
// Atualiza o texto do elemento da página correspondente ao saldo atual com o valor calculado, utilizando a propriedade textContent.
// Dessa forma, a função atualizarSaldo() garante que o saldo exibido na página sempre estará atualizado com base nas transações cadastradas.
  
  // Event listeners
  window.addEventListener('DOMContentLoaded', getTransacoes);
  formTransacao.addEventListener('submit', criarTransacao);
  
  // Função para inicializar a aplicação
  function init() {
    getTransacoes();
    formTransacao.addEventListener('submit', criarTransacao);
  }
  
  // Chamada da função de inicialização
  init()

  