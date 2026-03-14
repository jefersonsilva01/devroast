# SPEC: Code Editor com Syntax Highlighting

## 1. Análise de Opções

### Ray.so (Referência)
- **Biblioteca**: Shiki
- **Detecção automática**: Não possui (usuário seleciona)
- **Abordagem**: textarea + highlighted code sobreposto (camadas)
- **Temas**: Múltiplos temas customizáveis
- **Linguagens**: Carregamento dinâmico sob demanda

### Opções para Detecção de Linguagem

| Biblioteca | Tipo | Precisão | Tamanho | Notas |
|------------|------|----------|---------|-------|
| **highlight.js** | Heurística | Média | Grande | Suporta auto-detecção nativa |
| **lang-detector** | Heurística | Média | Pequeno | 9 linguagens |
| **guesslang-js** | ML (TensorFlow.js) | Alta | Grande (~2MB) | Exato do VS Code |
| **language-detect** | N-gram | Média | Médio | Suporta shebang |

---

## 2. Decisões Técnicas

### Abordagem Recomendada

1. **Highlighting**: Shiki (já implementado no projeto)
   - Tema: vesper (como já configurado)
   - Carregamento lazy de linguagens

2. **Detecção de Linguagem**: highlight.js (`highlightAuto`)
   - Biblioteca leve com auto-detecção
   - 190+ linguagens suportadas
   - Alternativa: lang-detector (mais simples, menos linguagens)

3. **Estrutura do Editor** (seguindo ray.so):
   - Camada 1: textarea (edição)
   - Camada 2: highlighted code (visual, posicionada atrás)
   - Sincronização de scroll entre camadas

---

## 3. Especificação de Implementação

### Componentes

```
CodeEditor/
├── CodeEditor.tsx          # Componente principal (client)
├── CodeEditorInput.tsx     # Textarea para edição
├── CodeEditorHighlight.tsx # Código com highlighting
└── LanguageSelector.tsx    # Dropdown de seleção de linguagem
```

### Fluxo

1. Usuário cola código no editor
2. Sistema detecta linguagem automaticamente (background)
3. Se confiança > 80%: aplica automaticamente
4. Se confiança < 80%: sugere opções ao usuário
5. Usuário pode selecionar manualmente via dropdown

### API do Componente

```tsx
// Uso básico
<CodeEditor
  value={code}
  onChange={setCode}
  language="auto" | "typescript" | "python" | ...
  onLanguageDetected={(lang) => console.log(lang)}
/>
```

### Estados

- `editing`: Usuário digitando/colando
- `detecting`: Detectando linguagem
- `detected`: Linguagem detectada (pode mostrar badge)
- `ready`: Código com highlighting aplicado

---

## 4. To-Dos

- [ ] Integrar highlight.js para detecção automática
- [ ] Criar componente LanguageSelector com opções comuns
- [ ] Implementar editor com camadas (textarea + highlight)
- [ ] Sincronizar scroll entre camadas
- [ ] Suportar colagem de código (paste)
- [ ] Adicionar dropdown de seleção manual
- [ ] Mostrar linguagem detectada/selecionada
- [ ] Testar com múltiplas linguagens

---

## 5. Decisões Confirmadas

- Detecção automática: **OBRIGATÓRIA**
- Linguagens: **Top 20** (JS, TS, Python, Go, Rust, Java, C++, etc.)
- Editor: **EDITÁVEL**

---

## 6. To-Dos

- [ ] Integrar highlight.js para detecção automática
- [ ] Criar componente LanguageSelector com top 20 linguagens
- [ ] Implementar editor com camadas (textarea + highlight)
- [ ] Sincronizar scroll entre camadas
- [ ] Suportar colagem de código (paste)
- [ ] Adicionar dropdown de seleção manual
- [ ] Mostrar linguagem detectada/selecionada
- [ ] Testar com múltiplas linguagens
