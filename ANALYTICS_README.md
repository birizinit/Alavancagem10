# 📊 Painel de Analytics - Documentação

## Visão Geral

Sistema de analytics interno para monitoramento de acessos à aplicação, **totalmente front-end**, sem necessidade de banco de dados ou servidor backend.

## 🎯 Recursos

### Dados Rastreados

- **Total de Acessos**: Contagem total de todas as visitas
- **Visitantes Únicos**: Número de dispositivos diferentes que acessaram
- **Acessos por Período**: Hoje, esta semana, este mês
- **Tempo Médio de Sessão**: Duração média de permanência na aplicação
- **Gráfico de Acessos**: Visualização dos últimos 30 dias
- **Últimos Acessos**: Lista detalhada das 10 últimas visitas

### Informações de Cada Acesso

- Data e hora do acesso
- ID único do dispositivo
- Duração da sessão
- Página visitada

## 🔐 Acesso ao Painel

### Como Acessar

1. Acesse diretamente a URL: **`/admin-status`**
2. Digite as credenciais de administrador

### Credenciais Padrão

```
Usuário: patrick_admin
Senha: admin
```

⚠️ **IMPORTANTE**: Altere as credenciais padrão editando o arquivo `/app/admin-status/page.tsx`:

```typescript
const ADMIN_USER = "seu_novo_usuario"
const ADMIN_PASSWORD = "sua_nova_senha"
```

## 💾 Armazenamento de Dados

### Como Funciona

- Todos os dados são armazenados no **localStorage** do navegador
- Nenhum dado é enviado para servidores externos
- Os dados são privados e ficam apenas no seu dispositivo
- Retenção automática de **90 dias** (dados mais antigos são removidos)

### Limitações

- **Máximo de 1000 acessos** armazenados (mantém os mais recentes)
- Dados são específicos por navegador/dispositivo
- Limpar o cache do navegador remove os dados

### Estrutura de Dados

```javascript
{
  deviceId: "device_123456...",
  visits: [
    {
      timestamp: 1701234567890,
      deviceId: "device_123456...",
      sessionDuration: 45000,
      page: "/"
    }
  ],
  totalVisits: 150,
  uniqueVisitors: ["device_123...", "device_456..."]
}
```

## 📈 Funcionalidades do Painel

### Cards de Estatísticas

1. **Total de Acessos**: Contador geral desde o início
2. **Visitantes Únicos**: Dispositivos diferentes identificados
3. **Acessos Hoje**: Quantidade de acessos nas últimas 24h
4. **Tempo Médio**: Duração média de permanência

### Períodos

- **Esta Semana**: Últimos 7 dias
- **Este Mês**: Últimos 30 dias
- **Último Acesso**: Data e hora do acesso mais recente

### Gráfico

- Linha temporal dos últimos 30 dias
- Visualização de tendências
- Interativo (hover para detalhes)

### Lista de Acessos

- Últimas 10 visitas registradas
- Data/hora completa
- ID do dispositivo (truncado)
- Duração da sessão
- Página acessada

## 🔧 Rastreamento Automático

### Como é Implementado

O rastreamento é **automático** através do hook `useAnalytics`:

```typescript
// app/page.tsx
import { useAnalytics } from "@/hooks/use-analytics"

export default function Home() {
  // Rastreia automaticamente os acessos
  useAnalytics("/")
  
  // ... resto do código
}
```

### O que é Rastreado

1. **Início da sessão**: Quando o usuário acessa a página
2. **Duração**: Atualizada a cada 30 segundos
3. **Saída**: Ao fechar/sair da página

## 🛡️ Privacidade e Segurança

### Dados Coletados

- ✅ Timestamps de acesso
- ✅ ID único do dispositivo (gerado localmente)
- ✅ Duração da sessão
- ✅ Página visitada

### Dados NÃO Coletados

- ❌ Informações pessoais
- ❌ Endereço IP
- ❌ Localização geográfica
- ❌ Dados do navegador/sistema
- ❌ Cookies de terceiros

### Conformidade

- **100% Local**: Nenhum dado enviado externamente
- **LGPD/GDPR Compliant**: Sem coleta de dados pessoais
- **Transparente**: Código-fonte aberto e auditável

## 📱 Uso Prático

### Cenários de Uso

1. **Monitorar Engajamento**: Ver quantas vezes você acessa a aplicação
2. **Análise de Padrões**: Identificar horários de maior uso
3. **Tracking de Sessões**: Quanto tempo você passa na aplicação
4. **Métricas Pessoais**: Acompanhar seu uso ao longo do tempo

### Dicas

- Acesse o painel regularmente para ver tendências
- Monitore o tempo médio de sessão
- Compare acessos entre períodos
- Use para estabelecer metas de uso

## 🔄 Manutenção

### Limpeza Automática

O sistema limpa automaticamente:
- Dados com mais de 90 dias
- Mantém apenas os 1000 acessos mais recentes

### Limpeza Manual

Para limpar todos os dados manualmente:

```javascript
// No console do navegador (F12)
localStorage.removeItem('app_analytics_data')
localStorage.removeItem('app_device_id')
```

### Backup dos Dados

Para fazer backup:

```javascript
// No console do navegador
const data = localStorage.getItem('app_analytics_data')
console.log(data) // Copie e salve em um arquivo
```

Para restaurar:

```javascript
// No console do navegador
localStorage.setItem('app_analytics_data', 'dados_copiados_aqui')
```

## 🎨 Personalização

### Alterar Senha

Edite `/components/analytics-panel.tsx`:

```typescript
const ADMIN_PASSWORD = "nova_senha"
```

### Alterar Período de Retenção

Edite `/hooks/use-analytics.ts`:

```typescript
// Trocar 90 dias para outro valor
const ninetyDaysAgo = Date.now() - 90 * 24 * 60 * 60 * 1000
```

### Alterar Limite de Acessos

Edite `/hooks/use-analytics.ts`:

```typescript
// Trocar 1000 para outro valor
if (data.visits.length > 1000) {
  data.visits = data.visits.slice(-1000)
}
```

## 🐛 Troubleshooting

### Painel não abre

- Verifique se está logado no dashboard
- Tente recarregar a página (F5)

### Senha não funciona

- Verifique a senha em `/components/analytics-panel.tsx`
- Certifique-se de digitar corretamente

### Dados não aparecem

- Acesse a aplicação algumas vezes primeiro
- Verifique o console do navegador (F12) por erros
- Limpe o cache e tente novamente

### Gráfico não carrega

- Aguarde alguns segundos
- Certifique-se de ter dados de vários dias

## 📞 Suporte

Para questões técnicas ou melhorias:
- Revise o código em `/hooks/use-analytics.ts`
- Revise o componente em `/components/analytics-panel.tsx`
- Consulte a documentação do React e Recharts

---

**Versão**: 1.0.0  
**Última atualização**: Novembro 2025
