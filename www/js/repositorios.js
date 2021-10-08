//Contantes globais
const nomeUser = document.getElementById('nomeUser');
const imgUser = document.getElementById('img');
const repos = document.getElementById('repositorios');
const apiUrl = "https://api.github.com/users/";

//variaveis globais
let loginUser = window.location.href; //Nome de login do usuário
let page =  window.location.href; //Pagina, paginação referente aos repositórios

//Pegando valores pela url
loginUser = loginUser.substring(loginUser.indexOf("=") + 1, loginUser.indexOf("&")); 
page = page.substring(page.indexOf("page=") + 5);

//Função de chamada da API
function getAPIDados(url){
    let request = new XMLHttpRequest();
    request.open("GET", url, false);
    request.send();
    if(request.status == 200 ){
      return request.responseText;
    }else{
      return false;
    }
}

//Função criar uma linha na tabela de exibição para cada repositório do usuário
function criarlinhaRepos(repositorio){
  linha = document.createElement("tr"); //linha
  tdNome = document.createElement("td"); //celula, coluna 01;
  tdVisitar = document.createElement("td"); //celula, coluna 02;
  tdNome.innerHTML = repositorio.name; //inserindo nome do repositório na celula
  tdVisitar.innerHTML = "<a href='"+repositorio.html_url+"'>VISITAR</a>"; //inserindo link com url do repositório na celula

  //append dos elementos filhos na linha
  linha.appendChild(tdNome); 
  linha.appendChild(tdVisitar);
  return linha;
}

//Função de paginção: (30 por pagina) com base na quantidade de repositórios públicos calcula a quantidade de páginas.
function paginacao(qRepos){
  resto = qRepos % 30; //resto da divisão se tornará uma página quaso não seja igual a 0.
  if(resto != 0){
    resto = 1;  
  }
  qpaginas = (qRepos / 30) + resto ;
  qpaginas = parseInt(qpaginas, 10);
  if(qpaginas > 1){ 
    let paginacao = document.getElementById("paginacao");
    for(let i = 1; i <= qpaginas; i++){ //cria um link para cada pagina, assim o usuario será redirecionado para a página que escolher.
      let link = document.createElement("a");
      link.innerHTML = i;
      link.href = "http://localhost:8000/repositorios.html?usuario="+loginUser+"&page="+i;
      link.classList.add("linkPaginacao");
      if(i == page){
        link.classList.add("atualPagina");
      }
      paginacao.appendChild(link);
    }
  }
}

// Função que chama os repositorios e configura-os, utilizando o do metódo getAPIDados
function chamaRepos(pagina){
  let urlFinal = "/repos?page="+pagina; //final da url, adicionando o parametro pagina
  repositoriosDados = getAPIDados(apiUrl+loginUser+urlFinal); //chama os repositórios
    repositorios = JSON.parse(repositoriosDados); //transforma-os em tipo JSON
    if(repositorios.length != 0){ //Se não houver repositórios, informa. Se houver, os mostra.
      repos.classList.add("aparecer")
      let tbody = document.getElementById("tbody");
      repositorios.forEach(repositorio => {
        let linha = criarlinhaRepos(repositorio); 
        tbody.appendChild(linha);
      });
    }else{
      const respostaRepos = document.getElementById("respostaRepos");
      respostaRepos.classList.add("aparecer");
      respostaRepos.innerHTML = "Ainda não há repositórios registrados deste usuário"; 
    }
}

//Função principal que verifica se o usuario existe e chama seus dados caso exista
function main(){
    dados = getAPIDados(apiUrl+loginUser);
    if(dados != false){
      usuario = JSON.parse(dados);
      imgUser.classList.add("aparecer");
      if(usuario.name == null || usuario.name == ""){ // Verifica se o nome do usuário é vazio ou nullo, se for mostra o nome de login, senão mostra o nome de usuário.
        nomeUser.innerHTML = usuario.login;
      }else{
        nomeUser.innerHTML = usuario.name;
      } 
      imgUser.src = usuario.avatar_url;
      //chama api dos repositorios por pagina
      paginacao(usuario.public_repos); //constroi a paginção.
      chamaRepos(page); // mosta os dados de repositórios caso existam.
    }else{
      nomeUser.innerHTML = "Usuario não encontrado";
    }
}

main();