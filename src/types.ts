/**
 * Formulario base de una petición
 */
export type RequestType = {
  type: 'add' | 'modify' | 'delete' | 'read' | 'list';
  user: string;
  title?: string;
  body?: string;
  color?: string;
}

/**
 * Respuesta del servidor
 */
export type ResponseType = {
  message: string;
}