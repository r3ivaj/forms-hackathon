# Forms Hackathon

Una aplicación web para crear formularios inteligentes mediante conversación con IA. Permite diseñar, publicar y gestionar formularios complejos de manera intuitiva a través de un chat conversacional.

## 🚀 Características Principales

### 🤖 Creación de Formularios con IA

- **Chat Conversacional**: Crea formularios describiendo lo que necesitas en lenguaje natural
- **Asistente Especializado**: IA entrenada específicamente para construcción de formularios
- **Templates Predefinidos**: Formularios de onboarding para Persona Física (PF) y Persona Moral (PM)
- **Validación Inteligente**: Campos con validación automática según el tipo de dato

### 📝 Editor de Formularios Avanzado

- **Formularios Multi-paso**: Organiza campos en pasos lógicos para mejor UX
- **Tipos de Campo Diversos**: Texto, email, teléfono, textarea, select, archivos, números
- **Timer Personalizable**: Configuración de tiempo límite para completar el formulario
- **Navegación Intuitiva**: Botones de anterior/siguiente con validación por paso

### 🌐 Publicación y Compartir

- **URLs Amigables**: Genera enlaces únicos para cada formulario
- **Integración con Moffin**: Publica formularios directamente a la plataforma Moffin
- **Estado de Publicación**: Control de versiones (draft/published)
- **Republicación**: Actualiza formularios ya publicados

### 💾 Gestión de Datos

- **Base de Datos Convex**: Almacenamiento en tiempo real
- **Sesiones de Usuario**: Tracking de respuestas por sesión
- **Chats Persistentes**: Historial de conversaciones para iterar en formularios

## 🛠️ Stack Tecnológico

### Frontend

- **React 19** con TypeScript
- **TanStack Router** para routing
- **TanStack Form** para manejo de formularios
- **TanStack Query** para gestión de estado del servidor
- **Tailwind CSS** para estilos
- **Radix UI** para componentes accesibles
- **Framer Motion** para animaciones

### Backend

- **Convex** para backend-as-a-service
- **AI SDK** para integración con OpenAI
- **Zod** para validación de esquemas

### Herramientas de Desarrollo

- **Vite** como bundler
- **TypeScript** para tipado estático
- **Prettier** para formateo de código
- **pnpm** como gestor de paquetes

## 📁 Estructura del Proyecto

```
src/
├── components/
│   ├── ai-elements/          # Componentes de chat y IA
│   ├── chat/                  # Componentes específicos del chat
│   │   ├── form-renderer/    # Renderizado de formularios
│   │   └── ...
│   └── ui/                    # Componentes base reutilizables
├── hooks/                     # Custom hooks
├── lib/
│   ├── templates/            # Templates de formularios
│   └── tools/                # Utilidades y validadores
├── routes/                   # Rutas de la aplicación
├── utils/                     # Utilidades generales
└── styles/                   # Estilos globales

convex/
├── schema.ts                 # Esquema de la base de datos
├── chats.ts                  # Funciones de chat
└── formSettings.ts           # Funciones de configuración
```

## 🚀 Instalación y Desarrollo

### Prerrequisitos

- Node.js 18+
- pnpm 10.18.1+

### Configuración

1. Clona el repositorio
2. Instala dependencias:

   ```bash
   pnpm install
   ```

3. Configura las variables de entorno:

   ```bash
   # Copia el archivo de ejemplo
   cp env.example .env.local

   # Edita .env.local con tus credenciales reales
   ```

### Variables de Entorno Requeridas

- **OPENAI_API_KEY**: API key de OpenAI para el procesamiento de IA
- **OPENAI_MODEL**: Modelo de OpenAI a utilizar (ej: gpt-4o-mini)
- **CONVEX_DEPLOYMENT**: URL de tu deployment de Convex
- **CONVEX_DEPLOY_KEY**: Key para deployment de Convex
- **MOFFIN_API_URL**: URL de la API de Moffin
- **MOFFIN_API_KEY**: API key de Moffin
- **MOFFIN_ADMIN_API_KEY**: API key de administrador de Moffin

4. Inicia el servidor de desarrollo:
   ```bash
   pnpm dev
   ```

## 🔄 Flujo Técnico del Proyecto

### Arquitectura de Generación de Formularios

El proyecto funciona mediante un flujo de **IA → JSON → Renderizado**:

1. **Entrada del Usuario**: El usuario describe el formulario en lenguaje natural
2. **Procesamiento de IA**:
   - La IA (OpenAI) recibe el prompt del usuario
   - Utiliza un sistema de prompts especializado (`createSystemPrompt.ts`)
   - Genera un JSON Schema válido siguiendo el formato `FormSchema`
3. **Validación**: El JSON generado se valida contra el esquema Zod definido
4. **Renderizado**: El `FormRenderer` convierte el JSON en una interfaz de usuario funcional
5. **Publicación**: El formulario se puede publicar a Moffin o generar URLs compartibles

### Componentes Clave del Flujo

- **`createSystemPrompt.ts`**: Define las reglas y limitaciones para la IA
- **`FormRenderer.tsx`**: Renderiza el JSON Schema en componentes React
- **`transformFormSchemaToCustomPagesConfig.ts`**: Convierte el schema a formato Moffin
- **`validationUtils.ts`**: Valida campos en tiempo real durante el renderizado

### Estructura del JSON Schema

```typescript
interface FormSchema {
  title: string
  steps: Array<{
    title: string
    fields: Array<{
      id: string
      label: string
      type: 'text' | 'email' | 'tel' | 'textarea' | 'select' | 'file' | 'number'
      validation?: FieldValidation
      options?: Array<{ label: string; value: string }>
    }>
  }>
  sessionDuration: {
    type: 'unlimited' | 'custom'
    customMinutes?: number
  }
}
```

## 📖 Uso

### Crear un Formulario

1. **Inicio**: Describe el formulario que quieres crear en lenguaje natural
2. **Conversación**: El asistente te guiará para definir:
   - Tipo de persona (Física o Moral)
   - Campos específicos necesarios
   - Validaciones requeridas
   - Estructura por pasos
3. **Preview**: Ve el formulario en tiempo real mientras lo construyes
4. **Publicar**: Genera un enlace público para compartir

### Tipos de Formularios Soportados

- **Onboarding Persona Física**: 8 pasos con información personal, fiscal y de contacto
- **Onboarding Persona Moral**: 5 pasos para empresas con datos legales y fiscales
- **Formularios Personalizados**: Crea cualquier tipo de formulario según tus necesidades

### Características Avanzadas

- **Timer de Sesión**: Configura tiempo límite para completar el formulario
- **Validación en Tiempo Real**: Los campos se validan mientras el usuario escribe
- **Navegación Inteligente**: Solo permite avanzar cuando el paso actual es válido
- **Persistencia de Datos**: Las respuestas se guardan automáticamente

## 🔧 API y Integración

### Endpoints Principales

- `POST /api/chat` - Procesamiento de mensajes de IA
- `POST /api/publish-form` - Publicar formulario
- `POST /api/republish-form` - Republicar formulario
- `POST /api/create-form-submission` - Crear nueva sesión de formulario

### Esquema de Base de Datos

- **chats**: Conversaciones y títulos de formularios
- **formSettings**: Configuración de formularios con esquemas
- **sessions**: Sesiones de usuarios completando formularios

## 🤝 Contribución

Este es un proyecto de hackathon. Para contribuir:

1. Fork el repositorio
2. Crea una rama para tu feature
3. Haz commit de tus cambios
4. Push a la rama
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es parte de un hackathon y está bajo desarrollo activo.

---

**Nota**: Este proyecto utiliza pnpm como gestor de paquetes. Asegúrate de tener pnpm instalado antes de comenzar el desarrollo.
