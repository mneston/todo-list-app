# TaskMaster - Gerenciador de Tarefas

![TaskMaster Logo](assets/icons/icon-192.png)

Um gerenciador de tarefas moderno e intuitivo, desenvolvido com tecnologias web puras. Organize suas tarefas de forma eficiente com prioridades, datas, categorias e muito mais!

## ✨ Funcionalidades

- ✅ **Adicionar Tarefas**: Crie tarefas com texto, prioridade, data e categoria
- ✏️ **Editar Tarefas**: Modifique tarefas existentes facilmente
- 🗑️ **Excluir Tarefas**: Remova tarefas com confirmação
- ✅ **Marcar como Concluída**: Toggle para completar/reabrir tarefas
- 🔍 **Busca**: Encontre tarefas rapidamente por texto ou categoria
- 🏷️ **Filtros**: Visualize todas, ativas ou concluídas
- 📊 **Estatísticas**: Acompanhe seu progresso com métricas em tempo real
- 🌙 **Tema Dark/Light**: Alterne entre modos claro e escuro
- 📱 **Responsivo**: Funciona perfeitamente em desktop e mobile
- 🖱️ **Drag & Drop**: Reordene tarefas arrastando e soltando
- 💾 **Local Storage**: Seus dados ficam salvos localmente no navegador
- 🎨 **Interface Moderna**: Design clean e intuitivo

## 🚀 Tecnologias Utilizadas

- **HTML5**: Estrutura semântica e acessível
- **CSS3**: Estilização moderna com variáveis CSS e temas
- **JavaScript (ES6+)**: Lógica da aplicação com módulos
- **Local Storage**: Persistência de dados local
- **Shopify Draggable**: Biblioteca para drag & drop

## 📦 Instalação

1. **Clone o repositório**:

   ```bash
   git clone https://github.com/mneston/taskmaster.git
   cd taskmaster
   ```

2. **Abra no navegador**:
   - Abra o arquivo `index.html` diretamente no seu navegador
   - Ou use um servidor local (recomendado para melhor experiência):

     ```bash
     # Com Python 3
     python -m http.server 8000

     # Com Node.js (se tiver http-server instalado)
     npx http-server

     # Com PHP
     php -S localhost:8000
     ```

3. **Acesse**: `http://localhost:8000` (ou abra `index.html` diretamente)

## 🎯 Como Usar

### Adicionando uma Tarefa

1. Digite o texto da tarefa no campo principal
2. Selecione a prioridade (Baixa, Média, Alta)
3. Adicione uma data opcional
4. Escolha uma categoria (ou digite uma nova)
5. Clique no botão "+" ou pressione Enter

### Gerenciando Tarefas

- **Completar**: Clique no checkbox da tarefa
- **Editar**: Clique no ícone de lápis ✏️
- **Excluir**: Clique no ícone de lixeira 🗑️
- **Reordenar**: Arraste a tarefa pela alça (⋮⋮)

### Filtros e Busca

- Use os botões "Todas", "Ativas", "Concluídas" para filtrar
- Digite na barra de busca para encontrar tarefas específicas

### Tema

- Clique no botão de tema (🌙/☀️) no cabeçalho para alternar entre dark e light

## 📁 Estrutura do Projeto

```
taskmaster/
├── index.html          # Página principal
├── README.md           # Este arquivo
├── assets/
│   └── icons/          # Ícones da aplicação
└── css/
│   ├── style.css       # Estilos principais
│   └── themes.css      # Temas dark/light
└── js/
    ├── app.js          # Lógica principal da aplicação
    ├── storage.js      # Gerenciamento de Local Storage
    └── utils.js        # Funções utilitárias
```

## 🎨 Personalização

### Cores e Temas

Edite `css/themes.css` para personalizar cores:

- `--background`: Cor de fundo
- `--surface`: Cor das superfícies
- `--primary-color`: Cor principal
- `--text-primary`: Cor do texto principal

### Funcionalidades

Modifique `js/app.js` para adicionar novas funcionalidades:

- Novos tipos de filtro
- Campos adicionais nas tarefas
- Integrações com APIs externas

## 🤝 Contribuição

Contribuições são bem-vindas! Siga estes passos:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### Diretrizes

- Mantenha o código limpo e bem comentado
- Teste em múltiplos navegadores
- Siga as convenções de nomenclatura existentes
- Adicione comentários em português para novas funcionalidades

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Autor

**Márcio Dias Pereira**

- GitHub: [@mneston](https://github.com/mneston)
- LinkedIn: [Márcio Dias](https://linkedin.com/in/marciodiaspereira)

## 📞 Suporte

Se encontrar algum problema ou tiver sugestões:

1. Verifique se está usando um navegador moderno (Chrome, Firefox, Safari, Edge)
2. Limpe o cache do navegador
3. Abra uma [issue](https://github.com/mneston/taskmaster/issues) no GitHub

---

⭐ **Gostou do projeto? Dê uma estrela no GitHub!**
