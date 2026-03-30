import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';

/**
 * Lo que hace este mapper es convertir los mensajes de error o excepciones en los sp y los covierte en HTTP exceptions.
 */
export function mapSpError(error: unknown): never {
  const message = error instanceof Error ? error.message : String(error);

  const spErrors: Record<string, () => never> = {
    EMAIL_ALREADY_EXISTS: () => {
      throw new ConflictException('A user with this email already exists');
    },
    SKU_ALREADY_EXISTS: () => {
      throw new ConflictException('Un producto con este SKU ya existe');
    },
    USER_NOT_FOUND: () => {
      throw new NotFoundException('usuario no encontrado');
    },
    USER_NOT_FOUND_OR_INACTIVE: () => {
      throw new NotFoundException('usuario no encontrado o esta inactivo');
    },
    PRODUCT_NOT_FOUND: () => {
      throw new NotFoundException('Producto no encontrado');
    },
    PRODUCT_NOT_AVAILABLE: () => {
      throw new BadRequestException(
        'Producto no esta disponible para la venta',
      );
    },
    CATEGORY_NOT_FOUND: () => {
      throw new NotFoundException('Categoria no encontrada');
    },
    ORDER_NOT_FOUND: () => {
      throw new NotFoundException('Orden no encontrada');
    },
    ORDER_REQUIRES_AT_LEAST_ONE_ITEM: () => {
      throw new BadRequestException('Orden requiere al menos un item');
    },
    INSUFFICIENT_STOCK: () => {
      throw new BadRequestException(
        'Insuficiente stock para uno o mas productos en la orden',
      );
    },
    ORDER_CANNOT_BE_CANCELLED: () => {
      throw new BadRequestException(
        'Orden no puede ser cancelada en su estado actual',
      );
    },
  };

  for (const [key, thrower] of Object.entries(spErrors)) {
    if (message.includes(key)) thrower();
  }

  throw error;
}
