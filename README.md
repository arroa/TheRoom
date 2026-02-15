# TheRoom - Simulador de Junta Directiva con IA

Una experiencia inmersiva de sala de juntas impulsada por IA donde tú, como CEO, convocas a tus ejecutivos de nivel C para discusiones estratégicas.

## 🎯 Características

- **Convocatoria Dinámica de Ejecutivos**: El orquestador de IA analiza tu tema y convoca solo a los ejecutivos relevantes
- **Mesa de Juntas Visual**: Los ejecutivos aparecen/desaparecen dinámicamente con animaciones fluidas
- **Debate en Tiempo Real**: Observa a los ejecutivos discutir, debatir y proporcionar insights en tiempo real
- **Onboarding Simplificado**: Llega a la sala de juntas en segundos con un formulario rápido de 3 campos

## 🏗️ Stack Tecnológico

- **Framework**: Next.js 14+ (App Router)
- **Lenguaje**: TypeScript
- **Autenticación**: Clerk
- **Estilos**: Tailwind CSS
- **Gestión de Estado**: Zustand
- **IA**: OpenAI GPT-4o-mini

## 🚀 Comenzar

### Prerequisitos

- Node.js 18+
- npm o yarn
- API Key de OpenAI
- Cuenta de Clerk

### Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/arroa/TheRoom.git
cd TheRoom
```

2. Instala las dependencias:
```bash
npm install
```

3. Crea el archivo `.env.local`:
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=tu_clerk_publishable_key
CLERK_SECRET_KEY=tu_clerk_secret_key
OPENAI_API_KEY=tu_openai_api_key
NEXT_PUBLIC_INACTIVITY_TIMEOUT_MINUTES=30
```

4. Ejecuta el servidor de desarrollo:
```bash
npm run dev
```

5. Abre [http://localhost:3000](http://localhost:3000)

## 🎭 Los Ejecutivos

- **Victoria Chen** (CFO) - Estrategia financiera y gestión de riesgos
- **Marcus Rodriguez** (CTO) - Arquitectura tecnológica e innovación
- **Sarah Kim** (CIO) - Gobernanza de datos y sistemas empresariales
- **James Foster** (CDO) - Transformación digital y experiencia del cliente

## 📋 Cómo Funciona

1. **Presenta tu Tema**: Como CEO, presentas un tema o pregunta estratégica
2. **Orquestación IA**: El sistema analiza tu tema y determina qué ejecutivos son relevantes
3. **Convocatoria de Ejecutivos**: Los ejecutivos relevantes aparecen en la mesa de juntas con animaciones visuales
4. **Debate Dinámico**: Los ejecutivos discuten el tema, proporcionando insights desde su experiencia
5. **Control Interactivo**: Puedes interrumpir, hacer preguntas a ejecutivos específicos o guiar la conversación

## 🛠️ Estructura del Proyecto

```
the-room/
├── src/
│   ├── app/
│   │   ├── boardroom/       # Interfaz principal de la sala de juntas
│   │   ├── actions.ts       # Server actions
│   │   └── layout.tsx       # Layout raíz
│   ├── components/
│   │   ├── Onboarding.tsx   # Formulario rápido de onboarding
│   │   └── ui.tsx           # Componentes UI reutilizables
│   ├── lib/
│   │   ├── ai.ts            # Lógica del orquestador y agentes IA
│   │   ├── agents.ts        # Definiciones de personas ejecutivas
│   │   └── store.ts         # Gestión de estado con Zustand
│   └── middleware.ts        # Autenticación con Clerk
```

## 🎨 Filosofía de Diseño

- **Experiencia Inmersiva**: Siéntete como en una sala de juntas real
- **Presencia Dinámica**: Los ejecutivos solo aparecen cuando son necesarios
- **Claridad Visual**: Indicadores claros de quién habla y quién quiere hablar
- **Fricción Mínima**: Llega a la sala de juntas en segundos, no en minutos

## 📝 Licencia

MIT

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Por favor, siéntete libre de enviar un Pull Request.

## 📧 Contacto

Para preguntas o comentarios, por favor abre un issue en GitHub.
