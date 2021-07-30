# Node.js + MongoDB

Aperfeiçoamento de projeto desenvolvido durante o curso de Node.js + MongoDB realizado na PuralSight.

Durante o curso foi desenvolvido uma API para teste das funções mais básicas do banco de dados, porém sem chamadas por endpoints.


### Gerarando a imagem Docker do projeto localmente
O arquivo Dockerfile possui todas as configurações necessárias para que seja realizado o build da aplicação.


1. Necessário ter o Docker instalado no computador;
2. No diretório do projeto, abrir o terminal ou o cmd e digitar o seguinte comando:

```
docker image build -t {NOME_IMAGEM} .
```

Após a geração da imagem, verifique se a mesma foi criada através do comando:
```
docker images
```

Caso a imagem tenha sido criada, a mesma deverá estar presente na lista de imagens registradas.
